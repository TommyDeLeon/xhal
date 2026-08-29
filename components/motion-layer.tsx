"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE_OUT, EASE_SCRUB, MQ, SCRUB, STAGGER } from "@/lib/motion";
/*
  Reused rather than reimplemented. The graph has to recolour on exactly the
  same signal the screenshots swap on -- an explicit data-theme, or the OS
  preference when there is none -- and duplicating that rule here is how the
  two would eventually disagree.
*/
import { watchShotTheme } from "@/lib/shot-theme";

gsap.registerPlugin(ScrollTrigger);

// GSAP's own documented mitigation for the mobile-Safari address-bar issue:
// ScrollTrigger normally refreshes on any resize, and the toolbar collapsing
// as the user scrolls fires one. This tells it to ignore a resize on touch
// devices when only the height changed, which is the toolbar's signature.
ScrollTrigger.config({ ignoreMobileResize: true });

/* ── The module graph ──────────────────────────────────────────────────────
 *
 * The hero's imagery, painted rather than shipped. About 2kb of code instead of
 * an image file, it recolours itself when the theme changes, and -- the reason
 * it is two canvases -- the near layer draws OVER the headline so a few nodes
 * cross in front of the letterforms.
 *
 * It depicts nothing. A seeded arrangement of nodes is not a capture, and on a
 * page that talks about security it must never be dressed up as one. Decoration
 * derived from the subject, and honest about being decoration.
 */

/** Deterministic, so the arrangement is identical across reloads and themes. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type GraphNode = { x: number; y: number; r: number; ph: number; sp: number };
type GraphLink = { a: number; b: number; d: number; off: number };
type Graph = { nodes: GraphNode[]; links: GraphLink[]; near: boolean };

function buildGraph(near: boolean, w: number, h: number): Graph {
  const rand = seeded(near ? 991 : 7);

  /*
    Node count follows viewport AREA rather than being a constant. Twenty-eight
    nodes across a 1440px desktop reads as airy depth; the same twenty-eight on
    a 390px phone is a thicket that fights the headline for attention.
  */
  const area = w * h;
  const count = near
    ? Math.round(gsap.utils.clamp(4, 8, area / 210000))
    : Math.round(gsap.utils.clamp(9, 28, area / 46000));

  const nodes: GraphNode[] = [];
  for (let i = 0; i < count; i += 1) {
    nodes.push({
      x: rand(),
      // Near nodes hug the lower band, which is where the headline's baseline
      // sits -- that is what makes them cross in front of it.
      y: near ? 0.52 + rand() * 0.4 : rand(),
      r: near ? 2.6 + rand() * 3.4 : 1 + rand() * 1.8,
      ph: rand() * Math.PI * 2,
      sp: 0.12 + rand() * 0.3,
    });
  }

  const reach = near ? 0.42 : 0.235;
  const links: GraphLink[] = [];
  for (let a = 0; a < nodes.length; a += 1) {
    for (let b = a + 1; b < nodes.length; b += 1) {
      const dx = nodes[a].x - nodes[b].x;
      const dy = nodes[a].y - nodes[b].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < reach) links.push({ a, b, d, off: rand() });
    }
  }

  return { nodes, links, near };
}

