# tommydeleon.com

Tommy De Leon's light-only portfolio. The site presents three projects and their limits using a static Next.js export. The approved claims live in `content/site.ts` and `content/projects.ts`.

## Stack and architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 import, and semantic CSS. Node 24 is declared in `package.json`. `next.config.js` sets `output: "export"`, `trailingSlash: true`, and unoptimized images. There is no API route or runtime server.

| File | Role |
|---|---|
| `app/layout.tsx` | Fonts, metadata, light browser color scheme, skip link |
| `app/page.tsx` | Home page sections, rendered from committed content |
| `app/work/[slug]/page.tsx` | All three static project stories and page metadata |
| `app/globals.css` | Light palette, layout and the motion system (documented at the top of the file) |
| `components/site-header.tsx`, `site-footer.tsx`, `monogram.tsx` | Shared server-rendered site chrome |
| `components/work-media.tsx`, `shot.tsx`, `payment-flow.tsx` | Project media: film, reserved film slot, real captures, Tenant101 illustration |
| `lib/media.ts` | Build-time check of which films and captures are published |
| `components/film.tsx` | Client component; loads a video only after a play click |
| `components/motion.tsx` | Client component; scroll reveals and hero depth, progressive only |
| `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx` | Static discovery and error pages |
| `scripts/check-assets.mjs` | Checks published images and that each film is complete or absent, before `npm run build` |

### Editing content

| File | Holds |
|---|---|
| `content/site.ts` | Name, introduction, contact, portrait, and social links |
| `content/projects.ts` | Project claims, credit, status, films, case studies, and engineering notes |

Keep each project's limits beside its claims. Tenant101 is a team project in development and its film uses demo data. The CodeLock and Mimir status text is similarly intentional.

## Run and verify

Install declared dependencies in an environment with access to the npm registry, then run:

```bash
npm install
npm run dev
```

| Command | Purpose |
|---|---|
| `npx tsc --noEmit` | Typecheck |
| `npm run lint` | ESLint |
| `node scripts/check-assets.mjs` | List missing publication assets |
| `npm run build` | Asset check, then static export to `out/` |
| `npm run images` | Rebuild posters, product captures and the portrait from `assets/` |

The site builds today without any film. Film tests skip themselves until film files are published.

### Media

**Captures.** Real product screenshots live in `assets/work/` (PNG or JPEG). `npm run images` writes AVIF, WebP and JPEG at two widths to `public/images/work/` and records their sizes in `content/work-images.json`. Landscape captures publish at up to 1440px wide, phone captures at up to 720px. CodeLock's captures come from its public repository (`codelock-marketing/public/images`, made by its `scripts/capture-surfaces.mjs` from the running app). Mimir's is a real screenshot.

**Tenant101 phone screens.** `content/projects.ts` lists three optional captures: `tenant101-home`, `tenant101-overview` and `tenant101-support`. Add them to `assets/work/` as PNGs, then run `npm run images`, and they appear automatically. Until then Tenant101 shows a labelled illustration of its payment flow, never presented as a screenshot.

**Films.** CodeLock and Tenant101 each have a reserved 16:9 "Film coming soon" slot with no play button. A film replaces its slot automatically once all of these exist:

- `public/films/<slug>/<slug>-landscape-720.mp4`
- `public/films/<slug>/<slug>-portrait-720.mp4`
- `public/films/<slug>/<slug>-descriptions.vtt`
- a 1920x1080 still from the film, saved as `assets/posters/<slug>.png` (then run `npm run images` to write `public/images/posters/<slug>.{avif,webp,jpg}`)

A partly copied film fails `npm run build`. Check the film's `note`, `summary` and `credits` in `content/projects.ts` against the finished film before publishing.

### Motion

- **Opening:** the name rises, then the three projects are dealt onto the page and Tenant101's balance settles. This takes about 2 seconds and never blocks reading or controls.
- **Reveals:** each project enters in its own way. CodeLock's green cover lifts off, like the lock releasing. Mimir's window slides in beside the notebook. Tenant101's payment goes from reported to approved.
- **Feedback:** links sweep, arrows nudge, buttons press, and posters hand over to their player.
- **Only with a mouse:** the hero cards follow the pointer by a few pixels, and frames lift on hover.
- **Robustness:** all content is visible in the HTML. Reveals start only after `components/motion.tsx` runs, via the `motion` class on `<html>`. With reduced motion, nothing moves and that class is never added.

There is no `next start` script because this is a static export. Serve `out/` with a static file host to inspect the production output. Build-time fonts are self-hosted by Next.js.

## Security and privacy

The site has no API, forms, accounts, analytics, cookies, or localStorage use. There is no theme script or saved theme preference. Public external links use `noopener noreferrer`; email opens the visitor's mail app. The film component requests same-origin media only after a click. Hosting configuration in `vercel.json` applies response headers on deployment. The Content Security Policy permits inline scripts and styles for the static Next.js output, so it should not be described as a strict script policy.

The site's content, copy, portrait, and project footage are not licensed for reuse. The portrait photographer's rights should be confirmed by the owner. The portfolio's freelance availability may affect eligibility for a non-commercial hosting plan; confirm current host terms before deployment.

## Licensing

React, Next.js, and Tailwind CSS use MIT licenses. Geist (Vercel) and Source Serif 4 (Adobe) use the SIL Open Font License 1.1. Preserve notices included with distributed font files. Project film music credits are displayed beside each film.

## Manual checklist

1. Load `/`, each `/work/<slug>/`, an unknown route, `/robots.txt`, and `/sitemap.xml`; refresh and use browser back/forward.
2. Check 320, 375, 768, and 1440px widths, 200% text zoom, and 400% reflow. The header and all text should fit without horizontal scrolling.
3. Confirm a dark OS setting and an old saved `localStorage` `theme=dark` still render the light site.
4. Confirm no film bytes are requested before a play click. Play each film, use native controls and fullscreen, and check that starting a second film pauses the first.
5. Simulate a film load failure: its poster and play button return, and the fallback message appears.
6. Reach every control by keyboard with visible focus, including the skip link. Check reduced motion mode and no-JavaScript text visibility.

No automated browser test is currently part of this repository. Passing a static build alone does not establish accessibility or media playback on real devices.
