import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/os/", "/api/", "/signin/", "/onboard/", "/report/", "/run/", "/share/", "/client/"],
    },
    sitemap: "https://eevolvv.com/sitemap.xml",
  };
}
