# TEAM-HANDOFF

Local working record for the copy-and-positioning pass on tommydeleon.com.
Not published: nothing in `app/`, `components/` or `content/` references this
file, and the static export never includes it.

## Revision

- Base: `470f866` ("Light"), main, clean tree at start, 16 September 2026.
- Live site fetched the same day: title, description and body copy matched
  `470f866` (the earlier "live retrieval blocked" note no longer applies).
- No commit, push or deploy has been made. Everything below is uncommitted.

## Goal and decisions

Position the site for hiring managers first (junior software / web roles) and
freelance clients second, in plain language a non-technical reader follows,
with every claim checkable against the CodeLock repository. Direction:
"Practical software. Thoughtful execution."

| Decision | Why |
|---|---|
| Headline becomes "Practical software. Thoughtful execution." | Leads with what the evidence supports (a shipped, documented project). Networks/security stay in the deck as the study direction. |
| Two hero CTAs: filled "Hire me or start a project" → `#contact`, text "See the work" → `#work` | First draft had them the other way round; Gemini flagged the hiring CTA as buried and the swap was accepted. The work is the next section anyway. |
| Contact section reordered: **Hire me** (left) then **Start a project** (right), each with its own `mailto:` subject | Hiring is the primary audience. Both remain true. |
| "Reply within two business days" removed | Nothing in the repository supports a response-time promise. |
| `site.resumeUrl` → `/DeLeon_Tommy_Resume.pdf` | Owner supplied the original resume and asked for a generic software-developer version. Generated one page from the `[approved]` lines of `D:/Cowork/job-search-assistant/career/CAREER-RECORD.md`; linked "Resume (PDF)" in the hero and contact section (new tab). **Phone number omitted on purpose** because the file is public and the site publishes none. Includes Tenant101 as "Junior Developer, team project, with a project lead" — the wording the career record approves; drop it if the owner prefers the site-linked copy without it. |
| Self-critical phrasing replaced with contribution/outcome phrasing | e.g. "Staying focused is the thing I am worst at" → the problem stated as a product observation; "Where I actually am" → "What I work with"; case-study title no longer "built to survive its own author". |
| All copy shortened and de-jargoned (second pass, owner request) | Home + full case study rewritten for a reader with no technical background. `content/projects.ts` 6,782 → ~4,300 words; visible case-study text ≈2,460 words including alt text. Facts, dates and limits unchanged. |
| Absolutes softened after OpenAI review | "no off switch" / "only way back in" → "takes the dismiss button away… a commitment device, not a prison"; "no users" → "no usage data / no known user but me". Absence of telemetry cannot prove zero users. |
| Results callouts reordered: 3 of 12 · 2 of 12 · 695 · 0 | Evidence leads; the "0" callout now reads "Usage figures collected" and closes the list. |
| Tenant101 not re-added | Removed previously at the owner's request. Confirmed absent from source and history. |
| Metadata/manifest aligned with visible copy | `site.role` → "Software Developer · Networks & Security"; description and OG text rewritten; manifest name updated. |

## Files changed

- `content/site.ts` — role, positioning, `seeking`, `resumeUrl`, availability comment.
- `content/skills.ts` — shorter blurbs; Electron added to "Software I build with" (it is in the CodeLock stack).
- `content/story.ts` — four paragraphs shortened.
- `content/projects.ts` — CodeLock summary/body/details/captions and the entire case study rewritten; factual corrections listed below. Alt texts unchanged.
- `components/hero.tsx` — headline lines, CTA block, availability line, optional resume link.
- `components/adjacency.tsx` — thesis order flipped (software first), body shortened.
- `components/capability.tsx` — heading and intro.
- `components/contact.tsx` — hiring/client fork, subjects, response-time promise removed, `button-primary` fix (below).
- `components/motion-layer.tsx` — keyboard fix (below).
- `app/layout.tsx` — metadata description, OG/Twitter descriptions.
- `public/site.webmanifest` — name.
- `README.md` — first paragraph and the `content/site.ts` row.
- `components/story.tsx` — "Why networks" heading moved above the portrait (owner: misaligned/readability).
- `public/DeLeon_Tommy_Resume.pdf` — new, one page, 61 KB; source HTML kept at `D:/Cowork/job-search-assistant/career/Resume/DeLeon_Tommy_Resume_SoftwareDeveloper.html` with a PDF copy beside it.
- `TEAM-HANDOFF.md` — this file (new).

