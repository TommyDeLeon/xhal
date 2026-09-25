import type { Still as StillData } from "@/content/projects";

/** A real poster for a project whose film is not finished: no play control, no film claims. */
export function Still({ still, priority = false }: { still: StillData; priority?: boolean }) {
  return (
    <figure className="film">
      <div className="film__frame" data-orientation="landscape">
        <picture>
          <source type="image/avif" srcSet={`${still.poster}.avif`} />
          <source type="image/webp" srcSet={`${still.poster}.webp`} />
          <img
            className="film__poster"
            src={`${still.poster}.jpg`}
            alt={still.alt}
            width={1280}
            height={720}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        </picture>
      </div>
      <figcaption className="film__note">{still.note}</figcaption>
    </figure>
  );
}
