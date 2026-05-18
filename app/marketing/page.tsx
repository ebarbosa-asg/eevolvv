'use client'

import { useState } from 'react'

// ─── Chaos items — everything a business currently juggles ────────────────────
const CHAOS = [
  { icon: '📧', label: 'Email' },
  { icon: '📱', label: 'Texts' },
  { icon: '📊', label: 'Spreadsheets' },
  { icon: '🗓', label: 'Scheduling' },
  { icon: '💬', label: 'Reviews' },
  { icon: '📣', label: 'Social media' },
  { icon: '📦', label: 'Inventory' },
  { icon: '🧾', label: 'Invoicing' },
  { icon: '📞', label: 'Follow-ups' },
  { icon: '📈', label: 'Ads' },
  { icon: '🤝', label: 'Referrals' },
  { icon: '🗂', label: 'Paperwork' },
  { icon: '💰', label: 'Payroll' },
  { icon: '🔔', label: 'Reminders' },
  { icon: '📝', label: 'Reports' },
  { icon: '🔄', label: 'Repeat tasks' },
]

// ─── Pricing — tiers match canonical /pricing 1:1 ────────────────────────────
const PLANS = [
  {
    name: 'Agent One',
    price: '$499',
    period: '/mo',
    line: 'One AI agent. One workflow automated.',
    features: [
      'Your own agent page',
      '1 workflow automated',
      'Weekly check-in report',
      'Direct line to Eduardo',
    ],
    cta: 'Buy Agent One',
    href: '/pricing?tier=seed&checkout=1',
    highlight: false,
  },
  {
    name: 'Agent Three',
    price: '$999',
    period: '/mo',
    line: 'Three agents running while you focus on the work.',
    features: [
      'Your own agent page',
      '3 workflows automated',
      'Weekly + monthly reports',
      'Monthly optimization call',
      'Direct line to Eduardo',
    ],
    cta: 'Buy Agent Three',
    href: '/pricing?tier=core&checkout=1',
    highlight: true,
  },
  {
    name: 'Agent Five',
    price: '$1,999',
    period: '/mo',
    line: 'Five agents, ads, SEO — full AI ops layer.',
    features: [
      'Your own agent page',
      '5 workflows automated',
      'Ads + SEO managed',
      'Weekly reports + calls',
      'Priority response',
    ],
    cta: 'Buy Agent Five',
    href: '/pricing?tier=evolve&checkout=1',
    highlight: false,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function MarketingPage() {
  const [flipped, setFlipped] = useState(false)

  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'Space Grotesk, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid var(--rule)', position: 'sticky', top: 0, background: 'var(--paper)', zIndex: 100 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: 'var(--ink)', letterSpacing: '-0.5px' }}>eevolvv</a>
        <a href="#pricing" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '10px 22px', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          See pricing →
        </a>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '100px 32px 80px', maxWidth: 780, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'var(--ink)', color: 'var(--paper)', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '6px 14px', marginBottom: 28, borderRadius: 2 }}>
          AI FOR YOUR BUSINESS
        </div>
        <h1 style={{ fontSize: 'clamp(38px, 7vw, 72px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 28px' }}>
          Stop running your<br />business manually.
        </h1>
        <p style={{ fontSize: 'clamp(17px, 2.5vw, 22px)', lineHeight: 1.6, opacity: 0.65, maxWidth: 560, margin: '0 auto 44px' }}>
          We build AI that handles the repetitive stuff — follow-ups, scheduling, reports, reminders —
          so you can focus on the work that actually makes you money.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#how" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 32px', borderRadius: 4, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
            See how it works
          </a>
          <a href="#pricing" style={{ border: '1px solid var(--ink)', color: 'var(--ink)', padding: '14px 32px', borderRadius: 4, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
            View pricing
          </a>
        </div>
      </section>

      {/* ── INTERACTIVE CHAOS vs SIMPLE ── */}
      <section id="how" style={{ padding: '80px 32px', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.4, marginBottom: 12 }}>THE PROBLEM</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1.5px', margin: 0 }}>
              Running a business today looks like this.
            </h2>
          </div>

          {/* Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
            <button
              onClick={() => setFlipped(f => !f)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: flipped ? 'var(--ink)' : 'var(--paper)',
                color: flipped ? 'var(--paper)' : 'var(--ink)',
                border: '1.5px solid var(--ink)',
                padding: '12px 28px', borderRadius: 40,
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <span>{flipped ? '✦' : '○'}</span>
              {flipped ? 'With eevolvv — 1 thing' : 'Without eevolvv — tap to see the difference'}
            </button>
          </div>

          {/* The visual */}
          <div style={{
            position: 'relative',
            minHeight: 320,
            border: '1.5px solid var(--rule)',
            borderRadius: 12,
            overflow: 'hidden',
            background: flipped ? 'var(--ink)' : 'var(--paper)',
            transition: 'background 0.4s ease',
            padding: 40,
          }}>

            {/* CHAOS state */}
            {!flipped && (
              <div>
                <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, letterSpacing: 1.5, opacity: 0.35, marginBottom: 32 }}>
                  YOU MANAGE ALL OF THIS, EVERY DAY
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                  {CHAOS.map((item, i) => (
                    <div key={i} style={{
                      border: '1px solid var(--rule)',
                      borderRadius: 8,
                      padding: '10px 18px',
                      fontSize: 14,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'rgba(20,20,19,0.03)',
                      animation: `float-in 0.3s ease ${i * 0.04}s both`,
                    }}>
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
                <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, opacity: 0.4, fontStyle: 'italic' }}>
                  16 things pulling your attention. Every. Single. Day.
                </p>
              </div>
            )}

            {/* SIMPLE state */}
            {flipped && (
              <div style={{ textAlign: 'center', color: 'var(--paper)', padding: '20px 0' }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.5, marginBottom: 24 }}>
                  WITH EEVOLVV
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 110, height: 110,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontSize: 42,
                  marginBottom: 28,
                  background: 'rgba(255,255,255,0.07)',
                }}>
                  ✦
                </div>
                <h3 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-1.5px', margin: '0 0 16px', lineHeight: 1.1 }}>
                  Your AI handles it.
                </h3>
                <p style={{ fontSize: 18, opacity: 0.6, maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.6 }}>
                  Follow-ups, reminders, reports, scheduling — running automatically, every day, without you.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
                  {['You focus on clients', 'AI handles the rest', 'Reports every week'].map((t, i) => (
                    <div key={i} style={{ fontSize: 14, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#fff', opacity: 1 }}>✓</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, opacity: 0.4 }}>
            Tap the button above to flip between today and tomorrow.
          </p>
        </div>
      </section>

      {/* ── HOW SIMPLE IT IS ── */}
      <section style={{ padding: '80px 32px', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.4, marginBottom: 12 }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1.5px', margin: 0 }}>
              Three steps. That's it.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
            {[
              { n: '01', title: 'We audit your business', body: 'Takes 10 minutes. Tell us what you do, what you hate doing, and where time goes. We find the waste.' },
              { n: '02', title: 'We build your AI', body: 'In 48 hours, your first automation is live. You get a private page showing exactly what your AI is doing.' },
              { n: '03', title: 'You get time back', body: 'Every week you get a report. Every month we improve it. The AI gets smarter as your business grows.' },
            ].map((step, i) => (
              <div key={i} style={{ padding: '36px 32px', border: '1px solid var(--rule)', background: i === 1 ? 'var(--ink)' : 'transparent' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.35, marginBottom: 20, color: i === 1 ? 'var(--paper)' : 'var(--ink)' }}>
                  STEP {step.n}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', letterSpacing: '-0.5px', color: i === 1 ? 'var(--paper)' : 'var(--ink)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.65, margin: 0, color: i === 1 ? 'var(--paper)' : 'var(--ink)' }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STRIP ── */}
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

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '80px 32px', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.4, marginBottom: 12 }}>PRICING</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1.5px', margin: '0 0 14px' }}>
              Simple. Month-to-month. No contracts.
            </h2>
            <p style={{ fontSize: 16, opacity: 0.5, maxWidth: 480, margin: '0 auto' }}>
              Cancel any time. Start small. Scale when you're ready.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2, marginTop: 48 }}>
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
                    {plan.period}
                  </span>
                </div>
                <p style={{ fontSize: 14, opacity: 0.6, margin: '0 0 28px', lineHeight: 1.5, color: plan.highlight ? 'var(--paper)' : 'var(--ink)' }}>
                  {plan.line}
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
                  {plan.cta} →
                </a>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, opacity: 0.4 }}>
            Not sure which plan? <a href="https://eevolvv.com" style={{ color: 'var(--ink)', opacity: 1, fontWeight: 600 }}>Run the free diagnostic →</a>
          </p>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: '100px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-2px', margin: '0 0 20px', lineHeight: 1.05 }}>
            Your business deserves AI working for it.
          </h2>
          <p style={{ fontSize: 17, opacity: 0.55, maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Takes 10 minutes to get started. No tech knowledge needed. Cancel any time.
          </p>
          <a
            href="https://eevolvv.com"
            style={{
              display: 'inline-block',
              background: 'var(--ink)', color: 'var(--paper)',
              padding: '16px 40px', borderRadius: 4,
              fontSize: 16, fontWeight: 700,
              textDecoration: 'none', letterSpacing: 0.3,
            }}
          >
            Get your free AI audit →
          </a>
          <p style={{ marginTop: 18, fontSize: 13, opacity: 0.35 }}>Free. No credit card. No commitment.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--rule)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>eevolvv, Inc.</span>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, opacity: 0.45 }}>
          <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

      <style>{`
        @keyframes float-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </main>
  )
}
