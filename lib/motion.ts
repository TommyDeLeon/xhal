/**
 * Shared motion constants. Two eases for the whole site so every section feels
 * like it was choreographed by the same hand.
 */

/** Entrances. Matches --ease-out-expo in globals.css. */
export const EASE_OUT = "power3.out";

/** Anything scrub-linked. Eased scrubbing reads as input lag. */
export const EASE_SCRUB = "none";

/*
  Durations sit in the 600-1400ms band on purpose.

  The previous set was crisp -- 500/800/1200 with a 60ms stagger -- and crisp is
  the wrong register here. A cinematic reveal should feel like something being
  placed, which means the eye has time to follow it. These are slower without
  being slow enough to make the page feel unresponsive: past roughly 1.5s an
  entrance stops reading as deliberate and starts reading as a wait.
*/
export const DUR = {
  micro: 0.6,
  enter: 0.95,
  hero: 1.4,
} as const;

/* Wider, so lines and rows arrive one after another rather than nearly
   together. At 60ms a four-item stagger resolves in under a quarter second,
   which the eye reads as simultaneous. */
export const STAGGER = 0.09;

/*
  Scrub values, in seconds of catch-up.

  Higher is heavier. This is the difference between a scroll-linked animation
  that tracks the wheel exactly -- which reads as mechanical -- and one that
  trails it slightly, which reads as mass. Held under 1s: past that the lag
  stops feeling like weight and starts feeling like the page is behind you.
*/
export const SCRUB = {
  /** Anything pinned, or otherwise holding the viewport. */
  held: 0.8,
  /** Depth and parallax passes, the furthest planes. */
  drift: 1,
  /** Small local moves that still need to feel attached to the scroll. */
  close: 0.5,
} as const;

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
