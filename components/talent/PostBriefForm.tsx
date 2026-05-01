"use client";

import { useState } from "react";
import Link from "next/link";
import { DOMAINS } from "@/data/talent/domains";
import { WORK_TYPES } from "@/data/talent/workTypes";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid var(--rule)",
  background: "rgba(255,255,255,0.6)",
  fontSize: 15,
  color: "var(--ink)",
};

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span className="mono" style={{ display: "block", fontSize: 9, letterSpacing: "0.22em", opacity: 0.55, marginBottom: 6 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

export function PostBriefForm() {
  const [workType, setWorkType] = useState<string>(WORK_TYPES[0].name);
  const [title, setTitle] = useState("");
  const [scope, setScope] = useState("");
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ref] = useState(() => {
    const code = workType === "Task" ? "TSK" : workType === "Contract" ? "CTR" : "CSL";
    const n = Math.floor(Math.random() * 9000 + 1000);
    const l = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
    return `${code}-${n}-${l}`;
  });

  async function handleSubmit() {
    try {
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workType, title, scope, domain, budget, timeline, contact }),
      });
    } catch {
      // proceed to success regardless
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: "100px 24px 140px" }}>
        <div className="mx-auto" style={{ maxWidth: 720, textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--accent)", marginBottom: 24 }}>
            ● BRIEF RECEIVED
          </div>
          <h1
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(48px, 7vw, 96px)",
              fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, margin: 0,
            }}
          >
            We&apos;re{" "}
            <em className="serif" style={{ fontStyle: "italic", color: "var(--accent)" }}>on it.</em>
          </h1>
          <p style={{ fontSize: 18, opacity: 0.75, marginTop: 24, lineHeight: 1.55, maxWidth: 520, margin: "24px auto 0" }}>
            A real human reads every brief. You&apos;ll hear back inside one business day — with a name, a scope, or an honest &quot;not us.&quot;
          </p>
          <div
            style={{
              marginTop: 56, padding: 24,
              border: "1px solid var(--ink)",
              background: "var(--ink)", color: "var(--paper)",
              textAlign: "left", maxWidth: 480, margin: "56px auto 0",
            }}
          >
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.6, marginBottom: 12 }}>
              REFERENCE · KEEP THIS
            </div>
            <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "0.02em", color: "var(--accent)" }}>
              {ref}
            </div>
            <div style={{ fontSize: 14, marginTop: 14, opacity: 0.85 }}>
              {title || `New ${workType.toLowerCase()} · awaiting placement`}
            </div>
          </div>
          <div style={{ marginTop: 48 }}>
            <Link href="/" className="link-rule" style={{ background: "none", fontSize: 14, color: "var(--ink)", textDecoration: "none" }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 48, border: "1px solid var(--rule)", background: "rgba(255,255,255,0.6)", padding: 32 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.6, marginBottom: 12 }}>
        01 · TYPE OF WORK
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, border: "1px solid var(--ink)" }}>
        {WORK_TYPES.map((w, i) => (
          <button
            key={w.code}
            onClick={() => setWorkType(w.name)}
            style={{
              padding: "16px 12px",
              background: workType === w.name ? "var(--ink)" : "transparent",
              color: workType === w.name ? "var(--paper)" : "var(--ink)",
              border: 0,
              borderLeft: i > 0 ? "1px solid var(--ink)" : "none",
              cursor: "pointer",
              fontWeight: 500, fontSize: 14,
              textAlign: "left",
            }}
          >
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.22em", opacity: 0.65, marginBottom: 4 }}>{w.code}</div>
            <div style={{ fontSize: 18 }}>{w.name}</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{w.range}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
        <FieldLabel label="02 · ONE-LINE TITLE">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior welder for 3-week shipyard contract" style={inputStyle} />
        </FieldLabel>
        <FieldLabel label="03 · DESCRIBE THE SCOPE">
          <textarea
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            rows={5}
            placeholder="What needs to happen, when, where, and what 'done' looks like."
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
          />
        </FieldLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <FieldLabel label="04 · DOMAIN">
            <select value={domain} onChange={(e) => setDomain(e.target.value)} style={inputStyle}>
              {DOMAINS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </FieldLabel>
          <FieldLabel label="05 · TIMELINE">
            <input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Start in 2 wks, deliver in 6" style={inputStyle} />
          </FieldLabel>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <FieldLabel label="06 · BUDGET RANGE">
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$8k–$12k or $200/hr" style={inputStyle} />
          </FieldLabel>
          <FieldLabel label="07 · YOUR EMAIL">
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@company.com" type="email" style={inputStyle} />
          </FieldLabel>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 32, width: "100%",
          background: "var(--accent)", color: "var(--paper)",
          padding: "18px 0", border: 0, cursor: "pointer",
          fontSize: 15, fontWeight: 600, letterSpacing: "0.02em",
        }}
      >
        Submit brief →
      </button>
      <p className="mono" style={{ textAlign: "center", marginTop: 14, fontSize: 10, letterSpacing: "0.2em", opacity: 0.5 }}>
        REPLY WITHIN ONE BUSINESS DAY · NO ROBOTS
      </p>
    </div>
  );
}
