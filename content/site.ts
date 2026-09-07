/**
 * Single source of truth for identity and contact details.
 *
 * Anything still `null` is awaiting a real value. Every component that consumes
 * these fields checks for null and renders nothing rather than a placeholder,
 * so an unanswered field is invisible instead of wrong.
 */

export const site = {
  name: "Tommy De Leon",
  shortName: "Tommy De Leon",
  wordmark: "tommy de leon",

  /** Used in the document title and OG card. Not a job title he does not hold. */
  role: "Networks, Security & Software",

  /** The true current status, shown on the page. */
  status: "Electronics Engineering student",

  positioning:
    "Electronics Engineering student. I build working software while I train toward network and security engineering.",

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

  /** Freelance work is open. Drives the availability line in the contact fork. */
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

  /**
   * Web3Forms access key for the contact form.
   * TODO(tommy): create a free key at https://web3forms.com and paste it here.
   * While null the form refuses to fake a success and points at the email link.
   */
  web3formsKey: null as string | null,
} as const;

export type Site = typeof site;