/**
 * The thesis. Pinned briefly while the claim assembles itself in depth.
 *
 * The pin distance is deliberately short. A long pin with little happening
 * inside it reads as the page being stuck rather than as emphasis.
 *
 * This is the one section that already worked -- one idea, one viewport, held.
 * The rebuild only turns it up: the claim moves from text-h2 to display scale,
 * and it gets the same lit ground and grain as the hero, so the two read as
 * consecutive shots on one set rather than as a title card followed by a
 * document.
 */
export default function Adjacency() {
  return (
    <section
      data-pin
      id="approach"
      className="relative flex min-h-[100dvh] items-center overflow-hidden [perspective:var(--depth)]"
    >
      <div className="shell relative z-[2] [transform-style:preserve-3d]">
        <p className="text-display max-w-[18ch] font-semibold">
          <span data-pin-lead className="block">
            I am learning to defend networks
          </span>

          <span
            data-pin-rule
            aria-hidden
            className="my-8 block h-px w-full max-w-[20rem] origin-left bg-accent md:my-12"
          />

          <span data-pin-tail className="block text-text-muted">
            and I already build what runs on them.
          </span>
        </p>

        <p
          data-pin-body
          className="text-body-lg mt-14 max-w-[54ch] text-text-muted"
        >
          Those point at the same question. Reading a packet capture and writing
          the service that produced it both come down to one thing: what does
          this system do when someone hands it something it did not expect.
          Studying one keeps teaching me where the other is weak.
        </p>
      </div>

    </section>
  );
}
