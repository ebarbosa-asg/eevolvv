"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage } from "./ChatMessage";
import { SkillChip } from "./SkillChip";
import { TypingIndicator } from "./TypingIndicator";
import { DOMAINS } from "@/data/talent/domains";
import { SKILLS } from "@/data/talent/skills";

// ─── Types ──────────────────────────────────────────────────────────────────

type WorkType = "Task" | "Project" | "Contract" | "Consult" | "Advisory";

type Step =
  | "intro"
  | "input"
  | "parsing"
  | "skills"
  | "domains"
  | "work-type"
  | "availability"
  | "rate"
  | "contact"
  | "submitting"
  | "done";

interface State {
  step: Step;
  inputText: string;
  skills: string[];
  suggestedSkills: string[];
  domains: string[];
  workTypes: WorkType[];
  availability: string;
  rate: string;
  name: string;
  email: string;
  uploadMode: "text" | "file";
  botTyping: boolean;
  error: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const WORK_TYPES: { type: WorkType; label: string; desc: string }[] = [
  { type: "Task",     label: "Task",     desc: "One-off deliverable" },
  { type: "Project",  label: "Project",  desc: "Scoped engagement" },
  { type: "Contract", label: "Contract", desc: "Ongoing staffing" },
  { type: "Consult",  label: "Consult",  desc: "Advisory / fractional" },
  { type: "Advisory", label: "Advisory", desc: "Board / strategic" },
];

const AVAILABILITY_OPTIONS = [
  "Available now",
  "Within 2 weeks",
  "Within a month",
  "Just exploring",
];

const DOMAIN_ICONS: Record<string, string> = {
  "Technology":               "⚡",
  "Government & Federal":     "🏛️",
  "Defense & Aerospace":      "🚀",
  "Trades & Construction":    "🔧",
  "Healthcare & Life Sciences": "🩺",
  "Finance & Accounting":     "📊",
  "Creative & Media":         "✦",
  "Legal & Compliance":       "⚖️",
};

// Blueprint input field style
const fieldCls =
  "w-full rounded-xl border border-[rgba(20,20,19,0.2)] bg-[#faf7f0] px-4 py-3 text-sm " +
  "text-[#141413] placeholder:text-[#141413]/40 focus:border-[#141413] " +
  "focus:outline-none focus:ring-1 focus:ring-[rgba(20,20,19,0.12)] transition";

// Blueprint primary CTA
const ctaCls =
  "rounded-full bg-[#141413] text-[#faf7f0] px-6 py-2.5 text-sm font-bold transition hover:opacity-85";

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ChatIntake() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  const [state, setState] = useState<State>({
    step: "intro",
    inputText: "",
    skills: [],
    suggestedSkills: [],
    domains: [],
    workTypes: ["Task", "Project", "Contract"],
    availability: "",
    rate: "",
    name: "",
    email: "",
    uploadMode: "text",
    botTyping: false,
    error: null,
  });

