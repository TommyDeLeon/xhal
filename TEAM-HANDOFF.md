# Team handoff — tommydeleon.com rebuild

Updated 25 September 2026 (third cloud session: UI/UX revision). Project: **xhal** (public brand: Tommy De Leon).

## Where things are

- **Branch:** `claude/tommydeleon-portfolio-rebuild-nvhjf2-fd7c57`. `main` is untouched at `bdbda36`.
- **Instructions:** `planning/rebuild-prompt.md`, `planning/brand-and-rebuild-plan.md`, `planning/app-film-briefs.md`, `.impeccable/surfaces/app-page-tsx.md` (design direction, revised), `brand/README.md` (revised), `README.md` (media and motion sections).
- **Site status:** revision done and verified in Chromium. It **builds and deploys without any film**: CodeLock and Tenant101 each keep a reserved 16:9 "Film coming soon" slot with no play button. A film replaces its slot automatically once its files exist (README → Media).

## This revision (owner feedback: messy drop caps, too long, generic, not alive)

- **Typography:** drop caps and heavy 6px rules removed. Smaller name (one line on phones), a Source Serif 4 italic tagline, and hairline dividers.
- **Composition:** hero plus a "dealt" collection of three real product images. Then one lead project (CodeLock) and a staggered pair (Tenant101, Mimir). About uses a small portrait and splits "For teams hiring" and "For clients". Contact sits in two columns on desktop.
- **Project pages:** purpose, then media, then an "At a glance" panel. The panel shows my part, status, limits, facts and links first. Then problem, what it does and one decision. The engineering notes sit behind a `<details>` toggle. The next-project link replaces the previous/next pair.
- **Real media:** three CodeLock captures copied from its public repo (`codelock-marketing/public/images`, made from the running app by `scripts/capture-surfaces.mjs`). Mimir's real screenshot moved to `assets/work/`.
- **Tenant101:** a labelled illustration of the payment flow, using the film's demo amounts. It is captioned "Not a screenshot."
- **Tenant101 phone screens (waiting on you):** the owner shared real Tenant101 phone screenshots in chat, but only as images I could see; no files reached the container. Three optional captures are wired in `content/projects.ts`. Add `assets/work/tenant101-home.png`, `tenant101-overview.png` and `tenant101-support.png`, then run `npm run images`, and they replace the illustration.
- **Motion:** the opening deal, one reveal per project with its own meaning, link/button/poster feedback, and hover depth for mouse users. It is progressive: `components/motion.tsx` adds `html.motion`, and without it everything is visible. Reduced motion shows everything at rest.
- **Tests:** film tests skip themselves until films are published. New tests cover the "coming soon" slot (no play control, no broken images), no-JavaScript visibility, reveal-on-scroll and reduced motion.

## Follow-up: lion mark and project sequence

- **New brand mark:** a calm lion's head inside a mane of seven flat planes. De Leon means "of the lion". The owner chose it after four rounds of concepts; it replaces the "td" monogram everywhere: header, contact, favicons, app icons, social image and brand exports. Source: `brand/build-mark.py` → `brand/mark.path.txt` → `components/monogram.tsx` → `npm run icons`. Meaning and usage rules are in `brand/README.md`.
- **Project pages no longer loop:** CodeLock → Tenant101 → Mimir, then "Back to all work" (`/#work`). A new e2e test covers the order.
- **Checks:** tsc, lint and build pass. Playwright Chromium: 20 pass, 6 film tests skipped (no films yet).

## Verified in this session

Linux cloud container, Node 22.22.2 (`package.json` asks for 24.x), Chromium 1194 via a temporary Playwright config (the pinned Playwright wants a newer browser build than the container has).

| Check | Result |
|---|---|
| `npx tsc --noEmit`, `npm run lint`, `git diff --check` | Pass |
| `npm run build` (no films, no Tenant101 captures) | Pass; `check-assets` notes the pending items |
| Playwright chromium-desktop + chromium-mobile, no films | 18 pass, 6 film tests skipped |
| Same, with **temporary stand-in** films (deleted, not committed) | 24/24 pass: player, pause-other, failure fallback, no media before click |
| Overflow test at 320/390/768/1024/1440/1920px | Pass |
| Keyboard: skip link → home → nav → main action; focus outline solid | Pass (first 6 tab stops checked) |
| Lab load (local server, no throttling): LCP / CLS | LCP 84–156 ms, CLS 0 on home (390, 1440) and a project page |
| Initial transfer, uncompressed bodies | Home 849 KB phone / 1,048 KB desktop, including ~455 KB of JS before gzip. Estimated under 1 MB compressed; not measured on a real CDN. |
| Walkthrough recordings, desktop and phone | Opening, reveals, hover depth and film-slot states visible |

**Page height (px, same viewport, before → after):**

| Page | Phone 390 | Desktop 1440 |
|---|---|---|
| Home | 4317 → 3513 (−19%) | 3702 → 2866 (−23%) |
| CodeLock | 4474 → 3529 (−21%) | 3727 → 2834 (−24%) |
| Tenant101 | 3116 → 2683 (−14%) | 2778 → 2142 (−23%) |
| Mimir | 2647 → 2383 (−10%) | 2428 → 2046 (−16%) |

The one-third target was not reached. The remaining length is mostly the story text, which was kept unchanged so no claim or limit is lost. The "before" pages measured grey stand-in posters in place of the missing films.

## Open issues, in order

1. **Tenant101 phone captures:** add the three PNGs (above). Check that they show demo data only.
2. **Films:** when finished, add the files listed in `README.md` → Media. Check each film's `note`, `summary` and `credits` in `content/projects.ts` against the actual film.
3. **Claims to recheck:** CodeLock "420 API tests" (the source has 221 declarations; parameterised tests may explain the gap). Mimir "234 passing tests", and its "checked live on 26 September 2026" date, which is later than this session's date and may be a typo.
4. **Tenant101 `d121122` isn't on GitHub** (latest there is `00e4bdf`).
5. **WebKit/Safari not run here.** Run `npm run test:e2e` on the desktop, including WebKit, especially after films are added.
6. **Not yet done:** 200% text and 400% zoom by hand; real-device touch check; a Lighthouse run on the deployed preview.

## Next steps on the desktop

```powershell
cd D:\Cowork\xhal
git fetch origin
git checkout claude/tommydeleon-portfolio-rebuild-nvhjf2-fd7c57
git pull
npm ci
# optional: add assets/work/tenant101-*.png, assets/posters/<slug>.png, public/films/<slug>/...
npm run images
npx tsc --noEmit; npm run lint; npm run build
npm run test:e2e        # includes WebKit
npm run dev             # look at it: http://localhost:3000
```

Deploying means merging to `main` (Vercel). **Rollback:** redeploy the previous Vercel deployment, or revert the merge.

## Contributors

- Planning docs: OpenAI assistant (per `planning/brand-and-rebuild-plan.md`).
- Earlier rebuild commits: Claude sessions on the desktop.
- This revision: Claude (cloud) wrote the design, code, tests and docs, and ran the checks above.
- No Codex or Gemini review happened; neither is available in this container. Joint review is still pending.
