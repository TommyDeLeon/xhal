import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";

/**
 * Asymmetric split hero. Text holds the left seven columns, the portrait the
 * right five. Both sit in the section's shared camera rather than in separate
 * perspectives, so the portrait tilts as an object standing in the same room as
 * the type instead of in a box of its own.
 */
export default function Hero() {
  const portrait = site.portrait;

  return (
    <section
      data-hero
      /* The shared camera. Every 3D parent on the page reads --depth, so the
         hero, the thesis and the project cards are all shot on one lens. */
      style={{ perspective: "var(--depth)" }}
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-14 md:pt-24 [@media(max-height:640px)]:min-h-0 [@media(max-height:640px)]:py-7"
    >
      {/* Depth ground, the furthest plane. Decorative, so it is hidden from
          assistive tech. The value is a 0-1 depth scalar, not a distance. */}
      <div
        aria-hidden
        data-parallax="1"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120%] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--bg-raised)_0%,transparent_70%)]"
      />

      {/* Everything that recedes as the hero scrolls away moves as one plate,
          so the type and the portrait travel back in Z together rather than
          separating. preserve-3d keeps the portrait's own offset frame in the
          section's camera instead of giving it a second one. */}
      <div
        data-hero-depth
        className="shell grid w-full grid-cols-1 items-center gap-9 [transform-style:preserve-3d] md:grid-cols-12 md:gap-10 [@media(max-height:640px)]:gap-6 lg:gap-14"
      >
        <div className={portrait ? "md:col-span-7" : "md:col-span-10"}>
          <p className="text-mono-sm mb-5 text-text-muted md:mb-7 [@media(max-height:640px)]:mb-3">{site.status}</p>

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
            className="text-body-lg mt-5 max-w-[46ch] text-text-muted md:mt-7 [@media(max-height:640px)]:mt-3"
          >
            {site.positioning}
          </p>

          <div data-hero-cta className="mt-7 md:mt-10 [@media(max-height:640px)]:mt-4">
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

        {portrait ? (
          <div
            data-hero-portrait
            className="order-first [transform-style:preserve-3d] md:order-none md:col-span-5 [@media(max-height:640px)]:hidden"
          >
            <div
              data-tilt
              className="relative mx-auto w-full max-w-[clamp(9.5rem,30vw,24rem)] [transform-style:preserve-3d] [@media(max-height:640px)]:max-w-[6.5rem]"
            >
              {/* Offset frame sitting behind the photo in Z, so the panel reads
                  as a physical object rather than a pasted-in circle. */}
              <div
                aria-hidden
                className="absolute -inset-3 -z-10 rounded-[20px] border border-hairline"
                style={{ transform: "translateZ(-40px)" }}
              />

              <picture>
                <source srcSet="/images/tommy.avif" type="image/avif" />
                <source srcSet="/images/tommy.webp" type="image/webp" />
                {/* Pre-compressed at build time: static export has no image
                    optimizer at request time. */}
                <img
                  src={portrait.src}
                  alt={portrait.alt}
                  width={portrait.width}
                  height={portrait.height}
                  fetchPriority="high"
                  decoding="async"
                  className="block w-full rounded-[16px] border border-hairline object-cover"
                />
              </picture>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}