/*
  The module graph: its geometry, and the 2D renderer that is now the fallback.

  Moved out of components/motion-layer.tsx unchanged. It lives here because
  there are two renderers for it now -- this one and lib/graph-3d.ts -- and the
  geometry has to be the single thing they agree on. If buildGraph stayed inside
  the motion layer, the WebGL module would have had to import from a client
  component to get the type, which drags the whole GSAP island into its chunk
  and defeats the point of loading it separately.

  The hero's imagery, painted rather than shipped. About 2kb of code instead of
  an image file, it recolours itself when the theme changes, and -- the reason
  it is two canvases -- the near layer draws OVER the headline so a few nodes
  cross in front of the letterforms.

  It depicts nothing. A seeded arrangement of nodes is not a capture, and on a
  page that talks about security it must never be dressed up as one. Decoration
  derived from the subject, and honest about being decoration.
*/

/** Deterministic, so the arrangement is identical across reloads and themes. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export type GraphNode = {
  x: number;
  y: number;
  r: number;
  /**
   * Where the node sits within its layer's depth band: 0 furthest, 1 nearest.
   *
   * Stored rather than inferred from `r`. The 3D renderer used to recover depth
   * by inverting the radius formula, which silently produced nonsense the
   * moment radius picked up a viewport-dependent scale -- the inverse was still
   * subtracting constants that no longer matched the range. Size and depth are
   * two facts about a node, so the node carries both.
   *
   * The 2D renderer ignores it. It has no depth to express.
   */
  z: number;
  ph: number;
  sp: number;
};
export type GraphLink = { a: number; b: number; d: number; off: number };
export type Graph = {
  nodes: GraphNode[];
  links: GraphLink[];
  near: boolean;
  /**
   * How far apart two nodes may sit and still be linked, and the value both
   * renderers divide by to fade a link out as it stretches.
   *
   * Carried on the graph rather than recomputed from `near`, because it now
   * depends on the viewport: see buildGraph. Two renderers deriving it
   * independently is exactly how they would come to disagree about which links
   * exist -- which would show up as the fallback drawing a different picture
   * from the one it is falling back from.
   */
  reach: number;
};
export type Palette = {
  text: string;
  accent: string;
  /** The page ground. The lattice ignores it; the crystal builds its
      environment floor from it, so it is lit by the room it stands in. */
  bg: string;
  /**
   * Whether the resolved theme is a light one.
   *
   * Derived from the luminance of `--bg` rather than from `data-theme` or a
   * media query. Those two disagree by design -- the attribute is absent in
   * "system" mode -- so anything reading them has to reimplement the same
   * three-state resolution, and a fourth copy of that rule is a fourth chance
   * to get it wrong. The ground colour is the answer that resolution produces,
   * so this reads the answer instead.
   */
  light: boolean;
};

/** Clamp, written out rather than taken from gsap.utils: this module must stay
    importable without pulling the animation library into its chunk. */
function clamp(min: number, max: number, v: number): number {
  return v < min ? min : v > max ? max : v;
}

