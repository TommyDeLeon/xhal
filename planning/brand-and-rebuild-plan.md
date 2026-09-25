# Tommy De Leon — brand and rebuild plan

Prepared 25 September 2026. Planning only; this is a proposed direction, not an approved visual comp or a completed rebuild.

## Direction

**Useful software. Thoughtfully made.**

A light, editorial portfolio where real products earn attention. Warm ivory, deep green, generous spacing, readable type, and precise motion. Premium comes from composition, photography, and care. Keep the page calm; let the films carry the drama.

Use **Tommy De Leon** as the public identity. Keep **xhal** as the repository/project name unless the owner asks to make it a public alias. The supplied image is a checklist of brand dimensions, not an instruction to copy its dark appearance or publish corporate mission sections.

Confirmed in the planning conversation: hiring managers and freelance clients receive **equal priority**; produce **three films, one per app, each in its own repository**.

## Brand foundation

| Dimension | Proposed expression |
|---|---|
| Mission | Make useful software that helps people take their next step with less friction. |
| Vision | Build a body of thoughtful, dependable work that earns trust through use. |
| Values | Clarity, care, curiosity, honest proof. |
| Positioning | A software developer who turns practical problems into understandable tools and shows the thinking behind them. Avoid implying seniority or sole ownership of team work. |
| Audience | Hiring managers and freelance clients, equally. Both need to understand the work before its technology; managers need contribution evidence, while clients need relevance to their own problems. |
| Personality | Thoughtful, direct, quietly confident, curious. |
| Promise | Show what the product does, what Tommy contributed, and what has actually been checked. |
| Reputation to earn | Clear thinking, careful execution, easy collaboration. This is an ambition, not a testimonial. |
| Working experience | Clear scope, useful updates, accessible interfaces, honest limitations. Do not invent response times or availability. |

Suggested short story, subject to personal review: “I’m interested in the small frustrations that interrupt everyday work. I turn them into software, test the important parts, and keep improving what people actually use.” This is proposed copy, not a verified biography.

The screenshot’s “company culture” becomes personal working principles. “Customer service” becomes the contact and collaboration experience. These guide the design; they do not need separate homepage sections.

## Visual identity

| Role | Token | Use |
|---|---|---|
| Main background | `#F8F7F2` warm ivory | Most of every page |
| Raised surface | `#FFFFFF` | Media and occasional functional surfaces |
| Brand | `#174C3C` deep green | Links, key headings, main actions, mark |
| Main text | `#1D2924` | Body text and labels |
| Secondary text | `#526259` | Supporting text that must still be readable |
| Soft accent | `#E8EFE6` | Quiet highlights behind dark text |
| Decorative divider | `#D5DDD4` | Nonessential separators only; not a sole control boundary |

Calculated WCAG sRGB contrast: green/ivory **9.17:1**, white/green **9.83:1**, main text/ivory **14.04:1**, secondary text/ivory **6.02:1**, green/soft accent **8.39:1**. These checks cover only the named solid-color pairs, not the eventual website. Validate interaction states, overlays, media text, and focus indicators separately.

**Typography:** retain Geist for body text and controls to minimize change and font payload. Propose Source Serif 4 for selected display headings: a more robust editorial alternative to the existing Bodoni hairlines. Use no more than two families and the weights actually needed. Self-host through the existing build approach. Body 17–18px where space allows, never below 16px for primary reading; line height about 1.55–1.7, measure about 55–70 characters. Small-screen headlines start around 36px and grow fluidly rather than forcing desktop line breaks.

**Logo system:** a carefully spaced “Tommy De Leon” wordmark, with a simple `td` monogram for favicon and compact use. Explore letter joins without reducing recognition; test the icon at 16px and 32px before committing. Deliver SVG masters, light-background lockups, favicon sizes, and usage examples. No ornate crest or coding-bracket logo by default.

**Imagery:** use the existing real portrait, art-directed crops, and fresh app captures using synthetic demo records. Keep important UI readable. The film frame and portfolio use the personal palette; product footage preserves each app’s actual interface and identity. Do not recolor screenshots to imply a redesign that did not happen.

**Motion:** small 150–250ms control feedback, brief 300–500ms entrances where useful, and a deliberate transition into project media. Honor reduced motion. Content must be visible without animation JavaScript. No scroll hijacking, custom cursor, magnetic buttons, looping background video, text scrambling, particle field, or decorative 3D scene.

**Brand kit at implementation:** wordmark/monogram, color and type tokens, link/button/focus examples, portrait treatment, favicon, social preview card, film title/outro system, voice examples, and a concise usage guide. This plan defines the kit; it does not claim those assets already exist.

## Content and navigation

