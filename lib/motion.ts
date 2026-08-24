/**
 * Shared motion constants. Two eases for the whole site so every section feels
 * like it was choreographed by the same hand.
 */

/** Entrances. Matches --ease-out-expo in globals.css. */
export const EASE_OUT = "power3.out";

/** Anything scrub-linked. Eased scrubbing reads as input lag. */
export const EASE_SCRUB = "none";

export const DUR = {
  micro: 0.5,
  enter: 0.8,
  hero: 1.2,
} as const;

export const STAGGER = 0.06;

/** Breakpoints for gsap.matchMedia(). Mobile deliberately gets no pinning. */
export const MQ = {
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 768px) and (max-width: 1023.98px)",
  mobile: "(max-width: 767.98px)",
  motionOK: "(prefers-reduced-motion: no-preference)",
} as const;
