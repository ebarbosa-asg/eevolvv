import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buy AI Automation for Your Business — eevolvv',
  description: 'AI agents for your business from $499/mo. No contracts. Cancel anytime. First automation live in 48 hours.',
  alternates: { canonical: 'https://eevolvv.com/marketing' },
  openGraph: {
    title: 'Buy AI Automation — eevolvv',
    description: 'AI agents handle follow-ups, scheduling, intake, billing. You handle clients. Start at $499/mo.',
    url: 'https://eevolvv.com/marketing',
  },
}

const PLANS = [
  {
    name: 'Agent One',
    price: '$499',
    desc: 'One AI agent. One workflow automated.',
    features: ['Agent page', '1 workflow', 'Weekly reports', 'Direct line to Eduardo'],
    href: '/api/checkout?tier=seed',
    highlight: false,
  },
  {
    name: 'Agent Three',
    price: '$999',
    desc: 'Three agents. Full automation layer.',
    features: ['Agent page', '3 workflows', 'Weekly+monthly reports', 'Monthly call', 'Direct line'],
    href: '/api/checkout?tier=core',
    highlight: true,
  },
  {
    name: 'Agent Five',
    price: '$1,999',
    desc: 'Five agents + ads + SEO managed.',
    features: ['Agent page', '5+ workflows', 'Ads+SEO managed', 'Weekly calls', 'Priority response'],
    href: '/api/checkout?tier=evolve',
    highlight: false,
  },
]

const STEPS = [
  { n: '01', title: 'We audit', body: '10-min AI conversation maps your business. No forms. No signup.' },
  { n: '02', title: 'We build', body: 'First automation live in 48 hours. You get a private agent page.' },
  { n: '03', title: 'You work', body: 'AI handles the rest. Weekly reports. Monthly improvements.' },
]

export default function MarketingPage() {
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'Space Grotesk, sans-serif', overflowX: 'hidden' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 0, background: 'var(--paper)', zIndex: 100 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: 'var(--ink)', letterSpacing: '-0.5px' }}>eevolvv</a>
        <a href="#pricing" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '10px 22px', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          See pricing →
        </a>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 32px 80px', maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(38px, 7vw, 64px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 24px' }}>
          Your business runs on 16 tools.
          <br />
          We replace them with <span style={{ color: 'var(--accent)' }}>one</span>.
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', lineHeight: 1.6, opacity: 0.6, maxWidth: 520, margin: '0 auto 40px' }}>
          AI agents handle follow-ups, scheduling, intake, reports, and billing. You handle clients.
        </p>
        <a href="#pricing" style={{ display: 'inline-block', background: 'var(--ink)', color: 'var(--paper)', padding: '16px 36px', borderRadius: 4, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
          Start at $499/mo →
        </a>
        <p style={{ marginTop: 14, fontSize: 13, opacity: 0.35 }}>No contracts. Cancel anytime. First automation live in 48 hours.</p>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.4, marginBottom: 12, textAlign: 'center' }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1.5px', margin: '0 0 48px', textAlign: 'center' }}>
            Three steps. That&apos;s it.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ padding: '36px 32px', border: '1px solid var(--rule)', background: i === 1 ? 'var(--ink)' : 'transparent' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.35, marginBottom: 20, color: i === 1 ? 'var(--paper)' : 'var(--ink)' }}>
                  STEP {s.n}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', letterSpacing: '-0.5px', color: i === 1 ? 'var(--paper)' : 'var(--ink)' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.6, margin: 0, color: i === 1 ? 'var(--paper)' : 'var(--ink)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '48px 32px', borderBottom: '1px solid var(--rule)', background: 'rgba(20,20,19,0.025)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 80px)', flexWrap: 'wrap', textAlign: 'center' }}>
          {[
            { n: '48hrs', label: 'First automation live' },
            { n: '$499/mo', label: 'Starting price' },
            { n: '10 min', label: 'Onboarding audit' },
            { n: '0 tech', label: 'Required from you' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, letterSpacing: '-1px' }}>{s.n}</div>
              <div style={{ fontSize: 13, opacity: 0.45, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 32px', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.4, marginBottom: 12, textAlign: 'center' }}>PRICING</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1.5px', margin: '0 0 14px', textAlign: 'center' }}>
            Simple. Month-to-month. No contracts.
          </h2>
          <p style={{ fontSize: 16, opacity: 0.5, maxWidth: 480, margin: '0 auto 48px', textAlign: 'center' }}>
            Cancel any time. Start small. Scale when you&apos;re ready.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2 }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{
                padding: '40px 32px',
                border: '1.5px solid ' + (plan.highlight ? 'var(--ink)' : 'var(--rule)'),
                background: plan.highlight ? 'var(--ink)' : 'transparent',
                position: 'relative',
              }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -13, left: 32, background: 'var(--ink)', border: '1.5px solid var(--ink)', color: 'var(--paper)', fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: '4px 12px' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, opacity: 0.45, marginBottom: 16, color: plan.highlight ? 'var(--paper)' : 'var(--ink)' }}>
                  {plan.name.toUpperCase()}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-2px', color: plan.highlight ? 'var(--paper)' : 'var(--ink)' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 16, opacity: 0.5, color: plan.highlight ? 'var(--paper)' : 'var(--ink)' }}>
                    /mo
                  </span>
                </div>
                <p style={{ fontSize: 14, opacity: 0.6, margin: '0 0 28px', lineHeight: 1.5, color: plan.highlight ? 'var(--paper)' : 'var(--ink)' }}>
                  {plan.desc}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ fontSize: 14, display: 'flex', alignItems: 'flex-start', gap: 10, color: plan.highlight ? 'var(--paper)' : 'var(--ink)' }}>
                      <span style={{ opacity: 0.5, flexShrink: 0 }}>✓</span>
                      <span style={{ opacity: 0.8 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '13px 24px',
                    background: plan.highlight ? 'var(--paper)' : 'var(--ink)',
                    color: plan.highlight ? 'var(--ink)' : 'var(--paper)',
                    fontSize: 14, fontWeight: 700,
                    textDecoration: 'none',
                    borderRadius: 4,
                    letterSpacing: 0.3,
                  }}
                >
                  Buy {plan.name} →
                </a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, opacity: 0.4 }}>
            Not sure which plan? <a href="/" style={{ color: 'var(--ink)', opacity: 1, fontWeight: 600 }}>Run the free diagnostic →</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-2px', margin: '0 0 20px', lineHeight: 1.05 }}>
          Your business deserves AI working for it.
        </h2>
        <p style={{ fontSize: 16, opacity: 0.5, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Takes 10 minutes to start. Cancel any time.
        </p>
        <a href="#pricing" style={{ display: 'inline-block', background: 'var(--ink)', color: 'var(--paper)', padding: '16px 40px', borderRadius: 4, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
          Get your free AI audit →
        </a>
        <p style={{ marginTop: 14, fontSize: 13, opacity: 0.35 }}>Free. No credit card. No commitment.</p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--rule)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>eevolvv, Inc.</span>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, opacity: 0.45 }}>
          <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </main>
  )
}