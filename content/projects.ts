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
   * The section order is the argument: why existing tools fail, what the
   * competition actually is, how v1 broke and what replaced it, the engineering
   * of the speed gate, the honest limits, and the lesson last. Sections are
   * separate fields rather than one prose blob so the page can pace them
   * independently -- that ordering IS part of the content model, and flattening
   * it to markdown would move layout decisions back into copy.
   */
  caseStudy: CaseStudy | null;
};

export type CaseStudySection = {
  /** Short. Used as the section heading and as its in-page anchor. */
  heading: string;
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
      "Checks that run on the client are suggestions. The trust boundary belongs at the API, and the limits of the lock are written down honestly rather than overstated.",
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
        alt: "The CodeLock desktop application's lock screen filling the display. A header reads Locked, pass every test case to get back in, with Skip and Submit buttons. The problem is Characters That Appear Exactly Once, marked easy, noted as taking most people about five and a half minutes, with a worked example and two sample cases beside an editor holding an empty solve function. A footer offers holding Escape for ten seconds to abandon, noting it counts as a failed session.",
        caption:
          "The application, not the demo. A timer expired and this is the entire screen until the problem is solved — the problem chosen at the moment the lock fires, so it cannot be fetched and worked out in advance. Captured September 2026, before the screen gained a Run button and a console.",
        width: 1600,
        height: 670,
      },
      {
        src: "/images/codelock-verdict.jpg",
        alt: "A CodeLock judge result reading Correct, but too slow. All three test cases pass, but the measured runtime is 249 milliseconds against a 47 millisecond budget, and the verdict explains the lock stays on because the answer is roughly 50.8 times slower than the reference solution.",
        caption:
          "Why the lock is not simply a test runner. Every test passes, the submission takes 249ms against a 47ms budget — and it stays shut. Captured in the browser demo, which times a reference solution on the same machine moments earlier and applies the product's own arithmetic, best x 1.35 + 40ms, to whatever that machine reports. The 50.8x gap is larger than an installed judge shows, because a container's start-up cost is not being counted on both sides.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-app-dashboard.jpg",
        alt: "The CodeLock desktop app's dashboard. A session panel offers 15, 30, 60 and 90 minute blocks with 60 selected, above counters for problems solved, locks cleared and median unlock time. A sidebar shows the current tier at Easy, a streak of nought of three fast solves needed to reach Medium, a ratio of 1.00x off the best known answer, and a personal best of 170 milliseconds in Python. A run log lists one abandoned session.",
        caption:
          "Where a focus block starts, and the state the lock reads when it picks a problem: the tier, the streak toward the next one, and how far off the best known answer you have been running. Captured September 2026, before the dashboard gained pause and reset controls and before run-log rows became openable.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/codelock-limits.jpg",
        alt: "The desktop section of CodeLock's own limits page, headed Electron kiosk shell. Closing the window, minimising, the second monitor and sleeping the machine are marked prior tests. Switching virtual desktop and rebooting are marked untested. Killing the process, deleting the lock file and Ctrl+Alt+Del are marked defeated. Reopening after a kill and calling the unlock channel from DevTools are marked holds. Holding Escape for ten seconds is marked by design.",
        caption:
          "What the lock survives and what beats it, written down rather than glossed over. The status column is the honest part: prior tests means the shell provably decides correctly, not that anyone watched Windows honour it, and untested says so outright rather than leaving the reader to assume.",
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
      title: "CodeLock: putting the trust boundary in the right place",
      description:
        "How CodeLock moved from a client-side unlock check to a server-signed token, and why a fair speed gate needs per-language budgets and a 40ms floor.",
      premise: "A lock is only as good as where it checks.",
      intro: [
        "CodeLock locks the machine when a timer runs out. The way back in is a programming problem that has to be correct and fast enough, and it is chosen at the moment the lock fires rather than when the timer is armed, so it cannot be fetched and solved in advance.",
        "The idea was never the hard part. Deciding what fast enough means without being unfair to a language took most of the work, and making the lock impossible to simply tell that it is open moved the whole design onto the server.",
      ],
      overview: [
        {
          label: "Role",
          value:
            "Solo build. The API, the judge service, the desktop shell, the web app and the mobile client are all mine.",
        },
        {
          label: "Timeline",
          value:
            "2026. The escape audit — now the platform-limits section of the README — is the part I trust most about what this actually does; its most recent entries were exercised on 2 September 2026.",
        },
        {
          label: "Platforms",
          value:
            "Electron desktop, Next.js web, Expo mobile. Only the desktop shell enforces anything, and the reasons are below.",
        },
        {
          label: "Stack",
          value:
            "TypeScript everywhere, for a compile-time contract between the API that signs a token and the desktop layer that verifies it. Express for its middleware chain. Prisma against Postgres because a per-language budget map wants to be a JSON column. Docker and Node 24 for reasons given further down.",
        },
      ],
      sections: [
        {
          shot: "/images/codelock-app-dashboard.jpg",
          heading: "Every timer I tried had a dismiss button",
          standfirst:
            "A blocker you can wave away is a suggestion, not a lock.",
          body: [
            "Staying focused is the thing I am worst at. I lose hours to whatever is one tab away without ever deciding to, and every tool I tried to fix it with had the same hole in it: the button that turned it off was always within reach, and I always reached for it.",
            "So the cost of getting back in had to be doing the thing I was avoiding. When the timer runs out the machine locks, and the way through is a programming problem. That one constraint forced everything else, because the moment a lock has real value to the person it is locking, that person becomes its adversary. I am the adversary here. I know exactly where I would attack it, which turned out to be the most useful thing about building it for myself.",
          ],
        },
        {
          heading:
            "The things I lose hours to are built by people whose full-time job is making them hard to put down",
          standfirst:
            "Competing with that on willpower is a losing position, so I stopped trying.",
          body: [
            "There was no user research here and there are no personas. What there is, is an honest reading of why the existing options do not work, and it is not that they are badly made. A timer that asks you to please stop is competing against products refined by full-time teams whose entire objective is that you do not stop. That is not a fair fight, and a tool that treats it as one is asking the user to supply the very thing they came to the tool because they lack.",
            "The design follows from taking that seriously. CodeLock does not ask. It removes the option and puts a specific, checkable piece of work in the way, and the work is the same kind of work I was avoiding when I opened the tab.",
          ],
        },
        {
          shot: "/images/codelock-app-lock.jpg",
          heading: "The first version let the client decide it was unlocked",
          standfirst:
            "v1 asked the interface a question only the server had any business answering.",
          body: [
            "In the first version the app ran the tests, decided the answer was good enough, and released the lock. It fell over immediately, and it fell over in the dullest possible way: anything that could talk to the interface could tell it that it had passed. There was no attack to speak of. The check and the thing being protected were on the same side of the fence.",
            "The second version moved the decision to the API. Nothing on the client is trusted to conclude anything. The judge runs the submission, the speed gate is evaluated separately, and only if both clear does the API sign an unlock token. The token is HS256, its payload carries the user id, the lock session id and a type marker, the issuer and audience are pinned, and it expires after five minutes.",
            "Writing this page found a replay flaw in that binding. The payload named one user and one lock session, but the handler that released the lock never compared either one against the session it was holding, so inside its five minute window a validly signed token could release whichever lock happened to be live. It is closed now: the comparison is pulled out into a function and tested on its own. That was the same mistake as the first version in a smaller place, and I would not have noticed it if I had not sat down to write out how the unlock path works.",
            "The desktop shell verifies that signature in the Electron main process, behind an IPC handler. The renderer runs with node integration off, context isolation on and the sandbox flag set, so the window that draws the interface never holds the verifying key and cannot set the locked state itself. A patched web app, an injected script, or the unlock channel called by hand with an empty string all take the same path, and none of them can produce a signature. I ran that path against a live lock: a forged token and an empty one were both rejected, and the escape matrix records it as holds.",
            "There is a caveat I should state rather than let the paragraph above imply otherwise. The verifier accepts RS256 with a public key and HS256 with a shared secret. In the shared-secret mode the secret sits in the installed application's configuration, where the owner of the machine can read it. The documentation says that mode is acceptable when the only user is the person who installed it, and that is exactly the right way to describe it. It is not a defence against the machine's owner, and this lock has never claimed to be.",
          ],
        },
        {
          shot: "/images/codelock-demo.jpg",
          heading:
            "One runtime budget for every language would be a language preference, not a gate",
          standfirst:
            "Making the speed rule fair turned out to be most of the engineering.",
          body: [
            "Passing the tests is not enough on its own. The submission also has to land inside a runtime budget, so a correct answer that walks every pair is still a locked machine. That rule is easy to state and unpleasant to make fair, because runtime is not a property of the answer alone. It is a property of the answer, the language, and the machine that happened to run it.",
            "Budgets are therefore stored per language, as a map on the problem itself rather than as a constant in the code. The six languages are JavaScript, TypeScript, Python, Java, C++ and Go, and they do not start up at the same speed. I have not measured that difference and I am not going to put a number on it here. A single global number would make the gate unreachable in one language and free in another, which is not a gate, it is a statement about which language I prefer.",
            "There are 695 problems: 60 foundations, 55 build-the-data-structure, 150 core patterns, 325 variations and 95 breadth. Every one is judge-verified before it can be served: its reference solution in each of the six languages has passed that problem's own test cases in the sandbox. If one fails, the import marks the problem INACTIVE, so a broken problem cannot ship; the only thing that can be missing is a problem.",
            "Grading takes the best of several timed runs, and best means the minimum. The judge measures wall clock time on shared hardware, and one unlucky sample should not lock somebody out of their own machine. The gate itself is the reference time multiplied by a tolerance and rounded up, with a fixed floor added on top. None of those three numbers is a constant: the run count, the tolerance and the floor are all environment variables, defaulting to two runs, 1.35 and 40 milliseconds, and a deployment can move any of them. The floor is the part I would defend hardest. On a fast problem, 35 percent of the reference time is a very small number of milliseconds, small enough that the run to run variation of the judge itself can cover it. The floor is what keeps the gate measuring the solution rather than that variation.",
            "Correctness and speed are also separate steps. A wrong answer skips the extra timed runs and never reaches the gate, so a submission is never told it was too slow when the real problem was that it was wrong. The first batch is still timed and that figure is still stored, it simply never becomes a verdict. The comment sitting directly above that branch in the code says no timing happens there, which is wrong, and I found that out by having this page fact-checked rather than by reading my own comment again.",
            "The judge runs each submission in its own throwaway Docker container with the network switched off, all capabilities dropped, a read-only filesystem, a process limit and an unprivileged user. That is container isolation and not a hardened virtual machine, and the code says so in a comment rather than leaving it to be assumed. Docker is there for a specific reason: the isolate sandbox that Judge0 normally uses requires cgroup v1, which does not exist on a cgroup v2 host, so driving containers directly was the option that actually ran on the machines I have. Node 24 is in the judge image for a similarly narrow reason, which is that it strips type annotations natively and lets TypeScript submissions run without a build step. That buys a constraint as well as a feature: submissions have to stay inside erasable syntax, so enums and decorators are out.",
          ],
        },
        {
          heading: "The second bypass was not an attack, it was two clicks",
          standfirst:
            "Every path that ended a lock read the state, decided, and then wrote — which is not one decision, it is two.",
          body: [
            "The replay flaw was a missing comparison. This one was subtler and I found it the same way, by reading the code rather than by using the app. Every route that ended a lock session followed the same shape: read the session, check it was in the state that allowed the action, then write the new state. That reads like one decision. It is two, with a gap in the middle, and anything that arrives in the gap sees the same answer to the same question.",
            "A race condition is not exotic here. Two requests, one gap. Skip was the reachable one: the handler counted the skips spent today, found the allowance had room, and wrote — so double-clicking the button spent two days of a one-per-day allowance, because both requests counted before either wrote. Resume was the one that actually weakened the lock, and it was mine from the same week. Resuming a paused timer pushes the deadline forward by however long it was paused. Two resumes reading the same paused-at stamp both push it forward, so a double click bought real time back.",
            "Abandon was the worst of the three and the least interesting to trigger. It checked that the session belonged to you and nothing else — not what state it was in. Abandoning a session you had already solved overwrote the solve with abandoned, wrote an audit row contradicting the one already there, and recorded a failed session against the difficulty ladder. Repeat it and you walk your own ladder down on a problem you got right.",
            "The fix is the same in all three places and it is not clever: stop making the decision in the application. `updateMany` with the expected state in its WHERE clause is a single statement, so the database decides who wins and the loser gets a row count of zero and stops before the audit row, the ladder move and the re-arm. The engage path had always worked this way, because assigning two problems to one lock is obviously wrong; the endings had simply never been held to the same standard. That is the pattern I keep relearning on this project — the mistake is rarely in the part you were being careful about.",
          ],
        },
        {
          shot: "/images/codelock-limits.jpg",
          heading: "Only two rows in my own escape matrix say UNTESTED",
          standfirst:
            "The honest status of this lock is weaker than I would like it to be, and the document says so.",
          body: [
            "There are no download numbers, no user counts and no conversion figures on this project, so there is nothing of that kind to report. What exists instead is a section of the repository's README that lists every way I could think of to get out of the lock, and marks each one with what actually happened when I tried it.",
            "The result is less flattering than a summary would be. Deleting the lock file after killing the process defeats it. Ctrl+Alt+Del defeats it. Holding the power button defeats it, and so does booting another operating system. Those are recorded as defeated because they were run and they worked. Killing the process is defeated too, although reopening CodeLock after that holds. Switching virtual desktop and rebooting are the two untested rows. Calling the unlock channel from developer tools holds: against a live lock, a forged token and an empty one were both rejected.",
            "The rows in between say prior tests, which is a status I added rather than one I was pleased to need. Cancelling the close, undoing a minimise, and re-asserting the overlay after a display change or a wake are covered by tests now, and each is checked while unlocked as well as while locked, because a guard with no condition passes every does-it-hold test and quietly makes the app impossible to quit. That is not the same as the barrier holding. It proves the shell decides correctly; it says nothing about whether Windows honours the decision, which is the only part that matters to someone hammering Alt+Tab at two in the morning. Folding those rows into holds would claim the one thing nobody has watched happen, so they sit in their own column and the page says why.",
            "I am leaving that section exactly as the matrix has it. A tool that overstates what it enforces trains you to trust it in the one situation where it will not hold, and a focus tool that quietly fails is worse than no tool, because you stop watching for the failure. Unit-tested sits between untested and holds: the shell makes the right decision while locked and while unlocked, because a guard that fired every time would make the app impossible to quit, but I have not watched Windows honour it on hardware. The distance between what the code refuses and what I have personally verified is the most interesting thing on this project, and it is not a distance I can round down.",
            "The parts I can point at without qualification are these. The judge and the problem set live in the repository, so the pieces that would normally cost money to run are the pieces anyone can host themselves rather than depend on mine. And the verdict screen in this write-up is a real capture rather than a mockup: every test passes, the submission takes 249 milliseconds against a 47 millisecond budget, and the machine stays locked. That capture comes from the browser demo, which times a reference solution on the same machine seconds earlier and feeds it the product's own arithmetic, so the budget is honest about the hardware it was measured on rather than borrowed from mine. That screenshot is the argument for the speed gate, because it is the case where a correct answer is not good enough and the interface has to say so without being vague about why.",
          ],
        },
        {
          heading: "The boundary is wherever the signature is verified",
          standfirst:
            "Everything on the far side of it is input I do not control.",
          body: [
            "The lesson I actually took from this is small enough to write in one line. A check that runs on the client is a suggestion. It is worth having, because it makes the honest path fast and tells an honest user what went wrong, but it is not a boundary. The boundary is the place where a signature is verified, and everything on the other side of that place is input I have no authority over.",
            "I did not learn that by reading it. I learned it by shipping a version that got it wrong and seeing how little effort it took to walk through. Reading about trust boundaries had never made the idea concrete, and one broken build did.",
            "What I would do differently is start from the escape matrix instead of arriving at it. I wrote the enforcement first and the list of ways around it second, which is the wrong order. Had the matrix existed first, the reboot gap would have been a known limitation from the beginning rather than something I found later and had to write up after the fact.",
            "The constraints are worth naming too, because they shaped the product more than any preference of mine did. A browser tab can always be closed, so the web app was never going to be a lock and is scoped to the marketing site and the demo instead. On iOS there is no public API that lets an application hold the device, so enforcement there is not a feature I have yet to build, it is a thing the platform does not permit. On Android the native module is written but has never been compiled and no build has been produced, which makes mobile enforcement an intention rather than a claim. The desktop shell is the only surface that enforces anything today, and saying that plainly costs me less than having someone find it out for themselves.",
          ],
        },
      ],
    },  },
  {
    slug: "tenant101",
    name: "Tenant101",
    summary:
      "Rent collection for Philippine landlords who run their books on a notebook and a folder of GCash screenshots.",
    body: [
      "Most small landlords here collect rent the same way: a notebook, a group chat, and a screenshot of a GCash transfer. It works until somebody disputes a balance from four months ago, and then there is no version of events either side can point to. The landlord has one record, the tenant has another, and neither is complete.",
      "Tenant101 replaces that with a single ledger both sides read. Rent charges generate themselves at the start of each period, overdue rent is flagged nightly with the same surcharge for everyone, and reminders go out at seven days, three days and on the due date without anyone remembering to send them. The tenant gets a portal showing exactly what they owe, which is the same number the landlord sees.",
      "The money never touches the system. Tenants pay the landlord directly, into the landlord's own GCash or bank account, exactly as they did before. What changed is that the screenshot they were already sending now attaches to a payment record instead of a chat thread, and the landlord approves it in one place.",
    ],
    details: {
      summary: "Why approval is the only thing that creates a payment",
      body: [
        "There is exactly one code path that writes a Payment row, and everything else has to travel through it. A tenant's uploaded proof, a cash collection recorded by the owner, a trusted-tenant auto-approval and a confirmed card payment from the gateway all become a submission first and are then approved. A second way to create money would mean two places to keep the allocation and penalty logic correct, and they would drift.",
        "That mattered most when wiring in PayMongo. A webhook arrives more than once as a matter of course, so the idempotency key is the processor's payment id enforced by a unique index in Postgres rather than a check in application code, because a check-then-insert loses the race when two deliveries land together. The integration test fires four concurrent deliveries of the same payment and asserts exactly one Payment exists afterwards.",
        "Money is stored as integer centavos throughout, and pesos exist only at the edges where a form is filled in or a figure is rendered. Timestamps are stored UTC and displayed in Asia/Manila. The scheduled jobs were written against a Manila crontab and had to be converted to UTC for serverless cron, which rolls several of them onto the previous day, including one monthly job that cron cannot express at all and now runs daily against an idempotent unique index.",
      ],
    },
    stack: [
      "TypeScript",
      "Next.js 16",
      "React 19",
      "Prisma 7",
      "Postgres",
      "Tailwind 4",
      "Vitest",
      "Playwright",
      "Vercel",
    ],
    angle:
      "A ledger is only worth having if it cannot disagree with itself. One path creates money, duplicates are stopped by a database constraint rather than by hopeful code, and the marketing site says plainly what the software will not do.",
    repoUrl: null,
    liveUrl: "https://tenant101.tommydeleon.com",
    mark: null,
    /*
     * Empty on purpose, for now. The type says an empty array renders no media
     * panel "rather than a mocked-up fake of the interface", and the honest
     * position today is that the application itself is not publicly deployed —
     * only its marketing site is. Captures of the real dashboard belong here
     * once it is live: originals into assets/, then `npm run images`.
     */
    media: [],
    year: "2026",
    /*
     * No case study yet, for the same reason media is empty: the application
     * itself is not publicly deployed, only its marketing site is. Writing up a
     * system nobody can go and look at would be asking to be taken on trust.
     */
    caseStudy: null,
  },
];

/** Projects with a write-up. Drives the /work/<slug>/ routes and the sitemap. */
export const projectsWithCaseStudy = projects.filter(
  (project): project is Project & { caseStudy: CaseStudy } =>
    project.caseStudy !== null,
);
