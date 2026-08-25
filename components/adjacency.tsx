/**
 * The thesis. Pinned briefly while the claim assembles itself in depth.
 *
 * The pin distance is deliberately short. A long pin with little happening
 * inside it reads as the page being stuck rather than as emphasis.
 */
export default function Adjacency() {
  return (
    <section
      data-pin
      id="approach"
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-bg-sunken [perspective:var(--depth)]"
    >
      {/* Depth ground, pushed back in Z so it drifts slower than the type. */}
      <div
        aria-hidden
        data-pin-glow
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--bg-raised)_0%,transparent_65%)] opacity-70"
      />

      <div className="shell [transform-style:preserve-3d]">
        <p className="text-h2 max-w-[22ch] font-medium">
          <span data-pin-lead className="block">
            I am learning to defend networks
          </span>

          <span
            data-pin-rule
            aria-hidden
            className="my-6 block h-px w-full max-w-[16rem] origin-left bg-accent md:my-8"
          />

          <span data-pin-tail className="block text-text-muted">
            and I already build what runs on them.
          </span>
        </p>

        <p
          data-pin-body
          className="text-body-lg mt-10 max-w-[54ch] text-text-muted"
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