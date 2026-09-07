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
/*
  Geometry and the 2D renderer. The 3D one is NOT imported here -- it is reached
  through a dynamic import inside the motion-OK branch below, so its WebGL code
  never enters this island's chunk and is never fetched by a visitor who has
  asked for reduced motion.
*/
import {
  buildGraph,
  drawGraph,
  readPalette,
  GRAPH_FRAME_MS,
} from "@/lib/graph";
import type { Renderer } from "@/lib/graph-3d";

gsap.registerPlugin(ScrollTrigger);

// GSAP's own documented mitigation for the mobile-Safari address-bar issue:
// ScrollTrigger normally refreshes on any resize, and the toolbar collapsing
// as the user scrolls fires one. This tells it to ignore a resize on touch
// devices when only the height changed, which is the toolbar's signature.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Swaps a canvas for a structurally identical fresh one, and returns it.
 *
 * This exists because of a hard rule in the canvas API that is easy to miss:
 * **a canvas that has held a WebGL context can never grant a 2D one.**
 * getContext("2d") on it returns null, for the life of the element.
 *
 * That breaks the fallback in precisely the two situations the fallback exists
 * for. If the driver rejects the shaders, the WebGL context was still created
 * successfully before the rejection; if the context is lost mid-visit, it was
 * created and then taken away. Either way the element is spent, drawGraph's
 * getContext("2d") returns null, it returns without drawing, and the hero goes
 * blank with nothing logged anywhere.
 *
 * Replacing the element is the only way back. cloneNode(false) copies the
 * attributes -- class, data-graph, aria-hidden -- and nothing else, so the
 * replacement lands in the same place in the same stacking order with no
 * context attached.
 */
function recycleCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const fresh = canvas.cloneNode(false) as HTMLCanvasElement;
  canvas.replaceWith(fresh);
  return fresh;
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

      /*
        The 3D renderers, once they exist.

        One slot per canvas, all null to begin with. The loop starts painting
        the 2D graph on the very next frame and keeps doing so until the WebGL
        module has been fetched, compiled and accepted by the driver -- so the
        hero is never empty while that is happening, and if any of it fails the
        page simply carries on with what it is already drawing. The upgrade is
        invisible either way, because both renderers draw the same arrangement.
      */
      const renderers: (Renderer | null)[] = items.map(() => null);
      let disposed = false;

      import("@/lib/graph-3d")
        .then(({ createRenderer }) => {
          // matchMedia can tear this branch down while the chunk is in flight
          // -- a resize across a breakpoint, or the visitor navigating away.
          // Anything created after that would never be disposed.
          if (disposed) return;
          for (let i = 0; i < items.length; i += 1) {
            /*
              WebGL always gets a FRESH element, never the one already on screen.

              By the time this resolves, the loop below has been painting the 2D
              fallback for one or more frames, which permanently makes that
              element a 2D canvas -- context types are exclusive in both
              directions, not just from WebGL to 2D. Handing it to createRenderer
              would get null from getContext("webgl") on a perfectly capable
              GPU, and since nothing retries, a slow chunk would strand the
              visitor in 2D for the whole visit.

              So the attempt is made on a virgin clone. If it succeeds the clone
              is already in the DOM in the right place and simply becomes ours;
              if it fails, the clone is spent in turn and the 2D renderer needs
              another one.
            */
            const candidate = recycleCanvas(items[i].canvas);
            const renderer = createRenderer(candidate, items[i].graph);
            renderers[i] = renderer;
            items[i].canvas = renderer ? candidate : recycleCanvas(candidate);
          }
          // The swapped-in elements are new, so their measured sizes belong to
          // elements that are no longer in the tree.
          remeasure();
        })
        .catch(() => {
          // A chunk that fails to load is a network problem, not a page
          // problem. The 2D graph is already on screen; leave it there.
        });

      const tick = (ms: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        // Capped at ~30fps. See GRAPH_FRAME_MS.
        if (ms - lastDraw < GRAPH_FRAME_MS) return;
        lastDraw = ms;
        const t = ms / 1000;
        for (let i = 0; i < items.length; i += 1) {
          const renderer = renderers[i];
          /*
            draw() returns false once its GL context has been lost -- a GPU
            reset, or the browser reclaiming contexts from a backgrounded tab.
            Dropping the renderer here means the very next frame is drawn in 2D
            instead, so a lost context costs one frame rather than leaving the
            hero blank for the rest of the visit.
          */
          if (renderer && renderer.draw(palette, t, sizes[i].w, sizes[i].h)) {
            continue;
          }
          if (renderer) {
            renderer.dispose();
            renderers[i] = null;
            // The lost context is still attached to this element, so it can
            // never give a 2D one. Swap it before drawing. See recycleCanvas.
            items[i].canvas = recycleCanvas(items[i].canvas);
          }
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
        disposed = true;
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", remeasure);
        stopWatchingTheme();
        /*
          GPU objects are not reachable by the collector's usual rules. Without
          this, crossing the reduced-motion or breakpoint boundary a few times
          leaks a whole WebGL context per canvas per crossing.

          The canvases are recycled as well as disposed, and that is the part
          that is easy to miss: matchMedia hands the page straight to the
          reduced-motion branch when someone turns the preference on mid-visit,
          and that branch draws in 2D. A disposed context does not free the
          element -- it stays a WebGL canvas forever -- so without this swap the
          static fallback would paint nothing at all, which is precisely the
          case it exists to cover.
        */
        for (let i = 0; i < renderers.length; i += 1) {
          const renderer = renderers[i];
          if (!renderer) continue;
          renderer.dispose();
          items[i].canvas = recycleCanvas(items[i].canvas);
        }
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

    /*
      The nav's frost is no longer animated, and the tween that used to live
      here has been removed rather than retuned.

      It scrubbed the bar's opacity from 0 to 1 over the first 120px of scroll,
      on the assumption that there was nothing behind the bar worth hiding until
      content arrived. Full-bleed project plates broke that assumption: they run
      under the fixed bar, several of them are near-white, and a bar that is
      transparent for any part of that is unreadable for that part.

      The frost is now a static, always-on rule in globals.css. One less
      ScrollTrigger, and a contrast guarantee that does not depend on where the
      reader happens to be.
    */

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

