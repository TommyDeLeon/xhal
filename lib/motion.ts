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
   * Width-only gate for the pinned thesis section. Deliberately NOT combined
   * with a min-height media feature: gsap.matchMedia listens live, and on
   * mobile Safari window.innerHeight changes as the address bar collapses and
   * expands mid-scroll. A live height query crosses its threshold while the
   * user is scrolling through the very section it gates, tearing down and
   * rebuilding the pinned ScrollTrigger under their thumb, which is the
   * section jumping back and forth. Width is stable across toolbar show/hide,
   * so it is the only feature allowed to react live here. The vertical-room
   * check still happens, just as a one-time read inside the handler (see
   * motion-layer.tsx) so it only re-evaluates on a real orientation change,
   * not a toolbar twitch.
   */
  wide: "(min-width: 768px)",
} as const;
