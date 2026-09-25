"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
  Progressive motion. Content is fully visible in the server HTML; this script
  only adds `motion` to <html> once it is running, and CSS hides reveal targets
  only under that class. If the script fails, nothing is hidden.

  - [data-reveal] elements get `is-in` once, when they enter view. Anything
    already on screen is marked first, so nothing flashes out and back.
  - The hero collection follows a fine pointer by a few pixels, for depth.
  - Reduced motion: no class, no observer, no pointer effect.
*/
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    const fold = window.innerHeight;
    for (const el of targets) {
      const box = el.getBoundingClientRect();
      if (box.top < fold * 0.92 && box.bottom > 0) el.classList.add("is-in", "is-instant");
    }
    root.classList.add("motion");
    // Let those settle without a transition, then give hover effects back.
    const settle = requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelectorAll(".is-instant").forEach((el) => el.classList.remove("is-instant"));
    }));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    for (const el of targets) if (!el.classList.contains("is-in")) observer.observe(el);

    const stage = document.querySelector<HTMLElement>("[data-depth]");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (!stage) return;
      const box = stage.getBoundingClientRect();
      const x = (event.clientX - (box.left + box.width / 2)) / box.width;
      const y = (event.clientY - (box.top + box.height / 2)) / box.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        stage.style.setProperty("--px", Math.max(-1, Math.min(1, x)).toFixed(3));
        stage.style.setProperty("--py", Math.max(-1, Math.min(1, y)).toFixed(3));
      });
    };
    const leave = () => {
      stage?.style.setProperty("--px", "0");
      stage?.style.setProperty("--py", "0");
    };
    const hero = stage?.closest("section");
    if (stage && hero && fine) {
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", leave);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settle);
      hero?.removeEventListener("pointermove", move);
      hero?.removeEventListener("pointerleave", leave);
    };
  }, [pathname]);

  return null;
}
