export type Project = {
  /** Stable id, also used as the anchor target. */
  slug: string;
  name: string;
  /** Sits under the title. One line, no marketing verbs. */
  summary: string;
  /** Short paragraphs. Why it exists and what it does. Keep to two or three. */
  body: string[];
  /**
   * Deeper engineering detail, collapsed by default. Keeps the card readable
   * without throwing away the part that shows how the thing actually works.
   */
  details: { summary: string; body: string[] } | null;
  /** Short mono strings. The stack, not every package. */
  stack: string[];
  /** The engineering point this project proves. */
  angle: string;
  repoUrl: string | null;
  /** Renders a "Live Demo" button only when set. */
  liveUrl: string | null;
  /** Small square brand mark shown beside the title. */
  mark: { src: string; alt: string } | null;
  /**
   * Real screenshots of the project running. The first is shown large and the
   * rest in a grid beneath it. An empty array renders no media panel at all,
   * rather than a mocked-up fake of the interface.
   */
  media: {
    /** Dark-theme capture. The light variant is the same name plus -light. */
    src: string;
    alt: string;
    /** Shown under the image. Carries the meaning when the text is too small. */
    caption: string;
    width: number;
    height: number;
  }[];
  year: string;
};

/**
 * Adding a project is one object in this array. No layout changes needed.
 */
export const projects: Project[] = [
  {
    slug: "codelock",
    name: "CodeLock",
    summary:
      "A device lock that only opens when you solve a programming problem correctly and fast enough.",
    body: [
      "I built this for myself. Staying focused is the thing I am worst at, and I lose hours to whatever is one tab away without ever deciding to. Blockers and timers never worked on me because I could always dismiss them, so I wanted the cost of unlocking to be doing the thing I was avoiding in the first place. When the timer runs out the device locks, and the way back in is a programming problem.",
      "It stopped being only for me fairly quickly. Almost everyone I know loses the same hours to the same things, and reels and games are not accidentally hard to put down, they are built by people whose job is making them hard to put down. Competing with that on willpower is a losing position. So CodeLock is free and stays free, and the parts that would normally cost money to run, the judge and the problem set, are in the repository so anyone can host their own rather than depend on mine.",
      "The problem is chosen at the moment the lock fires rather than when the timer is armed, so it cannot be fetched and pre-solved in advance. Passing the tests is not enough on its own either: the submission also has to land inside a runtime budget, so a correct but quadratic answer still leaves you locked and tells you how far off the pace it was.",
    ],
    details: {
      summary: "How the speed gate and the lock actually work",
      body: [
        "Making the speed rule fair turned out to be most of the work. Runtime budgets are stored per language, because a JVM cold start burns around 100ms before any user code runs while the equivalent C++ finishes in single digits, and one global number would make the gate unreachable in one language and free in another.",
        "Grading takes the fastest of several runs, since the judge measures wall-clock time on shared hardware that swings by tens of milliseconds and a single unlucky sample should not lock someone out of their own machine. A fixed millisecond floor sits underneath the percentage tolerance, because a 35% band around an 8ms target is narrower than the judge's own jitter.",
        "The lock itself is server-authoritative, which is the part I learned the most from. Clients never decide they are unlocked. The API signs a token bound to one user and session, issued only after a sandboxed judge reports a pass and the speed gate clears, and the desktop shell verifies that signature in a process the interface cannot reach. A patched web app, an injected script, or the console calling unlock with an empty string all stay locked.",
      ],
    },
    stack: [
      "TypeScript",
      "Node 24",
      "Express",
      "Prisma",
      "Postgres",
      "Next.js 16",
      "React 19",
      "Electron",
      "Expo",
      "Docker",
    ],
    angle:
      "Checks that run on the client are suggestions. The trust boundary belongs at the API, and the limits of the lock are written down honestly rather than overstated.",
    repoUrl: "https://github.com/TommyDeLeon/codelock",
    liveUrl: "https://codelock.tommydeleon.com",
    mark: { src: "/images/codelock-mark.png", alt: "" },
    media: [
      {
        src: "/images/codelock-verdict.jpg",
        alt: "A CodeLock judge result reading Correct, but too slow. All three test cases pass with green ticks, but the measured runtime overshoots the 189 millisecond budget, and the verdict explains the lock stays on because the answer is roughly three times slower than the best known solution.",
        caption:
          "Every test passes and the machine stays locked. The submission came in over the 189ms budget, about 3x off the best known solution.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-demo.jpg",
        alt: "The CodeLock demo screen. A Pair Sum problem statement with sample cases sits beside a code editor holding a deliberately quadratic JavaScript solution, above a Run against the judge button.",
        caption:
          "The demo hands you a problem that is winnable the wrong way: the obvious nested loop is correct and will not clear the gate.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-limits.jpg",
        alt: "A table of attempts to escape the desktop lock. Killing the process, switching virtual desktop, and calling the unlock channel from DevTools are marked as holding; deleting the lock file, rebooting, and Ctrl+Alt+Del are marked as defeating it.",
        caption:
          "What the lock survives and what beats it, written down rather than glossed over. Ctrl+Alt+Del wins, and the docs say so.",
        width: 1600,
        height: 1000,
      },
    ],
    year: "2026",
  },
];