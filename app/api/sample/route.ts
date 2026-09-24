import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactEmail } from "@/lib/seo";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const url = body.url?.trim() ?? "";
  if (!name || !email || !url || !email.includes("@") || name.length > 120 || url.length > 500) {
    return NextResponse.json({ error: "Name, email, and episode URL are required." }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("protocol");
  } catch {
    return NextResponse.json({ error: "Episode URL must be http or https." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = contactEmail();
  await resend.emails.send({
    from: "eevolvv <hello@eevolvv.com>",
    to,
    reply_to: email,
    subject: `Sample cut request: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nEpisode: ${url}\n`,
  });

  return NextResponse.json({ ok: true, delivered: true });
}
