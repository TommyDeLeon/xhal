import type { Metadata, Viewport } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { site } from "@/content/site";
import { Motion } from "@/components/motion";
import "./globals.css";

/*
  Two families, self-hosted by next/font at build time (no request reaches
  Google from a visitor's browser). Geist carries reading and controls; Source
  Serif 4 carries the name, section and project titles, and the italic line. Its optical
  size axis keeps it sturdy at display sizes, where the old Didone thinned out.
*/
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz"],
});

// Only the tagline is italic, so it is not preloaded and skips the optical-size axis.
const serifItalic = Source_Serif_4({
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
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
    <html lang="en" className={`${geist.variable} ${serif.variable} ${serifItalic.variable}`}>
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
