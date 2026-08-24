"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE_OUT, EASE_SCRUB, MQ, STAGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

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

      // The portrait is optional, so only animate it when it exists.
      if (document.querySelector("[data-hero-portrait]")) {
        tl.fromTo(
          "[data-hero-portrait]",
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: DUR.hero },
          0.15,
        );
      }
    });

    // Parallax depth. Desktop only: on tablet it is one layer, on mobile none.
    mm.add(`${MQ.desktop} and ${MQ.motionOK}`, () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 0.15;
        gsap.to(el, {
          yPercent: -12 * depth * 10,
          ease: EASE_SCRUB,
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    });

    mm.add(`${MQ.tablet} and ${MQ.motionOK}`, () => {
      const single = document.querySelector<HTMLElement>('[data-parallax="1"]');
      if (!single) return;
      gsap.to(single, {
        yPercent: -8,
        ease: EASE_SCRUB,
        scrollTrigger: {
          trigger: single.closest("section") ?? single,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // The pinned thesis. It holds the viewport because it is the argument the
    // whole site is making. Not pinned below 768px, where it fights OS scroll.
    mm.add(`(min-width: 768px) and ${MQ.motionOK}`, () => {
      const pin = document.querySelector<HTMLElement>("[data-pin]");
      if (!pin) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const rule = pin.querySelector("[data-pin-rule]");
      const tail = pin.querySelector("[data-pin-tail]");

      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, ease: EASE_SCRUB, transformOrigin: "left center" },
        );
      }
      if (tail) {
        tl.fromTo(tail, { opacity: 0.25 }, { opacity: 1, ease: EASE_SCRUB }, "<");
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

    // Fonts change metrics, which moves every trigger. Recalculate once they
    // have actually landed rather than guessing with a timeout.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => mm.revert();
  }, []);

  return null;
}
