import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/brand";

const joinSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  skills: z.array(z.string()).default([]),
  domains: z.array(z.string()).default([]),
  workTypes: z.array(z.string()).min(1, "At least one work type required"),
  availability: z.string().optional(),
  rate: z.string().optional(),
  inputText: z.string().optional(),
});

type JoinData = z.infer<typeof joinSchema>;

async function sendJoinNotification(data: JoinData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[join] RESEND_API_KEY not set — skipping email");
    return false;
  }
  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: "eevolvv/talent <no-reply@talent.eevolvv.com>",
      to: CONTACT_EMAIL,
      subject: `[New Lever] ${data.name}`,
      text: [
        `New talent joined eevolvv/talent.`,
        ``,
        `Name:         ${data.name}`,
        `Email:        ${data.email}`,
        `Availability: ${data.availability ?? "Not provided"}`,
        `Rate:         ${data.rate ?? "Not provided"}`,
        `Work types:   ${data.workTypes.join(", ")}`,
        `Domains:      ${data.domains.length > 0 ? data.domains.join(", ") : "Not specified"}`,
        ``,
        `Skills (${data.skills.length}):`,
        data.skills.length > 0
          ? data.skills.map((s) => `  · ${s}`).join("\n")
          : "  (none listed)",
      ].join("\n"),
    });
    return true;
  } catch (err) {
    console.error("[join] Email failed:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = joinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  await sendJoinNotification(parsed.data);
  return NextResponse.json({ success: true });
}
