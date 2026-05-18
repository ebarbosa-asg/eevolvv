'use client'

/**
 * Payment trust marks shown near every checkout button.
 *
 * Stripe + card-brand acknowledgment + plain-language reassurance.
 * Inverted variant for dark backgrounds.
 */
export function TrustMarks({ inverted = false }: { inverted?: boolean }) {
  const color = inverted ? 'rgba(244,241,234,0.55)' : 'rgba(20,20,19,0.55)'

  return (
    <div
      className="mono"
      style={{
        display: 'flex',
        gap: 14,
        flexWrap: 'wrap',
        alignItems: 'center',
        fontSize: 10,
        letterSpacing: '0.16em',
        color,
        marginTop: 14,
      }}
    >
      <span>SECURED BY STRIPE</span>
      <span style={{ opacity: 0.45 }}>·</span>
      <span>VISA · MC · AMEX</span>
      <span style={{ opacity: 0.45 }}>·</span>
      <span>SSL ENCRYPTED</span>
      <span style={{ opacity: 0.45 }}>·</span>
      <span>NO SETUP FEE</span>
    </div>
  )
}
