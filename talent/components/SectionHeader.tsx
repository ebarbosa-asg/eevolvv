interface SectionHeaderProps {
  number: string;
  eyebrow: string;
  title: string;
  note?: string;
}

export function SectionHeader({ number, eyebrow, title, note }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr auto",
        gap: 24,
        alignItems: "baseline",
        borderTop: "1px solid var(--ink)",
        paddingTop: 24,
      }}
    >
      <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--accent)", fontWeight: 600 }}>
        § {number}
      </div>
      <div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, marginBottom: 12 }}>
          {eyebrow}
        </div>
        <div style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1 }}>
          {title}
        </div>
      </div>
      {note && (
        <div className="mono section-header-badge" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, alignSelf: "start" }}>
          {note}
        </div>
      )}
    </div>
  );
}
