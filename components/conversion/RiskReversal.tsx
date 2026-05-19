'use client'

/**
 * Free-first trust block. Resolves the conversion buyer's two biggest
 * objections with useful artifacts and transparent cancellation terms.
 *
 * Use above tier-selection on /pricing, on industry pages near checkout,
 * and on /contact above the form.
 */
export function RiskReversal({ inverted = false }: { inverted?: boolean }) {
  const fg = inverted ? 'var(--paper)' : 'var(--ink)'
  const bg = inverted ? 'rgba(244,241,234,0.04)' : 'rgba(20,20,19,0.04)'
  const ruleColor = inverted ? 'rgba(244,241,234,0.14)' : 'var(--rule)'

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${ruleColor}`,
        borderLeft: '3px solid var(--accent)',
        padding: '24px 28px',
        color: fg,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 24,
      }}
    >
      <Pillar
        marker="FREE FIRST"
        title="Useful before you pay"
        body="Start with a free ghost-work scan, report, and roadmap preview. Spend only when the next build step is obvious."
      />
      <Pillar
        marker="MONTHLY · NO LOCK-IN"
        title="Cancel anytime"
        body="Monthly plans cancel any time, ends at period close. Switch tiers up or down whenever you want."
      />
      <Pillar
        marker="DELIVERY · 14 DAYS"
        title="First agent live in 14 days"
        body="Checkout takes 2 minutes. Your agent page and first workflow are queued and live within 14 business days — or we extend your subscription by the delay at no charge."
      />
    </div>
  )
}

function Pillar({ marker, title, body }: { marker: string; title: string; body: string }) {
  return (
    <div>
      <div
        className="mono"
        style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}
      >
        § {marker}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 13, opacity: 0.72, lineHeight: 1.55, margin: 0 }}>{body}</p>
    </div>
  )
}
