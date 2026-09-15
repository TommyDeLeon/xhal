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
  /**
   * Long-form write-up. Renders a dedicated route at /work/<slug>/ and a link
   * from the project card; null means the project has no case study yet and
   * nothing extra is rendered anywhere.
   *
   * The section order is the argument: the problem, how the problems were
   * actually found, the goals and the constraints, three decisions in the order
   * they were forced, the evidence, and the limits and the lesson last.
   * Sections are separate fields rather than one prose blob so the page can pace them
   * independently -- that ordering IS part of the content model, and flattening
   * it to markdown would move layout decisions back into copy.
   */
  caseStudy: CaseStudy | null;
};

export type CaseStudySection = {
  /**
   * Two or three words naming this section's job in the argument -- "The
   * problem", "Decision 2 - the speed gate", "Results and evidence".
   *
   * The headings on this page are sentences, which reads well and skims badly:
   * someone deciding whether to spend ten minutes here scans the left column
   * and gets narrative colour rather than a map. The kicker is the map. It
   * carries no information the heading does not, so it is decoration for a
   * reader and structure for a skimmer, and a section without one renders
   * exactly as it did before.
   */
  kicker?: string;
  /** Short. Used as the section heading and as its in-page anchor. */
  heading: string;
  /**
   * Verified figures belonging to this section, pulled out of the prose and
   * set large above it.
   *
   * `note` is not optional, and that is the whole point of the shape. A number
   * on a portfolio page is worthless without its denominator and its source --
   * "3 of 12" means nothing until you know twelve of what, established how.
   * Requiring the note makes an unsourced callout impossible to add without
   * noticing that you cannot source it.
   */
  results?: { value: string; label: string; note: string }[];
  /** Runs under the heading at display scale. One sentence, no wind-up. */
  standfirst: string;
  body: string[];
  /**
   * `media.src` of the capture that belongs under this section, if any.
   *
   * Named rather than positional. The page used to deal the remaining captures
   * out by index — section 0 got media[1], section 1 got media[2] — and called
   * it "beside the prose it illustrates". It was not: the limits table landed
   * under a section about attention being engineered, the lock screen under one
   * about runtime budgets, and the escape-matrix section, which the limits
   * table is *of*, got no image at all because the indexes had run out.
   *
   * Index pairing also breaks silently. Adding a section or reordering media
   * re-shuffles every pairing after it, with nothing to fail — the page still
   * renders, just with the wrong picture under the wrong argument.
   */
  shot?: string;
};

export type CaseStudy = {
  /** Page <title>. Distinct from the project name so the tab says something. */
  title: string;
  /** Meta and OG description. One sentence, factual, no marketing verbs. */
  description: string;
  /** The opening claim, set at display scale on the title card. */
  premise: string;
  /** Under the premise. Two or three sentences of context. */
  intro: string[];
  /**
   * Fixed facts: role, timeline, platforms, stack. Label/value pairs rather
   * than prose, because this block is scanned rather than read -- someone
   * deciding whether to spend ten minutes here needs the shape of the project
   * before the argument starts.
   */
  overview: { label: string; value: string }[];
  sections: CaseStudySection[];
};

/**
 * Adding a project is one object in this array. No layout changes needed.
 */
