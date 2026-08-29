import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import ContactForm from "./contact-form";

/**
 * Two paths, deliberately different destinations. Left is for people who want
 * something built; right is for recruiters and peers who just want to talk.
 */
export default function Contact() {
  return (
    <section id="contact" className="section-y">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6">
          <h2 className="text-h2 font-semibold">Start a project</h2>
          <p className="mt-5 max-w-[46ch] leading-[1.7] text-text-muted">
            I am taking freelance work now. Websites, web apps, and the kind of
            small internal tool that never gets built because nobody has time.
            Tell me what is in front of you and I will tell you straight whether
            I am the right person for it, including when I am not.
          </p>

          <ContactForm />
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="text-h2 font-semibold">Let&apos;s connect</h2>
          <p className="mt-5 max-w-[42ch] leading-[1.7] text-text-muted">
            Hiring for an entry-level network or security role, comparing notes,
            or asking how something in CodeLock works. No pitch required, and I
            answer these too.
          </p>

          <ul className="mt-8 flex flex-col divide-y divide-hairline border-y border-hairline">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center justify-between gap-4 py-4 text-text transition-colors hover:text-accent"
              >
                <span>{site.email}</span>
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

          <p className="mt-6 text-sm text-text-muted">
            I read everything that arrives and reply within two business days.
          </p>
        </div>
      </div>
    </section>
  );
}
