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
  //
  // The headline leads with software because that is what the evidence on
  // this page supports today -- a shipped, documented project -- and the deck
  // under it carries the networks-and-security direction as fact rather than
  // as the claim. "Practical" and "thoughtful" are the two adjectives the case
  // study earns: working code, and the record of what it was verified to do.
  const lines = ["Practical software.", "Thoughtful", "execution."];

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
        There is deliberately no label above the headline.

        There was one — a mono masthead line reading the subject on the left and
        the status on the right, with a rule under it. It was the classic
        eyebrow, and an eyebrow is an admission that the heading underneath is
        not trusted to introduce itself. The heading is nine words of plain
        English naming exactly what he does; it needs no announcement, and
        removing the announcement is what lets it open the page cold.

        The status did not vanish with it. It is the first clause of
        site.positioning in the deck below, which is where it was already being
        read from.
      */}
      {/*
        z-[4], above the front canvas, not z-[2] below it.

        The front layer used to paint over the headline on purpose, so a few
        nodes crossed the letterforms and the type read as standing in the
        space. At 9rem in Bodoni it did not read as depth: an edge landing on a
        hairline serif, or along the descender of the "y", looks like a scratch
        on the type, and it was reported twice as a rendering fault. The graph
        still passes in front of everything else in the hero, which is where the
        parallax was doing real work; the display type is not a surface to draw
        on.
      */}
      <div
        data-hero-depth
        className="shell relative z-[4] mt-10 w-full [transform-style:preserve-3d] md:mt-14"
      >
        <h1 className="text-display">
          <span className="sr-only">
            Practical software. Thoughtful execution.
          </span>

          <span aria-hidden>
            {lines.map((line) => (
              // overflow-hidden is the mask the line rises out of. The padding
              // keeps descenders from being clipped by their own mask.
              // 0.2em, not 0.08em. Measured: this Didone's descenders reach
              // 0.268em below the baseline, so at 127px the "y" of "security,"
              // and the comma after it overflowed a 0.08em pad by 12.8px and
              // the mask sheared their tails off flat. 0.2em clears the deepest
              // ink with room left, and scales with the clamped display size.
              <span key={line} className="block overflow-hidden pb-[0.2em]">
                <span data-hero-line className="block">
                  {line === "Practical software." ? (
                    <>
                      Practical{" "}
                      {/*
                        The one accented word on the page. Software is the
                        thing being sold; the colour puts the weight there
                        without a second sentence.
                      */}
                      <span className="text-accent">software.</span>
                    </>
                  ) : line === "execution." ? (
                    /*
                      The last line goes italic, and it is the one real
                      typographic risk on the page.

                      A Didone's italic is not a slanted roman — it is a
                      separately drawn, far more calligraphic alphabet, and
                      setting one line of a three-line headline in it turns a
                      statement into a cadence. The sentence lands on the word
                      that carries its meaning: execution is the claim the case
                      study backs, and the italic is what makes you hear the
                      emphasis rather than just read it.

                      Only the final line. Two italic lines would be a style;
                      one is a decision.
                    */
                    <span className="italic">execution.</span>
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

            {/*
              Two actions. The filled button is the one the site exists for --
              hiring and client enquiries -- and the contact section splits
              those two. The work is a text link beneath it, and it is also the
              very next thing on the page, so it loses nothing by being quiet
              here. A resume link appears only when site.resumeUrl is set;
              there is no approved one yet.
            */}
            <div
              data-hero-cta
              className="flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-3 md:flex-col md:items-start md:gap-y-4"
            >
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px active:translate-y-0"
              >
                Hire me or start a project
                <ArrowRight
                  size={16}
                  weight="bold"
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="#work"
                className="inline-flex items-center gap-2 text-sm text-text underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                See the work
              </Link>
              {site.resumeUrl ? (
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 text-sm text-text underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  Resume (PDF)
                </a>
              ) : null}
            </div>

            {/*
              Facts, not claims. Every line is read off content/site.ts rather
              than written for effect: the availability flag drives the first,
              the socials array the rest. An unset field renders nothing, which
              is the rule the whole site follows.

              Set in the body face, NOT in mono. Mono earns its place on code, on
              data, and on measurements — a runtime, a budget, a ratio. "Open to
              freelance" is a sentence and a social handle is a name, and
              setting either in a typewriter face is monospace worn as a costume
              for technical credibility. It is one of the most reliable tells
              that a page was assembled from the idea of a developer portfolio
              rather than composed.
            */}
            <ul className="flex flex-col gap-2 text-sm md:col-span-3 md:items-end md:text-right">
              {site.availableForWork ? (
                <li className="max-w-[24ch] text-text-faint md:max-w-none">
                  Open to junior roles and freelance
                </li>
              ) : null}
              {site.socials.map((social) => (
                <li key={social.label} className="text-text-faint">
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
