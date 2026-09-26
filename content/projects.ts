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
      "A Windows focus timer you earn your way out of: when time is up, solve a coding problem to unlock your screen.",
    credit: "Solo project. I built all of it: the server, the code sandbox, the lock screen and the Windows app.",
    status: "A personal tool, not released. Only the Windows desktop app enforces the lock.",
    creditShort: "Solo project",
    statusShort: "Not released",
    title: "CodeLock: a focus timer you earn your way out of",
    description:
      "A Windows focus tool that unlocks only when you solve a coding problem correctly and fast enough, with a plain record of what it does and does not stop.",
    film: {
      landscape: "/films/codelock/codelock-landscape-720.mp4",
      portrait: "/films/codelock/codelock-portrait-720.mp4",
      poster: "/images/posters/codelock",
      descriptions: "/films/codelock/codelock-descriptions.vtt",
      seconds: 34,
      note: "The real desktop app, on a local test server. The wait is cut, typing is sped up, and the voice is synthetic.",
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
          "Every focus app I tried had a dismiss button, and the person it was meant to stop could always reach it.",
        ],
      },
      {
        key: "does",
        heading: "What it does",
        body: [
          "When the timer ends, the desktop app takes the screen and serves a coding problem. Every test must pass, within a time budget for its language. A correct but slow answer keeps you locked.",
        ],
      },
      {
        key: "decision",
        heading: "One decision",
        body: [
          "At first the app decided its own unlock, so anything that could talk to it could fake a pass. Now only the server can unlock, with a signed note for that one session, checked where the lock screen can't reach. Against a live lock, a forged note and an empty one were both rejected.",
        ],
      },
      {
        key: "limits",
        heading: "What works today, and its limits",
        body: [
          "It runs on one Windows machine, with 420 API tests and 46 for the desktop shell. It is a commitment device, not security: ending the process, Ctrl+Alt+Del or a power-off still get you out. The browser demo shows the challenge but can't lock anything.",
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
      "Rent records for landlords and tenants in the Philippines. Tenants pay by GCash, Maya or card, and the balance updates itself.",
    credit:
      "Team project. I built most of it, including the PayMongo payments, payment review and balance calculations. My mentor owns the product.",
    status: "In development, not launched. Shown with demo data only.",
    creditShort: "Team project, built mostly by me",
    statusShort: "Not launched",
    title: "Tenant101: rent that records itself",
    description:
      "A property and tenant management app where a tenant pays rent from their phone with GCash, Maya or a card, and the balance updates on its own once PayMongo confirms the payment.",
    film: {
      landscape: "/films/tenant101/tenant101-landscape-720.mp4",
      portrait: "/films/tenant101/tenant101-portrait-720.mp4",
      poster: "/images/posters/tenant101",
      descriptions: "/films/tenant101/tenant101-descriptions.vtt",
      seconds: 38,
      note: "Demo data in PayMongo's test mode, so no real money moved. Typing is sped up, and the voice is synthetic.",
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
          "Small landlords track rent in notebooks and chat threads. A GCash screenshot gets lost, and nobody is sure what is still owed.",
        ],
      },
      {
        key: "does",
        heading: "What it does",
        body: [
          "Tenants see what they owe and pay by GCash, Maya or card through the landlord's own PayMongo account. The balance updates once PayMongo confirms: no receipt to upload, nothing to approve. Cash is reported and reviewed by the landlord.",
        ],
      },
      {
        key: "decision",
        heading: "One decision",
        body: [
          "Coming back from checkout proves nothing, so the app ignores it. A payment is recorded only when PayMongo's signed notice checks out: a tenant who closes the tab is still credited, and a forged return is not. Balances are always worked out from recorded payments, in whole centavos.",
        ],
      },
      {
        key: "limits",
        heading: "What works today, and its limits",
        body: [
          "The film's flow runs end to end on a local copy with invented data. It isn't launched: online payments are verified only in PayMongo's test mode, and the terms still need legal review.",
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
      "A private Windows assistant that explains what you're working on, right beside it.",
    credit: "Solo project. I built the desktop app, the backend, the privacy rules and the tests.",
    status: "In development for my own use. Several parts are not yet tested on real hardware.",
    creditShort: "Solo project",
    statusShort: "In development",
    title: "Mimir: a little help, right beside the work",
    description:
      "A private Windows assistant and tutor that answers from sources it actually read, keeps private material on the laptop, and says so when it can't find support.",
    shots: [
      {
        src: "/images/work/mimir-beside-notebook",
        alt: "Mimir's window open beside a practice notebook, with one line of Python selected.",
        width: 1440,
        height: 810,
        caption: "A real screenshot, beside a synthetic practice page.",
      },
    ],
    story: [
      {
        key: "problem",
        heading: "The problem",
        body: [
          "When I'm stuck, help is usually in another window, and searching for it loses the context I was in.",
        ],
      },
      {
        key: "does",
        heading: "What it does",
        body: [
          "Mimir opens beside the work and answers briefly, citing sources it actually read. When it can't find support, it says so. As a tutor, it gives hints instead of answers.",
        ],
      },
      {
        key: "decision",
        heading: "One decision",
        body: [
          "Private material never leaves the laptop. Files, code, screen and audio are answered by a small local model; only general public questions may go to a hosted one. One sign of private content is enough to keep a question local.",
        ],
      },
      {
        key: "limits",
        heading: "What works today, and its limits",
        body: [
          "234 backend tests pass, and hosted answers were checked live on 26 September 2026. Voice and the screen companion aren't reliable yet, answers can still be wrong, and it isn't available to download.",
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
