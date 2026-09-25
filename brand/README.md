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
- `monogram.svg`: compact mark for icons and small placements. `monogram-ink.svg` and `monogram-reverse.svg` are approved variants.
- `lockup.svg`: green monogram followed by ink wordmark.

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

**Geist** serves body text and controls: 17px on phones, 18px on larger screens, line-height 1.6, and about 38rem maximum reading measure. **Source Serif 4** serves the masthead, drop initials, and titles; use weight 600 and negative tracking for display text.

The site scale in `app/globals.css`: masthead `clamp(3rem, 12.4vw, 9.25rem)` at 0.92 line-height and −0.035em tracking; section titles `clamp(2rem, 5.5vw, 3.25rem)` at −0.02em; feature titles `clamp(2.25rem, 7vw, 4rem)` at −0.03em; story headings `clamp(1.5rem, 3.6vw, 2rem)`; drop text `clamp(1.1875rem, 2.4vw, 1.375rem)`.

## Imagery and motion

Use the real portrait and real product captures only. Keep each product's own colours in footage; never recolour screenshots. Label synthetic demo data. For new motion, use 150–250ms for control feedback and 300–500ms for entrances. Keep one scroll-driven plate unmask and honour reduced motion. No scroll hijacking, custom cursor, particles, or looping background video.

## Favicon and social preview

Run `python brand/build-monogram.py` from the repository root to rebuild the Source Serif 4 mark path at weight 600 and optical size 20. Copy the resulting path from `brand/monogram.path.txt` into `components/monogram.tsx` before exporting assets. The smaller optical size keeps the serifs and hairlines sturdy at 16px.

Run `npm run icons` from the repository root. It writes the SVG masters, transparent PNG exports, favicon and app icons, and `public/og.png`. The social card is 1200×630, with the site name, line, role, and URL. The generator needs the local WOFF2 files in `brand/fonts/`, Sharp, and Playwright's Chromium. It fails with a clear error if Chromium cannot launch; regenerate the assets in an environment where it can.

## Video framing

Make 1920×1080 and 1080×1920 masters at 30fps. Use an ivory frame with a green 6px rule, Source Serif 4 titles, and Geist labels. Keep on-screen text to 3–7 words. Hold labels at least 0.8s and sentences for 0.3s per word with a 1.2s minimum. Keep product UI in its real palette inside a plain frame. End with “{Product} · tommydeleon.com” and the monogram. Put “Demo data” and staging labels in Geist 600 on a `#E8EFE6` chip.

## Licences

The included Latin WOFF2 files were copied from the site's local Next build. Both are under the SIL Open Font License 1.1, which permits embedding. Source Serif 4 is embedded as a base64 font in the wordmark and lockup SVG masters. The font files contain these copyright notices:

- Geist: “Copyright 2024 The Geist Project Authors (https://github.com/vercel/geist-font)” (Vercel).
- Source Serif 4: “© 2014 - 2021 Adobe Systems Incorporated (http://www.adobe.com/), with Reserved Font Name ‘Source’” (Adobe).

See the [SIL OFL 1.1 text](https://openfontlicense.org/open-font-license-official-text/) for the licence terms. Tommy should confirm the portrait's copyright before external reuse.
