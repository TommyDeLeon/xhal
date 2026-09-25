import type { Shot as ShotData } from "@/content/projects";

/** A real product capture in AVIF, WebP and JPEG at two widths. */
export function Picture({
  shot,
  sizes,
  priority = false,
  className,
  decorative = false,
}: {
  shot: ShotData;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Repeats of an image already described elsewhere on the page. */
  decorative?: boolean;
}) {
  const half = Math.round(shot.width / 2);
  const set = (ext: string) => `${shot.src}-${half}.${ext} ${half}w, ${shot.src}-${shot.width}.${ext} ${shot.width}w`;
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${shot.src}-${shot.width}.jpg`}
        srcSet={set("jpg")}
        sizes={sizes}
        alt={decorative ? "" : shot.alt}
        width={shot.width}
        height={shot.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
