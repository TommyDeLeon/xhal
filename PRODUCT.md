# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences with equal priority (confirmed by the owner during planning):

- **Hiring managers** screening a junior software/web developer. They need to see what Tommy actually built or contributed, one meaningful decision per project, what has really been checked, and a résumé within one click.
- **Freelance clients** with a practical problem (record-keeping, a repeated manual step, a website). They need to recognise their own problem in the work and reach Tommy without friction.

Both arrive cold, usually from a link or LinkedIn, often on a phone, and decide within seconds whether to keep reading.

## Product Purpose

tommydeleon.com is Tommy De Leon's personal portfolio. It answers four questions in order: who he is, what he made or contributed to, why it matters, and how to contact him. Success is a visitor reaching a credible project within about thirty seconds and the résumé or email without searching.

## Positioning

A software developer who turns practical problems into understandable tools and shows the thinking behind them, including what has and has not been verified. The honesty of the evidence (limits stated beside claims, team work credited as team work) is the differentiator a template portfolio cannot copy.

## Operating Context

- Static-export Next.js site on Vercel (push to `main` deploys; deployment needs the owner's authorisation).
- Public source at github.com/TommyDeLeon/xhal. "xhal" is the internal project name; the public brand is **Tommy De Leon**.
- One shared, project-led journey: identity → three selected projects → short About with résumé → contact. Navigation: Work, About, Contact.

## Capabilities and Constraints

- Owner status (confirmed 25 Sep 2026): software developer and Electronics Engineering student; networks and security remain a learning interest. Open to junior software/web roles and freelance web work.
- Freelance work he can take on (confirmed): web apps and dashboards, internal tools, websites, desktop utilities.
- Projects:
  - **CodeLock** — solo, public repo. Windows focus/commitment tool; only the Electron desktop app enforces a lock. Not released; no usage data. Not an unbreakable lock.
  - **Tenant101** — team project in a private repo owned by the owner's mentor. Tommy wrote most of the application code under the mentor's guidance. Credit the mentor unnamed. No source link. Demo data only; never real tenant records.
  - **Mimir** — solo, private repo. Personal Windows assistant/tutor in development; several parts unverified on real hardware. Not fully offline, not guaranteed correct, not publicly distributed.
- Light mode only. No theme switch, no dark CSS, no saved theme preference.
- Preserve routes (`/`, `/work/codelock/`), résumé at `/DeLeon_Tommy_Resume.pdf`, canonical URLs, sitemap, robots, 404.
- Email published: tommydeleon104@gmail.com. No phone number.

## Brand Commitments

- Visible name "Tommy De Leon". Line: "Useful software. Thoughtfully made."
- Owner-pinned: warm ivory `#F8F7F2` ground, deep green `#174C3C` brand colour, ink `#1D2924`; Geist for body and controls, Source Serif 4 for selected headings.
- Voice: short, plain English; thoughtful, direct, quietly confident. No "revolutionary", "seamless", "enterprise-grade".
- Real portrait (`assets/tommy.jpg`) and real product captures only; app footage keeps each product's own colours.

## Evidence on Hand

- CodeLock: repository history (solo), README limits, existing captures in `assets/codelock-*`, the long-form case study in `content/projects.ts`.
- Tenant101: private repository history (Tommy is the majority committer; mentor and a Lovable template also present), README feature table.
- Mimir: private repository, README and TEAM-HANDOFF status notes.
- There are no testimonials, client logos, usage figures or paid engagements. Do not fabricate any.

## Product Principles

1. The work leads; the page recedes.
2. Every claim sits next to its limit.
3. Credit exactly: solo work as solo, team work as team.
4. One destination, one control.
5. Readable first on a phone.

## Accessibility & Inclusion

Target WCAG 2.2 AA: keyboard access, visible focus, 4.5:1 text contrast, reduced motion honoured, 200% text resize and 400% reflow, captions/descriptions for films where required.
