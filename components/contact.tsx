import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";

/**
 * Two paths, deliberately different destinations. Left is for people hiring;
 * right is for people who want something built. Hiring leads because that is
 * the audience the site is written for first, and the freelance path stays
 * because it is open too.
 *
 * No response-time promise anywhere. There was one ("within two business
 * days"); nothing in the repository could back it, so it went.
 */
export default function Contact() {
  return (
    <section id="contact" className="section-y">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6">
          <p className="text-mono-sm uppercase text-text-faint">Hiring</p>
          <h2 className="text-h2 mt-3 font-semibold">Hire me</h2>
          <p className="mt-5 max-w-[46ch] leading-[1.7] text-text-muted">
            I am looking for a junior software or web developer role:
            full-time, part-time or internship. CodeLock shows how I work. The
            code, the write-up and a live demo are all public.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            {/*
              The same filled pill as the hero. This used to reference a
              `button-primary` class that no stylesheet defined, so both CTAs
              shipped as unstyled text with the arrow wrapped under them.
            */}
            <a
              href={`mailto:${site.email}?subject=Role%20enquiry`}
              className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px active:translate-y-0"
            >
              Email me about a role
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </a>
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

          <ul className="mt-8 flex flex-col divide-y divide-hairline border-y border-hairline">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center justify-between gap-4 py-4 text-text transition-colors hover:text-accent"
              >
                <span className="min-w-0 break-all">{site.email}</span>
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </li>

            {site.phone ? (
              <li>
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                  className="group flex items-center justify-between gap-4 py-4 text-text transition-colors hover:text-accent"
                >
                  <span>{site.phone}</span>
                  <ArrowUpRight size={16} aria-hidden className="shrink-0" />
                </a>
              </li>
            ) : null}

            {site.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-4 text-text transition-colors hover:text-accent"
                >
                  <span>
                    {social.label}
                    <span className="text-mono-sm ml-3 text-text-muted">
                      {social.handle}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="text-mono-sm uppercase text-text-faint">Clients</p>
          <h2 className="text-h2 mt-3 font-semibold">Start a project</h2>
          {site.availableForWork ? (
            <p className="mt-5 max-w-[42ch] leading-[1.7] text-text-muted">
              I take freelance work: websites, web apps, and the small tools
              that never get built because nobody has time. Tell me what you
              need and I will tell you straight whether I am the right fit.
            </p>
          ) : null}

          <div className="mt-8">
            <a
              href={`mailto:${site.email}?subject=Project%20enquiry`}
              className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px active:translate-y-0"
            >
              Email me about a project
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </a>
            <p className="mt-4 text-sm text-text-muted">
              Opens your mail app. The address is also listed on the left.
            </p>
          </div>

          <p className="mt-10 max-w-[42ch] text-sm leading-[1.7] text-text-muted">
            Questions about CodeLock are welcome too. I read everything that
            arrives.
          </p>
        </div>
      </div>
    </section>
  );
}
