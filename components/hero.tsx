import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";

/**
 * Editorial hero. The portrait sits above the headline as a byline rather than
 * filling a panel: the source is 294px square, and at this display size it
 * renders around 2.6x density instead of being upscaled into softness.
 */
export default function Hero() {
  const portrait = site.portrait;

  return (
    <section
      data-hero
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16"
    >
      {/* Depth ground. Decorative, so it is hidden from assistive tech. */}
      <div
        aria-hidden
        data-parallax="1"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120%] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--bg-raised)_0%,transparent_70%)]"
      />

      <div className="shell grid w-full grid-cols-1 items-center lg:grid-cols-12">
        <div className="lg:col-span-10">
          {portrait ? (
            <div data-hero-portrait className="mb-9 flex items-center gap-4">
              {/* Pre-compressed at build time: static export has no image
                  optimizer at request time. */}
              <picture>
                <source srcSet="/images/tommy.avif" type="image/avif" />
                <source srcSet="/images/tommy.webp" type="image/webp" />
                <img
                  src={portrait.src}
                  alt={portrait.alt}
                  width={portrait.width}
                  height={portrait.height}
                  fetchPriority="high"
                  decoding="async"
                  className="h-24 w-24 rounded-full border border-hairline object-cover md:h-28 md:w-28"
                />
              </picture>

              <p className="text-mono-sm max-w-[18ch] text-text-muted">
                {site.status}
              </p>
            </div>
          ) : null}

          <h1 className="text-display font-medium">
            {/* The visual lines are split for the mask reveal, which would make
                the accessible name read as one run-on word. Screen readers get
                the clean sentence instead. */}
            <span className="sr-only">
              Networks, security, and the software between.
            </span>
            <span aria-hidden>
              {["Networks, security,", "and the software", "between."].map(
                (line) => (
                  <span
                    key={line}
                    className="block overflow-hidden pb-[0.06em]"
                  >
                    <span data-hero-line className="block">
                      {line}
                    </span>
                  </span>
                ),
              )}
            </span>
          </h1>

          <p
            data-hero-sub
            className="text-body-lg mt-7 max-w-[48ch] text-text-muted"
          >
            {site.positioning}
          </p>

          <div data-hero-cta className="mt-10">
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
      </div>
    </section>
  );
}