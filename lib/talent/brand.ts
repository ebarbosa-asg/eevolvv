/**
 * eevolvv/talent brand constants.
 * Replaces the former @archimedes/lib workspace package.
 */

export const BRAND = {
  /** Full display name of the talent platform */
  talentName: "eevolvv/talent",
  /** Production domain — override with NEXT_PUBLIC_TALENT_DOMAIN env var */
  talentDomain:
    process.env.NEXT_PUBLIC_TALENT_DOMAIN?.trim() || "talent.eevolvv.com",
  /** Contact email — override with NEXT_PUBLIC_CONTACT_EMAIL env var */
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    "hello@eevolvv.com",
  founder: {
    name: "Eduardo Barbosa",
    title: "Founder & Operator",
  },
};

/** Shorthand for internal notification target — resolves from env or BRAND default */
export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL?.trim() ||
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  BRAND.contactEmail;
