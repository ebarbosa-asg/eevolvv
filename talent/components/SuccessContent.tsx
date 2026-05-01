"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SHARE_URL = "https://talent.eevolvv.com/join";

export function SuccessContent() {
  const name = useSearchParams().get("name");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try { await navigator.clipboard.writeText(SHARE_URL); }
    catch {
      const el = Object.assign(document.createElement("textarea"), { value: SHARE_URL });
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative overflow-hidden px-4 pb-24 pt-20 md:px-6 md:pt-28">
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-32 h-80 w-80 rounded-full bg-teal-200/35 blur-3xl" />
      <div className="relative mx-auto max-w-lg space-y-10">
        <div className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/30">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">
            {name ? `You're in, ${name}.` : "You're in."}
          </h1>
          <p className="text-slate-500">
            Skills on the graph. We&apos;ll reach out when the fit is real.
            Tasks pay — you&apos;ll know what it&apos;s worth before you commit.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-cyan-200/70 bg-white/85 px-6 py-6 backdrop-blur-sm">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">What&apos;s next</p>
          <ul className="space-y-3">
            {[
              "Profile reviewed within 24 hours",
              "You get a message when a scope fits your stack",
              "You opt in — we never share without asking",
              "Every scope comes with a spec and a payout",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-200/80 bg-teal-50">
                  <svg className="h-3 w-3 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-900">Spread the word. Get the homie paid.</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just joined eevolvv/talent — skills get matched to paid tasks. No job board. No feed. Just real work when the fit is there.\n${SHARE_URL}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.03]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              Share on X
            </a>
            <button onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border-2 border-cyan-300/90 bg-white/80 px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-400">
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            <Link href="/" className="inline-flex items-center rounded-full border-2 border-cyan-300/90 bg-white/80 px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-400">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
