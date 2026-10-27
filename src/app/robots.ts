import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog";

// drawiful.art/robots.txt : tout est indexable sauf l'espace privé des artistes
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/overview",
        "/artworks",
        "/orders",
        "/settings",
        "/subscription",
        "/domaine",
        "/gallery",
        "/reset-password",
        "/forgot-password",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
