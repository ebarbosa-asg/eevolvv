import { NextRequest, NextResponse } from "next/server";
import { extractSkills } from "@/lib/extractors";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let text = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("resume") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf" || file.name?.endsWith(".pdf")) {
        const pdfModule = await import("pdf-parse") as any;
        const pdfParse: (buf: Buffer) => Promise<{ text: string }> =
          pdfModule.default ?? pdfModule;
        const result = await pdfParse(buffer);
        text = result.text;
      } else {
        text = buffer.toString("utf-8");
      }
    } else {
      const body = await req.json();
      text = body.text ?? "";
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "No text to parse" }, { status: 400 });
    }

    const result = await extractSkills(text);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[intake] Parse error:", err);
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
  }
}
