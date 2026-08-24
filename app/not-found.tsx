import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist on tommydeleon.com.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-[100dvh] items-center justify-center px-5"
    >
      <div className="w-full max-w-[52ch]">
        <p className="text-mono-sm text-accent">404</p>
        <h1 className="text-h2 mt-4 font-medium">
          No route to that page.
        </h1>
        <p className="mt-5 leading-[1.7] text-text-muted">
          The address resolved but nothing is listening on the other end. It was
          probably a broken link or a typo in the path.
        </p>

        <Link
          href="/"
          className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-px"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden />
          Back to {site.wordmark}
        </Link>
      </div>
    </main>
  );
}
