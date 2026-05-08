export default function OnboardSuccessPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
      <div style={{ maxWidth: 540, textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 24, fontWeight: 600 }}>
          § 01 · PAYMENT CONFIRMED
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink)', margin: '0 0 16px', lineHeight: 1.1 }}>
          Payment confirmed!
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink)', opacity: 0.65, margin: '0 0 32px', lineHeight: 1.6 }}>
          Check your email for your onboarding link. Your build clock starts the moment you complete onboarding.
        </p>
        <div style={{
          padding: '20px 24px',
          background: 'rgba(20,20,19,0.04)',
          border: '1px solid var(--rule)',
          borderLeft: '3px solid var(--accent)',
          textAlign: 'left',
          marginBottom: 32,
        }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: 12, fontWeight: 600 }}>
            WHAT HAPPENS NEXT
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.8, opacity: 0.8 }}>
            <div>→ Onboarding link sent to your email</div>
            <div>→ Complete the 5-min intake form</div>
            <div>→ Your technician starts the build</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5, margin: 0 }}>
          Questions? Email us at{' '}
          <a href="mailto:hello@eevolvv.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            hello@eevolvv.com
          </a>
        </p>
      </div>
    </main>
  )
}
