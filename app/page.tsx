import { site } from "@/content/site";
import Link from "next/link";
import { projects } from "@/content/projects";
import { Film } from "@/components/film";
import { Monogram } from "@/components/monogram";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader home />
      <main id="main">
        <section className="wrap masthead" aria-labelledby="masthead-name">
          <h1 id="masthead-name" className="masthead__name">Tommy De Leon</h1>
          <hr className="masthead__rule" />
          <div className="intro">
            <p className="intro__line">{site.line}</p>
            <div className="intro__side">
              <p className="intro__text">{site.intro}</p>
              <a className="button" href="#work">
                Explore my work
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 3v17m-7-7 7 7 7-7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section id="work" className="wrap work" aria-labelledby="work-title">
          <h2 id="work-title" className="visually-hidden">Selected work</h2>
          {projects.map((project, i) => (
            <article
              key={project.slug}
              id={project.slug}
              className="feature"
              aria-labelledby={`${project.slug}-title`}
            >
              <h3 id={`${project.slug}-title`} className="feature__title">{project.name}</h3>
              <p className="dropcap">{project.purpose}</p>
              <dl className="meta">
                <div><dt>My part</dt><dd>{project.credit}</dd></div>
                <div><dt>Status</dt><dd>{project.status}</dd></div>
              </dl>
              <Film
                film={project.film}
                name={project.name}
                priority={i === 0}
                failureHint="The project story describes what it shows."
              />
              <Link className="more-link" href={`/work/${project.slug}/`}>
                Read the {project.name} story
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 12h17m-7-7 7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </section>

        <section id="about" className="wrap about" aria-labelledby="about-title">
          <h2 id="about-title" className="section-title">About</h2>
          <div className="about__grid">
            <figure className="about__portrait">
              <picture>
                <source type="image/avif" srcSet={`${site.portrait.src}.avif`} />
                <source type="image/webp" srcSet={`${site.portrait.src}.webp`} />
                <img
                  src={`${site.portrait.src}.jpg`}
                  alt={site.portrait.alt}
                  width={site.portrait.width}
                  height={site.portrait.height}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
            <div className="about__text">
              <p>
                I&apos;m a software developer and an Electronics Engineering student. I like the small
                frustrations that interrupt everyday work: I turn them into software, test the parts
                that matter, and keep improving what people actually use.
              </p>
              <p>
                Alongside building, I&apos;m learning networks and security, where my engineering studies
                and my software meet.
              </p>
              <p>
                I&apos;m open to junior software and web roles, and to freelance work: web apps and
                dashboards, internal tools, websites and desktop utilities.
              </p>
              <a className="button button--quiet" href={site.resumeUrl}>
                View my résumé<span className="visually-hidden"> (PDF)</span>
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="wrap contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="section-title">Contact</h2>
          <p className="contact__line">
            Have a role, a project or a problem worth solving? Email me and I&apos;ll reply personally.
          </p>
          <a className="contact__email" href={`mailto:${site.email}`}>{site.email}</a>
          <ul className="contact__links">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.label}<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <Monogram className="contact__mark" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