  const patch = useCallback((p: Partial<State> | ((s: State) => Partial<State>)) => {
    setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) }));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.step, state.botTyping]);

  async function botTransition(nextStep: Step, ms = 700) {
    patch({ botTyping: true });
    await delay(ms);
    patch({ botTyping: false, step: nextStep });
  }

  async function handleTextSubmit() {
    const text = state.inputText.trim();
    if (!text) return;
    patch({ step: "parsing", botTyping: true, error: null });
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      await delay(400);
      patch({
        botTyping: false,
        step: "skills",
        skills: data.confirmed ?? [],
        suggestedSkills: data.suggested ?? [],
      });
    } catch {
      patch({ botTyping: false, step: "input", error: "Couldn't parse that — try again." });
    }
  }

  async function handleFile(file: File) {
    patch({ step: "parsing", botTyping: true, error: null });
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await fetch("/api/intake", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      await delay(400);
      patch({
        botTyping: false,
        step: "skills",
        skills: data.confirmed ?? [],
        suggestedSkills: data.suggested ?? [],
      });
    } catch {
      patch({ botTyping: false, step: "input", error: "Couldn't read that file — try pasting instead." });
    }
  }

  async function handleSkip() {
    patch({ inputText: "[no resume]" });
    await botTransition("skills", 400);
  }

  function toggleSkill(skill: string) {
    patch((s) => ({
      skills: s.skills.includes(skill)
        ? s.skills.filter((x) => x !== skill)
        : [...s.skills, skill],
    }));
  }

  function toggleSuggested(skill: string) {
    patch((s) => ({
      skills: s.skills.includes(skill)
        ? s.skills.filter((x) => x !== skill)
        : [...s.skills, skill],
    }));
  }

  function addSkill(skill: string) {
    patch((s) => ({
      skills: s.skills.includes(skill) ? s.skills : [...s.skills, skill],
    }));
  }

  function toggleDomain(d: string) {
    patch((s) => ({
      domains: s.domains.includes(d)
        ? s.domains.filter((x) => x !== d)
        : [...s.domains, d],
    }));
  }

  function toggleWorkType(t: WorkType) {
    patch((s) => ({
      workTypes: s.workTypes.includes(t)
        ? s.workTypes.filter((x) => x !== t)
        : [...s.workTypes, t],
    }));
  }

  async function handleSubmit() {
    patch({ step: "submitting", botTyping: true });
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          skills: state.skills,
          domains: state.domains,
          workTypes: state.workTypes,
          availability: state.availability,
          rate: state.rate,
          inputText: state.inputText !== "[no resume]" ? state.inputText : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw err;
      }
      patch({ botTyping: false, step: "done" });
      router.push(`/success?name=${encodeURIComponent(state.name.split(" ")[0] ?? "")}`);
    } catch {
      patch({ botTyping: false, step: "contact", error: "Something went wrong — try again." });
    }
  }

  const { step } = state;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 pb-32 px-1">

      {/* ── INTRO ─────────────────────────────────────────────────────────── */}
      <ChatMessage role="system" content={
        <span>
          Hey — <span className="font-semibold">what do you do?</span>
          <br />
          <span className="text-[#faf7f0]/60 text-xs mt-0.5 block">
            Drop a resume, paste your background, or just type it out.
          </span>
        </span>
      } />

      {/* ── INPUT STEP ────────────────────────────────────────────────────── */}
      {step === "intro" && (
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 space-y-3">
          <InputPanel
            value={state.inputText}
            onChange={(v) => patch({ inputText: v })}
            onSubmit={handleTextSubmit}
            onFile={handleFile}
            onSkip={handleSkip}
            error={state.error}
            fileInputRef={fileInputRef}
          />
        </div>
      )}

      {/* ── PARSING ───────────────────────────────────────────────────────── */}
      {step === "parsing" && (
        <>
          <ChatMessage role="user" content={
            state.inputText && state.inputText !== "[no resume]"
              ? state.inputText.slice(0, 60) + (state.inputText.length > 60 ? "…" : "")
              : "Resume uploaded."
          } />
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm bg-[#141413] px-4 py-3">
              <TypingIndicator />
            </div>
          </div>
        </>
      )}

      {/* ── SKILLS STEP ───────────────────────────────────────────────────── */}
      {(step === "skills" || step === "domains" || step === "work-type" ||
        step === "availability" || step === "rate" || step === "contact" ||
        step === "submitting") && (
        <>
          {state.inputText && state.inputText !== "[no resume]" && (
            <ChatMessage role="user" content={
              state.inputText.slice(0, 60) + (state.inputText.length > 60 ? "…" : "")
            } />
          )}

          <ChatMessage role="system" content={
            state.skills.length > 0
              ? "Got it — here's what I'm seeing. Tap to remove, add what I missed."
              : "Nothing extracted. Tell me what you're good at."
          } />

          {step === "skills" && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 space-y-4">
              {state.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {state.skills.map((s) => (
                    <SkillChip key={s} skill={s} selected onToggle={toggleSkill} />
                  ))}
                </div>
              )}

              {state.suggestedSkills.filter((s) => !state.skills.includes(s)).length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-[#141413]/50">People with your background often also do:</p>
                  <div className="flex flex-wrap gap-2">
                    {state.suggestedSkills
                      .filter((s) => !state.skills.includes(s))
                      .map((s) => (
                        <SkillChip key={s} skill={s} selected={false} onToggle={toggleSuggested} variant="suggest" />
                      ))}
                  </div>
                </div>
              )}

              <AddSkillInput confirmed={state.skills} onAdd={addSkill} />

              <button
                type="button"
                onClick={() => botTransition("domains", 500)}
                className={ctaCls}
              >
                {state.skills.length > 0 ? "Looks right →" : "Skip →"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── DOMAINS STEP ──────────────────────────────────────────────────── */}
      {(step === "domains" || step === "work-type" || step === "availability" ||
        step === "rate" || step === "contact" || step === "submitting") && (
        <>
          {step !== "domains" && (
            <ChatMessage role="user" content={
              state.skills.length > 0
                ? `${state.skills.length} skill${state.skills.length !== 1 ? "s" : ""} confirmed.`
                : "Skills noted."
            } />
          )}
          <ChatMessage role="system" content="What world do you work in? Pick all that apply." />

          {step === "domains" && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DOMAINS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDomain(d)}
                    className={`
                      group flex flex-col gap-1 rounded-2xl border px-3 py-3 text-left
                      text-xs font-medium transition-all duration-150
                      ${state.domains.includes(d)
                        ? "border-[#141413] bg-[#141413] text-[#faf7f0]"
                        : "border-[rgba(20,20,19,0.18)] bg-[#faf7f0] text-[#141413]/65 hover:border-[rgba(20,20,19,0.35)] hover:bg-[rgba(20,20,19,0.04)]"
                      }
                    `}
                  >
                    <span className="text-lg leading-none">{DOMAIN_ICONS[d] ?? "◆"}</span>
                    <span className="leading-snug">{d}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => botTransition("work-type", 500)}
                disabled={state.domains.length === 0}
                className={`${ctaCls} disabled:opacity-40`}
              >
                Continue →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── WORK TYPE STEP ────────────────────────────────────────────────── */}
      {(step === "work-type" || step === "availability" || step === "rate" ||
        step === "contact" || step === "submitting") && (
        <>
          {step !== "work-type" && (
            <ChatMessage role="user" content={state.domains.join(" · ") || "Domains noted."} />
          )}
          <ChatMessage role="system" content="What kind of engagement fits you?" />

          {step === "work-type" && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 space-y-3">
              <div className="flex flex-wrap gap-2">
                {WORK_TYPES.map(({ type, label, desc }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleWorkType(type)}
                    className={`
                      flex flex-col rounded-2xl border px-4 py-3 text-left transition-all
                      ${state.workTypes.includes(type)
                        ? "border-[#141413] bg-[#141413] text-[#faf7f0]"
                        : "border-[rgba(20,20,19,0.18)] bg-[#faf7f0] text-[#141413] hover:border-[rgba(20,20,19,0.35)] hover:bg-[rgba(20,20,19,0.04)]"
                      }
                    `}
                  >
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-xs opacity-60 mt-0.5">{desc}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => botTransition("availability", 500)}
                disabled={state.workTypes.length === 0}
                className={`${ctaCls} disabled:opacity-40`}
              >
                Continue →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── AVAILABILITY STEP ─────────────────────────────────────────────── */}
      {(step === "availability" || step === "rate" || step === "contact" || step === "submitting") && (
        <>
          {step !== "availability" && (
            <ChatMessage role="user" content={state.workTypes.join(" · ")} />
          )}
          <ChatMessage role="system" content="When are you available?" />

          {step === "availability" && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 space-y-3">
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => patch({ availability: opt })}
                    className={`
                      rounded-full border px-4 py-2 text-sm font-medium transition
                      ${state.availability === opt
                        ? "border-[#141413] bg-[#141413] text-[#faf7f0]"
                        : "border-[rgba(20,20,19,0.18)] bg-[#faf7f0] text-[#141413]/65 hover:border-[rgba(20,20,19,0.35)]"
                      }
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => botTransition("rate", 500)}
                disabled={!state.availability}
                className={`${ctaCls} disabled:opacity-40`}
              >
                Continue →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── RATE STEP ─────────────────────────────────────────────────────── */}
      {(step === "rate" || step === "contact" || step === "submitting") && (
        <>
          {step !== "rate" && (
            <ChatMessage role="user" content={state.availability} />
          )}
          <ChatMessage role="system" content={
            <span>
              What should a scope pay you?
              <span className="text-[#faf7f0]/50 text-xs block mt-0.5">$120/hr · $8k/wk · $25k project — whatever fits.</span>
            </span>
          } />

          {step === "rate" && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 space-y-3">
              <input
                type="text"
                placeholder="e.g. $150/hr or $20k project"
                value={state.rate}
                onChange={(e) => patch({ rate: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && botTransition("contact", 500)}
                className={fieldCls}
                autoFocus
              />
              <button
                type="button"
                onClick={() => botTransition("contact", 500)}
                className={ctaCls}
              >
                {state.rate ? "Continue →" : "Skip →"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── CONTACT STEP ──────────────────────────────────────────────────── */}
      {(step === "contact" || step === "submitting") && (
        <>
          {step !== "contact" && state.rate && (
            <ChatMessage role="user" content={state.rate} />
          )}
          <ChatMessage role="system" content="Last thing — name and email, and you're in." />

          {step === "contact" && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={state.name}
                onChange={(e) => patch({ name: e.target.value })}
                className={fieldCls}
                autoFocus
              />
              <input
                type="email"
                inputMode="email"
                placeholder="your@email.com"
                value={state.email}
                onChange={(e) => patch({ email: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && state.name.trim() && state.email.includes("@")) {
                    handleSubmit();
                  }
                }}
                className={fieldCls}
              />
              {state.error && <p className="text-xs text-red-600">{state.error}</p>}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!state.name.trim() || !state.email.includes("@")}
                className={`w-full py-3.5 ${ctaCls} disabled:opacity-40`}
              >
                You&apos;re in →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── BOT TYPING INDICATOR ──────────────────────────────────────────── */}
      {state.botTyping && (
        <div className="flex justify-start animate-in fade-in duration-200">
          <div className="rounded-2xl rounded-tl-sm bg-[#141413] px-4 py-3">
            <TypingIndicator />
          </div>
        </div>
      )}

      {/* ── SUBMITTING ────────────────────────────────────────────────────── */}
      {step === "submitting" && !state.botTyping && (
        <ChatMessage role="user" content={`${state.name} · ${state.email}`} />
      )}

      <div ref={bottomRef} className="h-1" />
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function InputPanel({
  value,
  onChange,
  onSubmit,
  onFile,
  onSkip,
  error,
  fileInputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onFile: (f: File) => void;
  onSkip: () => void;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }

  return (
    <div className="space-y-3">
      {/* Text input */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && value.trim()) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Paste your LinkedIn about section, bullet your background, or just type what you do..."
          rows={4}
          className="w-full resize-none rounded-2xl border border-[rgba(20,20,19,0.2)] bg-[#faf7f0] px-4 py-3 pr-24 text-sm text-[#141413] placeholder:text-[#141413]/40 focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[rgba(20,20,19,0.12)] transition"
          autoFocus
        />
        {value.trim() && (
          <button
            type="button"
            onClick={onSubmit}
            className="absolute bottom-3 right-3 rounded-full bg-[#141413] text-[#faf7f0] px-3.5 py-1.5 text-xs font-bold transition hover:opacity-85"
          >
            Go →
          </button>
        )}
      </div>

      {/* Upload drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed
          px-5 py-4 transition-colors duration-150
          ${dragging
            ? "border-[#141413] bg-[rgba(20,20,19,0.05)]"
            : "border-[rgba(20,20,19,0.2)] bg-[#faf7f0]/60 hover:border-[rgba(20,20,19,0.4)] hover:bg-[rgba(20,20,19,0.04)]"
          }
        `}
      >
        <svg className="h-5 w-5 shrink-0 text-[#141413]/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <div>
          <p className="text-sm font-medium text-[#141413]/75">Or drop a resume</p>
          <p className="text-xs text-[#141413]/40">PDF or .txt · max 10MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={onSkip}
        className="text-xs text-[#141413]/40 hover:text-[#141413]/70 transition underline-offset-2 hover:underline"
      >
        Skip — I&apos;ll add skills manually
      </button>
    </div>
  );
}

function AddSkillInput({
  confirmed,
  onAdd,
}: {
  confirmed: string[];
  onAdd: (s: string) => void;
}) {
  const [value, setValue] = useState("");

  const matches = value.length > 1
    ? (SKILLS as readonly string[])
        .filter((s) => s.toLowerCase().includes(value.toLowerCase()) && !confirmed.includes(s))
        .slice(0, 6)
    : [];

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Add a skill..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-[rgba(20,20,19,0.2)] bg-[#faf7f0] px-4 py-2.5 text-sm text-[#141413] placeholder:text-[#141413]/40 focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[rgba(20,20,19,0.12)] transition"
      />
      {matches.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {matches.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { onAdd(s); setValue(""); }}
              className="rounded-full border border-dashed border-[rgba(20,20,19,0.25)] bg-[#faf7f0] px-3 py-1.5 text-xs font-medium text-[#141413]/65 transition hover:border-[rgba(20,20,19,0.5)] hover:bg-[rgba(20,20,19,0.04)]"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
