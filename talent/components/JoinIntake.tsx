"use client";

import { useState } from "react";
import { DOMAINS } from "@/data/domains";

type Step = 0 | 1 | 2 | 3 | 4; // upload | extracting | confirm | details | done

const SAMPLE_RESUMES = {
  welder: {
    label: "[DEMO] Tradesperson",
    skills: ["Welding", "Plumbing", "Electrical", "HVAC"],
  },
  bidwriter: {
    label: "[DEMO] Federal / proposal",
    skills: ["Federal Proposal Writing", "ATO Support", "FedRAMP", "Contract Review"],
  },
  engineer: {
    label: "[DEMO] Software / engineering",
    skills: ["TypeScript", "React", "Python", "AWS"],
  },
} as const;

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

export function JoinIntake() {
  const [step, setStep] = useState<Step>(0);
  const [pickedDemo, setPickedDemo] = useState<keyof typeof SAMPLE_RESUMES | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [rate, setRate] = useState("");
  const [available, setAvailable] = useState("Within 2 weeks");
  const [ref] = useState(() => {
    const n = Math.floor(Math.random() * 9000 + 1000);
    const l = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
    return `OPR-${n}-${l}`;
  });

  function pickDemo(key: keyof typeof SAMPLE_RESUMES) {
    setPickedDemo(key);
    setStep(1);
    setTimeout(() => {
      setSkills(SAMPLE_RESUMES[key].skills as unknown as string[]);
      setStep(2);
    }, 1600);
  }

  async function handleFile(file: File) {
    setStep(1);
    const fd = new FormData();
    fd.append("resume", file);
    try {
      const res = await fetch("/api/intake", { method: "POST", body: fd });
      const data = await res.json();
      setSkills(data.confirmed ?? []);
      setStep(2);
    } catch {
      setStep(0);
    }
  }

  function toggleSkill(s: string) {
    setSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  async function handleSubmit() {
    try {
      await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, skills, domain, rate, available }),
      });
    } catch {
      // proceed to done regardless
    }
    setStep(4);
  }

  const STEP_LABELS = ["UPLOAD", "EXTRACT", "CONFIRM", "DETAILS", "SUBMITTED"];

  return (
    <div
      style={{
        maxWidth: 720, margin: "0 auto",
        border: "1px solid var(--rule)",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* progress bar */}
      <div
        className="mono"
        style={{
          display: "flex", justifyContent: "space-between",
          padding: "14px 24px", borderBottom: "1px solid var(--rule)",
          fontSize: 10, letterSpacing: "0.22em", opacity: 0.65,
        }}
      >
        <span>STEP {Math.min(step + 1, 4)} OF 4</span>
        <span>· {STEP_LABELS[step]}</span>
      </div>

      <div style={{ padding: 32 }}>
        {/* Step 0 — Upload */}
        {step === 0 && (
          <div className="anim-fade-up">
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>
              Drop your resume.
            </h2>
            <p style={{ fontSize: 15, opacity: 0.7, marginTop: 12, lineHeight: 1.55 }}>
              We pull your skills out, you confirm them, you&apos;re in. No 47-field form. No &quot;tell us about a time you demonstrated leadership.&quot; No tracking pixel that follows you to the grocery store.
            </p>

            <label
              htmlFor="resume-upload"
              style={{
                display: "block",
                marginTop: 28, padding: 32,
                border: "1.5px dashed var(--rule)",
                textAlign: "center", cursor: "pointer",
              }}
            >
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", opacity: 0.6 }}>
                ↑ DROP A FILE · OR PICK BELOW
              </div>
              <div style={{ fontSize: 13, opacity: 0.55, marginTop: 8 }}>
                PDF, DOC, or paste plain text · Max 10MB
              </div>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </label>

            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, marginTop: 28, marginBottom: 12 }}>
              SAMPLE RESUMES
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {(Object.entries(SAMPLE_RESUMES) as [keyof typeof SAMPLE_RESUMES, { label: string }][]).map(([k, r]) => (
                <button
                  key={k}
                  onClick={() => pickDemo(k)}
                  style={{
                    textAlign: "left", padding: "14px 18px",
                    border: "1px solid var(--rule)", background: "transparent",
                    cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{r.label}</span>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", opacity: 0.55 }}>USE →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Extracting */}
        {step === 1 && (
          <div className="anim-fade-in" style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="mono anim-blink" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--accent)", marginBottom: 20 }}>
              ● EXTRACTING SKILLS
            </div>
            <div style={{ width: 200, height: 2, background: "var(--rule)", margin: "0 auto", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "var(--accent)", animation: "drawLine 1.5s ease-out forwards", transformOrigin: "left" }} />
            </div>
            <p className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", opacity: 0.55, marginTop: 24 }}>
              READING · {pickedDemo ? SAMPLE_RESUMES[pickedDemo].label.toUpperCase() : "YOUR RESUME"}
            </p>
          </div>
        )}

        {/* Step 2 — Confirm skills */}
        {step === 2 && (
          <div className="anim-fade-up">
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>
              Confirm your skills.
            </h2>
            <p style={{ fontSize: 14, opacity: 0.7, marginTop: 10 }}>
              Tap to remove ones that don&apos;t fit. Add what we missed.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
              {skills.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSkill(s)}
                  style={{
                    padding: "8px 14px",
                    border: "1px solid var(--ink)",
                    background: "var(--ink)", color: "var(--paper)",
                    fontSize: 13, cursor: "pointer",
                  }}
                >
                  {s} ×
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              style={{
                marginTop: 32, width: "100%",
                background: "var(--ink)", color: "var(--paper)",
                padding: "14px 0", border: 0, cursor: "pointer",
                fontSize: 14, fontWeight: 500,
              }}
            >
              Looks right →
            </button>
          </div>
        )}

        {/* Step 3 — Details */}
        {step === 3 && (
          <div className="anim-fade-up">
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>
              Last details.
            </h2>
            <p style={{ fontSize: 14, opacity: 0.7, marginTop: 10 }}>
              So we know how to reach you when scope arrives.
            </p>
            <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
              <FieldLabel label="NAME">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
              </FieldLabel>
              <FieldLabel label="EMAIL">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" style={inputStyle} />
              </FieldLabel>
              <FieldLabel label="PRIMARY DOMAIN">
                <select value={domain} onChange={(e) => setDomain(e.target.value)} style={inputStyle}>
                  {DOMAINS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <FieldLabel label="TARGET RATE">
                  <input value={rate} onChange={(e) => setRate(e.target.value)} placeholder="$120/hr or $8k/wk" style={inputStyle} />
                </FieldLabel>
                <FieldLabel label="AVAILABLE">
                  <select value={available} onChange={(e) => setAvailable(e.target.value)} style={inputStyle}>
                    <option>Now</option>
                    <option>Within 2 weeks</option>
                    <option>Within a month</option>
                    <option>Just lurking</option>
                  </select>
                </FieldLabel>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !email.includes("@")}
              style={{
                marginTop: 32, width: "100%",
                background: "var(--accent)", color: "var(--paper)",
                padding: "16px 0", border: 0, cursor: "pointer",
                fontSize: 14, fontWeight: 600, letterSpacing: "0.02em",
                opacity: !name.trim() || !email.includes("@") ? 0.5 : 1,
              }}
            >
              Submit to the pool →
            </button>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div className="anim-fade-up" style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--accent)", marginBottom: 16 }}>
              ● YOU&apos;RE IN
            </div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>
              Welcome to the pool.
            </h2>
            <p style={{ fontSize: 16, opacity: 0.75, marginTop: 16, maxWidth: 460, margin: "16px auto 0", lineHeight: 1.55 }}>
              We&apos;ve got your name. When real scope hits and you fit, we&apos;ll reach out. Until then, we won&apos;t.
            </p>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", opacity: 0.55, marginTop: 32 }}>
              REF · {ref}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
