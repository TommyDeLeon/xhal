import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import { site } from "@/content/site";
import { Motion } from "@/components/motion";
import "./globals.css";

/*
  Two families, self-hosted by next/font at build time (no request reaches
  Google from a visitor's browser). Inter carries reading and controls;
  Newsreader, made for reading on screens, carries the name, titles and the
  italic line. latin-ext is loaded too: it holds the peso sign (U+20B1), and
  the browser fetches it only on pages that show one.
*/
const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz"],
});

// Only the tagline is italic, so it is not preloaded.
const serifItalic = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif-italic",
  display: "swap",
  style: "italic",
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name}, ${site.role}`,
    description: site.line,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}: ${site.line}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.role}`,
    description: site.line,
    images: ["/og.png"],
  },
  // ?v= changes whenever the icons change: browsers cache favicons by URL,
  // often for weeks, and would keep showing the old mark otherwise.
  icons: {
    icon: [
      { url: "/favicon.ico?v=lion2", sizes: "any" },
      { url: "/icon.svg?v=lion2", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=lion2", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest?v=lion2",
  robots: { index: true, follow: true },
};

/*
  Light only. color-scheme tells the browser not to darken form controls or
  scrollbars under a dark OS setting, and the theme colour matches the page.
  There is no theme script and nothing reads the old saved "theme" key.
*/
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F8F7F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${serifItalic.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Motion />
      </body>
    </html>
  );
}
