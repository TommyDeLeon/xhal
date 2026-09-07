/**
 * The hero lattice, in real 3D.
 *
 * This is the default renderer for the two hero canvases; lib/graph.ts holds
 * the 2D one it falls back to. It is a *separate module on purpose*: the motion
 * layer reaches it through a dynamic import, so none of this WebGL code sits in
 * the chunk that renders the page. A visitor whose GPU refuses a context
 * downloads it and discards it; a visitor under reduced motion never requests
 * it at all.
 *
 * Why 3D, on a page that was already carefully composed in 2D:
 *
 * The 2D graph implied depth with two stacked canvases and an alpha ramp.
 * Implied is as far as it goes -- nothing moves *relative to* anything else, so
 * the eye reads two flat sheets rather than one room. Here the nodes carry a
 * true z, the camera pans a few hundredths of a unit, and near nodes slide
 * across far ones. That differential is the only thing that reads as space, and
 * it is not something a static composition can be drawn to fake.
 *
 * What it costs, and why that is affordable:
 *
 * Every buffer is static and uploaded once. The pulse, the travelling packets
 * and the depth falloff are computed in the vertex shader from per-vertex
 * attributes and one time uniform, so a frame is a few uniform writes and three
 * draw calls. There is no per-frame CPU geometry work at all -- which makes it
 * cheaper than the 2D renderer it replaces, since that one cleared and refilled
 * a full-viewport bitmap on the CPU every frame.
 *
 * It still depicts nothing. See the note in lib/graph.ts.
 */

import type { Graph, Palette } from "./graph";


/* ── Shaders ──────────────────────────────────────────────────────────────
 *
 * GLSL ES 1.00, so this runs on WebGL 1 as well as 2. WebGL 2 buys nothing
 * here -- no instancing, no integer attributes, no transform feedback -- and
 * requiring it would drop a class of older mobile GPUs for no gain.
 */

/**
 * The shared projection, pasted into all three vertex shaders.
 *
 * Deliberately NOT a general perspective matrix. x and y map to the viewport
 * independently, exactly as the 2D version mapped them, because the lattice is
 * abstract and stretching it to fill the viewport is what keeps the composition
 * identical at every aspect ratio. A uniform-aspect projection would letterbox
 * the field and move nodes relative to the headline -- a composition decision,
 * not a maths one, and not one the renderer gets to make.
 *
 * The perspective is carried entirely by `s`: a point nearer the camera scales
 * up about the camera's own axis, so panning the camera displaces near points
 * further than far ones. That differential IS the parallax.
 */
const PROJECT = `
  uniform vec2 uPan;
  uniform float uDist;

  vec3 project(vec3 p) {
    float s = uDist / (uDist - p.z);
    return vec3((p.xy - uPan) * s, s);
  }
`;

/**
 * Atmospheric falloff, shared so the three passes cannot drift apart.
 *
 * `s` is the perspective scale, so it is already the depth cue. Squaring it
 * makes a node at the back both smaller and fainter, and it is that pair of
 * signals together that reads as distance rather than as a size change.
 */
const FALLOFF = `
  float falloff(float s) {
    return clamp(s * s * 0.82, 0.12, 1.0);
  }
`;

const NODE_VS = `
  precision mediump float;
  attribute vec3 aPos;
  attribute vec3 aWobble;
  uniform float uTime;
  uniform float uDpr;
  varying float vFade;
  ${PROJECT}
  ${FALLOFF}

  void main() {
    vec3 q = project(aPos);
    gl_Position = vec4(q.xy, 0.0, 1.0);
    float pulse = 0.72 + 0.28 * sin(uTime * aWobble.z + aWobble.y);
    gl_PointSize = aWobble.x * q.z * pulse * uDpr;
    vFade = falloff(q.z);
  }
`;