export const projects: Project[] = [
  /*
    Written for a reader with no technical background. The homepage card is
    three short paragraphs -- the problem, what was built, what has been
    verified -- and the case study keeps the same plain register. Every date,
    count and limit below was checked against the CodeLock repository on
    16 September 2026; see TEAM-HANDOFF.md for the evidence table.
  */
  {
    slug: "codelock",
    name: "CodeLock",
    summary: "A focus lock for Windows. When your timer runs out, the screen locks, and the way back in is solving a coding problem — correctly, and fast.",
    body: [
      "Every focus app has a dismiss button, and the person it is blocking can always reach it. CodeLock takes the button away. When the timer ends, the screen locks and hands you a programming problem chosen at that moment, so there is nothing to prepare in advance. It is a commitment device, not a prison: the write-up lists the ways around it.",
      "I built every part of it myself: the service that keeps the timers and decides when you have earned your way out, the sandbox that runs your code safely, the lock screen, and the desktop app that actually holds the machine. Being right is not enough. Your answer also has to be fast, and a slow one keeps you locked and tells you how far off you were.",
      "What is proven so far: 695 problems, each checked in six languages before it can be used; a faked unlock rejected against a live lock; and a public list of twelve ways to escape the lock, including the three that work. It is a personal tool, not a product yet, and the write-up keeps every limit next to the claim.",
    ],
    details: {
      summary: "How the speed rule and the lock work",
      body: [
        "Making “fast enough” fair was most of the work. Every language starts up at a different speed, so each problem carries a time budget per language rather than one number for all. You get the better of two runs, and a small margin is added on top so a noisy measurement cannot lock you out unfairly.",
        "The app is never allowed to decide it is unlocked. Only the server can say so, by signing a short note after your code passes and the speed check clears, and the desktop app checks that signature in a place the screen cannot touch. While writing this up I found a hole: a genuine note from one problem could open a different lock for five minutes. I closed it on 2 September 2026. That kind of bug only shows up by reading the code, not by using the app.",
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
    angle: "Checks that run on the user's own screen are suggestions. The real decision belongs on the server — and what the lock has actually survived is written down, route by route, including the rows that prove nothing.",
    repoUrl: "https://github.com/TommyDeLeon/codelock",
    liveUrl: "https://codelock.tommydeleon.com",
    mark: {
      src: "/images/codelock-mark.png",
      alt: "",
    },
    media: [
      {
        src: "/images/codelock-app-lock.jpg",
        alt: "The CodeLock lock screen filling the display. A header reads Locked, pass every test case to get back in, with Skip, Run and Submit buttons. The problem is Stack LIFO Basics, marked easy and noted as taking most people about six minutes, with the specification and sample cases beside an editor holding an empty Stack class. Below the editor, Console and Test results tabs offer a Run button described as running your code without using an attempt.",
        caption: "The real thing, not the demo. The timer ran out, and this is the whole screen until the problem is solved. Run lets you test a guess without losing an attempt.",
        width: 1600,
        height: 670,
      },
      {
        src: "/images/codelock-verdict.jpg",
        alt: "A CodeLock judge result reading Correct, but too slow. All three test cases pass, but the measured runtime is 249 milliseconds against a 47 millisecond budget, and the verdict explains the lock stays on because the answer is roughly 50.8 times slower than the reference solution.",
        caption: "The moment the speed rule exists for: every test passes, but 249 ms against a 47 ms budget keeps the machine shut. Captured in the browser demo, which measures on your own machine, so the gap reads larger than the installed app would show.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-app-dashboard.jpg",
        alt: "The CodeLock desktop app's dashboard. A session panel offers 15, 30, 60 and 90 minute blocks with 60 selected, above counters reading five problems solved at three per cent of submissions accepted, five locks cleared, and a median unlock of 33 minutes. A sidebar shows the tier at Easy, a streak of nought of three fast solves needed to reach Medium, a ratio of 1.00x off the best known answer across six solves with six records held, and a list of personal bests in Python. A run log lists sessions marked solved, bypassed or abandoned.",
        caption: "Where a focus block starts. The counters are from my own machine during development, not from users. Bypassed and abandoned sessions stay in the log next to the solved ones.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-limits.jpg",
        alt: "The desktop section of CodeLock's own limits page, headed Electron kiosk shell. Closing the window, minimising, the second monitor and sleeping the machine are marked prior tests. Switching virtual desktop and rebooting are marked untested. Killing the process, deleting the lock file and Ctrl+Alt+Del are marked defeated. Reopening after a kill and calling the unlock channel from DevTools are marked holds. Holding Escape for ten seconds is marked by design.",
        caption: "The escape list the product publishes about itself: twelve ways out of the desktop lock, with what actually happened for each. Three beat it. Two held. The rest say plainly what has and has not been tried.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-demo.jpg",
        alt: "The CodeLock demo screen. A Pair Sum problem statement with sample cases sits beside a code editor holding a deliberately quadratic JavaScript solution, above a Run against the judge button.",
        caption: "Try it in the browser with nothing to install. The problem is winnable the wrong way: the obvious answer is correct, but too slow.",
        width: 1600,
        height: 1000,
      },
    ],
    year: "2026",
    caseStudy: {
      title: "CodeLock: a focus lock you have to earn your way out of",
      description: "A Windows focus tool that only unlocks when you solve a coding problem correctly and fast — and a plain record of what it has and has not survived.",
      premise: "A focus timer you have to earn your way out of.",
      intro: [
        "When the timer runs out, CodeLock takes over your screen. To get back in, you solve a programming problem: every test must pass, and it has to run fast. The problem is picked the moment the lock fires, so there is nothing to prepare in advance.",
        "I built it alone, for myself, and for anyone else who wants to learn programming by having no other way out. The source is public to read. It runs on one machine, with no accounts and no analytics or outside tracking, and it has not been released yet, so there are no usage figures to show. The story here is what happened when I tried to break my own lock, twelve different ways.",
      ],
      overview: [
        {
          label: "Role",
          value: "Everything: the server, the code sandbox, the desktop app, the web app and the phone app.",
        },
        {
          label: "Timeline",
          value: "264 commits, 21 August to 15 September 2026, from the repository's own history. This write-up covers the lock and the speed rule; newer features are not covered.",
        },
        {
          label: "Status",
          value: "A personal tool. No release, no analytics, nothing sent anywhere. Every number here is a test result, not a usage figure.",
        },
        {
          label: "What actually locks",
          value: "The Windows desktop app, and nothing else. A browser tab can always be closed, iPhone does not allow it, and the Android version has not been built or run on a phone.",
        },
        {
          label: "Stack",
          value: "TypeScript throughout, so the part that signs an unlock and the part that checks it share one definition. Express, Prisma and Postgres for the server. Docker for the sandbox.",
        },
      ],
      sections: [
        {
          kicker: "The problem",
          shot: "/images/codelock-app-dashboard.jpg",
          heading: "Every blocker I tried had an off switch",
          standfirst: "A tool you can wave away is a suggestion, not a lock.",
          body: [
            "Every focus tool I tried had the same hole: the button that turned it off was right there, for the very person it was meant to stop.",
            "The apps distracting you are built by full-time teams whose job is to keep you there. A timer that politely asks you to stop relies on willpower, the exact thing you were short of.",
            "So getting back in had to cost real work. When the timer ends, the machine locks, and the way out is a programming problem. That one rule shaped everything else, because the moment a lock has value, the person it locks becomes the one trying to break it. Building it for myself meant I knew exactly where that person would attack.",
          ],
        },
        {
          kicker: "How the problems were found",
          heading: "By re-reading the code, not by using the app",
          standfirst: "Nothing was reported, because nothing collects reports. So here is exactly what did the finding.",
          body: [
            "There are no analytics, nothing is sent anywhere, and I am the only known user, so the bugs on this page were not reported. Three things found them.",
            "Writing it down. Explaining how the unlock works, in plain sentences, is what exposed the replay flaw below. Using the app would never have shown it, because the bypass looks exactly like an honest unlock.",
            "A measurement coming back wrong. A database change dated 29 August 2026 records that two languages failed inside a 256 MB sandbox and passed at 500 MB, so the limit was raised to 512 MB. Not a hunch: two failures, one number, one recorded fix.",
            "Watching the machine afterwards. Two sandboxes were still running twenty-four minutes after their job had finished. They are now named at launch so they can be found and stopped.",
            "What is missing from that list is obvious: someone else using it, and hitting what I never thought to look for.",
          ],
        },
        {
          kicker: "Goals and constraints",
          shot: "/images/codelock-demo.jpg",
          heading: "Three things it had to do, and what the platforms would not allow",
          standfirst: "Most of the boundaries were not mine to choose.",
          body: [
            "Three goals. Getting back in had to be earned, not dismissed. The speed rule had to be fair in every supported language. And nothing on screen could ever be allowed to decide that the machine was unlocked.",
            "It also had to cost nothing to run. Grading happens in a sandbox bundled with the project instead of a paid service, and the server refuses to send code anywhere but that local sandbox, so a stale setting cannot quietly cost money. It has no login at all, which is a deliberate choice for a single-machine tool and the reason it is documented as belonging off the public internet.",
            "The platforms set the hardest limits. A browser tab can always be closed, so the web app is the demo and the lock screen, never the lock. iPhone only lets an app hold the device with a permission this project does not have, so it says so instead of pretending. The Android version is written but has never been built or run on a phone. Saying that plainly costs less than having someone discover it.",
          ],
        },
        {
          kicker: "Decision 1 — who decides",
          heading: "The first version let the app decide it was unlocked",
          standfirst: "Version one asked the screen a question only the server should answer.",
          body: [
            "In the first version the app ran the tests, decided the answer was good enough, and unlocked itself. It failed simply: anything that could talk to the app could fake a pass.",
            "The cheap fix would have been to make the app harder to talk to. That slows down a bored attacker and does nothing against a determined one, and the attacker here is the owner of the machine on a bad evening. So the decision moved instead of being defended where it was.",
            "Now nothing on screen decides anything. The server runs your code, checks the speed, and only then signs a short note saying you earned this specific lock, valid for five minutes. The desktop app checks that signature in a part of the program the screen cannot reach. On 30 August 2026 I tested this against a live lock: a forged note and an empty one were both rejected, and the lock stayed up.",
            "Then writing this page found the mirror image. A forged note was refused, but a real one from an earlier problem could open a later lock, because the code never checked which lock the note was for. I closed that on 2 September 2026 with a small, separate check that runs before any release.",
            "Two honest caveats. The test that proved that fix went when the old test suite was retired on 8 September 2026; a few new tests have been added since, but not around the unlock. And the check confirms who the note is for and when it expires, but not yet who issued it, a gap I found while writing this and have not closed.",
            "One more. By default, the secret that signs the note sits on the same machine, where its owner can read it. That is fine for a tool with one user. This is a commitment device, not a defence against its owner.",
          ],
        },
        {
          kicker: "Decision 2 — the speed rule",
          shot: "/images/codelock-verdict.jpg",
          heading: "One time limit for every language would be a preference, not a rule",
          standfirst: "Passing the tests is not enough, and making that fair was most of the engineering.",
          body: [
            "A correct but slow answer still leaves you locked. Simple to say, hard to make fair, because speed depends on the language and the machine, not just the answer.",
            "So every problem carries a separate time budget for each of its six languages, because they do not start up at the same speed. One shared number would make the rule impossible in one language and free in another: a language preference dressed up as a rule.",
            "The time limit is the known good time plus 35 percent, with a fixed 40 milliseconds added on top, and you get the better of two runs. That fixed margin matters most: on a very quick problem, 35 percent is smaller than the normal wobble in timing, and the margin keeps the rule measuring your code instead of the wobble. The limit also tightens as your own best time improves.",
            "Correctness and speed are checked separately, so a wrong answer is never told it was too slow.",
            "Behind it sit 695 problems in five tiers. Before a problem can be served, its reference solution has to pass its own tests in all six languages under the real sandbox, and anything that fails is switched off. The worst case is a missing problem, never a broken one.",
            "Every submission runs in its own throwaway box with no internet access and no way to change anything outside it. That is solid isolation, not a fortress, and the code says so.",
          ],
        },
        {
          kicker: "Decision 3 — the double-click",
          heading: "The second bypass was a double-click, not an attack",
          standfirst: "Read, decide, then write. That is two steps with a gap in the middle.",
          body: [
            "Found the same way: by reading. Every action that ended a lock session did three things. Read the state, check it, write the new state. Two requests arriving together both get past the check before either one writes.",
            "Skip: a double-click spent two days of a one-per-day allowance. Resume: a double-click on a paused timer pushed the deadline forward twice, buying real time back. Abandon: it checked that the session was yours but not what state it was in, so abandoning a session you had already solved erased the solve and moved your difficulty down for a problem you got right.",
            "The fix is not clever: stop deciding in the app. A single database write that names the state it expects is one step, so the database decides who wins and the loser changes nothing. All four ending paths work that way now, and the database itself allows only one active session per person.",
            "That is the lesson I keep relearning here. The mistake is rarely in the part I was being careful about.",
          ],
        },
        {
          kicker: "Results and evidence",
          shot: "/images/codelock-limits.jpg",
          heading: "What I can show, and what I cannot",
          standfirst: "No usage data, so no user results. What exists is a record of what happened when I attacked my own lock.",
          results: [
            {
              value: "3 of 12",
              label: "Ways out of the desktop lock that worked",
              note: "Killing the process; killing it and deleting the lock file; Ctrl+Alt+Del or a power-off. Each was tried, and each worked. From the list the product publishes about itself.",
            },
            {
              value: "2 of 12",
              label: "Barriers proven by trying the attack",
              note: "Reopening after a kill brought the lock back. A forged and an empty unlock were both rejected against a live lock on 30 August 2026.",
            },
            {
              value: "695",
              label: "Problems, each checked before it can be served",
              note: "Across five tiers. Every reference solution had to pass its own tests in all six languages under the real sandbox; anything with a gap is switched off.",
            },
            {
              value: "0",
              label: "Usage figures collected",
              note: "No release, no analytics, no error tracking, by design, so no user or download numbers exist to report. Every figure above is a test result, not user impact.",
            },
          ],
          body: [
            "The escape list comes first, and it is deliberately unflattering. Of twelve ways out of the desktop lock, three beat it and are marked as beaten because they were tried and they worked. Two held, and held is reserved for a barrier someone actually watched work. One, holding Escape for ten seconds, is a deliberate exit.",
            "The other six prove nothing yet, and separating them out is the point. Four were covered by tests retired on 8 September 2026, so they rest on a decision that was once tested and now is not. Two, switching virtual desktop and rebooting, have never been tried, and say so. A test proves the app decides correctly. It says nothing about whether Windows obeys, which is all that matters at two in the morning.",
            "The second result is the verdict screen above: every test passing, 249 milliseconds against a 47 millisecond budget, and the machine still shut. It is a real capture from the browser demo, which measures on your own machine, so the ratio reads larger than the installed app would show.",
            "The third is the problem bank. 695 is only a count. What makes it evidence is that every problem had to pass its own tests in all six languages before it could be served.",
            "The baseline: I verified everything on a single machine, and the tests behind some early claims have been retired. The status column tracks exactly what is still proven.",
          ],
        },
        {
          kicker: "Limits and lessons",
          heading: "The real check has to live where the app cannot reach it",
          standfirst: "Everything past that line is input I do not control, and I learned that by shipping it wrong first.",
          body: [
            "The lesson fits in a line. A check that runs on the user's screen is a suggestion. Worth having, because it makes the honest path quick, but not a boundary. The boundary is where the server's signed note is checked, out of the app's reach.",
            "What I would do differently is write the escape list first. I built the lock and then listed the ways around it, which is backwards. Had the list existed first, the reboot gap would have been a known limit from day one.",
            "Still unproven, in plain terms: most escape routes have not been tried on real hardware. A real reboot has never been sat through. Android has never been built or run on a phone. macOS and Linux are untested. No one but me is known to have used this.",
            "The next step is not a feature. It is putting tests back around the unlock: the check that a note matches the lock it was earned for, the speed maths, and the double-click guards, plus checking who issued the note. Those are the places where a silent bug is a bypass.",
          ],
        },
      ],
    },
  },
];

/** Projects with a write-up. Drives the /work/<slug>/ routes and the sitemap. */
export const projectsWithCaseStudy = projects.filter(
  (project): project is Project & { caseStudy: CaseStudy } =>
    project.caseStudy !== null,
);
