# Tommy De Leon brand guide

These masters are for making assets. The website serves only the generated files in `public/`.

## Purpose

**Mission:** Make useful software that helps people take their next step with less friction.

**Positioning:** A software developer who turns practical problems into understandable tools and shows the thinking behind them.

**Audience:** Hiring managers need clear contribution, decisions, and proof they can discuss in an interview. Freelance clients need to recognise a practical problem, see relevant work, and find a direct way to get in touch. Give both equal attention.

## Values and voice

- **Clarity:** Explain the problem and the next step in plain words.
- **Care:** Make tools that respect people's time and attention.
- **Curiosity:** Ask what actually happens in use, then test it.
- **Honest proof:** Put evidence and limitations beside each claim.

Sound thoughtful, direct, quietly confident, and curious.

| Do | Don't |
| --- | --- |
| “It is a personal tool, not released.” | “A revolutionary productivity platform.” |
| “The local test copy uses demo data.” | “Trusted by landlords everywhere.” |
| “I built most of the application with my mentor's guidance.” | “I built the whole product myself.” |

Avoid **revolutionary, seamless, enterprise-grade, game-changing**. Place limits beside claims and credit team work as team work.

**Short story — proposed, for Tommy's review:** “I'm interested in the small frustrations that interrupt everyday work. I turn them into software, test the parts that matter, and keep improving what people actually use.”

## Logo system

- `wordmark.svg`: full name, best when space allows.
- `monogram.svg`: **the lion mark**, for icons and small placements. `monogram-ink.svg` and `monogram-reverse.svg` are approved variants.
- `lockup.svg`: green lion mark followed by ink wordmark.

**The lion mark.** De Leon means "of the lion". The mark is a lion's head, drawn calm and watchful rather than roaring: steady and considered, the way the work is built, tested and improved. A broad face with a level brow, a wide nose and a split muzzle sits inside a mane of seven flat planes, cut like a gem, which gives it a precise, engineered feel. It is one colour and reads as a lion-shaped badge down to 16px. Use it as drawn: don't add a roar, teeth or a crown, don't round the planes, and don't fill the gaps.

Keep clear space on every side equal to at least **25% of the mark height**. Minimum display sizes: monogram **16px**, wordmark **120px wide**. Do not recolour off palette, add effects, stretch, or place on busy photos. The reverse mark belongs on its green square.

## Colour

Ratios use WCAG 2.x sRGB relative luminance; run `node brand/contrast.mjs` to reproduce. The 4.5:1 column is for normal text and 3:1 for large text and relevant graphical elements. These ratios apply to the named pair only.

| Token | Hex | Role | Contrast use |
| --- | --- | --- | --- |
| Ivory | `#F8F7F2` | Main ground, reverse text | On green: **9.17:1**, 4.5 pass, 3 pass |
| Paper | `#FFFFFF` | Clean secondary surface | Check each foreground before use |
| Green | `#174C3C` | Brand mark, links, rules | On ivory: **9.17:1**, 4.5 pass, 3 pass; on soft: **8.39:1**, 4.5 pass, 3 pass |
| Green deep | `#0F372B` | Pressed controls | Check each foreground before use |
| Ink | `#1D2924` | Main text | On ivory: **14.04:1**, 4.5 pass, 3 pass; on soft: **12.85:1**, 4.5 pass, 3 pass |
| Muted | `#526259` | Secondary text | On ivory: **6.02:1**, 4.5 pass, 3 pass; on soft: **5.51:1**, 4.5 pass, 3 pass |
| Soft | `#E8EFE6` | Gentle chip or panel | Use tested foreground pairs above |
| Rule | `#D5DDD4` | Separators, decorative only | On ivory: **1.29:1**, 4.5 fail, 3 fail; never use for text or essential boundaries |

## Typography

**Geist** serves body text and controls: 17px on phones, 18px on larger screens, line-height 1.6, and about 38rem maximum reading measure. **Source Serif 4** serves the name, section and project titles (weight 600, slight negative tracking), and in italic the one-line tagline. No drop initials: display type is used sparingly.

The site scale in `app/globals.css`: name `clamp(2.75rem, 8vw, 5.25rem)` at −0.03em; project page titles `clamp(2.5rem, 6.5vw, 4.25rem)`; section and feature titles `clamp(1.75rem, 3.4vw, 2.375rem)`; story headings `clamp(1.375rem, 2.4vw, 1.625rem)`. Sections are separated by 1px hairlines (`--rule`), not heavy rules.

## Imagery and motion

Use the real portrait and real product captures only. Keep each product's own colours in footage; never recolour screenshots. Label synthetic demo data. Motion has a beginning and an end: one opening sequence (about 2s) and one reveal per section when it first enters view, each with its own meaning (see the Motion notes in `README.md`). Controls respond in 150–300ms. Reveals depend on script and never on browser-only scroll-timeline features, and reduced motion shows everything at rest. No scroll hijacking, custom cursor, particles, or looping background video.

## Favicon and social preview

Run `python brand/build-mark.py` from the repository root (needs `pip install shapely`, a build-time tool only) to rebuild the lion path on its 64-unit grid. Copy the path from `brand/mark.path.txt` into `components/monogram.tsx`, then run `npm run icons`. If the pinned Playwright browser is missing, point it at another Chromium with `CHROMIUM_PATH=/path/to/chrome npm run icons`.

Run `npm run icons` from the repository root. It writes the SVG masters, transparent PNG exports, favicon and app icons, and `public/og.png`. The social card is 1200×630, with the site name, line, role, and URL. The generator needs the local WOFF2 files in `brand/fonts/`, Sharp, and Playwright's Chromium. It fails with a clear error if Chromium cannot launch; regenerate the assets in an environment where it can.

The **tab icon** (`public/icon.svg`, `favicon.ico`, `icon-32.png`) is the lion alone on a transparent background, edge to edge so it stays legible at 16px. The SVG follows the browser's theme: green on light tab bars, white on dark ones. **Home-screen icons** (`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) need a solid tile, so they use the reverse lion on green. Their URLs carry a `?v=` tag in `app/layout.tsx` and `public/site.webmanifest`. Change that tag whenever the icons change: browsers cache favicons by URL, often for weeks.

## Video framing

Make 1920×1080 and 1080×1920 masters at 30fps. Use an ivory frame with a 1px hairline, Source Serif 4 titles, and Geist labels. Keep on-screen text to 3–7 words. Hold labels at least 0.8s and sentences for 0.3s per word with a 1.2s minimum. Keep product UI in its real palette inside a plain frame. End with “{Product} · tommydeleon.com” and the lion mark. Put “Demo data” and staging labels in Geist 600 on a `#E8EFE6` chip.

## Licences

The included Latin WOFF2 files were copied from the site's local Next build. Both are under the SIL Open Font License 1.1, which permits embedding. Source Serif 4 is embedded as a base64 font in the wordmark and lockup SVG masters. The font files contain these copyright notices:

- Geist: “Copyright 2024 The Geist Project Authors (https://github.com/vercel/geist-font)” (Vercel).
- Source Serif 4: “© 2014 - 2021 Adobe Systems Incorporated (http://www.adobe.com/), with Reserved Font Name ‘Source’” (Adobe).

See the [SIL OFL 1.1 text](https://openfontlicense.org/open-font-license-official-text/) for the licence terms. Tommy should confirm the portrait's copyright before external reuse.
