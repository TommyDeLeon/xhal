import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projectsWithCaseStudy } from "@/content/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    /*
      Derived from the content model rather than listed by hand. A case study
      added to content/projects.ts appears here on its own, and one that is
      still null cannot be advertised to a crawler by accident -- which is the
      failure that matters, because a 404 in a sitemap is worse than an absence.
    */
    ...projectsWithCaseStudy.map((project) => ({
      url: `${site.url}/work/${project.slug}/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
