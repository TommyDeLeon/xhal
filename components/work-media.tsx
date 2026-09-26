import type { Project, Shot } from "@/content/projects";
import type { ProjectMedia } from "@/lib/media";
import { Film } from "./film";
import { Picture } from "./shot";
import { PaymentFlow } from "./payment-flow";

const isPhone = (shot: Shot) => shot.height > shot.width;

function Phones({ shots, priority = false }: { shots: Shot[]; priority?: boolean }) {
  return (
    <div className="phones" data-count={Math.min(shots.length, 3)}>
      {shots.slice(0, 3).map((shot) => (
        <div className="phones__device" key={shot.src}>
          <Picture shot={shot} sizes="(min-width: 1024px) 12rem, 28vw" priority={priority} />
        </div>
      ))}
    </div>
  );
}

function phoneCaption(phones: Shot[]) {
  return phones.length === 1
    ? phones[0].caption
    : `${phones.map((shot) => shot.caption.split(".")[0]).join(", ")}. Demo data on a local test copy.`;
}

/**
 * The lead media for a project.
 *
 * - Film published: the player.
 * - Film on the way: a 16:9 slot where the player will go, filled with the
 *   project's real captures (or, for Tenant101 without captures, a labelled
 *   illustration) and marked "Film coming soon". No play control.
 * - No film planned: the lead capture.
 */
export function WorkMedia({
  project,
  media,
  sizes,
  priority = false,
  brief = false,
}: {
  project: Project;
  media: ProjectMedia;
  sizes: string;
  priority?: boolean;
  /** On the home page: no caption under the film; its project page carries the note. */
  brief?: boolean;
}) {
  if (media.film) {
    return (
      <Film
        film={media.film}
        name={project.name}
        priority={priority}
        showNote={!brief}
        failureHint="The project story describes what it shows."
      />
    );
  }

  const phones = media.shots.filter(isPhone);
  const lead = media.shots.find((shot) => !isPhone(shot));

  if (project.film) {
    let inside: React.ReactNode;
    let caption: string;
    if (phones.length > 0) {
      inside = <Phones shots={phones} priority={priority} />;
      caption = phoneCaption(phones);
    } else if (lead) {
      inside = <Picture className="media__image" shot={lead} sizes={sizes} priority={priority} />;
      caption = lead.caption;
    } else {
      inside = <PaymentFlow />;
      caption = "An illustration of the payment flow, using the demo amounts from the upcoming film. Not a screenshot.";
    }
    return (
      <figure className="media">
        <div className="media__frame media__frame--slot" data-project={project.slug}>
          {inside}
          <span className="media__soon">Film coming soon</span>
        </div>
        <figcaption className="media-note">{caption}</figcaption>
      </figure>
    );
  }

  if (!lead) return null;
  // Mimir opens beside the work, so its panel slides in beside the notebook.
  const split = project.slug === "mimir";
  return (
    <figure className="media">
      <div className={`media__frame${split ? " media__frame--split" : ""}`} data-project={project.slug}>
        <Picture className="media__image" shot={lead} sizes={sizes} priority={priority} />
        {split && <Picture className="media__image media__panel" shot={lead} sizes={sizes} priority={priority} decorative />}
      </div>
      <figcaption className="media-note">{lead.caption}</figcaption>
    </figure>
  );
}

/** Captures not already shown as the lead, for the project page. */
export function Gallery({ project, media }: { project: Project; media: ProjectMedia }) {
  const phones = media.shots.filter(isPhone);
  const wide = media.shots.filter((shot) => !isPhone(shot));
  // The lead slot shows phones first, else the first wide capture, unless a film took it.
  const leadUsedPhones = !media.film && Boolean(project.film) && phones.length > 0;
  const leadUsedWide = !media.film && !leadUsedPhones && wide.length > 0;
  const restWide = leadUsedWide ? wide.slice(1) : wide;
  const restPhones = leadUsedPhones ? [] : phones;
  if (restWide.length === 0 && restPhones.length === 0) return null;
  return (
    <div className="gallery" data-reveal>
      {restPhones.length > 0 && (
        <figure className="media gallery__phones">
          <div className="media__frame media__frame--slot"><Phones shots={restPhones} /></div>
          <figcaption className="media-note">{phoneCaption(restPhones)}</figcaption>
        </figure>
      )}
      {restWide.map((shot) => (
        <figure className="media" key={shot.src}>
          <div className="media__frame">
            <Picture className="media__image" shot={shot} sizes="(min-width: 768px) 45vw, 100vw" />
          </div>
          <figcaption className="media-note">{shot.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** A small, decorative version of each project's lead image for the opening collection. */
export function HeroCard({ project, media }: { project: Project; media: ProjectMedia }) {
  const phone = media.shots.find(isPhone);
  const wide = media.shots.find((shot) => !isPhone(shot));
  if (phone) {
    return <Picture className="hero-card__image" shot={phone} sizes="10rem" priority decorative />;
  }
  if (wide) {
    return <Picture className="hero-card__image" shot={wide} sizes="(min-width: 1024px) 26rem, 60vw" priority decorative />;
  }
  return project.slug === "tenant101" ? <PaymentFlow compact /> : null;
}
