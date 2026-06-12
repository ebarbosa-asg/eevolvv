'use client'

import { useState } from 'react'
import SiteHeader from '@/components/sections/site-header'
import SiteFooter from '@/components/sections/site-footer'

export default function TextbackPageClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePilot() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'textback-pilot' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else { setError(data.error ?? 'Something went wrong.'); setLoading(false) }
    } catch { setError('Network error.'); setLoading(false) }
  }

  return (
    <>
      <SiteHeader />
      <main>

        {/* ── § 01 · HERO ───────────────────────────────────────────────── */}
        <section style={{
          background: 'var(--paper)',
          paddingTop: 120,
          paddingBottom: 80,
        }}>
          <div className="site-rail" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 24,
            }}>
              § 01 · Missed-Call Textback — Gyms &amp; Studios
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 52px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--ink)',
              maxWidth: 780,
              marginBottom: 24,
            }}>
              Every missed call answered by text in 30 seconds.
            </h1>

            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.65,
              color: 'var(--ink)',
              opacity: 0.72,
              maxWidth: 640,
              marginBottom: 40,
            }}>
              Most gyms lose 60–80% of the leads that call and don&apos;t get an answer. We install an instant
              text-back system that turns missed calls into booked trials — automatically.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <button
                onClick={handlePilot}
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--accent)',
                  color: 'var(--paper)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: 4,
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                  textDecoration: 'none',
                }}
              >
                {loading ? 'Redirecting…' : 'Start 30-Day Pilot → $497'}
              </button>

              <a
                href="https://calendly.com/hello-eevolvv"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '13px 28px',
                  border: '1px solid var(--ink)',
                  borderRadius: 4,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
              >
                Book a Call First →
              </a>
            </div>

            {error && (
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                color: 'var(--accent)',
                marginBottom: 12,
              }}>
                {error}
              </p>
            )}

            <div className="mono" style={{
              fontSize: 12,
              color: 'var(--ink)',
              opacity: 0.5,
              letterSpacing: '0.04em',
            }}>
              <span style={{ color: 'var(--accent)', marginRight: 6 }}>→</span>
              30-day money-back · Live within 7 business days · No long-term contract
            </div>

          </div>
        </section>

        {/* ── § 02 · THE PROBLEM ────────────────────────────────────────── */}
        <section style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          paddingTop: 80,
          paddingBottom: 80,
        }}>
          <div className="site-rail" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 24,
            }}>
              § 02 · The Problem
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.5vw, 40px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--paper)',
              maxWidth: 640,
              marginBottom: 40,
            }}>
              Every missed call is a lost member.
            </h2>

            {/* Terminal log block */}
            <div style={{
              background: 'rgba(20,20,19,0.055)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: 4,
              padding: '24px 28px',
              marginBottom: 56,
              maxWidth: 720,
            }}>
              {[
                { key: 'MISSED CALL', val: 'no callback → caller tries the gym down the street' },
                { key: 'AFTER-HOURS', val: 'zero response until morning → lead booked elsewhere overnight' },
                { key: 'VOICEMAIL', val: '"leave a message" → 70% of callers hang up instead' },
                { key: 'FOLLOW-UP', val: 'manual callbacks happen once, if at all → lead goes cold' },
              ].map(({ key, val }) => (
                <div
                  key={key}
                  className="mono"
                  style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--paper)', display: 'flex', gap: 12 }}
                >
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                  <span>
                    <span style={{ display: 'inline-block', minWidth: 130 }}>{key}</span>
                    <span style={{ opacity: 0.5, marginRight: 8 }}>↳</span>
                    <span style={{ opacity: 0.8 }}>{val}</span>
                  </span>
                </div>
              ))}
              <div className="mono" style={{
                fontSize: 13,
                lineHeight: 1.9,
                color: 'var(--paper)',
                opacity: 0.3,
                marginTop: 4,
              }}>
                // Most gyms recover fewer than 20% of missed calls without an automated system
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 40,
              maxWidth: 720,
            }}>
              {[
                { stat: '60–80%', label: 'of missed calls never convert without follow-up' },
                { stat: '5 min', label: 'the window where a callback converts at peak rate' },
                { stat: '3–6/wk', label: 'trial bookings the average gym misses to response delay' },
              ].map(({ stat, label }) => (
                <div key={stat}>
                  <div className="mono" style={{
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    lineHeight: 1,
                    marginBottom: 8,
                    letterSpacing: '-0.02em',
                  }}>
                    {stat}
                  </div>
                  <div className="mono" style={{
                    fontSize: 12,
                    color: 'var(--paper)',
                    opacity: 0.55,
                    lineHeight: 1.5,
                    letterSpacing: '0.02em',
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── § 03 · WHAT YOU GET ───────────────────────────────────────── */}
        <section style={{
          background: 'var(--paper)',
          paddingTop: 80,
          paddingBottom: 80,
        }}>
          <div className="site-rail" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 24,
            }}>
              § 03 · What You Get
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.5vw, 40px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--ink)',
              maxWidth: 640,
              marginBottom: 48,
            }}>
              A missed-call machine, live in 7 days.
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              marginBottom: 48,
            }}>
              {[
                {
                  num: 'N=01',
                  title: 'Instant Text-Back',
                  body: 'Every missed call triggers a text in <30s: "Hey [name], this is [Gym Name] — sorry we missed you! What\'s bringing you in today?" Custom message you approve.',
                },
                {
                  num: 'N=02',
                  title: 'Lead Follow-Up Sequence',
                  body: '5-touch automated sequence (day 0, 1, 3, 7, 14) via text. Each touch moves toward a trial booking. Stops when they book or ask to stop.',
                },
                {
                  num: 'N=03',
                  title: 'Trial Booking + Reminder',
                  body: 'Once they say yes to a trial, a booking confirmation and 24hr reminder fire automatically. Reduces no-shows.',
                },
                {
                  num: 'N=04',
                  title: 'Weekly Metrics Report',
                  body: 'Every Monday: missed call count, text-back response rate, trials booked from sequence, trial-to-membership conversion.',
                },
              ].map(({ num, title, body }) => (
                <div
                  key={num}
                  style={{
                    background: 'rgba(20,20,19,0.035)',
                    border: '1px solid var(--rule)',
                    borderRadius: 6,
                    padding: '28px 28px 32px',
                  }}
                >
                  <div className="mono" style={{
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: 14,
                  }}>
                    {num}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 18,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink)',
                    marginBottom: 10,
                  }}>
                    {title}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: 'var(--ink)',
                    opacity: 0.68,
                    margin: 0,
                  }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>

            {/* Delivery note */}
            <div style={{
              background: 'rgba(20,20,19,0.055)',
              border: '1px solid var(--rule)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: 4,
              padding: '16px 22px',
              display: 'inline-block',
            }}>
              <span className="mono" style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.9 }}>
                <span style={{ color: 'var(--accent)' }}>→</span>
                {' '}
                <span style={{ opacity: 0.85 }}>
                  DELIVERY: 7 business days · 30-day money-back · cancel anytime after pilot
                </span>
              </span>
            </div>

          </div>
        </section>

        {/* ── § 04 · DELIVERY TIMELINE ──────────────────────────────────── */}
        <section style={{
          background: 'var(--paper)',
          borderTop: '1px solid var(--rule)',
          paddingTop: 80,
          paddingBottom: 80,
        }}>
          <div className="site-rail" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 24,
            }}>
              § 04 · Delivery Timeline
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.5vw, 40px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--ink)',
              maxWidth: 560,
              marginBottom: 52,
            }}>
              Live in 7 business days.
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 0,
              position: 'relative',
            }}>
              {[
                {
                  day: 'DAY 1',
                  label: 'Kickoff call',
                  detail: 'Map your phone system, booking platform (Mindbody/Glofox/Acuity), and the message tone and content you want to use',
                },
                {
                  day: 'DAY 2',
                  label: 'Build + configure',
                  detail: 'Textback sequence set up and connected to your phone number and booking flow',
                },
                {
                  day: 'DAY 5',
                  label: 'Test + review',
                  detail: 'You review 3 test call scenarios and approve every message template',
                },
                {
                  day: 'DAY 7',
                  label: 'Live',
                  detail: 'Every missed call triggers a text-back within 30 seconds',
                },
              ].map(({ day, label, detail }, i) => (
                <div
                  key={day}
                  style={{
                    borderLeft: i === 0 ? '3px solid var(--accent)' : '1px solid var(--rule)',
                    paddingLeft: 24,
                    paddingBottom: 40,
                    paddingRight: 24,
                    position: 'relative',
                  }}
                >
                  <div className="mono" style={{
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: 8,
                  }}>
                    {day}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 17,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink)',
                    marginBottom: 8,
                  }}>
                    {label}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: 'var(--ink)',
                    opacity: 0.6,
                    margin: 0,
                  }}>
                    {detail}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── § 05 · WHO DOES THE WORK ──────────────────────────────────── */}
        <section style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          paddingTop: 80,
          paddingBottom: 80,
        }}>
          <div className="site-rail" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 24,
            }}>
              § 05 · Who Does the Work
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 48,
              marginBottom: 48,
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'clamp(20px, 2.5vw, 26px)',
                  letterSpacing: '-0.025em',
                  color: 'var(--paper)',
                  marginBottom: 16,
                }}>
                  A human operations lead
                </div>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: 'var(--paper)',
                  opacity: 0.65,
                  margin: 0,
                }}>
                  We scope, build, test, and configure the system around your specific gym. You get a named contact
                  from kickoff to handoff.
                </p>
              </div>

              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'clamp(20px, 2.5vw, 26px)',
                  letterSpacing: '-0.025em',
                  color: 'var(--paper)',
                  marginBottom: 16,
                }}>
                  The Volvv-E engine
                </div>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: 'var(--paper)',
                  opacity: 0.65,
                  margin: 0,
                }}>
                  AI that runs the text sequences 24/7 after launch. Handles after-hours, weekends, and the full
                  follow-up cadence without manual intervention.
                </p>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 28,
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 17,
                color: 'var(--paper)',
                opacity: 0.45,
                margin: 0,
                fontStyle: 'italic',
              }}>
                You own the messages. We run the system.
              </p>
            </div>

          </div>
        </section>

        {/* ── § 06 · PRICING ────────────────────────────────────────────── */}
        <section style={{
          background: 'var(--paper)',
          paddingTop: 80,
          paddingBottom: 80,
        }}>
          <div className="site-rail" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 24,
            }}>
              § 06 · Pricing
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
              marginBottom: 48,
              maxWidth: 820,
            }}>
              {/* Pilot card — featured */}
              <div style={{
                background: 'var(--ink)',
                border: '2px solid var(--accent)',
                borderRadius: 8,
                padding: '36px 32px',
                position: 'relative',
              }}>
                {/* Badge */}
                <div className="mono" style={{
                  display: 'inline-block',
                  background: 'var(--accent)',
                  color: 'var(--paper)',
                  fontSize: 9,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: 2,
                  marginBottom: 20,
                }}>
                  Lowest Risk Start
                </div>

                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: '-0.025em',
                  color: 'var(--paper)',
                  marginBottom: 4,
                }}>
                  30-Day Pilot
                </div>

                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(36px, 5vw, 48px)',
                  letterSpacing: '-0.03em',
                  color: 'var(--accent)',
                  lineHeight: 1,
                  marginBottom: 28,
                }}>
                  $497
                  <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6, letterSpacing: 0 }}> one-time</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'Instant text-back on every missed call',
                    '5-touch lead follow-up sequence',
                    'Trial booking + reminder flow',
                    'Kickoff call on Day 1',
                    'Live in 7 business days or extended free',
                    '30-day money-back guarantee',
                  ].map((feat) => (
                    <li key={feat} className="mono" style={{ fontSize: 13, color: 'var(--paper)', opacity: 0.8, display: 'flex', gap: 10, lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handlePilot}
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'var(--accent)',
                    color: 'var(--paper)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '14px 0',
                    border: 'none',
                    borderRadius: 4,
                    cursor: loading ? 'wait' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {loading ? 'Redirecting…' : 'Start Pilot →'}
                </button>

                {error && (
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent)', marginTop: 10, marginBottom: 0 }}>
                    {error}
                  </p>
                )}
              </div>

              {/* Monthly card */}
              <div style={{
                background: 'rgba(20,20,19,0.04)',
                border: '1px solid var(--rule)',
                borderRadius: 8,
                padding: '36px 32px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: '-0.025em',
                  color: 'var(--ink)',
                  marginBottom: 4,
                }}>
                  Monthly After Pilot
                </div>

                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(36px, 5vw, 48px)',
                  letterSpacing: '-0.03em',
                  color: 'var(--ink)',
                  lineHeight: 1,
                  marginBottom: 20,
                }}>
                  $299
                  <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.5, letterSpacing: 0 }}>/mo</span>
                </div>

                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: 'var(--ink)',
                  opacity: 0.65,
                  marginBottom: 0,
                }}>
                  Pilot proves the number. Convert with one click after 30 days. No re-setup, no new contract.
                </p>
              </div>
            </div>

            {/* Guarantee block */}
            <div style={{
              background: 'rgba(20,20,19,0.055)',
              border: '1px solid var(--rule)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: 4,
              padding: '18px 24px',
              marginBottom: 32,
              maxWidth: 540,
            }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: 6, textTransform: 'uppercase' }}>
                30-Day Money-Back Guarantee
              </div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--ink)',
                opacity: 0.65,
                margin: 0,
              }}>
                If the system isn&apos;t live and processing real missed calls within 30 days, full refund. No questions asked.
              </p>
            </div>

            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              color: 'var(--ink)',
              opacity: 0.55,
            }}>
              Want to talk it through first?{' '}
              <a
                href="https://calendly.com/hello-eevolvv"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'underline' }}
              >
                Book a call →
              </a>
            </p>

          </div>
        </section>

        {/* ── § 07 · FAQ ────────────────────────────────────────────────── */}
        <section style={{
          background: 'var(--paper)',
          borderTop: '1px solid var(--rule)',
          paddingTop: 80,
          paddingBottom: 80,
        }}>
          <div className="site-rail" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 24,
            }}>
              § 07 · Common Questions
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(24px, 3vw, 36px)',
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: 52,
            }}>
              Everything you need to know.
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '40px 56px',
              maxWidth: 1000,
            }}>
              {[
                {
                  q: 'What phone system do you work with?',
                  a: 'Any system that supports call forwarding. We route missed calls through a tracking number and trigger the text-back from there. Works with Google Voice, Grasshopper, RingCentral, and most VoIP providers.',
                },
                {
                  q: 'What booking platforms do you integrate with?',
                  a: 'Mindbody, Glofox, Acuity, and Pike13 are the primary integrations. If you use something else, tell us in the kickoff call — most platforms have API or Zapier access.',
                },
                {
                  q: 'What if someone texts back "stop"?',
                  a: 'We honor all opt-outs immediately. The sequence stops and the contact is suppressed from future messages. Full TCPA compliance.',
                },
                {
                  q: "What's in the 5-touch sequence?",
                  a: 'Day 0 (instant text-back), Day 1 (follow-up), Day 3 (social proof + CTA), Day 7 (last chance offer), Day 14 (win-back). Every message is approved by you before going live.',
                },
                {
                  q: 'What happens after 30 days?',
                  a: 'You decide. Convert to $299/mo and keep it running, or we hand off the full configuration. No pressure, no auto-renewal.',
                },
                {
                  q: "What's the money-back guarantee?",
                  a: "If the system isn't live and processing real missed calls within 30 days, full refund. No questions asked.",
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <div className="mono" style={{
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: 10,
                  }}>
                    Q
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: '-0.01em',
                    color: 'var(--ink)',
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}>
                    {q}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: 'var(--ink)',
                    opacity: 0.62,
                    margin: 0,
                  }}>
                    {a}
                  </p>
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <div style={{
              marginTop: 72,
              paddingTop: 52,
              borderTop: '1px solid var(--rule)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
            }}>
              <button
                onClick={handlePilot}
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--accent)',
                  color: 'var(--paper)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: 4,
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? 'Redirecting…' : 'Start 30-Day Pilot → $497'}
              </button>

              <a
                href="https://calendly.com/hello-eevolvv"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  color: 'var(--ink)',
                  opacity: 0.55,
                  textDecoration: 'none',
                }}
              >
                or book a call first →
              </a>
            </div>

          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