The visitor should understand the work in five seconds, find a credible example in thirty seconds, and reach a useful contact or résumé without searching.

**Home sequence:** identity → selected work → short about → contact.

- Header: name, Work, About, Contact. Use ordinary anchor links; keep all three visible on mobile if they fit. Add a menu only when real content needs it. No theme switch.
- Hero: “Useful software. Thoughtfully made.” Support: “I’m Tommy, a software developer building practical tools for everyday problems.” Main action: **Explore my work**. Start the first project within or immediately below the opening viewport; avoid an empty screen filled with oversized type.
- Selected work: CodeLock, Tenant101, Mimir. Each gets a distinct composition, real poster, one-sentence purpose, contribution/status line, one video play control, and one project-story link. No repeated “Learn more / View project / Explore” controls with the same destination.
- About: 60–90 words, real portrait, current background only after checking it. Keep learning interests here rather than a separate wall of technology badges. One **View résumé** link.
- Equal audience support: each project explains the problem and practical result for clients, then makes Tommy’s role and one meaningful decision easy for hiring managers to inspect. In About, briefly state the kinds of work he can take on, grounded in evidence. Do not let résumé language dominate the hero or add a second client-only homepage.
- Contact: one clear invitation and a visible email link. LinkedIn and GitHub can be quieter text links. Remove the current overlapping hiring/freelance contact funnels if both lead to the same email. Preserve useful navigation on long pages; repetition is justified when it serves a different moment in the journey.

Draft project summaries, pending app and contribution verification:

| App | Short explanation | Film hook |
|---|---|---|
| CodeLock | A focus tool that turns your next break into coding practice. | “Earn your next break.” |
| Tenant101 | A clearer way to keep track of rent, payments, and tenant requests. | “Who’s paid. What’s next.” |
| Mimir | A personal desktop assistant for understanding what you’re working on. | “A little help. Right here.” |

Aim for roughly 250–400 homepage words, excluding navigation and footer. This is an editorial budget, not an accessibility standard. Prefer ordinary verbs. Replace “reconciliation” with “matching payments to rent”; explain essential technical detail once. Avoid “revolutionary,” “seamless,” “enterprise-grade,” inflated numbers, invented users, and unmeasured time savings.

**Project pages:** title and purpose → short film → the problem → what the app does → my contribution → one meaningful decision → what works today and limitations → useful demo/source link when valid. Main story target: 250–450 words. Optional deeper engineering notes may remain available without dominating the first read. Put material caveats beside the affected claim, not hidden in an accordion.

Tenant101 must clearly distinguish Tommy’s verified contribution from the team’s work. Mimir is not automatically “fully offline,” “unlimited,” “undetectable,” or ready for public distribution. CodeLock is not an unbreakable security lock. Verify these boundaries against current source and runtime before publishing.

## Mobile-first behavior

1. Start with a 360–390px single-column composition and verify reflow at 320px. Use 20–24px side gutters where they fit, comfortable touch controls, and natural page scrolling.
2. Put a project’s explanation beside its poster in reading order: title, purpose, contribution/status, poster, story link. Do not make visitors swipe through a carousel to discover apps.
3. Deliver a re-composed vertical film on narrow screens and landscape on wide screens, selected before loading. Desktop UI may remain landscape within a vertical edit with focused crops and a stable context frame. Never imply the desktop app runs on a phone.
4. At about 768px, introduce two-column arrangements only where the content benefits. At 1024–1440px, use a restrained asymmetrical grid: text in a narrow column, larger media beside it. Maintain DOM reading order. Cap the overall canvas around 1200–1280px and the text measure independently.
5. At 1920px, use the additional space for margins rather than oversized paragraphs. Test 200% text resize, 400% zoom/reflow, long labels, landscape phones, keyboard focus, and touch without hover.

Film experience: a real still poster with one descriptive play control, native accessible controls after play, no automatic sound, no loading all three films on arrival. Use click-to-load media, `playsInline`, captions when speech is present, and a nearby text summary. Pause a playing film when another starts. If loading fails, keep the poster, summary, and project link usable. Fullscreen playback remains available. Keep the website light even when product footage contains dark surfaces.

## Build sequence and acceptance

