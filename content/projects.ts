/**
 * The three selected projects. Every claim below was checked against the
 * project's own repository on 25 September 2026 (CodeLock b63d53e, Tenant101
 * d121122, Mimir b3aebc5) or against a recorded run; the evidence ledgers live
 * in each film repository (codelock-film, tenant101-film, mimir-film).
 *
 * A limit sits next to the claim it limits. Keep it that way when editing.
 */

export type Film = {
  /** Web encodes under /films/<slug>/. */
  landscape: string;
  portrait: string;
  poster: string;
  /** WebVTT text description of what happens on screen. */
  descriptions: string;
  seconds: number;
  /** Visible on the poster and in the summary when the footage is staged. */
  note: string;
  /** One-paragraph text alternative, always shown beside the player. */
  summary: string;
  credits: string | null;
};

/**
 * A real product capture. Sources live in assets/work/; `npm run images` writes
 * /images/work/<name>-<width>.{avif,webp,jpg} at `width` and half of it.
 */
export type Shot = {
  src: string;
  alt: string;
  /** Size of the largest published file. */
  width: number;
  height: number;
  /** What it is, and what is demo data. Shown under the image. */
  caption: string;
  /** Used only once its file exists; the build does not require it. */
  optional?: true;
};

export type StoryKey = "problem" | "does" | "part" | "decision" | "limits";
export type StorySection = { key?: StoryKey; heading: string; body: string[] };

