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

  /**
   * Pinning needs vertical room, not just width. A phone held sideways is
   * wider than 768px but only ~390px tall, and there the pinned section opens
   * on a near-empty screen while the rest of the claim waits below the fold.
   * Height is the real condition, so it is part of the query.
   */
  canPin: "(min-width: 768px) and (min-height: 640px)",

  /**
   * The exact complement of canPin: too narrow OR too short. Comma is OR in a
   * media query. These viewports still get the choreography, just driven by
   * scroll position instead of a pin, so the section is never merely static.
   */
  cannotPin:
    "(max-width: 767.98px) and (prefers-reduced-motion: no-preference), (max-height: 639.98px) and (prefers-reduced-motion: no-preference)",
} as const;
