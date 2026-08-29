import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.role}`,
    template: `%s - ${site.name}`,
  },
  description:
    "Tommy De Leon designs defensible networks and builds the software that runs on them. Segmentation, packet analysis, hardening, and production web engineering.",
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} - ${site.role}`,
    description:
      "Network and security engineering, with the software depth to build what runs on the network.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name}, ${site.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - ${site.role}`,
    description:
      "Network and security engineering, with the software depth to build what runs on the network.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
      suppressHydrationWarning is load-bearing here, not a papered-over warning.

      The inline script below deliberately mutates <html> before React hydrates:
      it adds the js-motion class, and a data-theme attribute when a theme has
      been chosen. Both MUST land before first paint -- that is the whole reason
      the script is inline in <head> rather than in a component -- so by the time
      React hydrates, the live <html> no longer matches the markup the server
      sent and React reports a mismatch it explicitly cannot patch up.

      This is the documented use for the flag: an element intentionally modified
      before hydration. It applies to this element alone; a genuine mismatch
      anywhere else in the tree still surfaces.
    */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        {/*
          Marks the document as motion-capable before first paint, so the CSS
          that hides reveal targets only applies when JS will actually reveal
          them. No JS, or reduced motion, means nothing is ever hidden.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion');" +
              "try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-on-accent"
        >
          Skip to content
        </a>

        {/*
          One light, one vignette, one grain, for the whole document.

          These were previously repeated inside individual sections, which gave
          the page a separate light source per section and put a hard rectangle
          edge at every boundary. Hoisting them here is what makes the page read
          as one continuous space rather than as a stack of separately lit
          panels -- and it is also cheaper, since it is three fixed layers
          instead of one set per section.
        */}
        <div aria-hidden className="film-page-key" />

        {children}

        {/* Above the content and the nav, so the frame encloses everything. */}
        <div aria-hidden className="film-page-vignette" />
        <div aria-hidden className="film-page-grain" />
      </body>
    </html>
  );
}

