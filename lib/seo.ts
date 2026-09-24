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

function configuredEnv(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || /^todo\b/i.test(trimmed)) return "";
  return trimmed;
}

export function bookingUrl() {
  return configuredEnv(process.env.NEXT_PUBLIC_CAL_URL) || configuredEnv(process.env.NEXT_PUBLIC_CALENDLY_URL);
}

export function legalAddress() {
  return configuredEnv(process.env.NEXT_PUBLIC_LEGAL_ADDRESS);
}

export function legalEntity() {
  return configuredEnv(process.env.NEXT_PUBLIC_LEGAL_ENTITY);
}

export function legalState() {
  return configuredEnv(process.env.NEXT_PUBLIC_LEGAL_STATE);
}

/** Legal actor in sentences. No entity type or state while the env is TODO. */
export function legalParty() {
  return legalEntity() || "the company operating eevolvv";
}

export function plausibleDomain() {
  return configuredEnv(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
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
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "eevolvv — your content is the place to stand" }],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: opts.description,
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true },
  };
}

export function organizationGraph() {
  const entity = legalEntity();
  const address = legalAddress();
  const orgName = entity || SITE_NAME;
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    name: orgName,
    url: SITE_URL,
    email: contactEmail(),
    brand: { "@type": "Brand", name: SITE_NAME },
    description:
      "Done-for-you short-form clipping and posting. Your content is the place to stand; our automation is the lever.",
  };
  if (entity) {
    organization.legalName = entity;
    organization.alternateName = SITE_NAME;
  } else {
    organization.alternateName = "eevolvv 2.0";
  }
  if (address) {
    organization.address = { "@type": "PostalAddress", streetAddress: address };
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@type": "Organization", name: orgName },
      },
      {
        "@type": "Service",
        name: "eevolvv clipping retainers",
        serviceType: "Short-form video clipping and distribution",
        areaServed: "Worldwide",
        provider: { "@type": "Organization", name: orgName, url: SITE_URL },
        offers: [packages.ship, packages.dominate].map((pack) => ({
          "@type": "Offer",
          name: pack.name,
          description: pack.lead,
          price: String(pack.price),
          priceCurrency: "USD",
          url: absoluteUrl(`/packages/${pack.slug}`),
        })),
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
