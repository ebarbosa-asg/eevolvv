const steps = [
  { n: "01", title: "Drop", body: "Hours recorded", icon: "drop" },
  { n: "02", title: "Find moments", body: "Best peaks", icon: "moments" },
  { n: "03", title: "Auto-clip", body: "9:16 + captions", icon: "clip" },
  { n: "04", title: "SEO titles", body: "Hooks + meta", icon: "seo" },
  { n: "05", title: "Post", body: "4 platforms", icon: "post" },
  { n: "06", title: "Report", body: "Double down", icon: "report" },
] as const;

function StepIcon({ kind }: { kind: (typeof steps)[number]["icon"] }) {
  const stroke = { fill: "none", stroke: "#3DFF8A", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      {kind === "drop" && (
        <>
          <path d="M16 6 v12" {...stroke} />
          <path d="M11 14 l5 5 5-5" {...stroke} />
          <path d="M8 22 h16 v4 H8 Z" {...stroke} />
        </>
      )}
      {kind === "moments" && (
        <>
          <circle cx="13" cy="15" r="6" {...stroke} />
          <circle cx="20" cy="18" r="5" {...stroke} />
        </>
      )}
      {kind === "clip" && (
        <>
          <rect x="11" y="5" width="10" height="22" rx="2" {...stroke} />
          <path d="M14 14 l5 3-5 3 Z" fill="#3DFF8A" stroke="none" />
        </>
      )}
      {kind === "seo" && (
        <>
          <path d="M10 6 h8 l4 4 v16 H10 Z" {...stroke} />
          <path d="M18 6 v4 h4" {...stroke} />
          <path d="M13 16 h6 M13 20 h4" {...stroke} />
        </>
      )}
      {kind === "post" && (
        <>
          <rect x="7" y="8" width="7" height="7" rx="1.5" fill="#3DFF8A" />
          <rect x="18" y="8" width="7" height="7" rx="1.5" fill="#5AA2FF" />
          <rect x="7" y="18" width="7" height="7" rx="1.5" fill="#C084FC" />
          <rect x="18" y="18" width="7" height="7" rx="1.5" fill="#FF5D6C" />
        </>
      )}
      {kind === "report" && (
        <>
          <path d="M7 24 V10" {...stroke} />
          <path d="M7 24 H26" {...stroke} />
          <path d="M10 20 v-4 M16 20 V12 M22 20 v-6" {...stroke} />
        </>
      )}
    </svg>
  );
}

export function PipelineDiagram() {
  return (
    <div className="how-block">
      <ol className="how-steps" aria-label="Six steps from a long-form recording to a feed-ready batch.">
        {steps.map((step) => (
          <li key={step.n}>
            <span className="how-node">
              <StepIcon kind={step.icon} />
            </span>
            <span className="step-no">{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      <ul className="platforms" aria-label="Where clips are posted">
        <li>YouTube Shorts</li>
        <li>TikTok</li>
        <li>Instagram Reels</li>
        <li>LinkedIn on Dominate</li>
      </ul>
      <div className="winners">
        <span className="winners-orb" aria-hidden="true" />
        <p>
          <strong>Feed winners back</strong>
          <span>Analytics → clipper taste → next batch</span>
        </p>
      </div>
    </div>
  );
}
