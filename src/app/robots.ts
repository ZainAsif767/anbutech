import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/*
 * Generated to out/robots.txt at build time. Without this file crawlers get a
 * 404 on /robots.txt, which is not fatal (the default is "crawl everything")
 * but leaves no place to advertise the sitemap.
 */
// Required by `output: "export"`: metadata routes must be resolvable at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
