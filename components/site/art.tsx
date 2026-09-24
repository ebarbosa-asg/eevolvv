export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#3DFF8A" />
      <text
        x="16"
        y="22.5"
        textAnchor="middle"
        fill="#06210f"
        fontFamily="IBM Plex Sans, sans-serif"
        fontSize="18"
        fontWeight="700"
      >
        e
      </text>
    </svg>
  );
}

export function PillDuo() {
  return (
    <svg className="pill-duo" viewBox="0 0 56 40" aria-hidden="true">
      <rect x="4" y="4" width="20" height="32" rx="10" fill="#4D8DFF" />
      <rect x="28" y="4" width="20" height="32" rx="10" fill="#FF4D5E" />
    </svg>
  );
}

export function CaptureMark() {
  return (
    <svg className="capture-mark" viewBox="0 0 48 64" aria-hidden="true">
      <path d="M6 4h36L34 18H14Z" fill="#3DFF8A" />
      <path d="M14 20h20l-6 14H20Z" fill="#8BFFB8" />
      <path d="M20 36h8l-4 10Z" fill="#FF5D6C" />
    </svg>
  );
}

/** TODO: swap this SVG poster for a Rive state machine at public/rive/lever.riv (idle → hover lift → click pulse). */
export function LeverArt() {
  return (
    <svg
      className="lever"
      viewBox="0 0 760 560"
      role="img"
      aria-label="A lever. Long-form content sits low on the left. The pipeline fulcrum tips a wall of phones up toward the feed."
    >
      <defs>
        <linearGradient id="lever-beam" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#14c964" />
          <stop offset="0.45" stopColor="#7dffb0" />
          <stop offset="1" stopColor="#3DFF8A" />
        </linearGradient>
        <radialGradient id="lever-disc" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#0f2a1c" />
          <stop offset="70%" stopColor="#0c1c14" />
          <stop offset="100%" stopColor="#0c1c14" stopOpacity="0" />
        </radialGradient>
        <filter id="lever-glow" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="400" cy="310" r="158" fill="url(#lever-disc)" />
      <text x="702" y="42" textAnchor="middle" fill="#E6C36A" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="13" letterSpacing="2.4">
        THE FEED
      </text>
      <circle cx="702" cy="108" r="46" fill="none" stroke="#3DFF8A" strokeWidth="3" />
      <circle cx="702" cy="108" r="27" fill="none" stroke="#3DFF8A" strokeWidth="3" />
      <circle cx="702" cy="108" r="8" fill="#07140c" stroke="#3DFF8A" strokeWidth="3" />
      <g className="lever-arm">
        <path d="M118 438 L610 248" stroke="url(#lever-beam)" strokeWidth="18" strokeLinecap="round" filter="url(#lever-glow)" />
        <circle cx="108" cy="448" r="34" fill="#FF4D6D" opacity="0.22" />
        <circle cx="108" cy="448" r="16" fill="#FF4D6D" />
        {[
          { x: 456, y: 278, r: -18 },
          { x: 518, y: 236, r: -14 },
          { x: 576, y: 198, r: -10 },
        ].map((phone) => (
          <g key={phone.x} transform={`translate(${phone.x} ${phone.y}) rotate(${phone.r})`}>
            <rect x="-26" y="-46" width="52" height="92" rx="10" fill="#070a08" stroke="#3DFF8A" strokeWidth="2.4" />
            <rect x="-16" y="-30" width="32" height="48" rx="3" fill="none" stroke="#1A9F52" strokeWidth="1.4" />
            <path d="M-4 -10 L8 -2 L-4 6 Z" fill="#3DFF8A" />
          </g>
        ))}
      </g>
      <text x="108" y="508" textAnchor="middle" fill="#FF5D73" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="12" letterSpacing="1.6">
        CONTENT
      </text>
      <path d="M392 300 L440 392 H344 Z" fill="#3DFF8A" />
      <text x="470" y="428" textAnchor="middle" fill="#3DFF8A" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="12" letterSpacing="1.6">
        PIPELINE
      </text>
    </svg>
  );
}

export function TerminalStrip() {
  return (
    <p className="terminal" aria-hidden="true">
      <span className="prompt">eevolvv@ops:~$</span>
      <span className="cmd">clip --ship episode.mp4</span>
    </p>
  );
}

const triad = [
  {
    title: "Place to stand",
    body: "The hard creative work is done. Episodes, demos, and webinars sit unused in a folder.",
    icon: "stand",
  },
  {
    title: "Lever",
    body: "Selection, captions, titles, and posting. Humans stay for taste and brand safety.",
    icon: "lever",
  },
  {
    title: "World",
    body: "Not guaranteed virality. Your best moments leave the archive and meet the feed.",
    icon: "world",
  },
] as const;

