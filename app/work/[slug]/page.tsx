import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, findProject } from "@/content/projects";
import { Film } from "@/components/film";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const url = `/work/${slug}/`;
  return { title: project.title, description: project.description, alternates: { canonical: url }, openGraph: { url, title: project.title, description: project.description, images: ["/og.png"] } };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return <><SiteHeader/><main id="main"><header className="wrap project-head"><h1>{project.name}</h1><hr className="masthead__rule"/></header><div className="wrap project-lead"><p className="dropcap">{project.purpose}</p><dl className="meta"><div><dt>My part</dt><dd>{project.credit}</dd></div><div><dt>Status</dt><dd>{project.status}</dd></div>{project.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></div><section className="wrap project-film" aria-label={`${project.name} film`}><Film film={project.film} name={project.name} priority failureHint="The summary below describes what it shows."/><p className="summary"><strong>What the film shows:</strong> {project.film.summary}</p>{project.film.credits && <p className="film__note">{project.film.credits}</p>}</section><div className="wrap story">{project.story.map((section, i) => <section key={section.heading} aria-labelledby={`story-${i}`}><h2 id={`story-${i}`}>{section.heading}</h2><div>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}{project.links.length > 0 && <section aria-labelledby="links-title"><h2 id="links-title">Links</h2><div><ul className="links">{project.links.map((link) => <li key={link.href}><a className="button button--quiet" href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span className="visually-hidden"> (opens in a new tab)</span></a></li>)}</ul></div></section>}</div>{project.notes.length > 0 && <section className="wrap notes" aria-labelledby="notes-title"><h2 id="notes-title" className="section-title">Engineering notes</h2><div className="story">{project.notes.map((section, i) => <section key={section.heading} aria-labelledby={`note-${i}`}><h3 id={`note-${i}`}>{section.heading}</h3><div>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}</div></section>}<nav className="wrap pager" aria-label="More projects"><a href={`/work/${previous.slug}/`}><span>Previous project</span><strong>{previous.name}</strong></a><a href={`/work/${next.slug}/`}><span>Next project</span><strong>{next.name}</strong></a></nav></main><SiteFooter/></>;
}
