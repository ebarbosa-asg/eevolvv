import { ImageResponse } from "next/og";

export const alt = "eevolvv/talent — Skilled work, placed right";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#141413";
const PAPER = "#faf7f0";
const ACCENT = "#8b2e14";

// Rotation math: 8° clockwise around fulcrum point (600, 315) in 1200×630
// Lever group container: left=60, top=247, width=1020, height=136
// Fulcrum offset within group: (540, 68) → world (600, 315)
const PIVOT = "translate(540px, 68px) rotate(8deg) translate(-540px, -68px)";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: PAPER,
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "monospace",
        }}
      >
        {/* Blueprint grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(20,20,19,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,19,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* FIG. 01 / PLACEMENT MECHANICS */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 68,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span style={{ display: "flex", fontSize: 18, letterSpacing: 4, color: "rgba(20,20,19,0.5)" }}>
            FIG. 01
          </span>
          <span style={{ display: "flex", fontSize: 18, letterSpacing: 4, color: "rgba(20,20,19,0.5)" }}>
            PLACEMENT MECHANICS
          </span>
        </div>

        {/* Brand — top right */}
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 52,
            display: "flex",
            fontSize: 16,
            letterSpacing: 4,
            color: "rgba(20,20,19,0.38)",
          }}
        >
          EEVOLVV / TALENT
        </div>

        {/* ── Lever group: rotated 8° clockwise around fulcrum tip (600, 315) ── */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 247,
            width: 1020,
            height: 136,
            display: "flex",
            transform: PIVOT,
          }}
        >
          {/* Beam */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 65,
              width: 1020,
              height: 6,
              background: INK,
              display: "flex",
            }}
          />
          {/* SCOPE box */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 34,
              width: 156,
              height: 62,
              border: `2.5px solid ${INK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 4,
              color: INK,
            }}
          >
            SCOPE
          </div>
          {/* OPERATOR label */}
          <div
            style={{
              position: "absolute",
              right: 26,
              top: 6,
              display: "flex",
              fontSize: 16,
              letterSpacing: 3,
              color: INK,
            }}
          >
            OPERATOR
          </div>
          {/* OPERATOR circle */}
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 34,
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: ACCENT,
              border: `2.5px solid ${INK}`,
              display: "flex",
            }}
          />
        </div>

        {/* Fulcrum triangle (CSS border trick — zero-size div) */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 315,
            width: 0,
            height: 0,
            borderLeft: "60px solid transparent",
            borderRight: "60px solid transparent",
            borderBottom: "140px solid #c9bead",
            display: "flex",
          }}
        />
        {/* Fulcrum outline (slightly larger, drawn behind) */}
        <div
          style={{
            position: "absolute",
            left: 538,
            top: 313,
            width: 0,
            height: 0,
            borderLeft: "62px solid transparent",
            borderRight: "62px solid transparent",
            borderBottom: "144px solid " + INK,
            display: "flex",
            zIndex: -1,
          }}
        />

        {/* FULCRUM · EEVOLVV label */}
        <div
          style={{
            position: "absolute",
            left: 480,
            top: 470,
            display: "flex",
            fontSize: 17,
            letterSpacing: 3,
            color: "rgba(20,20,19,0.6)",
          }}
        >
          FULCRUM · EEVOLVV
        </div>

        {/* Baseline rule */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 545,
            height: 1.5,
            background: "rgba(20,20,19,0.28)",
            display: "flex",
          }}
        />
        {/* Tick marks */}
        {[60, 300, 600, 900, 1140].map((x) => (
          <div
            key={x}
            style={{
              position: "absolute",
              left: x,
              top: 540,
              width: 1.5,
              height: 12,
              background: "rgba(20,20,19,0.35)",
              display: "flex",
            }}
          />
        ))}
        {/* Baseline labels */}
        <div style={{ position: "absolute", left: 60, top: 564, display: "flex", fontSize: 17, letterSpacing: 4, color: "rgba(20,20,19,0.44)" }}>
          SCOPE
        </div>
        <div style={{ position: "absolute", right: 60, top: 564, display: "flex", fontSize: 17, letterSpacing: 4, color: "rgba(20,20,19,0.44)" }}>
          DELIVERY
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
