import { PostBriefForm } from "@/components/PostBriefForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post work — eevolvv/talent",
  description: "Describe the work. We match it to the right person. Hear back in one business day.",
};

export default function PostPage() {
  return (
    <div style={{ padding: "80px 24px 120px" }}>
      <div className="mx-auto" style={{ maxWidth: 760 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", opacity: 0.6, marginBottom: 14 }}>
          SUBMIT A BRIEF
        </div>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          What has to{" "}
          <em className="serif" style={{ fontStyle: "italic", color: "var(--accent)" }}>get done?</em>
        </h1>
        <p style={{ fontSize: 17, opacity: 0.75, marginTop: 20, lineHeight: 1.55, maxWidth: 560 }}>
          Describe the work plainly. We&apos;ll come back inside one business day with a name and a written scope — or with a clear &quot;we don&apos;t have the right person.&quot;
        </p>
        <PostBriefForm />
      </div>
    </div>
  );
}
