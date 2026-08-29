import Link from "next/link";
import {
  ArrowRight,
  ArrowSquareOut,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import { projects, type Project } from "@/content/projects";

/*
  ShotFigure lives in its own client component now that the screenshots are
  openable. The markup it renders is unchanged and still ships exactly one
  <picture> per capture with both theme variants as data attributes, which is
  what keeps a single file per shot on the wire -- an earlier version rendered
  both variants and hid one with display:none, and transferSize showed all six
  downloading anyway.
*/
import ShotFigure from "./shot-lightbox";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  // Alternates sides. Capped at two orientations, so with more projects the
  // rhythm still reads as composed rather than as a zigzag template.
  const flip = index % 2 === 1;

  return (
    <article
      id={project.slug}
      data-reveal
      data-tilt
      className="rounded-panel border border-hairline bg-bg-raised p-6 [transform-style:preserve-3d] md:p-10 lg:p-14"
    >
      {project.media.length ? (
        <div
          /*
            The screenshot stack keeps a perspective of its OWN, at the shared
            --depth distance rather than an arbitrary one.

            It briefly did not, on the theory that inheriting the section's
            camera was more "one continuous space". That broke: this card is
            ~2500px tall, and one perspective origin sitting at the centre of
            the whole section projects elements near its top and bottom
            extremely hard. Combined with the data-shot rotateX, parts of a shot
            crossed the camera plane while scrolling and were clipped away
            entirely -- the screenshot simply vanished.

            Sharing the perspective DISTANCE is what makes the page read as one
            room. Sharing one vanishing point across a full-page-height element
            is not something CSS does gracefully, and this is that wall.
          */
          className="mb-12 [perspective:var(--depth)]"
        >
          <ShotFigure shot={project.media[0]} />

          {project.media.length > 1 ? (
            /* Full width on small screens: these are 1600px captures of dense
               mono text, and a two-up grid on a phone makes the numbers that
               carry the meaning unreadable. */
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {project.media.slice(1).map((shot) => (
                <ShotFigure key={shot.src} shot={shot} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
        <div
          className={`self-start lg:sticky lg:top-24 ${
            flip
              ? "lg:order-2 lg:col-span-5 lg:col-start-8"
              : "lg:col-span-5"
          }`}
        >
          <div className="flex items-center gap-4">
            {project.mark ? (
              <img
                src={project.mark.src}
                alt={project.mark.alt}
                width={128}
                height={128}
                loading="lazy"
                decoding="async"
                aria-hidden={project.mark.alt === ""}
                className="h-12 w-12 rounded-[10px] border border-hairline"
              />
            ) : null}
            <p className="text-mono-sm text-text-muted">{project.year}</p>
          </div>
          <h3 className="text-h2 mt-4 font-medium">{project.name}</h3>
          <p className="text-body-lg mt-5 max-w-[42ch] text-text-muted">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
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

            {/*
              The case study link, rendered only for a project that has one.
              Sits first because it is the destination this section most wants
              you to take -- the repo and the demo are both one click deeper
              from there anyway.
            */}
            {project.caseStudy ? (
              <Link
                href={`/work/${project.slug}/`}
                /*
                  prefetch is off deliberately.

                  Next's static export writes this route's RSC payload as a
                  NESTED DIRECTORY -- out/work/codelock/__next.work/codelock/
                  __PAGE__.txt -- while the prefetch requests it as a
                  dot-separated filename, /work/codelock/__next.work.codelock.
                  __PAGE__.txt. Those do not match, so the prefetch 404s on any
                  static host, logging a console error on every page that links
                  here. Navigation itself is unaffected; only the speculative
                  fetch fails. Turning it off removes the error, and on a
                  two-page static site the prefetch was buying almost nothing.
                */
                prefetch={false}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px"
              >
                Read the case study
                <ArrowRight
                  size={16}
                  weight="bold"
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ) : null}

            {/* Renders only when a live URL exists. */}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                /* Outline, not filled. The case study is now the primary action
                   in this row, and two filled amber buttons beside each other
                   would leave neither of them reading as the primary one. */
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm text-text transition-colors hover:border-accent hover:text-accent"
              >
                <ArrowSquareOut size={16} aria-hidden />
                Live Demo
              </a>
            ) : null}
          </div>

        </div>

        <div className={flip ? "lg:order-1 lg:col-span-6" : "lg:col-span-6 lg:col-start-7"}>
          {project.body.map((para) => (
            <p
              key={para.slice(0, 40)}
              className="mb-5 max-w-[65ch] text-sm leading-[1.75] text-text-muted last:mb-0"
            >
              {para}
            </p>
          ))}

          {project.details ? (
            <details className="group mt-7 border-y border-hairline">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm text-text marker:content-none">
                {project.details.summary}
                <span
                  aria-hidden
                  className="text-mono-sm shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="pb-5">
                {project.details.body.map((para) => (
                  <p
                    key={para.slice(0, 40)}
                    className="mb-4 max-w-[65ch] text-sm leading-[1.75] text-text-muted last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </details>
          ) : null}

          <p className="mt-8 border-l border-accent pl-5 text-sm leading-[1.7] text-text">
            {project.angle}
          </p>


          <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-hairline pt-6">
            {project.stack.map((tech) => (
              <li key={tech} className="text-mono-sm text-text-muted">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  if (!projects.length) return null;

  return (
    <section id="work" className="relative section-y overflow-hidden">
      {/*
        The decorative radial ground that used to sit here is gone.

        It was a --bg-raised ellipse at 120% height inside a section with
        overflow-hidden, so the gradient was still bright where the section's
        box clipped it -- a hard, full-width horizontal line at the boundary.
        That was the visible seam between sections, and every section carrying
        one produced another. Lighting is now a single fixed layer in the root
        layout, so there is nothing left to clip.
      */}
      <div className="shell [perspective:var(--depth)]">
        <h2 className="text-h2 max-w-[18ch] overflow-hidden pb-[0.08em] font-medium">
          <span data-head className="block">
            Things I have built
          </span>
        </h2>

        <div data-reveal-group className="mt-14 flex flex-col gap-6">
          {projects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
