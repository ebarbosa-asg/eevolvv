const routes = [
  "/",
  "/packages/clip-and-ship",
  "/packages/clip-and-dominate",
  "/niches/podcasts",
  "/niches/saas",
  "/niches/coaches",
  "/case-studies",
  "/blog",
  "/blog/tool-vs-agency",
  "/blog/clipping-agency-cost-2026",
  "/blog/repurpose-podcast-shorts",
  "/about",
  "/sample",
  "/legal/privacy",
  "/legal/terms",
];

export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (path) => `  <url><loc>https://eevolvv.com${path === "/" ? "/" : path}</loc></url>`,
  )
  .join("\n")}
</urlset>`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
}
