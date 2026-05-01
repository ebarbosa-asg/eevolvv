"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DOMAINS } from "@/data/domains";

type WorkType = "Task" | "Contract" | "Consult";

const TYPE_META = {
  Task: { icon: "⚡", desc: "One deliverable. Fast payout." },
  Contract: { icon: "📋", desc: "Scoped engagement. Written agreement." },
  Consult: { icon: "💡", desc: "Knowledge session. Expert access." },
};

const TIMELINES = ["Within 1 week", "1–2 weeks", "This month", "1–3 months", "Flexible"];

const fieldClass =
  "w-full rounded-xl border border-cyan-200/80 bg-white/90 px-4 py-3 text-sm " +
  "text-slate-900 placeholder:text-slate-400 focus:border-teal-400 " +
  "focus:outline-none focus:ring-2 focus:ring-cyan-400/25";

export function PostWorkForm() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "submitting" | "success">("form");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    workType: "" as WorkType | "",
    title: "",
    description: "",
    sector: "",
    timeline: "",
    name: "",
    email: "",
    organization: "",
    budget: "",
  });

  function set(patch: Partial<typeof form>) {
    setForm((f) => ({ ...f, ...patch }));
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.workType) e.workType = "Select a work type";
    if (!form.title.trim()) e.title = "Required";
    if (form.description.trim().length < 40) e.description = "At least 40 characters";
    if (!form.sector) e.sector = "Required";
    if (!form.timeline) e.timeline = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStep("submitting");
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: form.budget || undefined,
          organization: form.organization || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStep("success");
    } catch {
      setErrors({ submit: "Something went wrong. Try again." });
      setStep("form");
    }
  }

  if (step === "success") {
    return (
      <div className="space-y-4 rounded-[1.75rem] border border-cyan-200/70 bg-white/85 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/30">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Scope received.</h2>
        <p className="text-slate-500">
          We review every submission. If there&apos;s a fit in the pool, you&apos;ll hear back within one business day.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full border-2 border-cyan-300/90 bg-white/80 px-6 py-2.5 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-400"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Work type */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">What type of work is this?</p>
        <div className="flex gap-3">
          {(Object.keys(TYPE_META) as WorkType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set({ workType: t })}
              className={[
                "flex flex-1 flex-col gap-1 rounded-[1.25rem] border p-4 text-left transition-all duration-200",
                form.workType === t
                  ? "border-cyan-400 bg-cyan-50/60 shadow-lg shadow-cyan-500/15"
                  : "border-cyan-200/70 bg-white/85 hover:border-cyan-300",
              ].join(" ")}
            >
              <span className="text-xl">{TYPE_META[t].icon}</span>
              <p className={["text-sm font-bold", form.workType === t ? "text-cyan-700" : "text-slate-900"].join(" ")}>{t}</p>
              <p className="text-xs text-slate-500">{TYPE_META[t].desc}</p>
            </button>
          ))}
        </div>
        {errors.workType && <p className="text-xs text-red-500">{errors.workType}</p>}
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-900">Title / what needs doing</label>
        <input
          type="text"
          placeholder="e.g. Fix a plumbing leak, Build a React dashboard, Review a contract"
          value={form.title}
          onChange={(e) => set({ title: e.target.value })}
          className={fieldClass}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-900">Describe the work</label>
        <textarea
          placeholder="What needs to happen? What does done look like? Any constraints?"
          rows={5}
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
          className={`${fieldClass} resize-none`}
        />
        <p className="text-xs text-slate-400">{form.description.length} / 40 min</p>
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      {/* Sector + Timeline */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-900">Sector</label>
          <select
            value={form.sector}
            onChange={(e) => set({ sector: e.target.value })}
            className={fieldClass}
          >
            <option value="">Select sector</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.sector && <p className="text-xs text-red-500">{errors.sector}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-900">Timeline</label>
          <select
            value={form.timeline}
            onChange={(e) => set({ timeline: e.target.value })}
            className={fieldClass}
          >
            <option value="">When do you need this?</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.timeline && <p className="text-xs text-red-500">{errors.timeline}</p>}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-900">Budget <span className="font-normal text-slate-400">(optional)</span></label>
        <input
          type="text"
          placeholder="e.g. $500, $5k–$10k, TBD"
          value={form.budget}
          onChange={(e) => set({ budget: e.target.value })}
          className={fieldClass}
        />
      </div>

      {/* Contact */}
      <div className="space-y-3 rounded-[1.25rem] border border-cyan-100/80 bg-white/60 p-5">
        <p className="text-sm font-semibold text-slate-900">Your contact info</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <input type="text" placeholder="Name" value={form.name}
              onChange={(e) => set({ name: e.target.value })} className={fieldClass} />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <input type="email" placeholder="Email" value={form.email}
              onChange={(e) => set({ email: e.target.value })} className={fieldClass} />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
        </div>
        <input type="text" placeholder="Organization (optional)" value={form.organization}
          onChange={(e) => set({ organization: e.target.value })} className={fieldClass} />
      </div>

      {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

      <button
        type="submit"
        disabled={step === "submitting"}
        className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/35 transition hover:scale-[1.02] disabled:opacity-50"
      >
        {step === "submitting" ? "Sending..." : "Submit scope →"}
      </button>
    </form>
  );
}