const SPRITE_FS = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vFade;

  void main() {
    /*
      A soft round sprite. smoothstep rather than a hard discard: a two-pixel
      dot with a cut edge aliases badly, and these are drawn over letterforms.

      Written as 1.0 - smoothstep(near, far, d) rather than the shorter
      smoothstep(far, near, d). GLSL leaves the result UNDEFINED when edge0 is
      greater than edge1 -- it is not specified to flip the ramp -- so the
      inverted form compiles everywhere and is only correct on the drivers that
      happen to handle it. This form is defined on all of them.
    */
    float a = 1.0 - smoothstep(0.08, 0.5, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor, a * uAlpha * vFade);
  }
`;

const LINE_VS = `
  precision mediump float;
  attribute vec3 aPos;
  attribute float aWeight;
  varying float vFade;
  ${PROJECT}
  ${FALLOFF}

  void main() {
    vec3 q = project(aPos);
    gl_Position = vec4(q.xy, 0.0, 1.0);
    vFade = aWeight * falloff(q.z);
  }
`;

const LINE_FS = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vFade;

  void main() {
    gl_FragColor = vec4(uColor, vFade * uAlpha);
  }
`;

/**
 * The packets. One point per link, sliding A to B and wrapping.
 *
 * Both endpoints are attributes and the position is mixed in the shader, so the
 * buffer never changes and the entire animation is `uTime`. On the CPU this
 * would mean rewriting a vertex buffer every frame to move a few dozen dots.
 */
const PACKET_VS = `
  precision mediump float;
  attribute vec3 aA;
  attribute vec3 aB;
  attribute float aOff;
  uniform float uTime;
  uniform float uDpr;
  uniform float uSize;
  varying float vFade;
  ${PROJECT}
  ${FALLOFF}

  void main() {
    float p = fract(uTime * 0.06 * (0.5 + aOff) + aOff);
    vec3 q = project(mix(aA, aB, p));
    gl_Position = vec4(q.xy, 0.0, 1.0);
    gl_PointSize = uSize * q.z * uDpr;
    vFade = falloff(q.z);
  }
`;

/* ── GL plumbing ──────────────────────────────────────────────────────── */

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  /*
    Checked rather than assumed. A driver that rejects a shader does it
    silently: the program links to nothing, every draw is a no-op, and the page
    paints an empty rectangle with no error anywhere. Returning null here is
    what routes those visitors to the 2D renderer instead.
  */
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // The program holds its own reference once attached, so these can go now.
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/** `#rrggbb` to three floats. Falls back to mid grey rather than throwing --
    a palette that failed to parse should dim the lattice, not break the page. */
function rgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [0.6, 0.6, 0.6];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export type Renderer = {
  /** False once the GL context is gone, so the caller can fall back mid-run. */
  draw: (palette: Palette, t: number, w: number, h: number) => boolean;
  dispose: () => void;
};

/**
 * Builds a renderer for one canvas, or returns null.
 *
 * Null is a supported outcome rather than an error path. A browser with WebGL
 * switched off, a GPU that has run out of contexts, and a driver that rejects
 * the shaders all arrive here, and the caller answers all three the same way:
 * by drawing the 2D graph instead. Nothing on the page depends on this
 * succeeding.
 */
