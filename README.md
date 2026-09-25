# tommydeleon.com

Tommy De Leon's light-only portfolio. The site presents three projects and their limits using a static Next.js export. The approved claims live in `content/site.ts` and `content/projects.ts`.

## Stack and architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 import, and semantic CSS. Node 24 is declared in `package.json`. `next.config.js` sets `output: "export"`, `trailingSlash: true`, and unoptimized images. There is no API route or runtime server.

| File | Role |
|---|---|
| `app/layout.tsx` | Fonts, metadata, light browser color scheme, skip link |
| `app/page.tsx` | Home page sections, rendered from committed content |
| `app/work/[slug]/page.tsx` | All three static project stories and page metadata |
| `app/globals.css` | Light palette and semantic page styles |
| `components/site-header.tsx`, `site-footer.tsx`, `monogram.tsx` | Shared server-rendered site chrome |
| `components/film.tsx` | Only client component; loads a video after a play click |
| `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx` | Static discovery and error pages |
| `scripts/check-assets.mjs` | Checks referenced images, film files, and descriptions before `npm run build` |

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
| `npx next build` | Static export without the prebuild asset check, useful while film media is pending |

The posters, film encodes, and WebVTT description tracks under `public/images/posters/` and `public/films/` are still pending. `npm run build` will fail until they arrive. No placeholder media should be published. The visible film summary and note remain readable without JavaScript; the video loads only after a visitor clicks Play film.

### Film media

The films and their poster frames come from the three film repositories: `codelock-film`, `tenant101-film`, and `mimir-film`. Export a 1920x1080 still from each film as `assets/posters/<slug>.png` (using the matching project slug), then run `npm run images`. The script writes 1280x720 AVIF, WebP, and JPEG posters to `public/images/posters/` and also refreshes the portrait from `assets/tommy.jpg`. Publish the film encodes and WebVTT description tracks separately under `public/films/`.

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