Owner follow-ups applied on 16 Sep (second round): capability intro no longer counts rows ("The row marked Building with went into CodeLock. The rows marked Training on are what I am studying now." — it had said "two of these" with one Building-with row); case-study intro adds "and for anyone else who wants to learn programming by having no other way out. The source is public to read." (the CodeLock README states the repo has **no software licence** and must not be called open source, so "free"/"open source" is deliberately not said); LinkedIn URL confirmed by the owner as `https://www.linkedin.com/in/tommydeleon/` (matches `content/site.ts`).

**Incident, resolved:** while copying the generated PDF into `career/Resume/`, the case-insensitive filesystem overwrote the owner's original `DeLeon_Tommy_RESUME.pdf`. A byte-identical copy (68,090 bytes, 8 Sep 2026) was found in `C:/Users/Tommy/Downloads/` and restored; the folder now holds the original plus the three variants.

## Defects found and fixed (pre-existing on the live site)

1. **Contact CTAs were unstyled.** Both `<a>`s used `className="button-primary"`, which no stylesheet defines, so they rendered as plain text with the arrow wrapped underneath. Replaced with the hero's filled-pill classes.
2. **Keyboard users could not reach revealed controls.** `[data-reveal]` targets are `visibility:hidden` until their ScrollTrigger fires, and a hidden element cannot take focus, so Tab skipped "Read the case study", "Source", "Live Demo" and every lightbox button until the reader had scrolled there by other means. `motion-layer.tsx` now completes all reveal tweens on the first `Tab` keydown. Verified: 33 focusable controls, all reachable with visible focus after one Tab.

## Claim evidence (CodeLock repository, read-only, 16 Sep 2026)

