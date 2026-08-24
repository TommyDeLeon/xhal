import { ArrowSquareOut, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { projects, type Project } from "@/content/projects";

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
        <div className="mb-12 [perspective:1600px]">
          <figure
            data-shot
            className="overflow-hidden rounded-panel border border-hairline shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]"
          >
            <picture>
              <source
                srcSet={project.media[0].src.replace(/\.jpg$/, ".avif")}
                type="image/avif"
              />
              <source
                srcSet={project.media[0].src.replace(/\.jpg$/, ".webp")}
                type="image/webp"
              />
              <img
                src={project.media[0].src}
                alt={project.media[0].alt}
                width={project.media[0].width}
                height={project.media[0].height}
                loading="lazy"
                decoding="async"
                className="block w-full"
              />
            </picture>
          </figure>

          {project.media.length > 1 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.media.slice(1).map((shot) => (
                <figure
                  key={shot.src}
                  data-shot
                  className="overflow-hidden rounded-panel border border-hairline"
                >
                  <picture>
                    <source
                      srcSet={shot.src.replace(/\.jpg$/, ".avif")}
                      type="image/avif"
                    />
                    <source
                      srcSet={shot.src.replace(/\.jpg$/, ".webp")}
                      type="image/webp"
                    />
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      loading="lazy"
                      decoding="async"
                      className="block w-full"
                    />
                  </picture>
                </figure>
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

            {/* Renders only when a live URL exists. */}
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
    <section id="work" className="section-y bg-bg-sunken">
      <div className="shell [perspective:1400px]">
        <h2 className="text-h2 max-w-[18ch] font-medium">
          Things I have built
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
