import type { Metadata } from "next";
import { SampleForm } from "@/components/site/SampleForm";
import { bookingUrl, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Free sample cut",
  description: "Send one episode link. eevolvv will tell you whether Clip & Ship or Clip & Dominate fits — or whether a tool is enough.",
  path: "/sample",
});

export default function SamplePage() {
  return (
    <section className="page-hero">
      <div className="wrap" style={{ display: "grid", gap: 28 }}>
        <div>
          <p className="eyebrow">Lead magnet</p>
          <h1>Send one episode</h1>
          <p className="lead">A link is enough. We look at whether the moments can stand alone in a feed. No fake before-and-after.</p>
        </div>
        <div className="dropzone">
          <div style={{ width: "min(520px, 100%)" }}>
            <svg viewBox="0 0 240 140" width="220" height="120" aria-hidden="true">
              <rect x="70" y="16" width="100" height="90" rx="16" fill="none" stroke="#3DFF8A" strokeWidth="3" />
              <path d="M108 52 L132 66 L108 80 Z" fill="#3DFF8A" />
              <path d="M120 110 v16 M100 126 h40" stroke="#3DFF8A" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <SampleForm booking={bookingUrl()} />
          </div>
        </div>
      </div>
    </section>
  );
}
