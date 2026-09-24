import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "eevolvv — clipping for creators who record but never post enough";
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
        <div style={{ display: "flex", fontSize: 28, color: "#3DFF8A", letterSpacing: 4 }}>EEVOLVV 2.0</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
          Your content is the place to stand. The automation is the lever.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#A3B5A9" }}>Clip & Ship $1,497/mo · Clip & Dominate $3,497/mo</div>
      </div>
    ),
    size,
  );
}
