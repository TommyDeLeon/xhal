import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, findProject, type StoryKey } from "@/content/projects";
import { mediaFor } from "@/lib/media";
import { WorkMedia, Gallery } from "@/components/work-media";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const url = `/work/${slug}/`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: project.title,
      description: project.description,
      images: ["/og.png"],
    },
  };
}

function Paragraphs({ body }: { body: string[] }) {
  return <>{body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</>;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const media = mediaFor(project);
  const section = (key: StoryKey) => project.story.find((item) => item.key === key);
  const part = section("part");
  const limits = section("limits");
  const story = (["problem", "does", "decision"] as const).map(section).filter((item) => item !== undefined);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <header className="wrap phead">
          <p className="eyebrow"><span className="feature__index">0{index + 1}</span> {project.kind}</p>
          <h1>{project.name}</h1>
          <p className="phead__purpose">{project.purpose}</p>
        </header>

        <section className="wrap pmedia" aria-label={`${project.name} media`}>
          <WorkMedia project={project} media={media} priority sizes="(min-width: 1280px) 1180px, 100vw" />
          {media.film && (
            <div className="pmedia__text">
              <p><strong>What the film shows:</strong> {media.film.summary}</p>
              {media.film.credits && <p className="media-note">{media.film.credits}</p>}
            </div>
          )}
        </section>

        <div className="wrap pbody">
          {/* Contribution and limits come first: what I did, and what it can't do yet. */}
          <aside className="glance" aria-label="At a glance" data-reveal>
            <dl>
              <div>
                <dt>My part</dt>
                <dd>{project.credit}</dd>
                {part && <dd className="glance__more">{part.body.join(" ")}</dd>}
              </div>
              <div>
                <dt>Status</dt>
                <dd>{project.status}</dd>
              </div>
              {limits && (
                <div>
                  <dt>{limits.heading}</dt>
                  {limits.body.map((paragraph) => <dd key={paragraph}>{paragraph}</dd>)}
                </div>
              )}
            </dl>
            <dl className="glance__facts">
              {project.facts.map((fact) => (
                <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
              ))}
            </dl>
            {project.links.length > 0 && (
              <ul className="links">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a className="button button--quiet" href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}<span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div className="story">
            {story.map((item, i) => (
              <section key={item.heading} aria-labelledby={`story-${i}`} data-reveal>
                <h2 id={`story-${i}`}>{item.heading}</h2>
                <Paragraphs body={item.body} />
              </section>
            ))}
            {project.notes.length > 0 && (
              <details className="notes">
                <summary>
                  <span>Engineering notes</span>
                  <span className="notes__hint">{project.notes.map((note) => note.heading).join(" · ")}</span>
                </summary>
                {project.notes.map((note, i) => (
                  <section key={note.heading} aria-labelledby={`note-${i}`}>
                    <h3 id={`note-${i}`}>{note.heading}</h3>
                    <Paragraphs body={note.body} />
                  </section>
                ))}
              </details>
            )}
          </div>
        </div>

        <div className="wrap">
          <Gallery project={project} media={media} />
        </div>

        <nav className="wrap pager" aria-label="More projects">
          <Link href={`/work/${next.slug}/`}>
            <span className="eyebrow">Next project</span>
            <strong>{next.name}</strong>
            <span className="pager__purpose">{next.purpose}</span>
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
