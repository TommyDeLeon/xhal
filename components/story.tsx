import { hasStory, story } from "@/content/story";
import { site } from "@/content/site";

/**
 * Renders nothing until real content exists. Sticky heading on the left, prose
 * on the right, so the section reads as a column of writing rather than a card.
 *
 * The portrait lives here now. It was in the old split hero, which the
 * full-bleed composition has no room for -- and this is the better home for it
 * anyway: a face belongs beside the paragraphs written in the first person, not
 * beside a positioning statement. It is also honest about its size here. The
 * original is 294px square, so it is framed small and deliberately rather than
 * blown up to fill a column it does not have the detail to fill.
 */
export default function Story() {
  if (!hasStory) return null;

  const portrait = site.portrait;

  return (
    <section id="story" className="section-y">
      <div
        data-reveal-group
        className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16"
      >
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            {portrait ? (
              <div data-reveal className="mb-8 max-w-[9rem]">
                <picture>
                  <source srcSet="/images/tommy.avif" type="image/avif" />
                  <source srcSet="/images/tommy.webp" type="image/webp" />
                  {/* Pre-compressed at build time: a static export has no image
                      optimizer at request time. */}
                  <img
                    src={portrait.src}
                    alt={portrait.alt}
                    width={portrait.width}
                    height={portrait.height}
                    loading="lazy"
                    decoding="async"
                    className="block w-full rounded-[14px] border border-hairline object-cover"
                  />
                </picture>
              </div>
            ) : null}

            <h2 className="text-h2 font-medium">{story.heading}</h2>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {story.paragraphs.map((para) => (
            <p
              key={para.slice(0, 40)}
              data-reveal
              className="mb-6 max-w-[65ch] leading-[1.75] text-text-muted last:mb-0"
            >
              {para}
            </p>
          ))}

          {story.aside ? (
            <p
              data-reveal
              className="text-h3 mt-14 border-l border-accent pl-6 font-medium text-text"
            >
              {story.aside}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