function TriadIcon({ kind }: { kind: (typeof triad)[number]["icon"] }) {
  if (kind === "stand") {
    return (
      <svg className="card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <rect x="16" y="18" width="40" height="30" rx="6" fill="none" stroke="#3DFF8A" strokeWidth="2" />
        <path d="M24 54 h24" stroke="#3DFF8A" strokeWidth="2" />
        <circle cx="36" cy="33" r="6" fill="#FF5D6C" />
      </svg>
    );
  }
  if (kind === "lever") {
    return (
      <svg className="card-icon" viewBox="0 0 72 72" aria-hidden="true">
        <path d="M14 50 L58 22" stroke="#3DFF8A" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 52 L42 52 L36 40 Z" fill="#3DFF8A" />
        <circle cx="14" cy="50" r="5" fill="#FF5D6C" />
      </svg>
    );
  }
  return (
    <svg className="card-icon" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="16" fill="none" stroke="#3DFF8A" strokeWidth="2" />
      <ellipse cx="36" cy="36" rx="7" ry="16" fill="none" stroke="#1A9F52" strokeWidth="2" />
      <path d="M20 36 h32" stroke="#1A9F52" strokeWidth="2" />
    </svg>
  );
}

export function LeverTriad() {
  return (
    <div className="triad">
      {triad.map((item) => (
        <article className="card" key={item.title}>
          <TriadIcon kind={item.icon} />
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

export function FunnelGraphic() {
  const bands = [
    { y: 10, w: 420, label: "Viewers", fill: "#3DFF8A" },
    { y: 78, w: 320, label: "Followers", fill: "#3DDCB0" },
    { y: 146, w: 230, label: "Sub / email", fill: "#FFD166" },
    { y: 214, w: 150, label: "Customers", fill: "#FF5D6C" },
  ];
  return (
    <svg className="funnel-svg" viewBox="0 0 520 340" role="img" aria-label="Audience capture funnel: viewers, followers, subscribers, customers.">
      {bands.map((band) => {
        const x = (520 - band.w) / 2;
        return (
          <g key={band.label}>
            <path
              d={`M${x} ${band.y} H${x + band.w} L${x + band.w - 28} ${band.y + 52} H${x + 28} Z`}
              fill={band.fill}
              opacity="0.9"
            />
            <text x="260" y={band.y + 32} textAnchor="middle" fill="#07140c" fontFamily="IBM Plex Sans, sans-serif" fontSize="16" fontWeight="700">
              {band.label}
            </text>
          </g>
        );
      })}
      <circle cx="260" cy="300" r="10" fill="#3DFF8A" />
    </svg>
  );
}

const phones = [
  { rim: "#3DFF8A", tilt: "-6deg" },
  { rim: "#5AA2FF", tilt: "-2deg" },
  { rim: "#FFD166", tilt: "1deg" },
  { rim: "#C084FC", tilt: "3deg" },
  { rim: "#FF5D6C", tilt: "6deg" },
];

export function PhoneWall() {
  return (
    <div className="phone-wall" aria-hidden="true">
      {phones.map((phone) => (
        <div
          key={phone.rim}
          className="phone"
          style={{ ["--rim" as string]: phone.rim, ["--tilt" as string]: phone.tilt }}
        >
          <div className="phone-screen">
            <b />
            <i />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12.5 l4.2 4.2 L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NicheArt({ slug }: { slug: "podcasts" | "saas" | "coaches" }) {
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Illustration of long-form source becoming short clips.">
      <rect width="640" height="420" rx="28" fill="#101612" />
      {slug === "podcasts" && (
        <g>
          <rect x="70" y="90" width="150" height="240" rx="75" fill="none" stroke="#3DFF8A" strokeWidth="8" />
          <path d="M40 180 q-30 30 0 70" fill="none" stroke="#5AA2FF" strokeWidth="6" />
          <path d="M250 180 q30 30 0 70" fill="none" stroke="#5AA2FF" strokeWidth="6" />
        </g>
      )}
      {slug === "saas" && (
        <g>
          <rect x="48" y="80" width="220" height="160" rx="16" fill="none" stroke="#3DFF8A" strokeWidth="4" />
          <path d="M70 190 L110 150 L150 170 L210 110" fill="none" stroke="#3DFF8A" strokeWidth="4" />
        </g>
      )}
      {slug === "coaches" && (
        <g>
          <circle cx="140" cy="180" r="70" fill="none" stroke="#FFD166" strokeWidth="6" />
          <path d="M128 160 L170 180 L128 200 Z" fill="#FFD166" />
        </g>
      )}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${340 + i * 70} ${80 + i * 18})`}>
          <rect width="86" height="160" rx="16" fill="#0A0C0B" stroke="#3DFF8A" strokeWidth="3" />
          <path d="M34 70 L58 84 L34 98 Z" fill="#3DFF8A" />
        </g>
      ))}
    </svg>
  );
}

export function FlowDiagram({ steps }: { steps: readonly { label: string; caption: string }[] }) {
  return (
    <ol className="pipeline is-drawn" aria-label={steps.map((step) => step.label).join(", ")}>
      {steps.map((step, index) => (
        <li key={step.label}>
          <span className="step-no">0{index + 1}</span>
          <h3>{step.label}</h3>
          <p className="muted">{step.caption}</p>
        </li>
      ))}
    </ol>
  );
}

export function BlogArt() {
  return (
    <svg viewBox="0 0 640 280" role="img" aria-label="Abstract lever and clip frames.">
      <rect width="640" height="280" fill="#101612" />
      <path d="M80 200 L520 70" stroke="#3DFF8A" strokeWidth="8" strokeLinecap="round" />
      <circle cx="80" cy="200" r="16" fill="#FF5D6C" />
      <circle cx="520" cy="70" r="28" fill="none" stroke="#3DFF8A" strokeWidth="3" />
    </svg>
  );
}