export function createRenderer(
  canvas: HTMLCanvasElement,
  graph: Graph,
): Renderer | null {
  let context: WebGLRenderingContext | null = null;
  try {
    context = canvas.getContext("webgl", {
      alpha: true,
      // The sprites are smoothstepped in the shader and the lines are hairlines
      // at low alpha. MSAA would cost fill rate to soften edges already soft.
      antialias: false,
      // No depth buffer: the blend below is order-independent, so there is
      // nothing to sort and nothing to test against.
      depth: false,
      // Nothing reads this canvas back, so the browser may discard the buffer
      // after each frame rather than keeping a copy of it.
      preserveDrawingBuffer: false,
      // Decoration must never wake a discrete GPU on a laptop running on battery.
      powerPreference: "low-power",
    }) as WebGLRenderingContext | null;
  } catch {
    // Some browsers throw rather than return null when WebGL is disabled.
    return null;
  }
  if (!context) return null;
  const gl = context;

  const nodeProgram = linkProgram(gl, NODE_VS, SPRITE_FS);
  const lineProgram = linkProgram(gl, LINE_VS, LINE_FS);
  const packetProgram = linkProgram(gl, PACKET_VS, SPRITE_FS);
  if (!nodeProgram || !lineProgram || !packetProgram) {
    /*
      Partial success is still failure. Release whatever did link -- and the
      context itself, which is the part that matters: no renderer reaches the
      caller, so nothing else will ever be in a position to dispose it, and a
      browser only grants a handful of contexts before it starts evicting the
      oldest ones from other pages.
    */
    for (const p of [nodeProgram, lineProgram, packetProgram]) {
      if (p) gl.deleteProgram(p);
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  const { near, nodes, links, reach } = graph;


  /*
    Node space.

    x and y keep the 2D layout exactly -- [0,1] mapped to [-1,1], y flipped
    because CSS y grows downward and clip space grows up.

    z is the new axis, and it is derived from the node's own radius rather than
    randomised separately. A node the 2D version drew larger was *already*
    meant to read as nearer, so deriving depth from radius preserves the
    near/far arrangement the composition was tuned against, instead of
    reshuffling it into a field nobody has looked at.
  */
  /*
    The depth bands are narrow on purpose.

    An earlier version put the near layer across z = -0.15 to 0.85, which at a
    camera distance of 2.2 magnifies it by up to 1.63x. Two things went wrong.
    Visually, near links were stretched into hairlines running the full width of
    the frame -- the geometry says a link is at most 30% of the viewport, and
    the projection was drawing it at nearly 50%. And structurally, that made the
    3D renderer draw a materially different picture from the 2D one it falls
    back to, which is exactly what Graph.reach exists to prevent.

    These bands keep the scale between about 0.71x and 1.29x. The parallax is
    what matters and it survives intact: a camera pan still displaces the near
    layer about 1.8x as far as the far layer, which is the differential the eye
    reads as depth. Magnification was never carrying that -- separation was.
  */
  const zOf = (n: { z: number }) =>
    near
      ? n.z * 0.6 - 0.1 // just in front of the z=0 plane
      : n.z * 0.4 - 0.9; // well behind it

  const nodePos = new Float32Array(nodes.length * 3);
  const nodeWobble = new Float32Array(nodes.length * 3);
  for (let i = 0; i < nodes.length; i += 1) {
    const n = nodes[i];
    nodePos[i * 3] = (n.x - 0.5) * 2;
    nodePos[i * 3 + 1] = (0.5 - n.y) * 2;
    nodePos[i * 3 + 2] = zOf(n);
    // Doubled: gl_PointSize is a diameter, n.r was a radius.
    nodeWobble[i * 3] = n.r * 2;
    nodeWobble[i * 3 + 1] = n.ph;
    nodeWobble[i * 3 + 2] = n.sp;
  }

  const linePos = new Float32Array(links.length * 6);
  const lineWeight = new Float32Array(links.length * 2);
  const packetA = new Float32Array(links.length * 3);
  const packetB = new Float32Array(links.length * 3);
  const packetOff = new Float32Array(links.length);

  for (let i = 0; i < links.length; i += 1) {
    const l = links[i];
    // The 2D renderer computed this per frame; it depends only on geometry, so
    // it is precomputed once and handed to the GPU as an attribute.
    const weight = 1 - l.d / reach;
    for (let e = 0; e < 2; e += 1) {
      const n = nodes[e === 0 ? l.a : l.b];
      const at = i * 6 + e * 3;
      linePos[at] = (n.x - 0.5) * 2;
      linePos[at + 1] = (0.5 - n.y) * 2;
      linePos[at + 2] = zOf(n);
      lineWeight[i * 2 + e] = weight;

      const endpoint = e === 0 ? packetA : packetB;
      endpoint[i * 3] = linePos[at];
      endpoint[i * 3 + 1] = linePos[at + 1];
      endpoint[i * 3 + 2] = linePos[at + 2];
    }
    packetOff[i] = l.off;
  }

  function upload(data: Float32Array): WebGLBuffer | null {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buf;
  }

  const buffers = {
    nodePos: upload(nodePos),
    nodeWobble: upload(nodeWobble),
    linePos: upload(linePos),
    lineWeight: upload(lineWeight),
    packetA: upload(packetA),
    packetB: upload(packetB),
    packetOff: upload(packetOff),
  };

  /*
    Initialisation is all-or-nothing.

    createBuffer returns null when the driver cannot allocate, and that failure
    does not lose the context -- so without this check every draw would bind
    null, render nothing, and still report success, leaving the caller showing
    an empty canvas it has no reason to replace. Better to fail here, where
    falling back is still on the table.
  */
  if (Object.values(buffers).some((buf) => buf === null)) {
    for (const buf of Object.values(buffers)) {
      if (buf) gl.deleteBuffer(buf);
    }
    gl.deleteProgram(nodeProgram);
    gl.deleteProgram(lineProgram);
    gl.deleteProgram(packetProgram);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  /*
    Additive.

    Order-independent, which is why there is no depth buffer and no sort: the
    lattice is light, and overlapping light adds. It also means a cluster of
    near nodes builds into a glow for free -- the thing the 2D renderer faked
    with a second, larger, low-alpha circle drawn behind every near node.
  */
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  /*
    Backing store at 1:1 with CSS pixels, matching the 2D renderer's decision
    for the same reason -- see GRAPH_DPR in lib/graph.ts. Point sizes multiply
    by uDpr so the sprites keep their intended visual size regardless.
  */
  const DPR = 1;

  let width = 0;
  let height = 0;
  let lost = false;

  /*
    A context can be lost at any time: a GPU reset, a driver update, the browser
    reclaiming contexts from a backgrounded tab. Drawing into a lost context is
    silently a no-op, so it is tracked and reported through draw()'s return
    value -- otherwise the hero would quietly go blank and stay blank.

    preventDefault is what allows a restore to be offered at all; this renderer
    does not take it up, because the caller's answer -- swap to the 2D renderer
    and stay there -- is simpler and cannot fail a second time.
  */
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
  };
  canvas.addEventListener("webglcontextlost", onLost);

  function bind(
    program: WebGLProgram,
    name: string,
    buf: WebGLBuffer | null,
    size: number,
  ) {
    const loc = gl.getAttribLocation(program, name);
    if (loc < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }

  /*
    Uniform locations are looked up once. getUniformLocation is a string lookup
    into the linked program, and calling it per uniform per pass per frame is
    the classic way to make a three-draw-call renderer show up in a profile.
  */
  const uniforms = [nodeProgram, lineProgram, packetProgram].map((p) => ({
    pan: gl.getUniformLocation(p, "uPan"),
    dist: gl.getUniformLocation(p, "uDist"),
    time: gl.getUniformLocation(p, "uTime"),
    dpr: gl.getUniformLocation(p, "uDpr"),
    size: gl.getUniformLocation(p, "uSize"),
    color: gl.getUniformLocation(p, "uColor"),
    alpha: gl.getUniformLocation(p, "uAlpha"),
  }));
  const [nodeU, lineU, packetU] = uniforms;

  function camera(u: (typeof uniforms)[number], t: number) {
    /*
      The entire camera animation, and it is deliberately tiny.

      Two incommensurate periods -- about 90s and 118s -- so the pan never
      visibly repeats, at an amplitude of a few hundredths of the field. Large
      enough that near and far nodes separate over a few seconds; small enough
      that nothing appears to move if you look straight at it. A hero that is
      obviously animating competes with the headline. This one only refuses to
      feel like a photograph.
    */
    gl.uniform2f(u.pan, Math.sin(t * 0.07) * 0.05, Math.cos(t * 0.053) * 0.035);
    /*
      Fixed. Dollying the camera would change the framing, and the framing is a
      decision the hero composition makes -- not one the idle animation gets to
      touch.
    */
    gl.uniform1f(u.dist, 2.2);
  }

  return {
    draw(palette, t, w, h) {
      /*
        isContextLost() is asked directly rather than trusting the event alone.

        The event is the documented signal, but it is not the whole truth: it
        can fire before this listener is attached, and a context can come back
        lost from a GPU reset the page never saw an event for. Both leave `lost`
        false while every draw is silently a no-op -- a frozen hero that reports
        no failure, which is the exact outcome the fallback exists to prevent.

        It is one boolean read per frame against a flag the driver already
        maintains, so being certain here costs nothing worth measuring.
      */
      if (lost || gl.isContextLost()) return false;
      if (!w || !h) return true;

      const bw = Math.round(w * DPR);
      const bh = Math.round(h * DPR);
      if (bw !== width || bh !== height) {
        width = bw;
        height = bh;
        canvas.width = bw;
        canvas.height = bh;
        gl.viewport(0, 0, bw, bh);
      }

      const text = rgb(palette.text);
      const accent = rgb(palette.accent);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Links first: the structure the nodes sit on.
      gl.useProgram(lineProgram);
      camera(lineU, t);
      gl.uniform3f(lineU.color, text[0], text[1], text[2]);
      gl.uniform1f(lineU.alpha, near ? 0.3 : 0.16);
      bind(lineProgram, "aPos", buffers.linePos, 3);
      bind(lineProgram, "aWeight", buffers.lineWeight, 1);
      gl.drawArrays(gl.LINES, 0, links.length * 2);

      // Nodes.
      const nodeColor = near ? accent : text;
      gl.useProgram(nodeProgram);
      camera(nodeU, t);
      gl.uniform1f(nodeU.time, t);
      gl.uniform1f(nodeU.dpr, DPR);
      gl.uniform3f(nodeU.color, nodeColor[0], nodeColor[1], nodeColor[2]);
      gl.uniform1f(nodeU.alpha, near ? 0.9 : 0.42);
      bind(nodeProgram, "aPos", buffers.nodePos, 3);
      bind(nodeProgram, "aWobble", buffers.nodeWobble, 3);
      gl.drawArrays(gl.POINTS, 0, nodes.length);

      // Packets last. They are the one element that should read as nearest.
      gl.useProgram(packetProgram);
      camera(packetU, t);
      gl.uniform1f(packetU.time, t);
      gl.uniform1f(packetU.dpr, DPR);
      gl.uniform1f(packetU.size, near ? 4.2 : 2.5);
      gl.uniform3f(packetU.color, accent[0], accent[1], accent[2]);
      gl.uniform1f(packetU.alpha, near ? 0.95 : 0.5);
      bind(packetProgram, "aA", buffers.packetA, 3);
      bind(packetProgram, "aB", buffers.packetB, 3);
      bind(packetProgram, "aOff", buffers.packetOff, 1);
      gl.drawArrays(gl.POINTS, 0, links.length);

      return true;
    },

    /*
      Explicit teardown.

      GPU objects are not reachable by the JS collector's usual rules, and a
      hero mounted and unmounted across a few client navigations would otherwise
      accumulate programs, buffers and whole contexts until the browser starts
      evicting the oldest -- which is how a page ends up with a blank hero after
      the visitor has been browsing for a while.

      loseContext is the only way to hand the context itself back rather than
      waiting for the canvas to be collected.
    */
    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      for (const buf of Object.values(buffers)) gl.deleteBuffer(buf);
      gl.deleteProgram(nodeProgram);
      gl.deleteProgram(lineProgram);
      gl.deleteProgram(packetProgram);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
