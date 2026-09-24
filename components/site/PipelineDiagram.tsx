"use client";

import { useEffect, useRef } from "react";

const steps = [
  { n: "01", title: "Drop", body: "Drive folder or unlisted link.", art: "drop" },
  { n: "02", title: "Hook", body: "Moments that stand alone.", art: "hook" },
  { n: "03", title: "Title", body: "Readable titles. SEO on Pro.", art: "title" },
  { n: "04", title: "Post", body: "Shorts, TikTok, Reels. LinkedIn on Pro.", art: "post" },
  { n: "05", title: "Report", body: "Loom, then double down.", art: "report" },
] as const;

function StepArt({ kind }: { kind: (typeof steps)[number]["art"] }) {
  const common = { fill: "none", stroke: "#3DFF8A", strokeWidth: 2 } as const;
  return (
    <svg className="pipe-art" viewBox="0 0 120 84" aria-hidden="true">
      {kind === "drop" && (
        <>
          <rect x="34" y="16" width="52" height="40" rx="6" {...common} />
          <path d="M48 56 v12 M72 56 v12 M40 68 h40" {...common} />
        </>
      )}
      {kind === "hook" && <path d="M30 58 C30 20 90 20 90 48" {...common} strokeLinecap="round" />}
      {kind === "title" && (
        <>
          <path d="M28 28 h64 M28 42 h48 M28 56 h40" {...common} strokeLinecap="round" />
        </>
      )}
      {kind === "post" && <path d="M30 54 L60 24 L90 54 M60 24 v40" {...common} strokeLinecap="round" strokeLinejoin="round" />}
      {kind === "report" && (
        <>
          <path d="M28 58 L48 40 L64 50 L92 24" {...common} strokeLinecap="round" />
          <path d="M28 64 h64" {...common} />
        </>
      )}
    </svg>
  );
}

export function PipelineDiagram() {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || window.innerWidth < 980) {
      el.classList.add("is-drawn");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-drawn");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className="pipeline" aria-label="Five steps. Drop the recording, cut the hook, title it, post it, report it.">
      {steps.map((step) => (
        <li key={step.n}>
          <StepArt kind={step.art} />
          <span className="step-no">{step.n}</span>
          <h3>{step.title}</h3>
          <p className="muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
