import { skillGroups } from "@/content/skills";

const surfaceClass = {
  raised: "bg-bg-raised border border-hairline",
  hairline: "border border-hairline",
  textured:
    "border border-hairline bg-[repeating-linear-gradient(180deg,transparent_0_3px,rgba(128,128,128,0.05)_3px_4px)]",
} as const;

const statusLabel = {
  building: "Building with",
  learning: "Training on",
} as const;

/**
 * Capability, split by what is actually true. The status on each card is the
 * point of the section: a page that blurs "can do" and "am learning" is not
 * worth reading, and the split is more convincing than the blur would be.
 */
export default function Capability() {
  return (
    <section id="capability" className="section-y">
      <div className="shell">
        <h2 className="text-h2 max-w-[16ch] font-medium">
          Where I actually am
        </h2>
        <p className="text-body-lg mt-6 max-w-[58ch] text-text-muted">
          Two of these I can be asked about in an interview today. Two I am still
          working through. Each card says which, because I would rather you know
          up front than find out halfway through a conversation.
        </p>

        <div
          data-reveal-group
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12"
        >
          {skillGroups.map((group) => (
            <article
              key={group.id}
              data-reveal
              className={`${group.span} ${surfaceClass[group.surface]} rounded-panel p-6 md:p-8`}
            >
              <p
                className={`text-mono-sm uppercase ${
                  group.status === "building" ? "text-accent" : "text-text-muted"
                }`}
              >
                {statusLabel[group.status]}
              </p>
              <h3 className="text-h3 mt-2 font-medium">{group.title}</h3>
              <p className="mt-3 max-w-[46ch] text-sm leading-[1.7] text-text-muted">
                {group.blurb}
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-mono-sm text-text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}