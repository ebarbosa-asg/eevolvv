/** Decorative thread diagram below founder bio — Navy → space → neural → build */
export function FounderPathDiagram() {
  return (
    <div
      style={{
        marginTop: 28,
        paddingTop: 22,
        borderTop: "1px solid var(--rule)",
      }}
    >
      <p
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          opacity: 0.45,
          margin: "0 0 18px",
        }}
      >
        FIG. 08 · OPERATOR THREAD
      </p>
      <svg
        viewBox="0 0 440 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="var(--ink)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          width: "100%",
          maxWidth: 520,
          height: "auto",
          display: "block",
          opacity: 0.72,
        }}
      >
        {/* Submarine — hull + conning tower (joined) + periscope from sail + bubbles */}
        <g>
          <circle cx="12" cy="43" r="1.5" opacity={0.4} />
          <circle cx="7" cy="37" r="1" opacity={0.48} />
          <circle cx="17" cy="32" r="1.8" opacity={0.34} />
          <circle cx="5" cy="27" r="0.75" opacity={0.5} />
          <circle cx="21" cy="23" r="1.2" opacity={0.4} />
          <circle cx="9" cy="19" r="0.65" opacity={0.45} />
          <ellipse cx="46" cy="36" rx="22" ry="7.5" />
          <path d="M 33 28.5 L 33 20.5 L 43.5 18 L 53 20.5 L 53 28.5 Z" />
          <path d="M 43.5 18 L 43.5 6.5 M 40.5 6.5 L 46.5 6.5" />
          <path d="M 26 34 h 4" opacity={0.65} />
        </g>

        <path d="M 76 33 h 12 m -3.5 -3.5 L 88 33 84.5 36.5" />

        {/* Rocket — tapered nose, cylindrical stage, engine skirt, swept fins */}
        <g>
          <path d="M 118 8 L 109 17.5 L 107.5 31 L 110 36 L 118 38.5 L 126 36 L 128.5 31 L 127 17.5 L 118 8 Z" />
          <circle cx="118" cy="24.5" r="3.6" />
          <path d="M 107.5 31 L 100 45 M 128.5 31 L 136 45" />
          <path d="M 115 38.5 L 118 46 L 121 38.5" opacity={0.55} />
        </g>

        <path d="M 152 33 h 12 m -3.5 -3.5 L 164 33 160.5 36.5" />

        {/* Brain — top-down cerebrum: mirrored lobes, longitudinal fissure, gyri */}
        <g>
          <path d="M 220 13 Q 212 11 202 15 Q 188 22 184 32 Q 182 40 187 46 Q 194 51 208 49 Q 216 47 220 41" />
          <path d="M 220 13 Q 228 11 238 15 Q 252 22 256 32 Q 258 40 253 46 Q 246 51 232 49 Q 224 47 220 41" />
          <path d="M 220 13 C 217.5 22 217.5 32 220 42" opacity={0.92} />
          <path
            d="M 196 26 Q 202 22 204 28 Q 200 34 196 30 M 205 24 Q 211 28 209 34 M 235 26 Q 229 22 227 28 Q 231 34 235 30 M 226 24 Q 220 28 222 34"
            opacity={0.68}
          />
        </g>

        <path d="M 268 33 h 12 m -3.5 -3.5 L 280 33 276.5 36.5" />

        {/* Robot — scaled up vs other glyphs for visual balance */}
        <g transform="translate(322 23.5) scale(1.52) translate(-322 -23.5)">
          <line x1="322" y1="10" x2="322" y2="17" />
          <rect x="312" y="17" width="20" height="15" rx="2.2" />
          <circle cx="318.5" cy="24.5" r="1.35" fill="var(--ink)" stroke="none" />
          <circle cx="325.5" cy="24.5" r="1.35" fill="var(--ink)" stroke="none" />
          <path d="M 317 32 v 3.5 M 322 32 v 3.5 M 327 32 v 3.5" />
        </g>
      </svg>
    </div>
  );
}