export type Project = {
  slug: string;
  name: string;
  /** One sentence. What it is for, in plain words. */
  purpose: string;
  /** Short label above the name, e.g. "Windows focus tool". */
  kind: string;
  /** Who did the work. Team work is never presented as solo. */
  credit: string;
  /** What state it is actually in. */
  status: string;
  /** One-line versions for the home page. Keep team credit and release state. */
  creditShort: string;
  statusShort: string;
  /** Page <title> and meta description for /work/<slug>/. */
  title: string;
  description: string;
  /**
   * The film is shown only when all its files are published (see lib/media.ts);
   * until then the first available shot leads, and no play control appears.
   */
  film?: Film;
  /** Real captures. The first available one leads; the rest form a gallery. */
  shots: Shot[];
  /** Main story: problem, what it does, contribution, one decision, limits. */
  story: StorySection[];
  /** Optional deeper engineering notes, below the main story. */
  notes: StorySection[];
  links: { label: string; href: string }[];
  facts: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "codelock",
    name: "CodeLock",
    kind: "Windows focus tool",
    purpose:
      "A focus timer for Windows that you have to earn your way out of: when time runs out, a coding problem stands between you and your screen.",
    credit: "Solo project. I designed, built and tested it.",
    status: "A personal tool, not released. Only the Windows desktop app enforces the lock.",
    creditShort: "Solo project",
    statusShort: "Personal tool, not released",
    title: "CodeLock: a focus timer you earn your way out of",
    description:
      "A Windows focus tool that unlocks only when you solve a coding problem correctly and fast enough, with a plain record of what it does and does not stop.",
    film: {
      landscape: "/films/codelock/codelock-landscape-720.mp4",
      portrait: "/films/codelock/codelock-portrait-720.mp4",
      poster: "/images/posters/codelock",
      descriptions: "/films/codelock/codelock-descriptions.vtt",
      seconds: 33,
      note: "Recorded on the Windows desktop app against a local test server. The 15-minute wait is cut, typing is sped up, and the pass is held as a still. The narration is a synthetic voice.",
      summary:
        "A 15-minute focus block starts from the dashboard. When the timer reaches zero, the desktop app takes over the whole screen with a programming problem, Two Sum. The first attempt is typed and submitted; it fails three of five tests, so the lock stays. The fix passes every test within the 162 ms speed budget, and the screen is released.",
      credits: "Music: “Envision” by Kevin MacLeod (incompetech.com), CC BY 4.0. Click: Kenney, CC0.",
    },
    shots: [
      {
        src: "/images/work/codelock-lock",
        alt: "CodeLock's desktop lock screen: a programming problem on the left and a code editor on the right.",
        width: 1440,
        height: 900,
        caption: "The desktop lock screen, captured from the running app.",
      },
      {
        src: "/images/work/codelock-demo-verdict",
        alt: "The CodeLock browser demo showing a correct answer marked too slow: 259 ms against a 48 ms budget.",
        width: 1440,
        height: 900,
        caption: "The browser demo: a correct but slow answer keeps the lock on.",
      },
      {
        src: "/images/work/codelock-dashboard",
        alt: "The CodeLock dashboard with focus block lengths, a run log of past sessions and personal bests.",
        width: 1440,
        height: 900,
        caption: "The dashboard, where a focus block starts.",
      },
    ],
    story: [
      {
        key: "problem",
        heading: "The problem",
        body: [
          "Every focus app I tried had a dismiss button, and the person it was meant to stop could always reach it. A timer that politely asks you to stop relies on willpower, the exact thing you were short of.",
        ],
      },
      {
        key: "does",
        heading: "What it does",
        body: [
          "When the timer ends, the desktop app takes the screen and serves a programming problem, picked at that moment so there is nothing to prepare. Every test must pass, and the answer must run inside a time budget set for its language. A correct but slow answer keeps you locked and tells you how far off you were.",
        ],
      },
      {
        key: "part",
        heading: "My part",
        body: [
          "All of it: the server that keeps timers and decides unlocks, the sandbox that runs submitted code in throwaway containers with no network, the lock screen, and the Windows desktop app that holds the machine.",
        ],
      },
      {
        key: "decision",
        heading: "One decision",
        body: [
          "The first version let the app decide it was unlocked, so anything that could talk to the app could fake a pass. I moved the decision. Now only the server can issue an unlock, as a short signed note for that specific session, and the desktop app checks the signature in a process the lock screen cannot reach. Against a live lock on 30 August 2026, a forged note and an empty one were both rejected.",
        ],
      },
      {
        key: "limits",
        heading: "What works today, and its limits",
        body: [
          "It runs on one Windows machine, with no accounts and no analytics, so there are no usage figures. The API has 420 automated tests and the desktop shell 46.",
          "It is a commitment device, not a security product. Killing the process, Ctrl+Alt+Del or a power-off all get you out, and the README says so. Most other escape routes are handled in code and unit-tested, but have not been watched on real hardware. The browser demo shows the challenge; it cannot lock anything.",
        ],
      },
    ],
    notes: [
      {
        heading: "Making “fast enough” fair",
        body: [
          "Languages start up at different speeds, so each problem carries a budget per language rather than one number. The limit is the known good time plus 35 percent, with a fixed 40 milliseconds on top, and you get the better of two runs. The fixed margin keeps a very quick problem measuring your code rather than timing noise.",
          "Correctness and speed are checked separately, so a wrong answer is never told it was merely slow.",
        ],
      },
      {
        heading: "The double-click bug",
        body: [
          "Ending a session used to read the state, check it, then write. Two requests arriving together both passed the check: a double-click could spend two skips, or push a paused deadline forward twice. Each ending path is now a single database write that names the state it expects, so the database decides who wins.",
        ],
      },
    ],
    links: [
      { label: "Try the browser demo", href: "https://codelock.tommydeleon.com" },
      { label: "Read the source on GitHub", href: "https://github.com/TommyDeLeon/codelock" },
    ],
    facts: [
      { label: "Built", value: "August–September 2026" },
      { label: "Platform", value: "Windows desktop (Electron), with a browser demo" },
      { label: "Stack", value: "TypeScript, Node, Express, Postgres, Docker, Next.js" },
    ],
  },
  {
    slug: "tenant101",
    name: "Tenant101",
    kind: "Rent records web app",
    purpose:
      "Rent records for landlords and tenants in the Philippines that show, on a phone, who has paid and what's still owed.",
    credit:
      "Team project. I built most of the application, guided by my mentor, who owns the product.",
    status: "In development. Not yet launched; shown here with demo data only.",
    creditShort: "Team project: I built most of it; my mentor owns the product",
    statusShort: "In development, demo data only",
    title: "Tenant101: rent that records itself",
    description:
      "A property and tenant management app where a tenant pays rent from their phone with GCash, Maya or a card, and the balance updates on its own once PayMongo confirms the payment.",
    film: {
      landscape: "/films/tenant101/tenant101-landscape-720.mp4",
      portrait: "/films/tenant101/tenant101-portrait-720.mp4",
      poster: "/images/posters/tenant101",
      descriptions: "/films/tenant101/tenant101-descriptions.vtt",
      seconds: 33,
      note: "Demo data. Recorded on a local test copy against PayMongo's test mode, so no real money moved. Green rings mark real taps; typing is sped up. The narration is a synthetic voice.",
      summary:
        "On a phone, a tenant sees ₱81,675 owed on a unit, taps Pay and picks GCash. They finish on PayMongo's checkout and its GCash test page, then return to the app, where the unit already reads Paid up, ₱0.00. PayMongo's signed notice recorded the payment; nobody approved it by hand.",
      credits: "Music: “Inspired” by Kevin MacLeod (incompetech.com), CC BY 4.0. Click: Kenney, CC0.",
    },
    // Real phone screens from the owner's local test copy. Until these files are
    // added, the page shows a labelled illustration of the payment flow instead.
    shots: [
      {
        src: "/images/work/tenant101-home",
        alt: "Tenant101 on a phone: a tenant's home screen with each rental's balance and a Pay this rental button.",
        width: 720,
        height: 1560,
        caption: "Tenant's home screen. Demo data on a local test copy.",
        optional: true,
      },
      {
        src: "/images/work/tenant101-overview",
        alt: "Tenant101 on a phone: the landlord's overview with collected, outstanding and overdue totals.",
        width: 720,
        height: 1560,
        caption: "Landlord's overview. Demo data on a local test copy.",
        optional: true,
      },
      {
        src: "/images/work/tenant101-support",
        alt: "Tenant101 on a phone: a support thread about a GCash payment not showing on the tenant's balance.",
        width: 720,
        height: 1560,
        caption: "A support thread. Demo data on a local test copy.",
        optional: true,
      },
    ],
    story: [
      {
        key: "problem",
        heading: "The problem",
        body: [
          "Small landlords often track rent in notebooks and chat threads. A tenant sends money by GCash, a screenshot gets lost, and nobody is sure what is still owed.",
        ],
      },
      {
        key: "does",
        heading: "What it does",
        body: [
          "Tenants see each rental's balance and what is due next, on the phone they already use. They pay with GCash, Maya or a card through PayMongo, on the landlord's own PayMongo account, and the balance updates by itself once PayMongo confirms the payment. There is no receipt to upload and nothing for the landlord to approve. Cash and other transfers can still be reported, and those wait for the landlord's review.",
          "Around that sit properties, leases, monthly charges, late fees, deposits, receipts, repairs and reports.",
        ],
      },
      {
        key: "part",
        heading: "My part",
        body: [
          "This is a team project owned by my mentor, who guides the product and has contributed code. I wrote most of the application, including the PayMongo card and e-wallet payments, the payment review flow, the balance calculations and the tenant's pay screen shown in the film.",
        ],
      },
      {
        key: "decision",
        heading: "One decision",
        body: [
          "Returning from the checkout proves nothing, so the app never trusts it. A payment is recorded only when PayMongo's signed notice arrives and checks out, so a tenant who closes the tab is still credited and a forged return is not. A tenant's own report is only a claim until the landlord approves it. Balances are always worked out from recorded payments rather than a stored total that could drift, and amounts are kept in whole centavos, never floating-point pesos.",
        ],
      },
      {
        key: "limits",
        heading: "What works today, and its limits",
        body: [
          "The flow in the film runs end to end on a local copy with invented people and amounts. It is not launched: online card and e-wallet payments are verified only in the payment provider's test mode, and the privacy notice and terms still need legal review before real tenants can use it.",
        ],
      },
    ],
    notes: [],
    links: [],
    facts: [
      { label: "Built", value: "February–September 2026" },
      { label: "Platform", value: "Web app, designed for phones first" },
      { label: "Stack", value: "TypeScript, Next.js, React, Postgres, Prisma" },
    ],
  },
  {
    slug: "mimir",
    name: "Mimir",
    kind: "Desktop assistant and tutor",
    purpose:
      "A personal desktop assistant for Windows that explains what you're working on, right beside it.",
    credit: "Solo project. I designed, built and tested it.",
    status: "In development for my own use. Several parts are not yet tested on real hardware.",
    creditShort: "Solo project",
    statusShort: "In development, for my own use",
    title: "Mimir: a little help, right beside the work",
    description:
      "A private Windows assistant and tutor that answers from sources it actually read, keeps private material on the laptop, and says so when it can't find support.",
    shots: [
      {
        src: "/images/work/mimir-beside-notebook",
        alt: "Mimir's window open beside a practice notebook, with one line of Python selected.",
        width: 1440,
        height: 810,
        caption: "A real screenshot of Mimir on my laptop, beside a synthetic practice page. A film is still to come.",
      },
    ],
    story: [
      {
        key: "problem",
        heading: "The problem",
        body: [
          "When I'm stuck on something, the help is usually somewhere else: another window, another tab, a search that loses the context I was in.",
        ],
      },
      {
        key: "does",
        heading: "What it does",
        body: [
          "Mimir sits in the tray and opens beside the work. You ask in plain words and it answers briefly, with citations from sources it actually read. When it can't find support, it says so instead of guessing. As a tutor it gives hints and checks attempts rather than handing over answers.",
        ],
      },
      {
        key: "part",
        heading: "My part",
        body: [
          "All of it: the desktop app, the backend that plans and checks each answer, the privacy rules, and the tests.",
        ],
      },
      {
        key: "decision",
        heading: "One decision",
        body: [
          "Private material never leaves the laptop. Anything from your files, your code, your screen or your computer's audio is answered by a small model running locally. Only general public questions may go to a hosted model. The check that decides is deliberately cautious: a single sign of private content is enough to keep a question local.",
        ],
      },
      {
        key: "limits",
        heading: "What works today, and its limits",
        body: [
          "The backend has 234 passing tests, and hosted answers were checked live on 26 September 2026. Voice questions and the screen companion run on my laptop but aren't reliable yet, and computer-audio listening is untested. It isn't fully offline, answers can still be wrong, and it isn't available to download.",
        ],
      },
    ],
    notes: [],
    links: [],
    facts: [
      { label: "Built", value: "September 2026" },
      { label: "Platform", value: "Windows desktop (Tauri)" },
      { label: "Stack", value: "Python, Rust, TypeScript, React" },
    ],
  },
];

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
