import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { BRAND } from "@/lib/brand";

const postScopeSchema = z.object({
  workType: z.enum(["Task", "Contract", "Consult"]),
  scopeName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().optional(),
  sector: z.string().min(1),
  description: z.string().min(80),
  timeline: z.string().min(1),
  clearanceRequired: z.string().min(1),
  referralSource: z.string().optional(),
});

type PostScopeData = z.infer<typeof postScopeSchema>;

async function sendScopeNotification(data: PostScopeData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[post-scope] RESEND_API_KEY not set — logging submission:");
    console.log(JSON.stringify(data, null, 2));
    return false;
  }

  const contactEmail =
    process.env.CONTACT_EMAIL?.trim() || BRAND.contactEmail.trim();

  const fromOverride = process.env.RESEND_FROM_EMAIL?.trim();
  const from = fromOverride
    ? `${BRAND.talentName} <${fromOverride}>`
    : BRAND.talentDomain
      ? `${BRAND.talentName} <no-reply@${BRAND.talentDomain}>`
      : null;

  if (!from || !contactEmail) {
    console.warn("[post-scope] Missing From address or contact email — skipping email");
    return false;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from,
      to: contactEmail,
      subject: `[New Scope] ${data.scopeName} — ${data.organization ?? "Independent"}`,
      text: [
        "A new scope was submitted via talent.eevolvv.com/post.",
        "",
        "— SCOPE DETAILS —",
        `Work type:     ${data.workType}`,
        `Scope name:    ${data.scopeName}`,
        `Submitted by:  ${data.name} (${data.email})`,
        `Organization:  ${data.organization ?? "Not provided"}`,
        `Sector:        ${data.sector}`,
        `Timeline:      ${data.timeline}`,
        `Clearance req: ${data.clearanceRequired}`,
        "",
        "— SCOPE DESCRIPTION —",
        data.description,
        "",
        "— SOURCE —",
        `How they found us: ${data.referralSource ?? "Not provided"}`,
      ].join("\n"),
    });

    return true;
  } catch (err) {
    console.error("[post-scope] Email send failed:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = postScopeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const emailSent = await sendScopeNotification(parsed.data);

  return NextResponse.json({
    success: true,
    emailNotice: emailSent ? "Notification sent." : "Scope logged. Email not configured.",
  });
}
