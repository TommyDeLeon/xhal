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

      {/*
        The masthead line.

        A magazine tells you what you are holding before it tells you anything
        else, and it does it in small type at the top of the page with a rule
        under it. Left is the subject; right is the edition. Neither is
        decoration — both are real, and both come from content/site.ts.
      */}
      <div className="shell relative z-[2] w-full">
        <div className="flex items-baseline justify-between gap-6 border-b border-hairline pb-4">
          <p className="text-mono-sm text-text-faint">
            Networks · Security · Software
          </p>
          {/*
            Dropped on a phone, where 375px forces both halves of the masthead
            to wrap to three lines each and the line stops reading as a masthead
            at all. The subject stays; the edition marker is the half that can
            go, because site.status also opens the standfirst directly below.
          */}
          <p className="text-mono-sm hidden text-text-faint sm:block">
            {site.status}
          </p>
        </div>
      </div>

      <div
        data-hero-depth
        className="shell relative z-[2] mt-10 w-full [transform-style:preserve-3d] md:mt-14"
      >
        <h1 className="text-display">
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
                  ) : line === "between." ? (
                    /*
                      The last line goes italic, and it is the one real
                      typographic risk on the page.

                      A Didone's italic is not a slanted roman — it is a
                      separately drawn, far more calligraphic alphabet, and
                      setting one line of a three-line headline in it turns a
                      statement into a cadence. The sentence lands on the word
                      that carries its meaning: the work is what sits BETWEEN
                      the two disciplines, and the italic is what makes you hear
                      the emphasis rather than just read it.

                      Only the final line. Two italic lines would be a style;
                      one is a decision.
                    */
                    <span className="italic">between.</span>
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

      {/*
        The deck.

        A rule closes the headline, and under it the argument splits into three
        registers that a magazine would recognise: the standfirst in reading
        type, the action, and a column of facts set in mono because they are
        scanned rather than read. Three different jobs, three different voices,
        one baseline.

        The rule is doing real work — it is the boundary between the statement
        and the evidence for it — which is the only reason it is allowed to
        exist. A rule that separates nothing is noise wearing the costume of
        structure.
      */}
      <div className="shell relative z-[4] mt-10 w-full md:mt-16">
        <div className="border-t border-hairline pt-8 md:pt-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
            <p
              data-hero-sub
              /*
                The measure cap applies on ONE column only, and that is the fix
                for a real collision rather than a style preference.

                46ch is roughly 400px at this size. In the twelve-column grid
                the standfirst occupies six tracks, which at the md breakpoint
                is about 370px — narrower than the cap. A grid item does not
                clip its own overflow, so the paragraph simply ran past its
                track and set its last lines underneath the call to action in
                the next column.

                Above md the column already governs the measure, so the cap is
                released. It stays below md, where there is no grid and nothing
                else to stop a line running the full width of the page.
              */
              className="text-body-lg max-w-[46ch] text-text-muted md:col-span-6 md:max-w-none"
            >
              {/*
                positioning ONLY.

                The old hero showed site.status as a label above the headline
                and site.positioning below it. Moving the status into this
                sentence printed it twice, because positioning already opens
                with the same clause. One field already says the whole thing, so
                it is the one field rendered -- and the status now sits in the
                masthead line above, where an edition marker belongs.
              */}
              {site.positioning}
            </p>

            <div
              data-hero-cta
              className="flex items-start md:col-span-3 md:justify-start"
            >
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

            {/*
              Facts, not claims. Every line here is read off content/site.ts
              rather than written for effect: the availability flag drives the
              first, and the socials array drives the rest. If a field is unset
              its line does not render, which is the same rule the whole site
              follows -- an unanswered field is invisible rather than wrong.
            */}
            <ul className="flex flex-col gap-2 md:col-span-3 md:items-end md:text-right">
              {site.availableForWork ? (
                <li className="text-mono-sm text-text-faint">
                  Open to freelance
                </li>
              ) : null}
              {site.socials.map((social) => (
                <li key={social.label} className="text-mono-sm text-text-faint">
                  {social.handle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </section>
  );
}
