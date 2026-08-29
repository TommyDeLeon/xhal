import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";

/**
 * Full-bleed hero.
 *
 * The composition is the reference's: one lit ground, display type set into it,
 * and micro-chrome around the edges. What changed from the previous asymmetric
 * split is that the type no longer shares the viewport with anything -- it owns
 * it, and the supporting copy sits below rather than beside.
 *
 * The two canvases are rendered here but never drawn here. They are marked with
 * data-graph and left empty; components/motion-layer.tsx finds them and does all
 * the painting, so this stays a server component and every moving thing on the
 * page is still owned by one island. A visitor with JS off gets the lit ground
 * and the type, which is the whole message -- the graph is decoration.
 */
export default function Hero() {
  // Split for the per-line mask reveal. The accessible sentence is rendered
  // separately below, because three masked spans would otherwise be announced
  // as one run-on string.
  const lines = ["Networks, security,", "and the software", "between."];

  return (
    <section
      data-hero
      /* The shared camera. Every 3D parent on the page reads --depth, so the
         hero and the sections after it are shot on one lens. */
      style={{ perspective: "var(--depth)" }}
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-24 pb-16 [@media(max-height:640px)]:min-h-0 [@media(max-height:640px)]:py-24"
    >
      {/*
        Far half of the module graph. Sits behind the headline so the type reads
        as standing inside the space rather than pasted onto it.
      */}
      <canvas
        aria-hidden
        data-graph="back"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      />

      <div data-hero-depth className="shell relative z-[2] w-full [transform-style:preserve-3d]">
        <h1 className="text-display font-semibold">
          <span className="sr-only">
            Networks, security, and the software between.
          </span>

          <span aria-hidden>
            {lines.map((line) => (
              // overflow-hidden is the mask the line rises out of. The padding
              // keeps descenders from being clipped by their own mask.
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span data-hero-line className="block">
                  {line === "and the software" ? (
                    <>
                      and the{" "}
                      {/*
                        The one accented word on the page.

                        The headline is Tommy's own and leads with networks,
                        which is what he wants said -- but software is what he
                        wants emphasised. Colour resolves that without rewriting
                        the sentence: the claim is unchanged, the weight moves.
                      */}
                      <span className="text-accent">software</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </span>
        </h1>
      </div>

      {/*
        Near half of the graph. Drawn OVER the headline so a few nodes cross in
        front of the letterforms. That occlusion is what separates "type on an
        image" from "type in a space", and it is the single idea worth taking
        from the reference.
      */}
      <canvas
        aria-hidden
        data-graph="front"
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      />

      <div className="shell relative z-[4] mt-10 flex w-full flex-col gap-7 md:mt-14 md:flex-row md:items-end md:justify-between md:gap-10">
        <p data-hero-sub className="text-body-lg max-w-[44ch] text-text-muted">
          {/*
            positioning ONLY.

            The old hero showed site.status as a label above the headline and
            site.positioning below it. Moving the status into this sentence
            printed it twice, because positioning already opens with the same
            clause -- "Electronics Engineering student. I build working software
            while I train toward...". One field already says the whole thing, so
            it is the one field rendered.
          */}
          {site.positioning}
        </p>

        <div data-hero-cta className="shrink-0">
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px active:translate-y-0"
          >
            Start a project
            <ArrowRight
              size={16}
              weight="bold"
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

    </section>
  );
}
