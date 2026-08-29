import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowSquareOut,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import MotionLayer from "@/components/motion-layer";
import ThemeShots from "@/components/theme-shots";
import ShotFigure from "@/components/shot-lightbox";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const project = projects.find((p) => p.slug === "codelock");
const study = project?.caseStudy ?? null;

/**
 * Points back at the home page's sections rather than at anchors on this one.
 * A bare "#work" here would scroll to nothing, because those sections do not
 * exist on this route.
 */
const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/#capability", label: "Capability" },
  { href: "/#story", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export const metadata: Metadata = study
  ? {
      title: study.title,
      description: study.description,
      alternates: { canonical: "/work/codelock/" },
      openGraph: {
        type: "article",
        locale: site.locale,
        url: `${site.url}/work/codelock/`,
        siteName: site.name,
        title: study.title,
        description: study.description,
        images: [
          { url: "/og.png", width: 1200, height: 630, alt: study.title },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: study.title,
        description: study.description,
        images: ["/og.png"],
      },
    }
  : {};

/**
 * The CodeLock write-up.
 *
 * Two registers on one page. The title card is the loud one: full-bleed, lit
 * from one side, display type, the same world as the home page hero. Everything
 * after it is a reading surface, so the measure drops to ~65ch and the type
 * comes back down -- running 8.5rem headings over four paragraphs about runtime
 * budgets photographs well and reads badly, and this page exists to be read.
 *
 * Every string comes from content/projects.ts. Nothing is hardcoded here.
 */
export default function CodelockCaseStudy() {
  if (!project || !study) notFound();

  const [lead, ...rest] = project.media;

  return (
    <>
      <Nav links={navLinks} />

      <main id="main">
        <article>
          {/* ── Title card ───────────────────────────────────────────── */}
          <header
            data-hero
            style={{ perspective: "var(--depth)" }}
            className="relative flex min-h-[82vh] flex-col justify-center overflow-hidden pt-28 pb-16"
          >
            <canvas
              aria-hidden
              data-graph="back"
              className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
            />

            <div
              data-hero-depth
              className="shell relative z-[2] w-full [transform-style:preserve-3d]"
            >
              <div className="mb-8 flex items-center gap-4">
                {project.mark ? (
                  <img
                    src={project.mark.src}
                    alt={project.mark.alt}
                    width={128}
                    height={128}
                    aria-hidden={project.mark.alt === ""}
                    className="h-11 w-11 rounded-[10px] border border-hairline"
                  />
                ) : null}
                <p className="text-mono-sm uppercase text-text-muted">
                  {project.name} · {project.year}
                </p>
              </div>

              <h1 className="text-display max-w-[14ch] font-semibold">
                <span className="block overflow-hidden pb-[0.08em]">
                  <span data-hero-line className="block">
                    {study.premise}
                  </span>
                </span>
              </h1>
            </div>

            <canvas
              aria-hidden
              data-graph="front"
              className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
            />

            <div className="shell relative z-[4] mt-10 flex w-full flex-col gap-7 md:mt-14 md:flex-row md:items-end md:justify-between md:gap-12">
              <div data-hero-sub className="max-w-[52ch]">
                {study.intro.map((para) => (
                  <p
                    key={para.slice(0, 40)}
                    className="text-body-lg mb-4 text-text-muted last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div data-hero-cta className="flex shrink-0 flex-wrap gap-3">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px"
                  >
                    <ArrowSquareOut size={16} aria-hidden />
                    Live Demo
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm text-text transition-colors hover:border-accent hover:text-accent"
                  >
                    <GithubLogo size={16} aria-hidden />
                    Source
                  </a>
                ) : null}
              </div>
            </div>

          </header>

          {/*
            The lead capture on its own, immediately after the card. It is the
            single most convincing thing on the page -- a judge verdict that
            passes every test and still refuses to unlock -- so it arrives
            before any of the prose explaining it.
          */}
          {lead ? (
            <section className="relative overflow-hidden py-14 md:py-20">
              <div className="shell [perspective:var(--depth)]">
                <ShotFigure shot={lead} />
              </div>
            </section>
          ) : null}

          {/*
            Overview. Fixed facts before the argument starts, so a reader can
            decide whether to spend ten minutes here.

            dl/dt/dd because a label-and-value pair is literally what a
            definition list is. Worth being accurate about the benefit, though:
            wrapping each pair in a div inside the dl is valid HTML, but support
            for announcing that grouping is not uniform across screen readers,
            and I have not tested it with one. This markup is the honest choice
            for the shape of the content, not a verified accessibility win, and
            an earlier version of this comment claimed otherwise.

            Guarded on length for the same reason every other conditional block
            on this page is guarded: an empty array would otherwise render the
            heading with nothing underneath it.
          */}
          {study.overview.length ? (
            <section className="section-y border-t border-hairline">
              <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <h2 className="text-h3 font-medium text-text-muted">
                    Overview
                  </h2>
                </div>

                <dl className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                  {study.overview.map((item, i) => (
                    /* Index-suffixed. Nothing in the type enforces unique
                       labels, and this list is static and never reordered, so
                       the index is stable rather than a reconciliation hazard. */
                    <div key={`${item.label}-${i}`}>
                      <dt className="text-mono-sm uppercase text-text-faint">
                        {item.label}
                      </dt>
                      <dd className="mt-2 leading-[1.7] text-text-muted">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          ) : null}

          {/* ── The prose ────────────────────────────────────────────── */}
          {study.sections.map((section, i) => (
            <section
              key={section.heading}
              id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="section-y relative"
            >
              <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <h2 className="text-h3 font-medium text-text-muted lg:sticky lg:top-28">
                    {section.heading}
                  </h2>
                </div>

                <div data-reveal-group className="lg:col-span-7 lg:col-start-6">
                  {/* The section's claim, set above the body so a reader
                      skimming only the headings still collects the argument. */}
                  <p
                    data-reveal
                    className="text-h3 mb-8 max-w-[34ch] font-medium text-text"
                  >
                    {section.standfirst}
                  </p>

                  {section.body.map((para) => (
                    <p
                      key={para.slice(0, 40)}
                      data-reveal
                      className="mb-6 max-w-[65ch] leading-[1.75] text-text-muted last:mb-0"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Remaining captures are dealt out between sections rather than
                  stacked into a gallery, so each lands beside the prose it
                  illustrates instead of arriving as an appendix. */}
              {rest[i] ? (
                <div className="shell mt-16 [perspective:var(--depth)]">
                  <ShotFigure shot={rest[i]} />
                </div>
              ) : null}
            </section>
          ))}

          {/* ── Stack and exit ───────────────────────────────────────── */}
          <section className="section-y border-t border-hairline">
            <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <h2 className="text-h3 font-medium text-text-muted">
                  Built with
                </h2>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {project.stack.map((tech) => (
                    <li key={tech} className="text-mono-sm text-text-muted">
                      {tech}
                    </li>
                  ))}
                </ul>

                <p className="mt-10 border-l border-accent pl-5 text-sm leading-[1.7] text-text">
                  {project.angle}
                </p>

                <Link
                  href="/#work"
                  className="group mt-12 inline-flex items-center gap-2.5 text-sm text-text-muted transition-colors hover:text-accent"
                >
                  <ArrowLeft
                    size={16}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />
                  Back to the work
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer links={navLinks} />
      <MotionLayer />
      <ThemeShots />
    </>
  );
}
