import Script from 'next/script'

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/hello-eevolvv'

export default function OnboardSuccessPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)' }}>

      {/* Header */}
      <div style={{
        background: 'var(--ink)', color: 'var(--paper)',
        padding: '40px 32px',
        borderBottom: '3px solid var(--accent)',
        textAlign: 'center',
      }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.32em', color: 'var(--accent)', marginBottom: 12, fontWeight: 700 }}>
          § 01 · PAYMENT CONFIRMED
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.1 }}>
          You&apos;re in. Book your kickoff call.
        </h1>
        <p style={{ fontSize: 16, opacity: 0.55, margin: '0 auto', maxWidth: 480, lineHeight: 1.6 }}>
          Your plan is active. Pick a 15-minute slot below — we&apos;ll walk through your report together and map out the first 30 days.
        </p>
      </div>

      {/* Calendly inline embed */}
      <div style={{ padding: '0', borderBottom: '1px solid var(--rule)' }}>
        <div
          className="calendly-inline-widget"
          data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&primary_color=8c2b1a&text_color=141413&background_color=faf7f0`}
          style={{ minWidth: '320px', height: '700px' }}
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
      </div>

      {/* What happens next */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 32px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 20, fontWeight: 700 }}>
          § 02 · WHAT HAPPENS NEXT
        </div>
        <div style={{
          padding: '20px 24px',
          background: 'rgba(20,20,19,0.04)',
          border: '1px solid var(--rule)',
          borderLeft: '3px solid var(--accent)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.8, opacity: 0.8 }}>
            <div>→ Check your email for your onboarding link</div>
            <div>→ Complete the 5-min intake form</div>
            <div>→ Join your 15-min kickoff call (booked above)</div>
            <div>→ Your build starts the same day</div>
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
