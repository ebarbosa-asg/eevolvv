import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/proof"],
    },
    sitemap: "https://eevolvv.com/sitemap.xml",
  };
}
