import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };
export default function NotFound() { return <><SiteHeader/><main id="main" className="wrap notfound"><h1>That page isn&apos;t here.</h1><p>It may have moved, or the address has a typo.</p><p><a className="button" href="/">Go to the home page</a></p></main><SiteFooter/></>; }
