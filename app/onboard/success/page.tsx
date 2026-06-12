'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/hello-eevolvv'

const PRODUCT_COPY: Record<string, { headline: string; sub: string; steps: string[] }> = {
  'intake-pilot': {
    headline: "Your AI Intake Pilot is confirmed.",
    sub: "Book your Day 1 kickoff call below — we'll map your intake flow, CRM, and qualification criteria. Usually 30 minutes.",
    steps: [
      'Book your kickoff call (below)',
      'We build your intake layer in 3 days',
      'You review and approve on Day 7',
      'Live and processing leads on Day 14',
    ],
  },
  'textback-pilot': {
    headline: "Your Missed-Call Textback Pilot is confirmed.",
    sub: "Book your Day 1 kickoff call below — we'll map your phone setup, booking platform, and message tone. Usually 20 minutes.",
    steps: [
      'Book your kickoff call (below)',
      'We configure your textback sequence in 2 days',
      'You approve every message template on Day 5',
      'Live and texting back on Day 7',
    ],
  },
  'first-fix': {
    headline: "Your First Fix is confirmed.",
    sub: "Book your scoping call below — we'll identify the one automation from your diagnostic to build first.",
    steps: [
      'Book your scoping call (below)',
      'We scope and build your automation',
      'You review and test before launch',
      'Live in 7 days',
    ],
  },
}

const DEFAULT_COPY = {
  headline: "You're in. Book your kickoff call.",
  sub: "Your plan is active. Pick a 15-minute slot below — we'll walk through your report and pick the first automations for your dashboard.",
  steps: [
    'Check your email for your onboarding link',
    'Complete the 5-min intake form',
    'Join your 15-min kickoff call (booked above)',
    'Your dashboard and first automation queue the same day',
  ],
}

function SuccessContent() {
  const params = useSearchParams()
  const product = params.get('product') ?? ''
  const copy = PRODUCT_COPY[product] ?? DEFAULT_COPY

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)' }}>

      {/* Header */}
      <div style={{
        background: 'var(--ink)', color: 'var(--paper)',
        padding: '48px 32px',
        borderBottom: '3px solid var(--accent)',
        textAlign: 'center',
      }}>
        <div className="mono" style={{
          fontSize: 9, letterSpacing: '0.32em', color: 'var(--accent)',
          marginBottom: 12, fontWeight: 700,
        }}>
          § 01 · PAYMENT CONFIRMED
        </div>
        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 700,
          letterSpacing: '-0.03em', margin: '0 0 14px', lineHeight: 1.1,
        }}>
          {copy.headline}
        </h1>
        <p style={{
          fontSize: 16, opacity: 0.6, margin: '0 auto',
          maxWidth: 520, lineHeight: 1.6,
        }}>
          {copy.sub}
        </p>
      </div>

      {/* Calendly inline embed */}
      <div style={{ borderBottom: '1px solid var(--rule)' }}>
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
        <div className="mono" style={{
          fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)',
          marginBottom: 20, fontWeight: 700,
        }}>
          § 02 · WHAT HAPPENS NEXT
        </div>
        <div style={{
          padding: '20px 24px',
          background: 'rgba(20,20,19,0.04)',
          border: '1px solid var(--rule)',
          borderLeft: '3px solid var(--accent)',
          marginBottom: 24,
        }}>
          {copy.steps.map((step, i) => (
            <div key={i} style={{
              fontSize: 14, color: 'var(--ink)', lineHeight: 1.8,
              opacity: 0.8, display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5, margin: 0 }}>
          Questions? Email us at{' '}
          <a href="mailto:hello@eevolvv.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            hello@eevolvv.com
          </a>
          {' '}or text (844) 433-8658.
        </p>
      </div>

    </main>
  )
}

export default function OnboardSuccessPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.18em' }}>LOADING...</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}
