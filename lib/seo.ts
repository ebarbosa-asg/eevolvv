import type { Metadata } from "next";
import { packages } from "@/lib/packages";

export const SITE_NAME = "eevolvv";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://eevolvv.com").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function contactEmail() {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@eevolvv.com";
}

export function bookingUrl() {
  return (
    process.env.NEXT_PUBLIC_CAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ||
    ""
  );
}

export function bookingEmbedSrc(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("embed")) parsed.searchParams.set("embed", "true");
    return parsed.toString();
  } catch {
    return "";
  }
}

export function pageMeta(opts: { title: string; description: string; path: string }): Metadata {
  const url = absoluteUrl(opts.path);
  const full = opts.title.includes(SITE_NAME) ? opts.title : `${opts.title} · ${SITE_NAME}`;
  return {
    title: { absolute: full },
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: full,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: opts.description,
    },
    robots: { index: true, follow: true },
  };
}

export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        alternateName: "eevolvv 2.0",
        url: SITE_URL,
        email: contactEmail(),
        brand: { "@type": "Brand", name: SITE_NAME },
        description:
          "Done-for-you short-form clipping and posting. Your content is the place to stand; our automation is the lever.",
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@type": "Organization", name: SITE_NAME },
      },
      {
        "@type": "Service",
        name: "eevolvv clipping retainers",
        serviceType: "Short-form video clipping and distribution",
        areaServed: "Worldwide",
        provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        offers: [
          {
            "@type": "Offer",
            name: packages.ship.name,
            price: String(packages.ship.price),
            priceCurrency: "USD",
            url: absoluteUrl("/packages/clip-and-ship"),
          },
          {
            "@type": "Offer",
            name: packages.dominate.name,
            price: String(packages.dominate.price),
            priceCurrency: "USD",
            url: absoluteUrl("/packages/clip-and-dominate"),
          },
        ],
      },
    ],
  };
}

export function faqGraph(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
