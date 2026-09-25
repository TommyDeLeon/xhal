# Team handoff — tommydeleon.com rebuild

Updated 25 September 2026 (cloud session). Project: **xhal** (public brand: Tommy De Leon).

## Where things are

- **Branch:** `claude/tommydeleon-portfolio-rebuild-nvhjf2`, built on `rebuild-8yc6ue` (all 17 desktop commits). The desktop WIP snapshot was folded into commit `Planning`. `main` is untouched at `bdbda36`.
- **Instructions:** `planning/rebuild-prompt.md` (full brief), `planning/brand-and-rebuild-plan.md`, `planning/app-film-briefs.md`, `.impeccable/surfaces/app-page-tsx.md` (design direction), `PRODUCT.md`, `brand/README.md`.
- **Site status:** light-only rebuild done: home, `/work/<slug>/` for all three projects, the brand kit in `brand/`, favicons, the social preview and Playwright tests. **Only the media is missing.**

## Verified in this session

These were run in a Linux cloud container, Node 22.22.2 (`package.json` asks for Node 24.x).

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Pass |
| `npm run lint` | Pass |
| `npm run build` with **temporary placeholder** posters/films | Pass (deleted afterwards; not committed) |
| `npm run build` with real repo contents | **Fails on purpose**: `scripts/check-assets.mjs` lists the 18 missing poster/film files |
| Playwright, `chromium-desktop` + `chromium-mobile`, placeholder media | 18/18 pass |
| Playwright WebKit | Not run (WebKit isn't installed in the cloud) |

## Open issues, in order

1. **Film repos are only on the desktop (if they exist).** `codelock-film`, `tenant101-film` and `mimir-film` aren't on GitHub. `content/projects.ts` already describes recorded films (music credits, Tenant101's ₱81,675 → ₱65,175 balance, recording notes). Confirm those films really exist and match that text. If they don't, change the text.
2. **Missing media:** add these files, then run `npm run build`:
   - Posters: export a 1920×1080 still from each film to `assets/posters/<slug>.png`, then run `npm run images`. It writes `public/images/posters/<slug>.{avif,webp,jpg}`.
   - Films: `public/films/<slug>/<slug>-landscape-720.mp4`, `<slug>-portrait-720.mp4` and `<slug>-descriptions.vtt`, for slugs `codelock`, `tenant101` and `mimir`.
3. **Claims to recheck by running the tests** (a quick count of the source doesn't match):
   - CodeLock: the site says 420 API tests; `apps/api` has 221 test declarations. Parameterised tests may explain the gap. The desktop app's 46 matches.
   - Mimir: the site says 93 passing backend tests; the repo has 152 `def test_` functions. The 93 may cover only part of the repo.
   - Fix the numbers in `content/projects.ts` if the runs disagree.
4. **Tenant101 `d121122` isn't on GitHub**; GitHub's latest is `00e4bdf`. Push it (with your teammate's OK) or keep your local copy as the evidence source.
5. **Two WebKit test failures** from the desktop run: `films make no media request before click…` and `starting another film pauses the first player`. Likely cause, not confirmed: the film files didn't exist, and Playwright's WebKit may not report or intercept video requests. Rerun them after adding the real media. Don't skip them.
6. **Not yet done** (from the brief): one consolidated visual review at 320/390/768/1024/1440/1920px, 200% text and 400% zoom, a keyboard pass, lab Core Web Vitals, and checking the <1 MB initial-load budget. Then update `README.md` if anything changed.

## Next steps on the desktop

```powershell
cd D:\Cowork\xhal
git fetch origin
git checkout claude/tommydeleon-portfolio-rebuild-nvhjf2
git pull
npm ci
# 1. finish or check the three films in D:\Cowork\<app>-film
# 2. copy the posters and web encodes in (see issue 2), then:
npm run images
npx tsc --noEmit; npm run lint; npm run build
npm run test:e2e        # all four projects, including WebKit
git diff --check
```

Deploying means pushing to `main` (Vercel). Only do it after the checks pass and you decide to publish. **Rollback:** redeploy the previous Vercel deployment, or revert the merge on `main`.

## Contributors

- Planning docs: OpenAI assistant (per `planning/brand-and-rebuild-plan.md`).
- Site rebuild commits: Claude sessions on the desktop.
- This session: Claude (cloud). It folded the WIP, ran the checks above, checked the app sources and wrote this handoff.
- No Codex or Gemini review has happened. A joint review is still pending.
