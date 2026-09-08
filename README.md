# tommydeleon.com

Personal site for Tommy De Leon, an Electronics Engineering student training
toward network and security engineering. Two pages: a single-scroll home page,
and a long-form case study for the CodeLock project.

Live at <https://tommydeleon.com>. Source at
<https://github.com/TommyDeLeon/xhal>.

## Stack

Next.js 16 (App Router) on React 19, Tailwind CSS 4, GSAP with ScrollTrigger,
TypeScript. Node 24 (`engines` in `package.json`).

The whole site is exported as static HTML (`output: "export"` in
`next.config.js`). There is no server, no database, no API route and no
runtime environment variable. Every page is decided at build time. That single
fact is what makes most of the rest of this file short.

## Architecture

```
app/                 Routes. layout.tsx holds fonts, metadata and the page-wide
                     light/vignette/grain layers. robots.ts and sitemap.ts are
                     source modules that emit robots.txt and sitemap.xml at
                     build time; the sitemap is derived from the content model,
                     so a case study cannot be advertised before it exists.
  page.tsx           Home. Composes the sections below and derives the nav from
                     whichever ones actually render.
  work/codelock/     The case study. 404s if the study is absent from content.
components/          Server components by default. The six marked "use client"
                     are nav, motion-layer, theme-toggle, theme-shots,
                     shot-lightbox and the ui/dialog it wraps -- everything
                     else renders to HTML and ships no JavaScript.
content/             Copy and data, separate from the components that render it.
lib/                 Graph geometry and its two renderers, motion breakpoints,
                     theme resolution, class merging.
scripts/             Build-time tools. Not application code.
assets/              Uncompressed image originals. Inputs to `npm run images`;
                     never served.
public/              Everything that ships as-is, including the compressed
                     images that `npm run images` writes to public/images.
```

Two design decisions are worth knowing before changing anything.

**All animation lives in `components/motion-layer.tsx`.** Sections stay
server-rendered and mark themselves with data attributes (`data-reveal`,
`data-parallax`, `data-pin`, `data-tilt`) that the motion layer reads. One
`gsap.matchMedia()` teardown, no animation code scattered across sections.
Breakpoints are in `lib/motion.ts`; pinning and parallax are desktop and tablet
only, because pinned scrolling on a phone fights the OS scroll. Under
`prefers-reduced-motion: reduce` no animation is created at all, and because
nothing is hidden by CSS in that case, the page renders complete and readable.

**Null means unset, and unset renders nothing.** Every component checks for
null rather than showing a placeholder, so an unfinished field is invisible
instead of wrong. Setting `liveUrl` on a project adds its Live Demo button;
leaving it null hides the button.

### Editing content

| File | Holds |
|---|---|
| `content/site.ts` | Name, positioning, email, socials, portrait, availability |
| `content/projects.ts` | One object per project, plus the case-study body |
| `content/skills.ts` | Capability groups and their grid spans |
| `content/story.ts` | The about narrative. Empty means the section does not render |

## Running it

Prerequisites: Node 24 or newer, and npm.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Type-checks, then writes the static site to `out/` |
| `npm run lint` | ESLint |
| `npm run images` | Rebuilds `public/images` from the originals in `assets/` |
| `npm run icons` | Regenerates the favicon set and the Open Graph card |

`npm run build` runs `scripts/check-assets.mjs` first, through npm's `prebuild`
hook. It fails the build if any file under `content/`, `components/` or `app/`
references an image that is not in `public/images`. The failure mode it exists
for is a typo, or a forgotten `npm run images`, shipping a broken image that
only a visitor would notice.

A screenshot is written down once as a `.jpg`, and five more filenames — the
AVIF and WebP sources plus the `-light` triple — are derived from it at runtime
by `components/shot-lightbox.tsx`. Those names appear in no source file, so the
guard expands each shot in `content/projects.ts` through the same rule and
checks all six. Without that it was checking 9 of the 34 published images, and
a half-finished `npm run images` would have passed on the strength of the one
`.jpg` it could see.

There is deliberately no `start` script: `next start` does not work with
`output: "export"` and errors out. To preview the built site exactly as it will
be served, point any static file server at `out/`, for example:

```bash
npx serve@latest out
```

### Environment variables

**None.** The application reads no environment variables and there is no
`.env` file to create. If you ever add one, note that a static export inlines
values at build time, so anything you add is public.

## External services

