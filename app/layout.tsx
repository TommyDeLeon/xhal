import type { Metadata } from "next";
import { Bodoni_Moda, Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

/**
 * The display face, and the reason there is now one at all.
 *
 * Every heading on this site used to be Geist — the same face as the body, at a
 * larger size. That is not a typographic hierarchy, it is a font-size change,
 * and it is most of why the page read as competent rather than as composed.
 *
 * Bodoni Moda is a Didone: extreme thick-to-thin contrast, unbracketed hairline
 * serifs, vertical stress. Two things follow, and both are the point. At
 * display size those hairlines catch the page's key light and the letterforms
 * acquire an edge no grotesk has, which is exactly the "ink with weight" the
 * direction asks for. And its authority is borrowed from print — this is the
 * skeleton of a masthead — so it does the editorial work by association before
 * a single word is read.
 *
 * DISPLAY SIZES ONLY. A Didone's hairlines thin to nothing below roughly 28px
 * and the face turns to mush, so body copy stays Geist, which is drawn to
 * disappear into reading. The two are doing opposite jobs deliberately, and the
 * distance between them is the hierarchy.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
  // Regular for running display type; medium where a heading has to hold its
  // own against a full-bleed plate behind it.
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

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
    "Tommy De Leon builds practical software end to end — TypeScript from the API to the desktop shell — and is training toward network and security engineering. Open to junior software roles and freelance web work.",
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
      "Practical software, thoughtfully executed. Full-stack TypeScript, a case study that says what was checked and what was not, and a path into network and security engineering.",
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
      "Practical software, thoughtfully executed. Full-stack TypeScript, a case study that says what was checked and what was not, and a path into network and security engineering.",
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
      className={`${geist.variable} ${geistMono.variable} ${bodoni.variable}`}
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
              "try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'||t==='system')document.documentElement.dataset.theme=t}catch(e){}",
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

