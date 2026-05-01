export function DimensionLine({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 8, height: 8, transform: "rotate(45deg)", background: "var(--ink)" }} />
      <div
        className="anim-draw-line"
        style={{ flex: 1, height: 1, background: "var(--ink)", opacity: 0.85 }}
      />
      <div
        className="mono"
        style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.65, whiteSpace: "nowrap" }}
      >
        {label}
      </div>
      <div
        className="anim-draw-line"
        style={{ flex: 1, height: 1, background: "var(--ink)", opacity: 0.85 }}
      />
      <div style={{ width: 8, height: 8, transform: "rotate(45deg)", background: "var(--ink)" }} />
    </div>
  );
}