The application makes **no network requests to any third party at runtime**.
Verified by loading both routes with a network trace: every request goes to the
site's own origin. There are no analytics, no error reporting, no forms, no
embedded widgets and no fonts fetched from Google. The contact section uses
`mailto:` links, which open the visitor's own mail client and send nothing
anywhere.

That leaves three services, none of which the running site calls:

| Service | Role | Can it bill by usage? |
|---|---|---|
| Vercel | Hosting and CDN | Not on Hobby — see below |
| GitHub | Source, and the deploy trigger | No |
| Google Fonts | Build-time font download only | No — free, no account, no key |

Google Fonts is used through `next/font/google`, which downloads the font files
during `npm run build` and serves them from this site's own domain. Per the
Next.js documentation, "no requests are sent to Google by the browser when the
user visits your site" — confirmed here in a network trace, where every font
request resolves to `/_next/static/media/*.woff2`. This matters for privacy as
well as cost: visitor IP addresses are never disclosed to Google.

### Cost exposure

Vercel's **Hobby plan cannot generate a bill.** Vercel's own documentation
states: "As the Hobby plan is a free tier there are no billing cycles. In most
cases, if you exceed your usage limits on the Hobby plan, you will have to wait
until 30 days have passed before you can use the feature again." Exceeding the
allowance pauses the resource; it does not charge. No payment method is
required.

Two further reasons this site is a poor candidate for a surprise cost:

- It uses no Vercel Functions, so the metered compute resources are never
  touched.
- `images: { unoptimized: true }` plus no use of `next/image` mean Vercel's
  metered Image Optimization is never invoked. Images are pre-compressed to
  AVIF and WebP by `npm run images`, which is run by hand when the originals
  change — not part of `npm run build` — and the results are committed.

**Open question, and it needs the owner's input.** Vercel restricts Hobby to
"non-commercial personal use only", and defines commercial usage to include
"advertising the sale of a product or service". This site's contact section
does advertise freelance availability, so it plausibly falls outside Hobby
terms. The consequence of a Hobby terms violation is that Vercel may pause the
deployment — not that it bills you. Moving to Pro settles the terms question
but costs $20/user/month and *introduces* usage-based on-demand charges, which
is the opposite of what a zero-billing-risk setup wants; Pro does at least
offer Spend Management to cap that. Neither the current plan nor any account
setting is verifiable from this repository. Check them in the Vercel dashboard.