export function buildGraph(near: boolean, w: number, h: number): Graph {
  const rand = seeded(near ? 991 : 7);

  /*
    Node count follows viewport AREA rather than being a constant. Twenty-eight
    nodes across a 1440px desktop reads as airy depth; the same twenty-eight on
    a 390px phone is a thicket that fights the headline for attention.
  */
  const area = w * h;
  const count = near
    ? Math.round(clamp(4, 8, area / 210000))
    : Math.round(clamp(9, 28, area / 46000));

  /*
    The near layer is a FOREGROUND element. On a wide screen it is meant to
    crowd the headline slightly -- a few nodes crossing the letterforms is the
    whole reason there are two canvases.

    On a phone the hero is tall and the band below the copy is empty, so the
    same nodes land in dead space with nothing to cross, and a handful of bright
    linked dots in an empty rectangle stops reading as depth and starts reading
    as a diagram of something. Scaled back to a few quiet accents instead.

    Keyed on the short side rather than on width, so a phone held sideways --
    wide, but with no vertical room either -- gets the same treatment.
  */
  const intimate = Math.min(w, h) < 520;
  const nearScale = intimate ? 0.62 : 1;

  const nodes: GraphNode[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = rand();
    // Near nodes hug the lower band, which is where the headline's baseline
    // sits -- that is what makes them cross in front of it.
    const y = near ? 0.52 + rand() * 0.4 : rand();
    /*
      One draw feeds both size and depth, so a node drawn larger is also the
      node placed nearer. That correspondence is what made the flat version
      read as layered at all, and keeping it means the 3D arrangement is the
      one the composition was tuned against rather than a fresh shuffle.

      Taking a single rand() here also preserves the sequence exactly as it was
      when radius consumed that draw, so the constellation is unchanged.
    */
    const z = rand();
    nodes.push({
      x,
      y,
      r: near ? (2.6 + z * 3.4) * nearScale : 1 + z * 1.8,
      z,
      ph: rand() * Math.PI * 2,
      sp: 0.12 + rand() * 0.3,
    });
  }

  /*
    Reach, and the reason link distance is no longer measured in the node
    coordinates themselves.

    x and y are both [0,1] but the viewport is not square, so a separation of
    0.235 was 297px across a 1265px-wide desktop and 169px down its 720px
    height. The same number meant two different distances depending on which
    way round you measured, which is why the constellation always came out
    stretched along one axis -- and on a 375x812 phone the stretch inverts, so
    the near layer drew one enormous vertical triangle.

    Scaling each axis by its share of the LONGEST side makes `d` a true
    on-screen distance expressed as a fraction of that side. `reach` then means
    the same visual span at every aspect ratio, which is what it always read as
    meaning.
  */
  const longest = Math.max(w, h) || 1;
  const sx = w / longest;
  const sy = h / longest;

  /*
    Retuned when the measurement above changed under them.

    The old 0.235 / 0.42 were calibrated against the un-corrected distance,
    where a vertical separation counted as if the viewport were square. Keeping
    them once `d` became a true on-screen distance made every vertical pair far
    more willing to link than before -- on a 1265x720 desktop the effective
    vertical threshold went from 169px to 297px -- and the hero filled up with
    long wires spanning the whole frame.

    These are the values that restore the density the composition was built
    around, now that the number they are compared against means the same thing
    in both directions.
  */
  const reach = (near ? 0.4 : 0.215) * (intimate && near ? 0.6 : 1);

  /*
    Links are faded by 1 - d/reach, so one sitting just inside the threshold is
    drawn at almost zero alpha. Those do not read as a faint connection; they
    read as a scratch on the lens -- a stray hairline wandering off to an edge
    with no visible node at either end to explain it.

    So the cut is made where the link would stop being legible rather than where
    it would stop existing. Anything below a quarter weight is dropped, and
    reach is opened up to compensate so the surviving density is unchanged.
  */
  const MIN_WEIGHT = 0.25;

  const links: GraphLink[] = [];
  for (let a = 0; a < nodes.length; a += 1) {
    for (let b = a + 1; b < nodes.length; b += 1) {
      const dx = (nodes[a].x - nodes[b].x) * sx;
      const dy = (nodes[a].y - nodes[b].y) * sy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (1 - d / reach >= MIN_WEIGHT) links.push({ a, b, d, off: rand() });
    }
  }

  return { nodes, links, near, reach };
}

/** Palette read once and cached; re-read only when the theme actually changes. */
export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const bg = cs.getPropertyValue("--bg").trim() || "#0a0b0d";

  /*
    Relative luminance, near enough. Not the WCAG formula -- nothing here is a
    contrast decision, it only has to separate a near-black ground from a
    near-white one, and the coefficients are what make green count for more than
    blue in that judgement.
  */
  const m = /^#?([0-9a-f]{6})$/i.exec(bg);
  const n = m ? parseInt(m[1], 16) : 0;
  const luma =
    (0.2126 * ((n >> 16) & 255) +
      0.7152 * ((n >> 8) & 255) +
      0.0722 * (n & 255)) /
    255;

  return {
    text: cs.getPropertyValue("--text").trim() || "#edeef0",
    accent: cs.getPropertyValue("--accent").trim() || "#f5a524",
    bg,
    light: luma > 0.5,
  };
}

