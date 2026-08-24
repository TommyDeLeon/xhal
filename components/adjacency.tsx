/**
 * The thesis. One sentence, held in the viewport while a rule draws between the
 * two halves of the claim. Both halves are true today: the network side is
 * training, the software side already ships.
 */
export default function Adjacency() {
  return (
    <section
      data-pin
      id="approach"
      className="flex min-h-[100dvh] items-center bg-bg-sunken"
    >
      <div className="shell">
        <p className="text-h2 max-w-[20ch] font-medium">
          I am learning to defend networks
          <span
            data-pin-rule
            aria-hidden
            className="my-6 block h-px w-full max-w-[14rem] origin-left bg-accent md:my-8"
          />
          <span data-pin-tail className="block text-text-muted">
            and I already build what runs on them.
          </span>
        </p>

        <p className="text-body-lg mt-10 max-w-[54ch] text-text-muted">
          Those point at the same question. Reading a packet capture and writing
          the service that produced it both come down to one thing: what does
          this system do when someone hands it something it did not expect.
          Studying one keeps teaching me where the other is weak.
        </p>
      </div>
    </section>
  );
}