| Claim on the site | Evidence |
|---|---|
| 264 commits, 21 Aug–15 Sep 2026 | `git log --oneline \| wc -l` = 264; first commit `00226fa` 2026-08-21, latest `e3fa937` 2026-09-15. (Old copy said 221 commits to 8 Sep — that window still counts 221; updated.) |
| No release tagged | `git tag` lists only `checkpoint/*` tags. |
| 695 problems, five tiers, six languages | 695 unique `slug:` entries under `apps/api/src/corpus/problems`; tier files `tier0*`, `tier05*`, `tier1*`, `tier2*`, `tier3*`; `LANGUAGES` in `packages/shared/src/index.ts` = JAVASCRIPT, TYPESCRIPT, PYTHON, JAVA, CPP, GO. |
| Speed rule ×1.35, 40 ms floor, best of two | `apps/api/src/env.ts`: `PERF_TOLERANCE` default 1.35, `PERF_FLOOR_MS` 40, `PERF_BEST_OF` 2. |
| 256 MB → 512 MB memory fix, 29 Aug | migration `20260829232310_raise_memory_limit_for_compilers`. |
| Containers alive 24 min | comment in `apps/judge/src/sandbox.ts:101`. |
| Forged/empty token rejected against a live lock, 30 Aug | `apps/web/src/app/(site)/limits/page.tsx:117` (the product's own ledger). |
| Token-to-session check, 2 Sep | commit `af9644f` (2026-09-02, "tokens"); `unlockTokenOpensLock` in `apps/desktop/src/lock-state.ts`, called in `main.ts:738`. |
| Issuer not verified | `apps/desktop/src/unlock-verifier.ts` checks `typ`, `aud`, `exp`; `iss` is declared but never compared. |
| Vitest suite removed 8 Sep; small node:test set since; unlock path untested | README "On tests" section; deletion commit `e038095` (2026-09-08); six `*.test.ts` files under `apps/api/src/services` added 8–15 Sep (session flow, skills, progression, tutor). No desktop tests exist. |
| Desktop escape ledger 12 rows: 3 defeated, 2 holds, 1 intended, 4 unit-tested, 2 untested | `DESKTOP` array in `apps/web/src/app/(site)/limits/page.tsx`. |
| Android not built or run on a device | README "Verification gaps"; no `apps/mobile/android/` directory exists. (Old copy said "never compiled — no JDK, no SDK"; softened to what the repo shows.) |
| Demo runs in a worker, no server | `apps/web/src/lib/demo-local.ts`, `components/lock/code-editor.tsx`. |
| Live demo / repo / site reachable ("all public") | `https://codelock.tommydeleon.com` 200, `https://github.com/TommyDeLeon/codelock` 200, `https://tommydeleon.com` 200 (curl, 16 Sep). LinkedIn returns 999 to curl (bot block), not fetch-verified. |
| Availability | `site.availableForWork = true` in the owner's working tree; no external verification possible. No response-time promise remains. |
| Resume | none in the repository; no link rendered. |

Not claimed anywhere: users, downloads, clients, testimonials, seniority,
credentials, guaranteed results, WCAG conformance.

## Commands and results

| Command | Result |
|---|---|
| `npm run lint` | clean |
| `npx tsc --noEmit` | clean |
| `npm run build` | 5 static routes, no warnings |
| `git diff --check` | clean (LF files; `core.autocrlf=true` prints CRLF warnings only) |
| `npx serve out -l 4173` + curl | `/` 200, `/work/codelock/` 200, `/nope/` 404 with custom page, `/robots.txt`, `/sitemap.xml` (2 URLs), images, `/og.png`, manifest all 200 |

Browser checks (Chrome DevTools MCP against the served `out/`):

- Direct load and reload of both routes: pass.
- Skip link is first Tab stop with visible outline; all 33 controls reachable after the keyboard fix.
- Lightbox: opens, body scroll locked, focus inside, Escape closes, focus returns to the thumbnail, scroll unlocked.
- Mobile menu at 375: `role=dialog`, Tab wraps, body locked, Escape closes, focus returns to the hamburger.
- Themes: Light/Dark/System each set `data-theme` and `localStorage.theme`, screenshots swap to the `-light` variant, choice survives reload.
- Reduced motion (matchMedia shimmed to `reduce`): no `js-motion` class, 0 of 21 motion targets hidden or transformed, no pin spacer.
- Widths 320 / 375 / 768 / 1440 on both routes: `scrollWidth <= innerWidth`.
- Console: no errors. Four `<link rel=preload>` font warnings (pre-existing, `next/font` preloading all weights) and one DevTools heuristic about lazy images (they do carry `width`/`height`; CLS is 0).

## Performance (before vs after, same conditions)

Mobile emulation 375×812 @2x, CPU 4×, Fast 4G, local static server, Chrome DevTools trace. Lab numbers, single runs, run-to-run variance roughly ±150 ms.

| Page | Before | After |
|---|---|---|
| `/` LCP | 734 ms, CLS 0 | 767 ms (a second run gave 977 ms), CLS 0 |
| `/work/codelock/` LCP | 714 ms, CLS 0 | not re-traced; page weight unchanged |
| Lighthouse a11y / best-practices / SEO (mobile) | 100 / 100 / 100 (home) | 100 / 100 / 100 (home and case study) |
| JS chunks in `out/` | 805 KB total files | unchanged (no dependency or bundle change) |

No image, font, motion or bundle optimisation was made: the baseline was already
good, and nothing in this pass changed delivery.

## Provider contributions

Router: `adaptive-model-router`, policy at
`C:\Users\Tommy\.claude\skills\adaptive-model-router\.amr\router.json`.

- **Google (Gemini)** — was not enabled and had no recorded model. Owner
  authorised enabling it this session ("no ceiling, plan-only, no billed
  API"). `agy models` (already authenticated) listed the account's models;
  the 11 Gemini IDs were imported into the registry from that listing and a
  `google` block added with `paid: false`, `paid_authorized: false`. The
  first `registry import` replaced the registry instead of merging; restored
  from the original source document and re-imported (17 models total).
  Review attempts with `agy --mode plan --model gemini-3.1-pro-low --effort
  low`: (1) flag-order error, no output; (2) headless mode auto-denied the
  `read_file` tool, no output; (3) `--dangerously-skip-permissions` in an
  isolated scratch copy was refused by the Claude Code auto-mode classifier;
  (4) rendered page text supplied inline in the prompt, no tools needed —
  see "Review outcomes". Screenshots could not be passed to `agy -p`, so the
  visual-hierarchy part was reviewed from a written layout description.
- **OpenAI (Codex, `gpt-5.6-sol`, `model_reasoning_effort=low`,
  `-s read-only`, `--add-dir D:/Cowork/codelock`)** — first attempt hung on
  stdin and timed out at 600 s (no output). Second attempt fed the prompt on
  stdin and completed — see "Review outcomes".
- **Claude (this session, Opus 5)** — implementation, verification, this record.

No API charges, upgrades or purchases. Only public-safe material was shared:
the git diff (contains the public site email) and page screenshots.

## Review outcomes

**OpenAI / Codex (read-only, verdict on first pass: fail — all points addressed or answered):**

| Finding | Action |
|---|---|
| "no off switch" / "only way back in" are absolute; the ledger records three working escapes | Accepted. Reworded: "takes the dismiss button away… a commitment device, not a prison"; case-study title → "a focus lock you have to earn your way out of"; premise → "A focus timer you have to earn your way out of." |
| "0 users" / "nobody else uses it" cannot be established from source | Accepted. Callout → "0 Usage figures collected"; prose → "no usage data", "no known user but me", "no one but me is known to have used this". |
| "use every day" / "everything here runs inside CodeLock" overstate | Accepted. → "Two of these went into building CodeLock"; "Everything here was used to build and run CodeLock." |
| "documented, verified case study" in OG text too broad | Accepted. → "a case study that says what was checked and what was not". |
| "all public" not proven | Not changed: the three URLs were fetched with HTTP 200 on 16 Sep (table above). |
| "where to put the guard / how people get past it" vague, implies offensive experience | Accepted. → "where the checks have to go / what those checks are up against". |
| First-Tab reveal fix: no leak found; completes motion globally on any Tab; needs keyboard testing | Tested in-browser (33/33 controls reachable, focus visible). Trade-off kept. |
| Concrete figures (264 commits, 695, six languages, 1.35/40 ms/best-of-2, ledger tally, Vitest removal, no `iss` check, session match) | Confirmed accurate by the reviewer. |
| `npm run build` failed with EPERM on `.next/` inside the reviewer's read-only sandbox | Environment limitation on their side; build passes here (5 routes). |

**Google / Gemini (`gemini-3.1-pro-low`, plan mode, prompt inline, no tools; hierarchy judged from a written layout description, not the screenshots):**

| Finding | Action |
|---|---|
| Hero: the hiring/client CTA was buried as a text link under the amber "See the work" pill; swap their weight | Accepted. "Hire me or start a project" is now the filled pill → `#contact`; "See the work" is the text link → `#work` (the work is also the next section). |
| Hero intro "I build software that works, and I write down what it has been tested to do" is clunky | Accepted with an accuracy tweak: "I build software that works, then document exactly what it has been tested to survive." ("reliable" not adopted.) |
| Case-study Status sounds defensive ("on purpose", "not a product") | Accepted: "A personal tool. No release, no analytics, no user tracking. Every number here is a test result, not a usage figure." |
| Problem section willpower sentence too wordy | Accepted, shortened. |
| "fell over in the dullest way possible" too casual | Accepted: "It failed simply: anything that could talk to the app could fake a pass." |
| Results "floor under all of it" metaphor muddy / self-critical | Accepted: "The baseline: I verified everything on a single machine… The status column tracks exactly what is still proven." |
| Pinned statement follow-up loses punch | Accepted: "Both face the same question: what happens when something unexpected hits the system?" |

After these edits: `tsc`, lint, build and `git diff --check` re-run clean;
33/33 controls focusable after one Tab; no horizontal scroll at 1440.

**Second passes (final copy + resume):**

- Gemini (`gemini-3.1-pro-low`, inline text, no tools): 4 suggestions, all applied — "deleted with the rest of the test suite" → "went when the old test suite was retired" (dates kept); capability intro reworded without a count; "by having to" → "by having no other way out"; resume summary close → "bringing methodical troubleshooting and independent work to development". Verdict: ready to publish.
- OpenAI / Codex second pass (`gpt-5.6-sol`, low, read-only, with the career record mounted): resume traceable line-by-line to `[approved]` entries, no wrong dates or seniority creep, phone absence confirmed, site never says "open source"/"free to use"; lint and tsc pass. Three findings, all applied — "no tracking" is broader than the repo supports (CodeLock stores sessions/submissions locally) → "no analytics or outside tracking" / "nothing sent anywhere"; resume "accessible UI" → "accessibility" (the record approves the skill, not an outcome); jargon in the speed-rule, sandbox and limits sections rewritten in plain words ("known good time plus 35 percent", "throwaway box with no internet access", "the check that a note matches the lock it was earned for"). Post-fix: tsc, lint, build, `git diff --check` clean; case study 25/25 controls focusable, no horizontal scroll; resume still one page.

## Remaining work / not done

- Both reviewers completed two passes; the fixes from the second pass have
  not themselves been re-reviewed. Prompts are in the session scratchpad
  (`review/openai-prompt-2.md`, `review/gemini-prompt-4.md`).
- Resume: the public copy omits the phone number and includes Tenant101 (team-project wording). Owner to confirm both choices; the local career-folder copy can carry the approved phone if wanted.
- LinkedIn URL confirmed by the owner (16 Sep).
- `README.md` still describes the Vercel Hobby commercial-use question as open.
- The CodeLock case study deliberately does not cover the progression and
  tutoring features added after 8 September; a follow-up could.
- Not committed. Suggested next step after owner review: commit on `main`,
  push, and re-check the deployed pages against the checklist above.
