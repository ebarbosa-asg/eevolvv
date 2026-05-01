import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeader";
import { FounderPathDiagram } from "@/components/sections/FounderPathDiagram";

const FOUNDER = {
  name: "Eduardo Barbosa",
  title: "Founder & Operator",
  tagline: "Human, Veteran, Artist — in no particular order.",
  bio: "Navy Nuclear → SpaceX → Neuralink → \"let me just build the thing myself.\" Founder of eevolvv. Operator first, title second.",
  photo: "/founder.jpg",
};

export function FounderSection() {
  return (
    <section id="who" style={{ padding: "120px 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <SectionHeader number="08" eyebrow="WHO IS BUILDING" title="Operator-led. We close work, not decks." note="ONE NAME" />
        <div className="grid mt-12 founder-grid" style={{ gap: 64, marginTop: 56 }}>
          <div>
            <div className="founder-photo" style={{ width: "100%", aspectRatio: "3 / 4", border: "1px solid var(--ink)", position: "relative", overflow: "hidden", background: "var(--paper)" }}>
              <Image
                src={FOUNDER.photo}
                alt={FOUNDER.name}
                fill
                style={{ objectFit: "cover", filter: "grayscale(0.15) contrast(1.02)" }}
                sizes="(max-width: 767px) min(100vw, 320px), 340px"
              />
              <div className="mono" style={{ position: "absolute", left: 10, top: 10, fontSize: 9, letterSpacing: "0.22em", color: "white", textShadow: "0 0 4px rgba(0,0,0,0.6)", opacity: 0.85 }}>
                PORTRAIT · 01
              </div>
              <div className="mono" style={{ position: "absolute", right: 10, top: 10, fontSize: 9, letterSpacing: "0.22em", color: "white", textShadow: "0 0 4px rgba(0,0,0,0.6)", opacity: 0.85 }}>
                ↳ 2026
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em" }}>{FOUNDER.name}</div>
            <div className="mono" style={{ fontSize: 12, letterSpacing: "0.18em", opacity: 0.65, marginTop: 6 }}>
              {FOUNDER.title.toUpperCase()}
            </div>
            <p className="serif" style={{ fontStyle: "italic", fontSize: 22, lineHeight: 1.45, marginTop: 28, color: "var(--accent)" }}>
              {FOUNDER.tagline}
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.55, marginTop: 20, color: "rgba(20,20,19,0.78)" }}>
              {FOUNDER.bio}
            </p>
            <FounderPathDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
