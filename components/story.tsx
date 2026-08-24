import { hasStory, story } from "@/content/story";

/**
 * Renders nothing until real content exists. Sticky heading on the left, prose
 * on the right, so the section reads as a column of writing rather than a card.
 */
export default function Story() {
  if (!hasStory) return null;

  return (
    <section id="story" className="section-y">
      <div
        data-reveal-group
        className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16"
      >
        <div className="lg:col-span-4">
          <h2 className="text-h2 font-medium lg:sticky lg:top-28">
            {story.heading}
          </h2>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {story.paragraphs.map((para) => (
            <p
              key={para.slice(0, 40)}
              data-reveal
              className="mb-6 max-w-[65ch] leading-[1.7] text-text-muted last:mb-0"
            >
              {para}
            </p>
          ))}

          {story.aside ? (
            <p
              data-reveal
              className="mt-10 border-l border-accent pl-6 text-h3 text-text"
            >
              {story.aside}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
