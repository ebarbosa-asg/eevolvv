'use client'

import { useState } from 'react'
import SiteHeader from '@/components/sections/site-header'
import SiteFooter from '@/components/sections/site-footer'

export default function IntakePageClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePilot() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'intake-pilot' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else {
        setError(data.error ?? 'Something went wrong.')
        setLoading(false)
      }
    } catch {
      setError('Network error.')
      setLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />

      {/* ─── SECTION 1: HERO ─── */}
      <section
        style={{
          backgroundColor: 'var(--paper)',
          paddingTop: 120,
          paddingBottom: 80,
        }}
      >
        <div
          className="site-rail"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}
        >
          {/* Section marker */}
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 28,
            }}
          >
            § 01 · AI CLIENT INTAKE — LAW FIRMS
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              maxWidth: 820,
              marginBottom: 28,
            }}
          >
            Every new client inquiry answered in under 60 seconds.
          </h1>

          {/* Sub */}
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              lineHeight: 1.65,
              color: 'var(--ink)',
              opacity: 0.72,
              maxWidth: 680,
              marginBottom: 44,
            }}
          >
            We install an AI intake layer over your phone and web contact flow. New
            inquiries are answered instantly, qualified, and pushed into Clio or
            MyCase — with a follow-up sequence that runs until they sign.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <button
              onClick={handlePilot}
              disabled={loading}
              className="mono"
              style={{
                background: 'var(--accent)',
                color: 'var(--paper)',
                border: 'none',
                borderRadius: 4,
                padding: '16px 32px',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'REDIRECTING…' : 'START 30-DAY PILOT → $997'}
            </button>

            <a
              href="https://calendly.com/hello-eevolvv"
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                background: 'transparent',
                color: 'var(--ink)',
                border: '1px solid var(--rule)',
                borderRadius: 4,
                padding: '16px 28px',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              BOOK A CALL FIRST →
            </a>
          </div>

          {/* Error */}
          {error && (
            <p
              className="mono"
              style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}
            >
              {error}
            </p>
          )}

          {/* Guarantee line */}
          <div
            className="mono"
            style={{
              fontSize: 12,
              color: 'var(--ink)',
              opacity: 0.52,
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ color: 'var(--accent)', marginRight: 6 }}>→</span>
            30-day money-back guarantee · Live within 14 business days · No long-term
            contract
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: THE PROBLEM (DARK / INVERTED) ─── */}
      <section
        style={{
          backgroundColor: 'var(--ink)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div
          className="site-rail"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}
        >
          {/* Section marker */}
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 28,
            }}
          >
            § 02 · THE PROBLEM
          </div>

          {/* H2 */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: 'var(--paper)',
              maxWidth: 640,
              marginBottom: 40,
            }}
          >
            Right now, your intake is losing you clients.
          </h2>

          {/* Terminal log block */}
          <div
            style={{
              background: 'rgba(250,247,240,0.04)',
              border: '1px solid rgba(250,247,240,0.1)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: 4,
              padding: '28px 32px',
              marginBottom: 48,
              maxWidth: 760,
            }}
          >
            {[
              {
                key: 'MISSED CALL',
                val: 'caller waits 4+ hours for callback → calls competitor',
              },
              {
                key: 'WEB FORM',
                val: 'inquiry sits in email for 24 hours → lead goes cold',
              },
              {
                key: 'VOICEMAIL',
                val: 'no callback protocol → 40% of messages never followed up',
              },
              {
                key: 'AFTER-HOURS',
                val: 'zero response until Monday → highest-intent leads lost',
              },
            ].map((row) => (
              <div
                key={row.key}
                className="mono"
                style={{
                  fontSize: 13,
                  lineHeight: 1.9,
                  color: 'var(--paper)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0 12px',
                }}
              >
                <span style={{ color: 'var(--accent)', minWidth: 10 }}>→</span>
                <span style={{ minWidth: 140, opacity: 0.9 }}>{row.key}</span>
                <span style={{ opacity: 0.55 }}>↳</span>
                <span style={{ opacity: 0.75 }}>{row.val}</span>
              </div>
            ))}
            <div
              className="mono"
              style={{
                fontSize: 13,
                lineHeight: 1.9,
                color: 'var(--paper)',
                opacity: 0.3,
                marginTop: 8,
              }}
            >
              // Law firms typically lose 2–4 potential clients per week to response
              delay alone
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 32,
              maxWidth: 760,
            }}
          >
            {[
              {
                stat: '78%',
                label: 'of callers go to the first firm that responds',
              },
              {
                stat: '<1 hr',
                label: 'the response window that converts',
              },
              {
                stat: '2–4/wk',
                label: 'clients lost to slow intake at most small firms',
              },
            ].map((item) => (
              <div key={item.stat}>
                <div
                  className="mono"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    lineHeight: 1,
                    marginBottom: 10,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {item.stat}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 12,
                    color: 'var(--paper)',
                    opacity: 0.6,
                    lineHeight: 1.5,
                    letterSpacing: '0.04em',
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: WHAT YOU GET (LIGHT) ─── */}
      <section
        style={{
          backgroundColor: 'var(--paper)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div
          className="site-rail"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}
        >
          {/* Section marker */}
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 28,
            }}
          >
            § 03 · WHAT YOU GET
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              marginBottom: 48,
            }}
          >
            A complete intake system, live in 14 days.
          </h2>

          {/* 2×2 card grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
              marginBottom: 40,
            }}
          >
            {[
              {
                num: 'N=01',
                title: 'AI Intake Layer',
                body: 'Web form + phone (via forwarded number or VAPI). Every inquiry answered in <60s with qualifying questions tailored to your practice area.',
              },
              {
                num: 'N=02',
                title: 'CRM Push',
                body: 'Qualified leads pushed directly into Clio or MyCase with contact info, matter type, and urgency flag — no manual data entry.',
              },
              {
                num: 'N=03',
                title: 'Follow-Up Sequence',
                body: '5-touch automated follow-up (text + email) until the lead signs a consult, declines, or asks to stop. Nothing falls through the cracks.',
              },
              {
                num: 'N=04',
                title: 'Weekly Report',
                body: 'Every Monday: inquiry count, response time avg, consults booked, and sequence performance. One clean dashboard, no noise.',
              },
            ].map((card) => (
              <div
                key={card.num}
                style={{
                  background: 'rgba(20,20,19,0.03)',
                  border: '1px solid var(--rule)',
                  borderLeft: '3px solid var(--accent)',
                  borderRadius: 4,
                  padding: '28px 28px 32px',
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: 'var(--accent)',
                    marginBottom: 14,
                    textTransform: 'uppercase',
                  }}
                >
                  {card.num}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '1.15rem',
                    color: 'var(--ink)',
                    marginBottom: 12,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.94rem',
                    lineHeight: 1.65,
                    color: 'var(--ink)',
                    opacity: 0.7,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          {/* Delivery terminal note */}
          <div
            style={{
              background: 'rgba(20,20,19,0.055)',
              border: '1px solid var(--rule)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: 4,
              padding: '16px 24px',
              display: 'inline-block',
            }}
          >
            <span className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>
              →
            </span>
            <span
              className="mono"
              style={{
                fontSize: 13,
                color: 'var(--ink)',
                opacity: 0.75,
                marginLeft: 10,
              }}
            >
              DELIVERY: 14 business days · 30-day money-back · cancel anytime after
              pilot
            </span>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: DELIVERY TIMELINE (LIGHT) ─── */}
      <section
        style={{
          backgroundColor: 'var(--paper)',
          paddingTop: 0,
          paddingBottom: 80,
          borderTop: '1px solid var(--rule)',
        }}
      >
        <div
          className="site-rail"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', paddingTop: 72 }}
        >
          {/* Section marker */}
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 28,
            }}
          >
            § 04 · DELIVERY TIMELINE
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              marginBottom: 52,
            }}
          >
            From payment to live intake in 14 days.
          </h2>

          {/* Timeline steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 0,
              position: 'relative',
            }}
          >
            {[
              {
                day: 'DAY 1',
                label: 'Kickoff call',
                body: 'Map your intake flow, qualification criteria, CRM setup, and the 3 questions every lead must answer.',
              },
              {
                day: 'DAY 3',
                label: 'Build + integrate',
                body: 'AI intake configured and connected to your phone forwarding and web contact form.',
              },
              {
                day: 'DAY 7',
                label: 'Test + review',
                body: 'You review 5 real test scenarios. We adjust tone, questions, and routing before going live.',
              },
              {
                day: 'DAY 14',
                label: 'Live',
                body: 'Real leads flowing through. Response time under 60 seconds. You get notified of every qualified lead.',
              },
            ].map((step, i) => (
              <div
                key={step.day}
                style={{
                  padding: '0 0 0 28px',
                  borderLeft: i === 0 ? '3px solid var(--accent)' : '1px solid var(--rule)',
                  marginLeft: i === 0 ? 0 : -1,
                  position: 'relative',
                }}
              >
                {/* Step dot */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: -8,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: i === 3 ? 'var(--accent)' : 'var(--paper)',
                    border: '2px solid var(--accent)',
                  }}
                />

                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: 'var(--accent)',
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  {step.day}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: 'var(--ink)',
                    marginBottom: 10,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.label}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: 'var(--ink)',
                    opacity: 0.65,
                    paddingRight: 20,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: WHO DOES THE WORK (DARK / INVERTED) ─── */}
      <section
        style={{
          backgroundColor: 'var(--ink)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div
          className="site-rail"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}
        >
          {/* Section marker */}
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 28,
            }}
          >
            § 05 · WHO DOES THE WORK
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: 'var(--paper)',
              marginBottom: 48,
            }}
          >
            You deal with a human. The engine runs 24/7.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32,
              marginBottom: 40,
            }}
          >
            {/* Left: Human */}
            <div
              style={{
                background: 'rgba(250,247,240,0.04)',
                border: '1px solid rgba(250,247,240,0.1)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: 4,
                padding: '32px 32px 36px',
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'var(--accent)',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                }}
              >
                T-01 · HUMAN OPS LEAD
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  color: 'var(--paper)',
                  marginBottom: 14,
                  letterSpacing: '-0.015em',
                }}
              >
                A human operations lead
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: 'var(--paper)',
                  opacity: 0.72,
                  marginBottom: 20,
                }}
              >
                Eduardo and team scope, configure, test, and hand off. You get a named
                point of contact from kickoff to launch — someone who answers your
                messages and owns the delivery.
              </p>
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--paper)',
                  opacity: 0.45,
                }}
              >
                <span style={{ color: 'var(--accent)' }}>→</span> Kickoff call ·
                Configuration review · Day 7 walkthrough · Handoff
              </div>
            </div>

            {/* Right: AI Engine */}
            <div
              style={{
                background: 'rgba(250,247,240,0.04)',
                border: '1px solid rgba(250,247,240,0.1)',
                borderLeft: '3px solid rgba(250,247,240,0.18)',
                borderRadius: 4,
                padding: '32px 32px 36px',
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'var(--accent)',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                }}
              >
                T-02 · AI ENGINE
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  color: 'var(--paper)',
                  marginBottom: 14,
                  letterSpacing: '-0.015em',
                }}
              >
                The Volvv-E engine
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: 'var(--paper)',
                  opacity: 0.72,
                  marginBottom: 20,
                }}
              >
                AI that runs the intake 24/7 after handoff. It handles after-hours,
                weekends, and the full follow-up sequence without any manual
                intervention — every lead contacted, every response logged.
              </p>
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--paper)',
                  opacity: 0.45,
                }}
              >
                <span style={{ color: 'var(--accent)' }}>→</span> 24/7 response ·
                CRM push · Follow-up sequence · Weekly digest
              </div>
            </div>
          </div>

          {/* Note line */}
          <div
            className="mono"
            style={{
              fontSize: 12,
              color: 'var(--paper)',
              opacity: 0.38,
              letterSpacing: '0.04em',
            }}
          >
            // Volvv-E is the delivery engine. You talk to a human.
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: PRICING (LIGHT) ─── */}
      <section
        style={{
          backgroundColor: 'var(--paper)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div
          className="site-rail"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}
        >
          {/* Section marker */}
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 28,
            }}
          >
            § 06 · PRICING
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              marginBottom: 48,
            }}
          >
            One flat fee to get it live. One low rate to keep it running.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
              maxWidth: 780,
              marginBottom: 40,
            }}
          >
            {/* Left: Featured pilot card */}
            <div
              style={{
                background: 'var(--ink)',
                border: '2px solid var(--accent)',
                borderRadius: 6,
                padding: '36px 32px 40px',
                position: 'relative',
              }}
            >
              {/* Featured badge */}
              <div
                className="mono"
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 28,
                  background: 'var(--accent)',
                  color: 'var(--paper)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  padding: '4px 10px',
                  textTransform: 'uppercase',
                }}
              >
                RECOMMENDED
              </div>

              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'var(--accent)',
                  marginBottom: 12,
                  textTransform: 'uppercase',
                }}
              >
                30-DAY PILOT
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '2.6rem',
                  color: 'var(--paper)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                $997
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: 'var(--paper)',
                  opacity: 0.45,
                  letterSpacing: '0.1em',
                  marginBottom: 28,
                }}
              >
                ONE-TIME · NO SUBSCRIPTION
              </div>

              <div style={{ marginBottom: 32 }}>
                {[
                  'AI intake layer (web + phone)',
                  'Clio or MyCase CRM push',
                  '5-touch follow-up sequence',
                  'Weekly performance report',
                  'Named ops lead from day 1',
                  'Live within 14 business days',
                ].map((feat) => (
                  <div
                    key={feat}
                    className="mono"
                    style={{
                      fontSize: 12,
                      color: 'var(--paper)',
                      opacity: 0.78,
                      lineHeight: 2,
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                    {feat}
                  </div>
                ))}
              </div>

              <button
                onClick={handlePilot}
                disabled={loading}
                className="mono"
                style={{
                  width: '100%',
                  background: 'var(--accent)',
                  color: 'var(--paper)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '15px 0',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? 'REDIRECTING…' : 'START PILOT →'}
              </button>

              {error && (
                <p
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: 'var(--accent)',
                    marginTop: 10,
                    textAlign: 'center',
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            {/* Right: Monthly card */}
            <div
              style={{
                background: 'rgba(20,20,19,0.03)',
                border: '1px solid var(--rule)',
                borderRadius: 6,
                padding: '36px 32px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: 'var(--accent)',
                    marginBottom: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  MONTHLY AFTER PILOT
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '2.6rem',
                    color: 'var(--ink)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  $499
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      opacity: 0.5,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    /mo
                  </span>
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: 'var(--ink)',
                    opacity: 0.45,
                    letterSpacing: '0.1em',
                    marginBottom: 28,
                  }}
                >
                  CANCEL ANYTIME
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    color: 'var(--ink)',
                    opacity: 0.7,
                    marginBottom: 24,
                  }}
                >
                  If the pilot delivers, convert with one click. No new contract, no
                  re-setup, no new onboarding. Everything keeps running — you just pay
                  monthly.
                </p>

                <div>
                  {[
                    'Everything from the pilot',
                    'Ongoing follow-up sequences',
                    'Monthly intake analytics',
                    'Quarterly tone + qualification review',
                  ].map((feat) => (
                    <div
                      key={feat}
                      className="mono"
                      style={{
                        fontSize: 12,
                        color: 'var(--ink)',
                        opacity: 0.65,
                        lineHeight: 2,
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: 'var(--ink)',
                  opacity: 0.38,
                  marginTop: 28,
                  letterSpacing: '0.04em',
                }}
              >
                // Available after pilot completes. Decide then — no pressure now.
              </div>
            </div>
          </div>

          {/* Guarantee + secondary CTA */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(20,20,19,0.055)',
                border: '1px solid var(--rule)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: 4,
                padding: '14px 20px',
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 12, color: 'var(--ink)', opacity: 0.7 }}
              >
                <span style={{ color: 'var(--accent)' }}>→</span> 30-day money-back
                guarantee. If the intake is not live and processing real leads within
                30 days, we refund in full.
              </span>
            </div>

            <a
              href="https://calendly.com/hello-eevolvv"
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                fontSize: 12,
                color: 'var(--ink)',
                opacity: 0.55,
                textDecoration: 'underline',
                textUnderlineOffset: 3,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              Not the right fit? Book a 15-min call first →
            </a>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: FAQ (LIGHT) ─── */}
      <section
        style={{
          backgroundColor: 'var(--paper)',
          paddingTop: 0,
          paddingBottom: 80,
          borderTop: '1px solid var(--rule)',
        }}
      >
        <div
          className="site-rail"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', paddingTop: 72 }}
        >
          {/* Section marker */}
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 28,
            }}
          >
            § 07 · COMMON QUESTIONS
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              marginBottom: 52,
            }}
          >
            Answers before you commit.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '0 48px',
              maxWidth: 960,
            }}
          >
            {[
              {
                q: 'What phone system do you use?',
                a: 'We work with your existing number via call forwarding. No new phone number required. Works with RingCentral, Google Voice, Grasshopper, and most VoIP providers.',
              },
              {
                q: 'What CRM integrations are supported?',
                a: 'Clio and MyCase are the primary integrations. If you use PracticePanther, Smokeball, or another system, tell us in the kickoff call — most have API access.',
              },
              {
                q: "What if a lead isn't a good fit for my firm?",
                a: 'The AI qualifies based on criteria you define in the kickoff call: matter type, geography, case value, urgency. Unqualified leads get a polite referral response.',
              },
              {
                q: 'What happens after the 30 days?',
                a: 'You decide. Convert to $499/mo and keep the intake running. Or we hand off the full configuration so you can run it yourself. No pressure.',
              },
              {
                q: 'Can I see the messages before they go live?',
                a: 'Yes. We show you every template during the Day 7 review. Nothing goes live without your approval.',
              },
              {
                q: "What's the money-back guarantee?",
                a: 'If the intake is not live and processing real leads within 30 days, we refund in full. No questions.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                style={{
                  padding: '28px 0',
                  borderBottom: '1px solid var(--rule)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--ink)',
                    letterSpacing: '-0.01em',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      color: 'var(--accent)',
                      fontSize: 13,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ◈
                  </span>
                  {faq.q}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.92rem',
                    lineHeight: 1.7,
                    color: 'var(--ink)',
                    opacity: 0.68,
                    paddingLeft: 23,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div
            style={{
              marginTop: 64,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: 'var(--ink)',
                opacity: 0.6,
                marginBottom: 28,
              }}
            >
              Ready to stop losing leads to slow response times?
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <button
                onClick={handlePilot}
                disabled={loading}
                className="mono"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--paper)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '16px 36px',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? 'REDIRECTING…' : 'START 30-DAY PILOT → $997'}
              </button>

              <a
                href="https://calendly.com/hello-eevolvv"
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  background: 'transparent',
                  color: 'var(--ink)',
                  border: '1px solid var(--rule)',
                  borderRadius: 4,
                  padding: '16px 28px',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                BOOK A CALL FIRST →
              </a>
            </div>

            {error && (
              <p
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--accent)',
                  marginTop: 14,
                  textAlign: 'center',
                }}
              >
                {error}
              </p>
            )}

            <div
              className="mono"
              style={{
                fontSize: 11,
                color: 'var(--ink)',
                opacity: 0.4,
                marginTop: 20,
                letterSpacing: '0.04em',
              }}
            >
              30-day money-back · live in 14 days · cancel anytime after pilot
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
