/**
 * Single source of truth for identity and contact details.
 *
 * Anything still `null` is awaiting a real value. Every component that consumes
 * these fields checks for null and renders nothing rather than a placeholder,
 * so an unanswered field is invisible instead of wrong.
 */

export const site = {
  name: "Tommy De Leon",
  wordmark: "tommy de leon",

  /**
   * Used in the document title and OG card. Describes what he does, not a
   * title he holds: "developer" is the activity CodeLock evidences, and the
   * networks/security half is named as the direction of study.
   */
  role: "Software Developer · Networks & Security",

  /** The true current status, shown on the page. */
  status: "Electronics Engineering student",

  positioning:
    "I build software that works, then document exactly what it has been tested to survive. Electronics Engineering student, training in networks and security.",

  /**
   * Who the site is for, in order. Drives the hero CTAs and the contact fork:
   * hiring managers first, then clients. Both are true today.
   */
  seeking: "Open to junior software and web roles, and to freelance web work.",

  /**
   * Generic software-developer resume, one page, generated 16 September 2026
   * from the approved career record. Deliberately carries no phone number,
   * because this file is public and the site publishes none (see `phone`).
   * Set to null to hide the link everywhere.
   */
  resumeUrl: "/DeLeon_Tommy_Resume.pdf" as string | null,

  url: "https://tommydeleon.com",
  locale: "en_US",

  email: "tommydeleon104@gmail.com",

  /** Deliberately omitted. Tommy does not want a number published. */
  phone: null as string | null,

  /**
   * Portrait. Replaced September 2026, and the note it used to carry is now
   * obsolete rather than merely out of date.
   *
   * The old file was a 294x294 square resampled up to 735 — an enlargement that
   * added no detail, so the layout had to frame it small and deliberately in
   * order not to admit it. This is a real 937x1678 photograph published at its
   * native size: scripts/optimize-images.mjs no longer enlarges a source that is
   * already larger than the box it renders into.
   *
   * Portrait orientation now rather than square, so anything cropping it should
   * crop toward the upper third, where the subject is.
   */
  portrait: {
    src: "/images/tommy.jpg",
    alt: "Tommy De Leon at a harbour railing, a city skyline and water behind him.",
    width: 937,
    height: 1678,
  } as { src: string; alt: string; width: number; height: number } | null,

  /**
   * Freelance work is open. Drives the availability line in the contact fork.
   * Confirmed by the owner in the working tree at revision 470f866; not a
   * response-time promise, and the site makes none.
   */
  availableForWork: true,

  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/tommydeleon/",
      handle: "in/tommydeleon",
    },
    {
      label: "GitHub",
      href: "https://github.com/TommyDeLeon",
      handle: "TommyDeLeon",
    },
  ],
} as const;
