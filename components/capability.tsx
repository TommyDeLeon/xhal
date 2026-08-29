import { skillGroups } from "@/content/skills";

const statusLabel = {
  building: "Building with",
  learning: "Training on",
} as const;

/**
 * Capability, split by what is actually true.
 *
 * This used to be four cards in a grid. Cards were the wrong container: they
 * gave "Building with" and "Training on" identical visual weight inside
 * identical boxes, which flattened the one distinction the section exists to
 * make. It now reads as a list of claims separated by hairlines, with the
 * status leading each row -- so the honest split IS the structure rather than a
 * label buried inside a tile.
 */
export default function Capability() {
  return (
    <section id="capability" className="relative section-y overflow-hidden">
      <div className="shell">
        <h2 className="text-h2 max-w-[16ch] overflow-hidden pb-[0.08em] font-medium">
          <span data-head className="block">
            Where I actually am
          </span>
        </h2>
        <p className="text-body-lg mt-8 max-w-[58ch] text-text-muted">
          Two of these I can be asked about in an interview today. Two I am still
          working through. Each row says which, because I would rather you know
          up front than find out halfway through a conversation.
        </p>

        <div
          data-reveal-group
          className="mt-20 flex flex-col border-t border-hairline"
        >
          {skillGroups.map((group) => (
            <article
              key={group.id}
              data-reveal
              className="grid grid-cols-1 gap-6 border-b border-hairline py-10 md:grid-cols-12 md:gap-10 md:py-14"
            >
              <div className="md:col-span-4">
                <p
                  className={`text-mono-sm uppercase ${
                    group.status === "building"
                      ? "text-accent"
                      : "text-text-faint"
                  }`}
                >
                  {statusLabel[group.status]}
                </p>
                <h3 className="text-h3 mt-3 max-w-[14ch] font-medium">
                  {group.title}
                </h3>
              </div>

              <div className="md:col-span-7 md:col-start-6">
                <p className="max-w-[54ch] leading-[1.7] text-text-muted">
                  {group.blurb}
                </p>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-mono-sm text-text-faint">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
