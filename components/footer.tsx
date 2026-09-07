import Link from "next/link";
import { site } from "@/content/site";

export default function Footer({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <footer className="border-t border-hairline">
      <div className="shell grid grid-cols-1 gap-10 py-14 sm:grid-cols-3">
        <div>
          <Link
            href="/"
            className="text-label-sm uppercase text-text transition-colors hover:text-accent"
          >
            {site.wordmark}
          </Link>
          <p className="mt-3 max-w-[28ch] text-sm text-text-muted">
            {site.status}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-col gap-3">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {site.email}
            </a>
          </li>
          {site.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted transition-colors hover:text-text"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="shell border-t border-hairline py-6">
        <p className="text-label-sm text-text-muted">
          {/* Computed at render, not hardcoded. */}
          &copy; {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
