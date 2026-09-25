/**
 * Identity and contact details. One source of truth for every page, the
 * metadata and the social card.
 *
 * Status facts were confirmed by the owner on 25 September 2026. Nothing here
 * is a response-time or availability promise beyond what he stated.
 */

export const site = {
  name: "Tommy De Leon",
  line: "Useful software. Thoughtfully made.",

  /** Used in the document title and social card. */
  role: "Software developer",

  intro:
    "I'm Tommy, a software developer building practical tools for everyday problems, and showing what I've actually checked.",

  description:
    "Tommy De Leon is a software developer building practical tools for everyday problems: a focus lock, a rent-records app and a desktop study assistant, each with what has and hasn't been checked.",

  /** Public résumé. Carries no phone number, by the owner's choice. */
  resumeUrl: "/DeLeon_Tommy_Resume.pdf",

  url: "https://tommydeleon.com",
  locale: "en_US",
  email: "tommydeleon104@gmail.com",

  portrait: {
    src: "/images/tommy",
    alt: "Tommy De Leon at a harbour railing, with a city skyline and water behind him.",
    width: 937,
    height: 1678,
  },

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tommydeleon/" },
    { label: "GitHub", href: "https://github.com/TommyDeLeon" },
  ],
} as const;
