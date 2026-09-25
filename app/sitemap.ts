import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: `${site.url}/` }, ...projects.map(({ slug }) => ({ url: `${site.url}/work/${slug}/` }))]; }
