import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/*
 * One entry, because the site is one page. The in-page anchors (#services,
 * #process, …) are not separate URLs and must not be listed here: a sitemap
 * that claims fragments are pages gets the whole file distrusted.
 */
// Required by `output: "export"`: metadata routes must be resolvable at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
