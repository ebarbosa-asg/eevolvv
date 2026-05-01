import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/talent/brand";

const postSchema = z.object({
  workType: z.enum(["Task", "Contract", "Consult"]),
  title: z.string().min(1),
  description: z.string().min(40, "Tell us more — at least 40 characters"),
  sector: z.string().min(1),
  timeline: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().optional(),
  budget: z.string().optional(),
});

type PostData = z.infer<typeof postSchema>;

async function sendPostNotification(data: PostData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: "eevolvv/talent <no-reply@talent.eevolvv.com>",
      to: CONTACT_EMAIL,
      subject: `[New ${data.workType}] ${data.title}`,
      text: [
        `New ${data.workType} posted on eevolvv/talent.`,
        ``,
        `Title:        ${data.title}`,
        `Type:         ${data.workType}`,
        `Sector:       ${data.sector}`,
        `Timeline:     ${data.timeline}`,
        `Budget:       ${data.budget ?? "Not provided"}`,
        `Posted by:    ${data.name} (${data.email})`,
        `Organization: ${data.organization ?? "Individual"}`,
        ``,
        `Description:`,
        data.description,
      ].join("\n"),
    });
    return true;
  } catch (err) {
    console.error("[post] Email failed:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ success: false }, { status: 400 }); }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  await sendPostNotification(parsed.data);
  return NextResponse.json({ success: true });
}