Sources: [Vercel Hobby plan](https://vercel.com/docs/plans/hobby),
[Fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines).

## Deploying

Deployment is Vercel building from the GitHub repository. A `git push` to
`main` is the deploy. There is no manual upload step.

`vercel.json` sets response headers, and is the only file that does. Vercel
applies it on the next deployment after it changes — the headers below are not
live until you push.

| Header | Why |
|---|---|
| `Content-Security-Policy` | Confines subresources to this origin, plus `data:` images |
| `X-Content-Type-Options: nosniff` | Stops MIME-type guessing |
| `X-Frame-Options: DENY` | Clickjacking, for browsers predating CSP `frame-ancestors` |
| `Referrer-Policy` | Does not leak full URLs to other origins |
| `Permissions-Policy` | Denies camera, microphone, geolocation and friends |

It also caches `/images/*` for a day with a week of `stale-while-revalidate`.
Vercel's default for those files is `max-age=0, must-revalidate`, which costs a
conditional request per image on every repeat visit. The trade is that a
replaced screenshot keeping its filename can be up to a day stale; hashed
`/_next/static/*` assets are unaffected and stay immutable.

If the site ever moves off Vercel, `vercel.json` will not come with it. The
headers above have to be reproduced in whatever the new host uses — an Apache
`.htaccess`, an nginx `add_header` block, a Netlify `_headers` file. Losing
them silently is the easy mistake.

## Security notes

The attack surface is genuinely small: static files, no server, no user input,
no authentication, no cookies, and no storage beyond a single `localStorage`
key holding the string `light` or `dark`.

- The inline script in `app/layout.tsx` runs before first paint to set the
  theme and the `js-motion` class. It is a fixed string with no interpolation.
  `suppressHydrationWarning` on `<html>` is deliberate and scoped to that
  element; a genuine mismatch elsewhere still surfaces.
- All external links carry `rel="noopener noreferrer"`.
- No `dangerouslySetInnerHTML` anywhere except that one script.
- No secrets exist in this repository, because nothing needs one.

**Known limitation in the CSP.** `script-src` and `style-src` include
`'unsafe-inline'`. They have to: a static export has no per-request nonce, and
Next.js embeds the RSC payload in inline scripts whose contents change every
build, so hashing is not practical either. The policy therefore blocks script
*sources* — nothing may load from another origin — but would not stop injected
inline script. Given the site renders no user-controlled input at all, there is
no known path to injection here; the policy is simply not the strict one it
might look like at a glance.

This is a review of the code in this repository. It is not a penetration test,
and it says nothing about the security of the Vercel or GitHub accounts
themselves.

## Licensing and attribution

The site's content, copy, photographs and project screenshots are Tommy De
Leon's own work and are not licensed for reuse. No `LICENSE` file is present,
so default copyright applies.

Third-party software used at runtime:

- **React, Next.js, Radix UI, Phosphor Icons, clsx, tailwind-merge and
  Tailwind CSS** — MIT.
- **GSAP** — GreenSock's standard "no charge" licence,
  <https://gsap.com/standard-license>. Free for commercial use including all
  plugins since April 2025; no fee and no attribution required. Copyright (c)
  2008-2026, GreenSock. The production bundle is minified, which strips GSAP's
  copyright banner along with every other comment — universal bundler
  behaviour; the notice is retained here instead.
- **Geist and Geist Mono** (Vercel) and **Bodoni Moda** (Copyright 2020 The
  Bodoni Moda Project Authors, <https://github.com/indestructible-type/Bodoni>)
  — SIL Open Font License 1.1. The OFL permits embedding and redistribution and
  asks that the copyright notice travel with the font files, which are
  self-hosted from this site. This section is that notice.

Not reviewed, because only the owner has the answer: whether the portrait in
`public/images/tommy.*` was taken by Tommy or by someone else who holds its
copyright. Nothing in the repository settles it.

No privacy policy or cookie banner is present, and on the current build none is
required: the site sets no cookies, runs no analytics, collects no personal
data and contacts no third party from the visitor's browser. Adding any one of
those changes that answer.

## Known limitations

- **No automated tests.** They were removed at the owner's request. Nothing now
  catches a regression before a visitor does. The checklist below is the
  substitute, and it is a manual one.
- The CSP relies on `'unsafe-inline'`, as explained above.
- **The CSP blocks Vercel's preview toolbar.** Preview deployments inject a
  script from `https://vercel.live`, which `script-src 'self'` refuses, so
  preview builds show CSP violations in the console and no toolbar. Production
  is unaffected — checked, and the live HTML contains no `vercel.live`
  reference. This was left as-is deliberately: allowing that origin would
  loosen the policy for every real visitor to serve a preview-only convenience.
  If you want the toolbar, add `https://vercel.live` to `script-src` and
  `wss://ws-us3.pusher.com` to `connect-src`, and accept that trade.
- The Vercel Hobby commercial-use question is open.
- `/images/*` can serve a day-stale file after a same-filename replacement.
- The two hero canvas renderers (`lib/graph.ts` 2D, `lib/graph-3d.ts` WebGL)
  are around 950 lines for a decorative background. That is a deliberate
  fallback pair rather than dead code, but it is the largest thing here that a
  reader might expect to be smaller.

## Manual verification checklist

Run this against a production build — `npm run build`, then serve `out/` — not
against the dev server.

1. `npm run lint` and `npm run build` both pass.
2. The home page and `/work/codelock/` load. Refresh each directly; both must
   still work, as must browser back and forward.
3. An unknown path such as `/nope/` returns HTTP 404 and renders the custom
   404 page.
4. `/robots.txt` and `/sitemap.xml` load, and the sitemap lists exactly the
   case studies that exist.
5. Nav anchors scroll to their sections and clear the fixed header.
6. Tab through the whole page. Focus is always visible, the skip link comes
   first, and no control is unreachable.
7. Open a screenshot lightbox. Escape closes it, focus returns to the thumbnail
   that opened it, and the page scroll unlocks.
8. At 375px wide, open the menu. It traps Tab, closes on Escape, and returns
   focus to the hamburger.
9. Toggle Light, Dark and System. Screenshots swap to the matching variant, and
   the choice survives a reload.
10. Check 320, 375, 768 and 1440px wide. Nothing scrolls horizontally.
11. The browser console is clean and no request fails.
12. With the OS set to reduced motion, the page renders complete and readable
    with no animation.