/*
  The backing store is deliberately 1:1 with CSS pixels, NOT devicePixelRatio.

  This was Math.min(devicePixelRatio, 2), which on any high-DPI display made
  each of these two full-viewport canvases 3810x2160 -- 8.2 megapixels each, so
  16.5 million pixels were cleared and refilled every single frame. Nothing on
  this canvas benefits: it is hairlines at 16% alpha and dots two pixels across,
  and a 2x backing store spends four times the fill rate to make a soft edge
  slightly less soft.

  That cost never shows up in a requestAnimationFrame frame counter, because it
  is not main-thread work. It is fill rate, and on an integrated GPU it is the
  difference between a page that scrolls and a page that does not.
*/
export const GRAPH_DPR = 1;

/*
  The graph redraws at roughly 30fps rather than at display refresh.

  Packets travel at 0.06 of a link per second and nodes pulse between 0.12 and
  0.42Hz. Nothing here moves fast enough for anyone to tell 30fps from 144, and
  at 144 the page pays for nearly five times as many repaints to render motion
  nobody can see. The scroll-linked animations are untouched and still run at
  full rate; only this decorative loop is capped.

  The cap survived the move to the GPU. A draw is cheaper now, but it is not
  free -- it is still fill rate over the whole viewport, and on a phone that is
  battery. Cheaper is not a reason to do it more often than anyone can see.
*/
export const GRAPH_FRAME_MS = 1000 / 30;

/*
  The 2D renderer, now the fallback rather than the default.

  It is kept in full, because it is what a visitor sees when WebGL is
  unavailable -- a blocked context, a driver that rejects the shaders, a browser
  with acceleration switched off, a context lost and not restored. That is a
  real population, and the answer for them is the imagery this page was designed
  with, not an empty rectangle.
*/
export function drawGraph(
  canvas: HTMLCanvasElement,
  graph: Graph,
  palette: Palette,
  t: number,
  /*
    Size is passed in rather than read off the element. Reading clientWidth
    inside the loop forced a layout every frame, for every canvas, purely to
    re-learn a number that only changes on resize.
  */
  w: number,
  h: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (!w || !h) return;

  /*
    Both dimensions are compared, not just the width.

    This used to resize only when the width changed, so a height-only resize --
    a phone rotating is not one, but a desktop window dragged taller is, and so
    is mobile Safari's address bar collapsing -- left the backing bitmap at its
    old height while the drawing below used the new one. The result is a graph
    squashed or clipped against a bitmap that no longer matches its element.
  */
  const bw = Math.round(w * GRAPH_DPR);
  const bh = Math.round(h * GRAPH_DPR);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }

  ctx.setTransform(GRAPH_DPR, 0, 0, GRAPH_DPR, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const { near, reach } = graph;
  ctx.lineWidth = near ? 1.1 : 0.7;

  for (const link of graph.links) {
    const A = graph.nodes[link.a];
    const B = graph.nodes[link.b];
    const ax = A.x * w;
    const ay = A.y * h;
    const bx = B.x * w;
    const by = B.y * h;

    ctx.globalAlpha = (near ? 0.3 : 0.16) * (1 - link.d / reach);
    ctx.strokeStyle = palette.text;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // A build travelling an edge. One point per link, wrapping.
    const p = (t * 0.06 * (0.5 + link.off) + link.off) % 1;
    ctx.globalAlpha = near ? 0.95 : 0.5;
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(
      ax + (bx - ax) * p,
      ay + (by - ay) * p,
      near ? 2.1 : 1.25,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  for (const node of graph.nodes) {
    const pulse = 0.72 + 0.28 * Math.sin(t * node.sp + node.ph);
    ctx.globalAlpha = near ? 0.9 : 0.42;
    ctx.fillStyle = near ? palette.accent : palette.text;
    ctx.beginPath();
    ctx.arc(node.x * w, node.y * h, node.r * pulse, 0, Math.PI * 2);
    ctx.fill();

    if (near) {
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(node.x * w, node.y * h, node.r * pulse * 3.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
}
