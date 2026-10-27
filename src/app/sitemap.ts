import type { MetadataRoute } from "next";
import { POSTS, SITE_URL } from "@/lib/blog";

// drawiful.art/sitemap.xml : la landing, le blog et ses articles
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = POSTS.map((p) => p.date).sort().at(-1);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    ...POSTS.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
