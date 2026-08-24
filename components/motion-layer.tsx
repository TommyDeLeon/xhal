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

      const q = gsap.utils.selector(pin);

      // Short pin. The whole sequence resolves inside roughly half a screen of
      // scroll, so the section reads as a beat rather than as a stall.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=55%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const lead = q("[data-pin-lead]");
      const rule = q("[data-pin-rule]");
      const tail = q("[data-pin-tail]");
      const body = q("[data-pin-body]");
      const glow = q("[data-pin-glow]");

      // The first clause settles back in depth as the second arrives, so the
      // two halves of the claim trade focus instead of just sitting there.
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