| Phase | Work | Exit evidence |
|---|---|---|
| Establish truth | Inspect dirty trees, routes, assets, product source, claims, project roles and current app behavior. Build a small evidence ledger. | Every public claim and proposed shot has a source, status, and owner contribution; unsupported claims are removed or marked. |
| Shape with Impeccable | Use init/shape guidance, consolidate settled user choices, compare meaningful compositions and develop mobile + desktop comps. This document is the recommended starting brief. | A resolved direction and mobile reading order; no implied approval from silence. |
| Build identity and mobile shell | Replace theme system, establish tokens, simplify content and navigation, build home and project pages. | Complete light-only mobile journey, real assets, working links, no overflow or hidden content. |
| Produce app films | In separate repositories, use the companion brag briefs and fresh app evidence. Website work can proceed with truthful still posters. | Reproducible renders, legible timing, sound/muted checks, real behavior distinguished from staged footage. |
| Expand and integrate | Compose tablet/desktop, integrate optimized media, update brand assets and metadata. | Same hierarchy and content across sizes; responsive media loads only as needed. |
| Verify and hand off | Run relevant static/build checks, browser journeys, accessibility and performance checks, and bounded review. | Recorded commands/results, screenshots, outstanding limitations, and deployment/rollback notes. |

Implementation targets:

- WCAG 2.2 AA as the accessibility target. Text contrast at least 4.5:1 for ordinary text; required non-text indicators at least 3:1. Use 44×44px touch targets as a design preference; WCAG AA target-size minimum is 24×24 CSS pixels with specified exceptions. Test keyboard navigation, focus visibility/obscuring, skip link, semantic headings, alt text, media alternatives, and reduced motion. Do not claim conformance from a checklist alone.
- Core Web Vitals goals at the 75th percentile when field data exists: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Prelaunch lab checks are provisional and cannot establish field INP. Keep initial page transfer around or below 1MB excluding on-demand films as a project budget. Measure rather than invent scores.
- No film bytes before play except a small poster; one chosen rendition; reserve media dimensions to prevent layout shifts. Start with optimized 720p web encodes and keep 1080p masters separately. Preserve readable detail over arbitrary file-size cuts.
- Test 320, 390, 768, 1024, 1440, and 1920px; at least Chromium and another engine where available, plus a real phone if available. Clearly mark unavailable coverage.
- Run `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `git diff --check` in xhal. Add focused tests only for changed meaningful behavior; manually verify old saved dark preference, dark OS preference, keyboard controls, all links, résumé, deep links, 404, playback failures, and reduced motion.
- Preserve static export, canonical URLs, metadata, sitemap, robots, resume access, and existing valid inbound routes. Remove stale theme scripts/styles and theme-based image switching, and update favicon/manifest/social assets consistently.
- Publish only with deployment authorization. Commits, if requested, have exactly one word and no body/trailers. Keep planning/agent process details out of rendered pages and public bundles.

## Current evidence and boundaries

Read-only source baseline: xhal `bdbda36`, CodeLock `b63d53e`, Tenant101 `d121122`, Mimir `b3aebc5`. xhal was clean before adding these planning files. Examined xhal content, composition, theme references, package configuration, and the three app READMEs. READMEs describe intended/current capabilities but do not prove runtime behavior. No application tests, app recordings, visual browser audit, or build were run for this planning task.

xhal currently has one project entry (CodeLock), a static-export Next.js/React architecture, Geist/Bodoni typography, and explicit dark/system themes. Key future files: `content/site.ts`, `content/projects.ts`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/nav.tsx`, `components/projects.tsx`, `components/contact.tsx`, `components/motion-layer.tsx`, `components/theme-toggle.tsx`, `components/theme-shots.tsx`, and the existing CodeLock route.

The web reader could not access tommydeleon.com during this task; this does not establish an outage. Recheck the live site during implementation. Earlier portfolio notes informed the claim/attribution checks, but this request supersedes their theme-preservation and hiring-first preferences.

Provider contribution: current OpenAI assistant prepared the plan. Claude CLI 2.1.278 reports an active first-party subscription login; exact allowed model execution/effort was not tested. Router settings and local registry were read, but no route execution or model switch was performed. No Claude or Gemini review occurred; joint review remains pending. Next contribution: verify a permitted model and review concrete design/evidence at implementation, using subscription capacity only.

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — accessibility criteria, distinct from the project’s editorial and sizing preferences.
- [Core Web Vitals](https://web.dev/articles/vitals) — performance thresholds and field measurement.
- [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) — proposed display face.
- [Remotion documentation](https://www.remotion.dev/docs/) and [license information](https://www.remotion.dev/docs/license) — verify installed version, local rendering and applicable terms before production.

Local skill references used: `C:/Users/Tommy/.claude/plugins/marketplaces/impeccable/plugin/skills/impeccable/SKILL.md` (shape/init/new-work guidance) and `C:/Users/Tommy/.claude/plugins/marketplaces/brag/skills/brag/SKILL.md` (inspect/plan/storyboard guidance). The requested deliverable is a prompt and plan, so the skills’ UI implementation and video-rendering stages have not been executed.
