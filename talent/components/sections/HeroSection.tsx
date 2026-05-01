"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DimensionLine } from "@/components/DimensionLine";

export function HeroSection() {
  return (
    <section className="relative" style={{ paddingTop: 72, paddingBottom: 80, overflow: "hidden" }}>
      <div className="absolute inset-0 blueprint-grid" style={{ opacity: 0.5, pointerEvents: "none" }} />
      <div className="absolute inset-0 blueprint-grid-fine" style={{ opacity: 0.35, pointerEvents: "none" }} />

      <div className="mx-auto relative" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <div
          className="flex items-center justify-between mono anim-fade-in hero-meta-row"
          style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.55, marginBottom: 24 }}
        >
          <span>EEVOLVV / TALENT · REV 2026</span>
          <span>EEVOLVVING FORWARD, TOGETHER</span>
        </div>

        <div
          className="anim-fade-up"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 14px", border: "1px solid var(--ink)",
            marginBottom: 32, background: "var(--paper)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", fontWeight: 600 }}>DAY ZERO</span>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", opacity: 0.55 }}>
            · FOUNDED 2026 · BUILDING IN PUBLIC
          </span>
        </div>

        <HeroLever />

        <div className="mt-20 anim-fade-in" style={{ animationDelay: "1.2s" }}>
          <DimensionLine label="MATCHED BY HAND · NO ALGORITHM TRUST FALLS" />
        </div>
      </div>
    </section>
  );
}

function HeroLever() {
  return (
    <div className="grid items-center hero-grid" style={{ gap: 60 }}>
      <div>
        <div className="mono anim-fade-up" style={{ fontSize: 11, letterSpacing: "0.22em", opacity: 0.6, marginBottom: 20 }}>
          PRINCIPLE OF THE LEVER · FIG. 01
        </div>
        <h1
          className="anim-fade-up"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 500,
            fontSize: "clamp(48px, 6.5vw, 96px)",
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            margin: 0,
            animationDelay: "0.1s",
          }}
        >
          Give us the <em className="serif" style={{ fontStyle: "italic", color: "var(--accent)" }}>scope.</em>
          <br />
          We bring the <em className="serif" style={{ fontStyle: "italic" }}>fulcrum.</em>
        </h1>
        <p
          className="anim-fade-up"
          style={{ fontSize: 18, lineHeight: 1.5, color: "rgba(20,20,19,0.78)", marginTop: 32, maxWidth: 480, animationDelay: "0.3s" }}
        >
          Tasks pay. One match when the fit is real.
        </p>
        <div className="flex items-center gap-3 anim-fade-up" style={{ marginTop: 32, animationDelay: "0.5s" }}>
          <Link
            href="/join"
            style={{
              background: "var(--ink)", color: "var(--paper)",
              padding: "16px 28px", fontSize: 14, fontWeight: 600,
              letterSpacing: "0.02em", textDecoration: "none", display: "inline-block",
            }}
          >
            Join →
          </Link>
          <Link
            href="/post"
            style={{
              background: "transparent", color: "var(--ink)",
              padding: "16px 28px",
              border: "1px solid var(--ink)",
              fontSize: 14, fontWeight: 600,
              letterSpacing: "0.02em", textDecoration: "none", display: "inline-block",
            }}
          >
            Post work
          </Link>
        </div>
      </div>
      <div className="lever-diagram">
        <LeverDiagram />
      </div>
    </div>
  );
}

function LeverDiagram() {
  const [tilt, setTilt] = useState(0);

  useEffect(() => {
    const onScroll = () => setTilt(Math.sin(window.scrollY / 220) * 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <svg viewBox="0 0 480 360" style={{ width: "100%", height: "auto" }} aria-hidden>
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(20,20,19,0.6)" strokeWidth="1" />
        </pattern>
      </defs>
      <line x1="20" y1="320" x2="460" y2="320" stroke="rgba(20,20,19,0.4)" strokeWidth="1" />
      {[20, 100, 240, 380, 460].map((x) => (
        <line key={x} x1={x} y1="318" x2={x} y2="324" stroke="rgba(20,20,19,0.5)" strokeWidth="1" />
      ))}
      <text x="20" y="340" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(20,20,19,0.55)">SCOPE</text>
      <text x="416" y="340" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(20,20,19,0.55)">DELIVERY</text>
      <polygon points="220,260 260,260 240,200" fill="url(#hatch)" stroke="var(--ink)" strokeWidth="1.4" />
      <text x="240" y="276" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(20,20,19,0.65)">
        FULCRUM · EEVOLVV
      </text>
      <g
        onMouseEnter={() => setTilt(-8)}
        onMouseLeave={() => setTilt(0)}
        style={{ transformOrigin: "240px 200px", transform: `rotate(${tilt}deg)`, transition: "transform 0.6s ease-out", cursor: "pointer" }}
      >
        <line x1="60" y1="200" x2="420" y2="200" stroke="var(--ink)" strokeWidth="2.5" />
        <rect x="40" y="172" width="60" height="28" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
        <text x="70" y="190" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink)">SCOPE</text>
        <circle cx="400" cy="200" r="14" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.4" />
        <text x="400" y="184" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink)">OPERATOR</text>
      </g>
      <text x="20" y="60" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(20,20,19,0.55)">FIG. 01</text>
      <text x="20" y="76" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(20,20,19,0.55)">PLACEMENT MECHANICS</text>
    </svg>
  );
}
