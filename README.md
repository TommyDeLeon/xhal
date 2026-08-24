# tommydeleon.com

Personal site for Tommy De Leon, network and security engineer.

## Stack

Next.js 16 (App Router) on React 19, Tailwind CSS 4, GSAP with ScrollTrigger,
TypeScript. Exported as static HTML and served from Hostinger, so there is no
Node runtime in production.

## Running it

```
npm install
npm run dev
```

`npm run build` writes the deployable site to `out/`. Upload the contents of
that directory to the Hostinger document root; `public/.htaccess` is copied
along with it and wires up the 404 page, compression, and cache headers.

`npm run images` regenerates the favicon set and the Open Graph card from the
vector source in `scripts/make-icons.mjs`.

## Editing content

Copy and data live in `content/`, separate from the components that render them.

| File | Holds |
|---|---|
| `content/site.ts` | Name, positioning, email, phone, socials, portrait, form key |
| `content/projects.ts` | One object per project. Adding one needs no layout change |
| `content/skills.ts` | Capability groups and their grid spans |
| `content/story.ts` | The about narrative. Empty means the section does not render |

Fields that are `null` are unset on purpose. Every component checks for null and
renders nothing rather than showing a placeholder, so an unfinished field is
invisible instead of wrong. Setting `liveUrl` on a project adds its Live Demo
button; leaving it null hides the button.

## Motion

All animation runs through `components/motion-layer.tsx`, a single client
component. Sections stay server-rendered and mark themselves with data
attributes (`data-reveal`, `data-parallax`, `data-pin`, `data-tilt`) that the
motion layer reads. Keeping it in one place means one `gsap.matchMedia()`
teardown and no animation code scattered across sections.

Breakpoint behaviour is defined in `lib/motion.ts`. Pinning and parallax are
desktop and tablet only; below 768px the page gets entrance reveals and nothing
else, because pinned scrolling on a phone competes with OS scroll. Under
`prefers-reduced-motion: reduce` no animation is created at all, and because
nothing is hidden by CSS in that case, the page renders complete and readable.

## Deploying

1. `npm run build`
2. Upload everything inside `out/` to the Hostinger document root
3. Confirm `.htaccess` made it across; hidden files are easy to miss over FTP