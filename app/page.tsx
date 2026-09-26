import { site } from "@/content/site";
import Link from "next/link";
import { projects } from "@/content/projects";
import { mediaFor } from "@/lib/media";
import { WorkMedia, HeroCard } from "@/components/work-media";
import { Monogram } from "@/components/monogram";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 12h17m-7-7 7 7-7 7" />
  </svg>
);

export default function Home() {
  const work = projects.map((project) => ({ project, media: mediaFor(project) }));
  return (
    <>
      <SiteHeader home />
      <main id="main">
        <section className="wrap hero" aria-labelledby="hero-name">
          <div className="hero__copy">
            <p className="eyebrow hero__role">{site.role}</p>
            <h1 id="hero-name" className="hero__name">
              <span className="hero__word"><span>Tommy</span></span>{" "}
              <span className="hero__word"><span>De Leon</span></span>
            </h1>
            <p className="hero__line">{site.line}</p>
            <p className="hero__intro">{site.intro}</p>
            <a className="button" href="#work">
              Explore my work
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 3v17m-7-7 7 7 7-7" />
              </svg>
            </a>
          </div>
          {/* The three projects, dealt onto the page. Decorative: each is described in Selected work. */}
          <div className="hero__stage" data-depth aria-hidden="true">
            {work.map(({ project, media }, i) => (
              <div key={project.slug} className={`hero-card hero-card--${project.slug}`} style={{ "--i": i } as React.CSSProperties}>
                <div className="hero-card__inner">
                  <HeroCard project={project} media={media} />
                  <span className="hero-card__tag">{project.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="work" className="wrap work" aria-labelledby="work-title">
          <h2 id="work-title" className="section-title section-head">Selected work</h2>
          <div className="collection">
            {work.map(({ project, media }, i) => (
              <article
                key={project.slug}
                id={project.slug}
                className={`feature feature--${i + 1}`}
                aria-labelledby={`${project.slug}-title`}
                data-reveal
              >
                <div className="feature__media">
                  <WorkMedia
                    project={project}
                    media={media}
                    priority={i === 0}
                    brief
                    sizes={i === 0 ? "(min-width: 1024px) 56vw, 100vw" : "(min-width: 1024px) 46vw, (min-width: 768px) 50vw, 100vw"}
                  />
                </div>
                <div className="feature__body">
                  <p className="eyebrow"><span className="feature__index">0{i + 1}</span> {project.kind}</p>
                  <h3 id={`${project.slug}-title`} className="feature__title">{project.name}</h3>
                  <p className="feature__purpose">{project.purpose}</p>
                  <p className="feature__meta">{project.creditShort} · {project.statusShort}</p>
                  <Link className="more-link" href={`/work/${project.slug}/`}>
                    Read the {project.name} story {arrow}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="wrap about" aria-labelledby="about-title" data-reveal>
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
            <h2 id="about-title" className="section-title">About</h2>
            <p className="about__lead">
              Software developer and Electronics Engineering student, also learning networks and
              security. I build tools that take the friction out of everyday work.
            </p>
            <dl className="offer">
              <div>
                <dt>Hiring</dt>
                <dd>Open to junior software and web roles.</dd>
              </div>
              <div>
                <dt>Freelance</dt>
                <dd>Web apps, dashboards, internal tools and websites.</dd>
              </div>
            </dl>
            <a className="button button--quiet" href={site.resumeUrl}>
              View my résumé<span className="visually-hidden"> (PDF)</span>
            </a>
          </div>
        </section>

        <section id="contact" className="wrap contact" aria-labelledby="contact-title" data-reveal>
          <h2 id="contact-title" className="section-title">Contact</h2>
          <p className="contact__line">
            A role, a project, or a problem worth solving? I reply personally.
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
