import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "eevolvv — your content is the place to stand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0C0B",
          color: "#E8F0EA",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#3DFF8A",
              color: "#06210F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 46,
              fontWeight: 700,
            }}
          >
            e
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "14px solid #3DFF8A",
            }}
          />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>eevolvv</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 64, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
          Your content is the place to stand. The pipeline is the lever.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#A3B5A9" }}>Clip & Ship $1,497/mo · Clip & Dominate $3,497/mo</div>
      </div>
    ),
    size,
  );
}
