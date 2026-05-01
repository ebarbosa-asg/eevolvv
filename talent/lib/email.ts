import { BRAND } from "@/lib/brand";

/**
 * Minimal local type for JoinFormData (replaces @archimedes/validators).
 * Keep in sync with the joinSchema in /api/join/route.ts.
 */
export interface JoinFormData {
  fullName: string;
  email: string;
  clearance: string;
  availability: string;
  earningsTarget?: number | null;
  skills: string[];
  domains: string[];
  background?: string | null;
}

/**
 * Verified-domain `from` defaults to talentDomain. Override with RESEND_FROM_EMAIL
 * (e.g. onboarding@resend.dev) while testing before DNS verification.
 */
function resendFromHeader(): string | null {
  const override = process.env.RESEND_FROM_EMAIL?.trim();
  if (override) {
    return `${BRAND.talentName} <${override}>`;
  }
  const domain = BRAND.talentDomain?.trim();
  if (domain) {
    return `${BRAND.talentName} <no-reply@${domain}>`;
  }
  return null;
}

/**
 * Sends internal notification and applicant confirmation via Resend when configured.
 * @returns true if both messages were accepted by Resend; false if skipped or on error.
 */
export async function sendJoinConfirmation(data: JoinFormData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail =
    process.env.CONTACT_EMAIL?.trim() || BRAND.contactEmail.trim();

  if (!apiKey) {
    console.log("[email] RESEND_API_KEY not set — logging submission:");
    console.log(JSON.stringify(data, null, 2));
    return false;
  }

  const from = resendFromHeader();
  if (!from) {
    console.warn(
      "[email] Set RESEND_FROM_EMAIL or NEXT_PUBLIC_TALENT_DOMAIN for a valid From address.",
    );
    return false;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const confirm = await resend.emails.send({
      from,
      to: data.email,
      subject: `You're in — ${BRAND.talentName}`,
      text: `
${data.fullName},

Your profile is in the system. We'll reach out when there's
a real match — not a keyword hit, an actual fit.

No account. No spam. Just work when there's work.

— ${BRAND.founder.name}
${BRAND.talentName}
${contactEmail || data.email}
    `.trim(),
    });

    if (confirm.error) {
      console.error("[email] Resend applicant confirmation failed:", confirm.error);
      return false;
    }

    if (contactEmail) {
      const internal = await resend.emails.send({
        from,
        to: contactEmail,
        subject: `New talent submission: ${data.fullName}`,
        text: `
New talent submission — eevolvv/talent:

Name:           ${data.fullName}
Email:          ${data.email}
Clearance:      ${data.clearance}
Availability:   ${data.availability}
Rate Target:    ${data.earningsTarget != null ? `$${data.earningsTarget}/hr` : "Not provided"}
Skills:         ${data.skills.join(", ")}
Domains:        ${data.domains.join(", ")}
Background:     ${data.background ?? "Not provided"}
    `.trim(),
      });

      if (internal.error) {
        console.error("[email] Resend internal notify failed:", internal.error);
      }
    } else {
      console.warn(
        "[email] No CONTACT_EMAIL / NEXT_PUBLIC_CONTACT_EMAIL — skipping internal notify only.",
      );
    }

    return true;
  } catch (err) {
    console.error("[email] Resend send threw:", err);
    return false;
  }
}
