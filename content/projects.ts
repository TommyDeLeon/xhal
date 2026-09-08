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
  {
    slug: "codelock",
    name: "CodeLock",
    summary:
      "A device lock that only opens when you solve a programming problem correctly and fast enough.",
    body: [
      "I built this for myself. Staying focused is the thing I am worst at, and I lose hours to whatever is one tab away without ever deciding to. Blockers and timers never worked on me because I could always dismiss them, so I wanted the cost of unlocking to be doing the thing I was avoiding in the first place. When the timer runs out the device locks, and the way back in is a programming problem.",
      "It stopped being only for me fairly quickly. Almost everyone I know loses the same hours to the same things, and reels and games are not accidentally hard to put down, they are built by people whose job is making them hard to put down. Competing with that on willpower is a losing position. So CodeLock is free and stays free, and the parts that would normally cost money to run, the judge and the problem set, are in the repository so anyone can host their own rather than depend on mine.",
      "The problem is chosen at the moment the lock fires rather than when the timer is armed, so it cannot be fetched and pre-solved in advance. New users get Tier 0 problems only, and later tiers open as they solve. There is no account and no tracker. Passing the tests is not enough on its own either: the submission also has to land inside a runtime budget, so a correct but quadratic answer still leaves you locked and tells you how far off the pace it was.",
    ],
    details: {
      summary: "How the speed gate and the lock actually work",
      body: [
        "Making the speed rule fair turned out to be most of the work. Runtime budgets are stored per language rather than as one global number, because the six supported languages do not all start up at the same speed, and a single figure would make the gate unreachable in one language and free in another.",
        "Grading takes the best of two timed runs by default, since the judge measures wall-clock time on shared hardware and one unlucky sample should not lock someone out of their own machine. The gate is the reference time multiplied by 1.35 and rounded up, with a 40ms floor added underneath it, because 35% of a fast target is a small enough number of milliseconds that the judge's own run-to-run variation can cover it.",
        "The lock itself is server-authoritative, which is the part I learned the most from. Clients never decide they are unlocked. The API signs a token only after a sandboxed judge reports a pass and the speed gate clears, and the desktop shell verifies that signature in a process the interface cannot reach, so a patched web app or a console call with an empty string cannot produce one. Writing the case study turned up the hole in that, and it was the mirror image of the attack I had defended against. A forged token was already rejected. A real one was not: the token names the lock session it was earned for, and the handler released the lock without ever reading that claim, so a token kept from an earlier problem opened a later lock inside its five-minute life. The signature check passed precisely because the token was genuine. One solved problem bought every lock in that window, and the replay looked exactly like an earned unlock. It is closed now, with the comparison pulled out into a function that is tested on its own, because a bypass that silent is not something I would have caught by using the app.",
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
      "Checks that run on the client are suggestions. The trust boundary belongs at the API — and what the lock has actually been observed to survive is written down per route, including the rows that prove nothing.",
    repoUrl: "https://github.com/TommyDeLeon/codelock",
    liveUrl: "https://codelock.tommydeleon.com",
    mark: { src: "/images/codelock-mark.png", alt: "" },
    /*
      Ordered to market the application, not the browser demo.

      The lead plate used to be the verdict screen — which is a capture of the
      DEMO, carrying its own banner saying nothing is locked and solving it
      cannot unlock anything. It is the best single illustration of the speed
      gate, but it is the wrong thing to open with: the first plate is what the
      reader takes the project to BE, and opening on a sandbox that admits it
      locks nothing sells the toy instead of the tool.

      So the real lock leads, the verdict follows as the argument for the gate,
      the app's own dashboard follows that, and the demo goes last, framed as
      what it is — the way to try the mechanism before installing anything.

      The settings screen is deliberately not here. It is a real capture and a
      real feature, but it is four controls at the top of an otherwise empty
      window, and as a full-bleed plate it would be mostly background.
    */
    media: [
      {
        src: "/images/codelock-app-lock.jpg",
        alt: "The CodeLock lock screen filling the display. A header reads Locked, pass every test case to get back in, with Skip, Run and Submit buttons. The problem is Stack LIFO Basics, marked easy and noted as taking most people about six minutes, with the specification and sample cases beside an editor holding an empty Stack class. Below the editor, Console and Test results tabs offer a Run button described as running your code without using an attempt.",
        caption:
          "The application, not the demo. A timer expired and this is the entire screen until the problem is solved — chosen at the moment the lock fires, so it cannot be fetched and worked out in advance. Run and the console below the editor exist so a guess can be tested without spending an attempt, which is the difference between a lock that teaches and one that only punishes.",
        width: 1600,
        height: 670,
      },
      {
        src: "/images/codelock-verdict.jpg",
        alt: "A CodeLock judge result reading Correct, but too slow. All three test cases pass, but the measured runtime is 249 milliseconds against a 47 millisecond budget, and the verdict explains the lock stays on because the answer is roughly 50.8 times slower than the reference solution.",
        caption:
          "The case the speed gate exists for: a correct answer that is not good enough. All three tests pass, the submission takes 249ms against a 47ms budget, and the machine stays shut. Captured in the browser demo, which times a reference solution on the same machine moments earlier and applies the product's own arithmetic, best x 1.35 + 40ms, to whatever that machine reports. The 50.8x gap reads larger than an installed judge would show, because the demo is not counting a container's start-up cost on both sides.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-app-dashboard.jpg",
        alt: "The CodeLock desktop app's dashboard. A session panel offers 15, 30, 60 and 90 minute blocks with 60 selected, above counters reading five problems solved at three per cent of submissions accepted, five locks cleared, and a median unlock of 33 minutes. A sidebar shows the tier at Easy, a streak of nought of three fast solves needed to reach Medium, a ratio of 1.00x off the best known answer across six solves with six records held, and a list of personal bests in Python. A run log lists sessions marked solved, bypassed or abandoned.",
        caption:
          "Where a focus block starts, and the state the lock reads when it picks a problem: the tier, the streak toward the next one, and how far off the best known answer the last six solves have run. The counters are my own, on my own machine during development — five locks is a development figure, not evidence that anyone uses this. The run log keeps bypassed and abandoned sessions in plain sight next to the solved ones, which is the point of keeping a log at all.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-limits.jpg",
        alt: "The desktop section of CodeLock's own limits page, headed Electron kiosk shell. Closing the window, minimising, the second monitor and sleeping the machine are marked prior tests. Switching virtual desktop and rebooting are marked untested. Killing the process, deleting the lock file and Ctrl+Alt+Del are marked defeated. Reopening after a kill and calling the unlock channel from DevTools are marked holds. Holding Escape for ten seconds is marked by design.",
        caption:
          "The escape ledger the product publishes about itself, and the single strongest piece of evidence on this page. Twelve desktop rows: three defeated, two holds, one deliberate exit, and six that prove nothing. The status column is the honest part — prior tests means the shell provably decided correctly under a suite that has since been deleted, not that anyone watched Windows honour it, and untested says so outright rather than leaving the reader to assume.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-demo.jpg",
        alt: "The CodeLock demo screen. A Pair Sum problem statement with sample cases sits beside a code editor holding a deliberately quadratic JavaScript solution, above a Run against the judge button.",
        caption:
          "The way to try the mechanism without installing anything, and it needs no server at all — the code runs in a worker in your own tab. It hands you a problem that is winnable the wrong way, because the obvious nested loop is correct and will not clear the gate.",
        width: 1600,
        height: 1000,
      },
    ],
    year: "2026",
    caseStudy: {
      title: "CodeLock: a focus lock built to survive its own author",
      description:
        "A desktop focus tool that only reopens when you solve a programming problem correctly and fast enough — and the honest record of every way I found around it.",
      premise: "A focus timer whose only off switch is a solved problem.",
      intro: [
        "CodeLock takes over the screen when a focus timer runs out. The way back in is a programming problem that has to pass every test and finish inside a time limit set per language, and it is chosen at the moment the lock fires rather than when the timer is armed — so it cannot be fetched and worked out while the clock is still running.",
        "I built it for myself, and the problem is not unusual. The applications those hours go to are refined by full-time teams whose objective is that you do not stop, and every blocker I had tried could be switched off by the person it was blocking. It is still a personal tool, though — one machine, no accounts, no telemetry, no release tagged, and nobody using it but me — so the honest headline here is not adoption. It is the escape ledger: twelve documented ways out of the desktop lock, each carrying what actually happened when I tried it, including the three that beat it.",
        "The idea was the easy part. Deciding what fast enough means without punishing a language took most of the engineering, and making the lock impossible to simply talk into opening moved the whole design onto the server — then a second time, after I found a way through my own fix.",
      ],
      overview: [
        {
          label: "Role",
          value:
            "Solo. The API, the sandboxed judge, the Electron desktop shell, the Next.js web app and the Expo mobile client are all mine.",
        },
        {
          label: "Timeline",
          value:
            "221 commits between 21 August and 8 September 2026, counted from the repository's own history.",
        },
        {
          label: "Status",
          value:
            "A personal tool, not a product. No release has been tagged, and there is no analytics, telemetry or error reporting anywhere in it — deliberately. Nothing on this page is a user-outcome number, because there are no users to measure.",
        },
        {
          label: "What actually enforces",
          value:
            "The Windows desktop shell, and nothing else. A browser tab can always be closed; iOS gives no unrestricted way for one app to hold the device; the Android module is written but has never been compiled.",
        },
        {
          label: "Stack",
          value:
            "TypeScript across all five apps, so the service that signs an unlock token and the process that verifies it share one compile-time contract. Express, Prisma and Postgres on the API. Docker for the judge, and Node 24 inside it, both for narrow reasons given below.",
        },
      ],
      sections: [
        {
          kicker: "The problem",
          shot: "/images/codelock-app-dashboard.jpg",
          heading: "Every blocker I tried had a dismiss button",
          standfirst: "A tool you can wave away is a suggestion, not a lock.",
          body: [
            "Staying focused is the thing I am worst at. I lose hours to whatever is one tab away without ever deciding to, and every tool I reached for had the same hole in it: the control that switched it off was always within reach, and I always reached for it.",
            "The applications those hours go to are not accidentally hard to put down. They are refined by full-time teams whose objective is that you do not stop. A timer that politely asks you to is competing with that on willpower, and it is asking the user to supply the exact thing they went looking for a tool because they lack.",
            "So the cost of getting back in had to be work I could not talk my way out of. When the timer expires the machine locks, and the way through is a programming problem — the same kind of work I was avoiding when I opened the tab. There was no user research here and there are no personas. This is one person's problem stated plainly, and the design follows from taking it seriously rather than from asking anybody.",
            "That single constraint forced everything else. The moment a lock has real value to the person it is locking, that person becomes its adversary. I am the adversary, and that turned out to be the most useful thing about building it for myself: I know exactly where I would attack it.",
          ],
        },
        {
          kicker: "How the problems were found",
          heading: "By re-reading the code, not by using the app",
          standfirst:
            "Nobody reported anything, because there is nobody to report it — so it is worth being exact about what did the finding.",
          body: [
            "This is the part of a case study where a discovery process usually gets invented, so here is the unembellished version. There is no telemetry, no analytics and no error tracking in this project by design, and there are no users. Three things found the defects on this page instead, and none of them was a bug report.",
            "Writing a path out end to end. Sitting down to describe how the unlock actually works, in prose, is what surfaced the replay flaw below. Using the application would never have shown it, because the bypass is indistinguishable from a legitimate unlock — the signature is real, the token is genuine, and the lock opens.",
            "A measurement coming back wrong. A database migration dated 29 August 2026 records that C++ compiled with g++ -O2 and Go run through go run both failed inside a 256MB container and passed at 500MB; the judge's default was raised to 512MB. That is not a hunch about compiler memory. It is two languages failing, a number that fixed them, and a migration that says so.",
            "Watching the machine after a run. A comment in the sandbox records two CPU-bound containers still alive twenty-four minutes after the run that started them had finished. Containers are now given a name at launch specifically so they can be found and killed rather than trusted to exit on their own.",
            "The limitation in that list is the obvious one. A fourth category — somebody else using this and hitting something I never thought to look for — does not exist yet, and no amount of re-reading my own code is a substitute for it.",
          ],
        },
        {
          kicker: "Goals and constraints",
          shot: "/images/codelock-demo.jpg",
          heading:
            "Three things it had to do, and several the platforms would not allow",
          standfirst:
            "The boundaries here were mostly not mine to choose, and they shaped the product more than any preference of mine did.",
          body: [
            "Success meant three specific things. Getting back in had to be earned rather than dismissed. The speed rule had to be defensible in any of the six supported languages rather than being a preference dressed up as a gate. And no path reachable from the interface could be allowed to conclude that the machine was unlocked.",
            "Against that sat the running costs. This had to cost nothing to operate, so grading runs on a judge bundled with the project rather than a metered service — and the API validates that address at boot, refusing any host but the local one, so a stale setting cannot quietly send code, and money, somewhere else. It also has no authentication at all, which is a deliberate scope decision for a single-machine tool and the reason every service is documented as belonging off the public internet.",
            "The platform boundaries are harder and more interesting. A browser tab can always be closed, so the web app was never going to be a lock; it is the marketing site, the try-it demo, and the lock screen that the desktop shell loads. On iOS, holding the device requires Apple's Family Controls entitlement, which this project does not have and has not implemented, so the native module reports itself unsupported and every enforcement call returns false rather than pretending. On Android the overlay module is written but has never been compiled — no JDK, no Android SDK, no build produced — which makes mobile enforcement an intention rather than a claim.",
            "Saying that plainly costs less than having somebody discover it for themselves, and the product's own limits page says the same thing in the same words.",
          ],
        },
        {
          kicker: "Decision 1 — the trust boundary",
          heading: "The first version let the client decide it was unlocked",
          standfirst:
            "v1 asked the interface a question only the server had any business answering.",
          body: [
            "Those platform limits decided what could enforce a lock at all. This one is about who gets to decide the lock has been satisfied.",
            "In the first version the application ran the tests, judged the answer good enough, and released the lock itself. It fell over in the dullest way available: anything that could talk to the interface could tell it that it had passed. There was no attack to describe. The check and the thing it was protecting were on the same side of the fence.",
            "The obvious cheaper repair would have been to make the client harder to talk to — obfuscate the bundle, hide the channel, check a value in two places. That buys time against a bored attacker and nothing at all against a determined one, and the attacker here is the owner of the machine on a bad evening. Any amount of client hardening is still the client marking its own work, so the decision had to move rather than be defended where it was.",
            "The second version moved the decision to the API. Nothing on the client concludes anything. The judge runs the submission, the speed gate is evaluated separately, and only when both clear does the API issue an unlock token — a short signed note saying this person earned this specific lock, valid for five minutes, carrying the user id, the lock session id and a type marker. Signing it needs a secret the interface does not hold.",
            "The desktop shell checks that signature in Electron's main process, behind a message channel. The window that draws the interface is a sandboxed web page with no filesystem access and no way to reach the verifying key, so a patched web app, an injected script, or the unlock channel called by hand from developer tools all arrive at the same door, and none of them can produce a valid signature. That one is not a design claim: it was run against a live lock on 30 August 2026, where a forged token and an empty string were both rejected as malformed and the overlay stayed up.",
            "Then writing this page found the mirror image of the attack I had defended against. A forged token was already refused. A real one was not. The token names the lock session it was earned for, and the handler that released the lock never read that claim — so inside its five-minute life, a token kept from one problem opened whichever lock happened to be live. The signature check passed precisely because the token was genuine. That was a working bypass until 2 September 2026, when a four-file commit pulled the comparison out into its own function and called it before release.",
            "Two caveats belong here rather than in a footnote. The regression test that commit added no longer exists — the entire automated suite was deleted from this repository on 8 September 2026, so the comparison is still in the code but the test that proved it is not. And the verifier checks the token's type, audience and expiry but not its issuer, even though the API sets one: a gap I found while writing this section and have not yet closed.",
            "The third caveat is about who this defends against, and it has never been otherwise. The verifier supports a public-key mode, but the documented default puts a shared secret in the installed application's own configuration, where the owner of the machine can read it. The documentation says that is acceptable when the only user is the person who installed it, and that is the correct way to describe it. This is a commitment device, not a defence against its owner.",
          ],
        },
        {
          kicker: "Decision 2 — the speed gate",
          shot: "/images/codelock-verdict.jpg",
          heading:
            "One runtime budget for every language would be a language preference, not a gate",
          standfirst:
            "Passing the tests is not enough — and making that rule fair turned out to be most of the engineering.",
          body: [
            "A correct answer that walks every pair still leaves the machine locked. The rule is easy to state and unpleasant to make fair, because runtime is not a property of the answer alone: it is a property of the answer, the language it is written in, and the machine that happened to run it.",
            "So budgets are stored per language, as a map on the problem itself rather than as a constant in the code. The six languages are JavaScript, TypeScript, Python, Java, C++ and Go, and they do not start up or compile at the same speed. A single global number would make the gate unreachable in one language and free in another, which is not a gate — it is a statement about which language I prefer.",
            "The gate is the target time multiplied by a tolerance, rounded up, with a fixed floor added underneath: by default 1.35 and 40 milliseconds, with the fastest of two timed runs counting. None of those three numbers is hardcoded; all are environment settings a deployment can move. The floor is the part worth defending. On a fast problem, 35 per cent of the reference time is a very small number of milliseconds — small enough that the judge's own run-to-run variation can cover it — and the floor is what keeps the gate measuring the solution rather than the noise.",
            "The target itself ratchets. It is the faster of the problem's measured reference time and your own best accepted time in that language, so the budget tightens as you get better at a problem rather than staying where it started.",
            "Correctness and speed are separate steps, which matters more than it sounds. A wrong answer never reaches the gate, and is never told it was too slow when the real problem was that it was wrong. One correction while I am here: a comment sitting directly above that branch says no timing happens, and that is misleading — the first batch is timed and the figure is stored, it simply never becomes a verdict.",
            "Underneath all of it sits the corpus: 695 problems across five tiers, with a gate on the way in as well as the way out. A measured import runs every problem's own reference solution, in each of the six languages, against that problem's own test cases; a problem with any gap is written as inactive, and the selector only ever draws from active problems. A broken problem cannot be served — the worst case is a missing one.",
            "Two implementation choices are worth a line each, because both were forced rather than preferred. The judge drives Docker containers itself rather than delegating to Judge0, the off-the-shelf code-execution service a project like this would normally sit on top of, because the sandbox Judge0 depends on needs a version of a Linux resource-limiting feature that the machines available no longer provide. And Node 24 is in the judge image because it runs TypeScript directly, with no compile step in front of it — at the price of a real constraint, since submissions have to stay inside the part of the language that is pure annotation, so the handful of features that need a compiler to emit actual code are out.",
            "Every submission runs in its own throwaway container with networking off, all Linux capabilities dropped, a read-only filesystem, a capped scratch space, a process limit and an unprivileged user. That is container isolation rather than a hardened virtual machine, and the code says so in a comment rather than letting it be assumed.",
          ],
        },
        {
          kicker: "Decision 3 — the state machine",
          heading: "The second bypass was two clicks, not an attack",
          standfirst:
            "Every route that ended a lock read the state, decided, and then wrote — which is not one decision, it is two with a gap in the middle.",
          body: [
            "I found this the same way as the last one, by reading the code rather than by using the application. Every handler that ended a lock session followed the same shape: read the session, check it was in a state that allowed the action, write the new state. That reads like a single decision. It is two, and anything arriving in the gap between them gets the same answer to the same question.",
            "Two requests, one gap. Skip was the reachable one: the handler counted the skips spent today, found the daily allowance had room, and wrote — so double-clicking the button spent two days of a one-per-day allowance, because both requests counted before either wrote.",
            "Resume was the one that actually weakened the lock. Resuming a paused timer pushes the deadline forward by however long it was paused, so two resumes reading the same paused-at stamp both push it, and a double click bought real time back.",
            "Abandon was the worst, and the least interesting to trigger. It checked that the session belonged to you and not what state it was in, so abandoning a session you had already solved overwrote the solve, wrote an audit row contradicting the one already there, and walked your own difficulty ladder down on a problem you got right.",
            "The fix is not clever: stop making the decision in the application. A single database write that names the expected state in its own condition is one statement, so the database decides who wins, and the loser changes nothing — no audit row, no ladder move, no re-arm. The alternative was a lock or a transaction around the read and the write, which would work; it just puts the correctness in a wrapper somebody can forget to add to the next handler, whereas a condition inside the write travels with the write.",
            "All four ending paths are guarded that way now, and the shapes differ for reasons worth naming. Skip and engage each take one guarded write and stop when it loses. Resume matches the exact paused-at stamp it read, not merely any pause, because the value can be cleared and set again between the read and the write — matching the timestamp means the write applies to the pause it was computed from, or to nothing. Abandon needs two narrow guards and one retry, because the difficulty-ladder decision underneath depends on which state the database actually moved from, and a single guard accepting either state would reintroduce the gap it was added to close.",
            "The one thing designed correctly from the start is bounded differently: a single active session per user is enforced by a uniqueness constraint in the database rather than by application code, and that is what makes the daily skip allowance bounded at all — the allowance is counted per user but spent per session, so two live sessions would have been two allowances.",
            "That is the pattern I keep relearning on this project. The mistake is rarely in the part I was being careful about.",
          ],
        },
        {
          kicker: "Results and evidence",
          shot: "/images/codelock-limits.jpg",
          heading: "What I can show, and what I cannot",
          standfirst:
            "There are no users, so there are no user outcomes. What exists instead is a per-route record of what happened when I attacked my own lock.",
          results: [
            {
              value: "0",
              label: "Users, downloads, telemetry events",
              note: "No release tagged, no analytics, no error tracking, no usage data of any kind — by design. Every other figure on this page is engineering validation, not user impact.",
            },
            {
              value: "3 of 12",
              label: "Documented desktop escapes that beat the lock",
              note: "Killing the process; killing it and deleting the lock file; Ctrl+Alt+Del or a power-off. Each was run, and each worked. From the ledger the product publishes about itself.",
            },
            {
              value: "2 of 12",
              label: "Barriers verified by running the attack",
              note: "Reopening after a kill restored the lock from disk. The unlock channel called from developer tools rejected both a forged and an empty token against a live lock, 30 August 2026.",
            },
            {
              value: "695",
              label: "Problems, each judged before it can be served",
              note: "Across five tiers. A measured import runs every reference solution in all six languages against that problem's own tests; a problem with any gap is marked inactive and never selected.",
            },
          ],
          body: [
            "The ledger is the result I would put first, and it is deliberately unflattering. Of twelve documented ways out of the desktop lock, three defeat it outright and are recorded as defeated because they were tried and they worked. Two hold, and holds is reserved for a barrier somebody has actually watched work. One — holding Escape for ten seconds — is a deliberate exit, and it records the session as failed.",
            "That leaves six rows that prove nothing, and separating them out is the entire point of keeping a ledger. Four of them once had automated tests covering the shell's decision: cancelling the close, undoing a minimise, re-asserting the overlay after a display change or a wake. Each was checked while unlocked as well as while locked, because a guard with no condition passes every does-it-hold test and quietly makes the application impossible to quit. Those tests were deleted from the repository on 8 September 2026, so today those rows rest on a decision that was once tested and now is not. The remaining two — switching virtual desktop, and rebooting — were never tried at all, and say so.",
            "None of that is the same as the barrier holding. A test proves the shell decides correctly. It says nothing about whether Windows honours the decision, which is the only part that matters to somebody hammering Alt+Tab at two in the morning. Folding those rows into holds would claim the one thing nobody has watched happen, so they sit in their own column and the page explains why.",
            "The second result is the verdict screen above: every test passing, 249 milliseconds measured against a 47 millisecond budget, and the machine still shut. That is the case the speed gate exists for — a correct answer that is not good enough — and the interface has to say so without being vague about the margin. It is a real capture from the browser demo, which times a reference solution on your own machine moments earlier and applies the product's own arithmetic to whatever that machine reports — so the budget is honest about the hardware it was measured on, and the ratio is inflated for the reason the caption gives.",
            "The third is the corpus gate. 695 problems is a count, not an outcome, and on its own it is exactly the kind of number this page should not lead with. What makes it evidence is the condition attached: a problem only becomes servable once its reference solution has passed its own test cases in all six languages under the real judge, and anything with a gap is written inactive. The failure mode that leaves is a missing problem, not a broken one.",
            "And the honest floor under all of it: none of this has been verified on hardware by anybody but me, on one machine, and the automated tests that backed several of these claims no longer exist.",
          ],
        },
        {
          kicker: "Limits and lessons",
          heading: "The boundary is wherever the signature is verified",
          standfirst:
            "Everything on the far side of it is input I do not control — and I did not learn that by reading about it.",
          body: [
            "The lesson fits in a line. A check that runs on the client is a suggestion. It is worth having, because it makes the honest path fast and tells an honest user what went wrong, but it is not a boundary. The boundary is the place where a signature is verified, and everything on the other side of that place is input I have no authority over. Reading about trust boundaries had never made that concrete. One shipped version that got it wrong did.",
            "What I would do differently is start from the escape ledger rather than arrive at it. I wrote the enforcement first and the list of ways around it second, which is the wrong order — had the ledger existed first, the reboot gap would have been a known limitation from the beginning instead of something found late and written up after the fact.",
            "The most useful correction is about the tests. Removing the automated suite took the evidence for several of the claims above with it, and the ledger had to be reworded to match. That is the clearest thing this project has taught me about writing down what you have verified: a claim and the thing backing it have to move together, or the document quietly becomes marketing.",
            "What remains unproven is short enough to list, which is the point of listing it. Most escape routes have never been exercised on hardware. A real reboot has never been sat through. Android has never been compiled, let alone run on a device. macOS and Linux are unverified throughout. Signing and auto-update have not been taken end to end. Nobody but me has used this.",
            "The most relevant next step is not a feature. It is putting regression tests back around the unlock path — the token-to-session comparison, the speed-gate arithmetic, and the guarded state transitions — and adding the issuer check the verifier is currently missing. Those are precisely the paths where a silent defect is a bypass rather than a bug, and right now nothing is watching them.",
          ],
        },
      ],
    },  },
];

/** Projects with a write-up. Drives the /work/<slug>/ routes and the sitemap. */
export const projectsWithCaseStudy = projects.filter(
  (project): project is Project & { caseStudy: CaseStudy } =>
    project.caseStudy !== null,
);