/** Palette read once and cached; re-read only when the theme actually changes. */
function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  return {
    text: cs.getPropertyValue("--text").trim() || "#edeef0",
    accent: cs.getPropertyValue("--accent").trim() || "#f5a524",
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
const GRAPH_DPR = 1;

/*
  The graph redraws at roughly 30fps rather than at display refresh.

  Packets travel at 0.06 of a link per second and nodes pulse between 0.12 and
  0.42Hz. Nothing here moves fast enough for anyone to tell 30fps from 144, and
  at 144 the page pays for nearly five times as many full-viewport repaints to
  render motion nobody can see. The scroll-linked animations are untouched and
  still run at full rate; only this decorative loop is capped.
*/
const GRAPH_FRAME_MS = 1000 / 30;

function drawGraph(
  canvas: HTMLCanvasElement,
  graph: Graph,
  palette: { text: string; accent: string },
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

  const bw = Math.round(w * GRAPH_DPR);
  if (canvas.width !== bw) {
    canvas.width = bw;
    canvas.height = Math.round(h * GRAPH_DPR);
  }

  ctx.setTransform(GRAPH_DPR, 0, 0, GRAPH_DPR, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const { near } = graph;
  const reach = near ? 0.42 : 0.235;
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

/** Every canvas the hero marked, paired with a graph sized to it. */
function collectGraphs() {
  return gsap.utils
    .toArray<HTMLCanvasElement>("canvas[data-graph]")
    .map((canvas) => ({
      canvas,
      graph: buildGraph(
        canvas.dataset.graph === "front",
        canvas.clientWidth || 1,
        canvas.clientHeight || 1,
      ),
    }));
}

/**
 * The single motion island. Sections stay server-rendered and mark themselves
 * with data attributes; this component reads those attributes and attaches the
 * animation. Keeping it in one place means one matchMedia teardown, one set of
 * ScrollTriggers, and no motion code duplicated across sections.
 *
 * Every animation here touches only transform and opacity.
 */
export default function MotionLayer() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    // The graph paints on a rAF loop, but only while the hero is actually on
    // screen. A full-viewport canvas repainting behind four sections the visitor
    // has already scrolled past is cost with nothing on the other side of it.
    mm.add(MQ.motionOK, () => {
      const items = collectGraphs();
      if (!items.length) return;

      let palette = readPalette();
      let visible = true;
      let raf = 0;
      let lastDraw = 0;

      /*
        Canvas sizes are measured once here and refreshed only on resize.
        Reading clientWidth inside the loop meant a forced layout on every
        frame for every canvas, to re-read a number that changes when the
        window changes and at no other time.
      */
      let sizes = items.map((item) => ({
        w: item.canvas.clientWidth,
        h: item.canvas.clientHeight,
      }));
      const remeasure = () => {
        sizes = items.map((item) => ({
          w: item.canvas.clientWidth,
          h: item.canvas.clientHeight,
        }));
        lastDraw = 0;
      };
      window.addEventListener("resize", remeasure);

      const hero = document.querySelector("[data-hero]");
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "160px" },
      );
      if (hero) io.observe(hero);

      const tick = (ms: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        // Capped at ~30fps. See GRAPH_FRAME_MS.
        if (ms - lastDraw < GRAPH_FRAME_MS) return;
        lastDraw = ms;
        const t = ms / 1000;
        for (let i = 0; i < items.length; i += 1) {
          drawGraph(
            items[i].canvas,
            items[i].graph,
            palette,
            t,
            sizes[i].w,
            sizes[i].h,
          );
        }
      };
      raf = requestAnimationFrame(tick);

      const stopWatchingTheme = watchShotTheme(() => {
        palette = readPalette();
      });

      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", remeasure);
        stopWatchingTheme();
      };
    });

    // Reduced motion gets the imagery, not a blank rectangle. One static frame,
    // repainted only when the theme or the viewport actually changes.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const items = collectGraphs();
      if (!items.length) return;

      const paint = () => {
        const palette = readPalette();
        for (const item of items) {
          drawGraph(
            item.canvas,
            item.graph,
            palette,
            3.2,
            item.canvas.clientWidth,
            item.canvas.clientHeight,
          );
        }
      };

      paint();
      window.addEventListener("resize", paint);
      const stopWatchingTheme = watchShotTheme(paint);

      return () => {
        window.removeEventListener("resize", paint);
        stopWatchingTheme();
      };
    });

    // Reveals. Cheap enough to run at every size, so it is the baseline that
    // survives when pinning and parallax are switched off.
    mm.add(MQ.motionOK, () => {
      const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");

      groups.forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]",
          group,
        );
        if (!items.length) return;

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DUR.enter,
            ease: EASE_OUT,
            stagger: STAGGER,
            scrollTrigger: {
              trigger: group,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      // Standalone reveals that are not inside a group.
      const loose = gsap.utils.toArray<HTMLElement>(
        "[data-reveal]:not([data-reveal-group] [data-reveal])",
      );
      loose.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DUR.enter,
            ease: EASE_OUT,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });
    });

    // Hero entrance. Reading order: name, then claim, then the action.
    mm.add(MQ.motionOK, () => {
      const hero = document.querySelector("[data-hero]");
      if (!hero) return;

      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT, duration: DUR.hero },
      });

      tl.fromTo(
        "[data-hero-line]",
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.08 },
      )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: DUR.enter },
          "-=0.7",
        )
        .fromTo(
          "[data-hero-cta]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: DUR.enter },
          "<0.1",
        );

      /*
        Safety net for the entrance.

        This timeline is the only thing standing between a visitor and the
        headline, the positioning line and the one call to action -- all three
        start at opacity 0 and become visible only when it plays. It is driven
        by requestAnimationFrame, which a backgrounded tab, a heavily throttled
        device or an automation browser can starve almost indefinitely. I
        measured 1fps in one, where this 1.4s entrance would take about a
        minute and the CTA is invisible for all of it.

        setTimeout is throttled on a different schedule, so it still lands. At
        normal frame rates the timeline finishes long before this fires and the
        guard does nothing at all. The point is that above-the-fold content is
        never left waiting on a frame budget that may never arrive.
      */
      const settle = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 4000);

      return () => window.clearTimeout(settle);
    });

    // Parallax depth. Desktop only: on tablet it is one layer, on mobile none.
    //
    // data-parallax is a 0-1 depth scalar, and 12% of the layer's own height is
    // the ceiling. The previous multiplier (-12 * depth * 10) sent a depth-1
    // ground -120%, further than its own height, which is why it read as a
    // moving object rather than as distance. Depth should be felt, not watched.
    mm.add(`${MQ.desktop} and ${MQ.motionOK}`, () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 0.15;
        gsap.to(el, {
          yPercent: -12 * depth,
          ease: EASE_SCRUB,
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: SCRUB.drift,
          },
        });
      });
    });

    mm.add(`${MQ.tablet} and ${MQ.motionOK}`, () => {
      const single = document.querySelector<HTMLElement>('[data-parallax="1"]');
      if (!single) return;
      gsap.to(single, {
        // Two thirds of the desktop ceiling. One layer carrying all the depth
        // should move less than the deepest of three, not the same.
        yPercent: -8,
        ease: EASE_SCRUB,
        scrollTrigger: {
          trigger: single.closest("section") ?? single,
          start: "top bottom",
          end: "bottom top",
          scrub: SCRUB.drift,
        },
      });
    });

    // The hero recedes as it leaves.
    //
    // This is the one idea worth taking from a scroll-driven 3D camera: the next
    // section should arrive from IN FRONT of the thing it replaces, not from
    // below it. Pushing the hero back in Z while the page scrolls past does that
    // with two composited properties and no renderer.
    //
    // -90px against the shared 1400px perspective is an effective scale of
    // 1400 / (1400 + 90) = 0.94 -- the floor of the amplitude budget, not past
    // it. Opacity carries the rest, because distance reads as falloff and
    // animating an actual blur is per-frame GPU work this page will not spend.
    mm.add(`${MQ.wide} and ${MQ.motionOK}`, () => {
      const plate = document.querySelector<HTMLElement>("[data-hero-depth]");
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!plate || !hero) return;

      gsap.fromTo(
        plate,
        { z: 0, opacity: 1 },
        {
          z: -90,
          opacity: 0.5,
          ease: EASE_SCRUB,
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: SCRUB.held,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    // Same beat on a phone, at roughly half the travel. A small screen makes the
    // same Z displacement read as a much larger proportional move, and the phone
    // is also the device least able to afford it.
    mm.add(`(max-width: 767.98px) and ${MQ.motionOK}`, () => {
      const plate = document.querySelector<HTMLElement>("[data-hero-depth]");
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!plate || !hero) return;

      gsap.fromTo(
        plate,
        { z: 0, opacity: 1 },
        {
          z: -45,
          opacity: 0.6,
          ease: EASE_SCRUB,
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: SCRUB.held,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    // The nav frosts once there is something behind it to frost.
    //
    // Runs at every width, because a transparent bar over body copy is a
    // legibility problem on a phone as much as on a desktop. Only the ANIMATED
    // case lives here; a reduced-motion visitor gets the frost outright and
    // permanently from CSS (:root:not(.js-motion) .nav-glass), because they need
    // the contrast fix more than anyone and should not have to earn it by
    // scrolling.
    //
    // Opacity is the only property that moves. The blur radius is static in CSS
    // and never tweened -- scrubbing a backdrop-filter is the single most
    // reliable way to drop a mid-range phone below 60fps.
    mm.add(MQ.motionOK, () => {
      const glass = document.querySelector<HTMLElement>("[data-nav-glass]");
      if (!glass) return;

      gsap.fromTo(
        glass,
        { opacity: 0 },
        {
          opacity: 1,
          ease: EASE_SCRUB,
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            // Roughly the height of the bar itself: the frost arrives as the
            // first content slides under it, not several screens later.
            end: "+=120",
            scrub: 0.3,
          },
        },
      );
    });

    // The pinned thesis. It holds the viewport because it is the argument the
    // whole site is making, on viewports with the width AND the vertical room
    // for it. Everything else gets the same beat scrubbed to scroll position
    // instead, so the section is never merely static.
    //
    // The width query is the only live-reactive condition. Height is read
    // fresh, once, each time this handler (re)runs — which only happens on an
    // actual width crossing (a real orientation change or resize), never on
    // mobile Safari's toolbar collapsing mid-scroll. A live min-height query
    // would retrigger on that toolbar movement and tear down/rebuild the pin
    // while the user is actively scrolling through it, which is exactly the
    // "scroll jumps back and forth" bug this replaced.
    mm.add(`${MQ.wide} and ${MQ.motionOK}`, () => {
      const pin = document.querySelector<HTMLElement>("[data-pin]");
      if (!pin) return;

      const tallEnough = window.innerHeight >= 640;
      const q = gsap.utils.selector(pin);
      const lead = q("[data-pin-lead]");
      const rule = q("[data-pin-rule]");
      const tail = q("[data-pin-tail]");
      const body = q("[data-pin-body]");
      const glow = q("[data-pin-glow]");

      if (tallEnough) {
        /*
          This used to pin. It does not any more, and the reason is measured.

          ScrollTrigger implements a pin by wrapping the element in a
          pin-spacer and swapping it to fixed positioning. Inserting that
          spacer changes document layout after first paint, and a trace of the
          production build attributed TWO layout shifts totalling 1.10 CLS to
          this one section -- both naming #approach, nothing else on the page
          contributing. The brief's own acceptance criterion is "no layout
          shift from motion (CLS ~0)", so the pin was failing a hard
          requirement in order to satisfy a soft one.

          The sequence is scrubbed across the section's own travel instead. The
          same five beats play against the same scroll input; what is lost is
          the viewport HOLDING while they play. That is a real loss and worth
          knowing about -- restoring `pin: true` here brings the hold back, and
          the 1.10 CLS with it.

          A longer window than the short-viewport branch below (85% to 10%
          rather than 80% to 15%), because without the hold the beats need more
          scroll distance to avoid resolving all at once.
        */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top 85%",
            end: "top 10%",
            scrub: SCRUB.held,
            invalidateOnRefresh: true,
          },
        });

        // The first clause settles back in depth as the second arrives, so
        // the two halves of the claim trade focus instead of just sitting.
        if (lead.length) {
          tl.fromTo(
            lead,
            { z: 0, opacity: 1 },
            { z: -90, opacity: 0.45, ease: EASE_SCRUB },
            0,
          );
        }
        if (rule.length) {
          tl.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, ease: EASE_SCRUB, transformOrigin: "left center" },
            0,
          );
        }
        if (tail.length) {
          tl.fromTo(
            tail,
            { z: -160, yPercent: 22, autoAlpha: 0 },
            { z: 0, yPercent: 0, autoAlpha: 1, ease: EASE_SCRUB },
            0.05,
          );
        }
        if (body.length) {
          tl.fromTo(
            body,
            { yPercent: 30, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, ease: EASE_SCRUB },
            0.35,
          );
        }
        if (glow.length) {
          tl.fromTo(
            glow,
            { scale: 0.75, opacity: 0.25 },
            { scale: 1.1, opacity: 0.7, ease: EASE_SCRUB },
            0,
          );
        }
      } else {
        // Wide but short (a phone held sideways). Same beat, no pin.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top 80%",
            end: "top 15%",
            scrub: SCRUB.close,
          },
        });

        if (lead.length) {
          tl.fromTo(
            lead,
            { yPercent: 16, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, ease: EASE_SCRUB },
            0,
          );
        }
        if (rule.length) {
          tl.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, ease: EASE_SCRUB, transformOrigin: "left center" },
            0.15,
          );
        }
        if (tail.length) {
          tl.fromTo(
            tail,
            { yPercent: 22, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, ease: EASE_SCRUB },
            0.3,
          );
        }
        if (body.length) {
          tl.fromTo(
            body,
            { yPercent: 18, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, ease: EASE_SCRUB },
            0.5,
          );
        }
      }
    });

    // Narrow (portrait phone). Never pins, whatever the height.
    mm.add(`(max-width: 767.98px) and ${MQ.motionOK}`, () => {
      const pin = document.querySelector<HTMLElement>("[data-pin]");
      if (!pin) return;

      const q = gsap.utils.selector(pin);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top 80%",
          end: "top 15%",
          scrub: SCRUB.close,
        },
      });

      const lead = q("[data-pin-lead]");
      const rule = q("[data-pin-rule]");
      const tail = q("[data-pin-tail]");
      const body = q("[data-pin-body]");

      if (lead.length) {
        tl.fromTo(
          lead,
          { yPercent: 16, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: EASE_SCRUB },
          0,
        );
      }
      if (rule.length) {
        tl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, ease: EASE_SCRUB, transformOrigin: "left center" },
          0.15,
        );
      }
      if (tail.length) {
        tl.fromTo(
          tail,
          { yPercent: 22, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: EASE_SCRUB },
          0.3,
        );
      }
      if (body.length) {
        tl.fromTo(
          body,
          { yPercent: 18, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: EASE_SCRUB },
          0.5,
        );
      }
    });

    // Card tilt. Feedback that the card is an object you are about to open.
    // Pointer-driven, so it uses quickTo rather than a tween per event.
    mm.add(`${MQ.desktop} and ${MQ.motionOK}`, () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-tilt]");
      const teardowns: Array<() => void> = [];

      cards.forEach((card) => {
        const rotX = gsap.quickTo(card, "rotationX", {
          duration: 0.6,
          ease: "power3",
        });
        const rotY = gsap.quickTo(card, "rotationY", {
          duration: 0.6,
          ease: "power3",
        });

        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rotY(px * 6);
          rotX(-py * 6);
        };
        const onLeave = () => {
          rotY(0);
          rotX(0);
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        teardowns.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      return () => teardowns.forEach((fn) => fn());
    });

    // Section headings rise out of a mask. Hierarchy: the heading is the first
    // thing the eye should land on when a section arrives.
    mm.add(MQ.motionOK, () => {
      gsap.utils.toArray<HTMLElement>("[data-head]").forEach((head) => {
        gsap.fromTo(
          head,
          { yPercent: 105 },
          {
            yPercent: 0,
            duration: DUR.enter,
            ease: EASE_OUT,
            scrollTrigger: { trigger: head, start: "top 88%", once: true },
          },
        );
      });
    });

    // Screenshots settle out of depth as they arrive. Storytelling: each shot
    // reads as an object being placed down rather than a picture appearing.
    mm.add(`${MQ.desktop} and ${MQ.motionOK}`, () => {
      gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((shot) => {
        gsap.fromTo(
          shot,
          { rotateX: 7, scale: 0.94, transformOrigin: "50% 100%" },
          {
            rotateX: 0,
            scale: 1,
            ease: EASE_SCRUB,
            scrollTrigger: {
              trigger: shot,
              start: "top 92%",
              end: "top 45%",
              scrub: SCRUB.held,
            },
          },
        );
      });
    });

    // Fonts change metrics, which moves every trigger. Recalculate once they
    // have actually landed rather than guessing with a timeout.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => mm.revert();
  }, []);

  return null;
}
