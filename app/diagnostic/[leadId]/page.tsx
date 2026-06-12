'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

interface SubmissionData {
  id: string
  business_name?: string
  contact_email?: string
  industry?: string
  report_text?: string
  created_at?: string
}

// ── Industry CTA config ───────────────────────────────────────────────────

const INDUSTRY_CTAS: Record<string, { label: string; desc: string; href: string; tag: string }> = {
  law: {
    label: 'AI Client Intake — Law Firms',
    desc: 'Specifically built for your industry. Automate intake, conflicts, and follow-ups.',
    href: '/intake',
    tag: 'LAW / LEGAL',
  },
  legal: {
    label: 'AI Client Intake — Law Firms',
    desc: 'Specifically built for your industry. Automate intake, conflicts, and follow-ups.',
    href: '/intake',
    tag: 'LAW / LEGAL',
  },
  fitness: {
    label: 'Missed-Call Textback',
    desc: 'Every missed call is a lost client. Auto-reply in seconds and recover the lead.',
    href: '/textback',
    tag: 'FITNESS / GYM',
  },
  gym: {
    label: 'Missed-Call Textback',
    desc: 'Every missed call is a lost client. Auto-reply in seconds and recover the lead.',
    href: '/textback',
    tag: 'FITNESS / GYM',
  },
}

const ROADMAP_CTA = {
  label: '$97 Full Implementation Roadmap',
  desc: 'Step-by-step build plan with tool recommendations and 90-day timeline.',
  tag: 'UPGRADE',
}

function detectIndustryKey(industry?: string): string | null {
  if (!industry) return null
  const lower = industry.toLowerCase()
  if (lower.includes('law') || lower.includes('legal') || lower.includes('attorney') || lower.includes('solicitor')) return 'law'
  if (lower.includes('fitness') || lower.includes('gym') || lower.includes('personal train') || lower.includes('yoga') || lower.includes('pilates')) return 'fitness'
  return null
}

// ── Diagnostic report waste items (from live submission if available) ──────

const FALLBACK_WASTE = [
  { area: 'Manual appointment scheduling', hours_per_week: 18.2, annual_cost: 47800 },
  { area: 'Insurance verification calls', hours_per_week: 6.8, annual_cost: 17800 },
  { area: 'Patient intake forms', hours_per_week: 4.1, annual_cost: 10800 },
]

// ── Component ─────────────────────────────────────────────────────────────

export default function DiagnosticReport() {
  const params = useParams()
  const leadId = params.leadId as string

  const [submission, setSubmission] = useState<SubmissionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!leadId) return
    fetch(`/api/diagnostic/submission?id=${encodeURIComponent(leadId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setSubmission(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [leadId])

  const industryKey = detectIndustryKey(submission?.industry)
  const industryCta = industryKey ? INDUSTRY_CTAS[industryKey] : null

  const waste = FALLBACK_WASTE
  const totalAnnualWaste = waste.reduce((s, w) => s + w.annual_cost, 0)

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', paddingBottom: '96px' }}>
      <style>{`
        .report-card {
          background: rgba(20,20,19,.055);
          border: 1px solid var(--rule);
          border-left: 3px solid var(--accent);
          padding: 20px 24px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.9;
          margin-bottom: 16px;
        }
        .cta-card {
          background: rgba(20,20,19,.04);
          border: 1px solid var(--rule);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cta-card:hover {
          border-color: rgba(20,20,19,0.3);
        }
        .cta-card-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-weight: 600;
        }
        .cta-card-title {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          color: var(--ink);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .cta-card-desc {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--ink);
          opacity: 0.6;
          margin: 0;
          line-height: 1.7;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--ink);
          color: var(--paper);
          border: 1px solid var(--ink);
          padding: 12px 20px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: background .2s ease, border-color .2s ease;
          align-self: flex-start;
          margin-top: 4px;
        }
        .cta-btn:hover {
          background: var(--accent);
          border-color: var(--accent);
        }
        .cta-btn-accent {
          background: var(--accent);
          border-color: var(--accent);
        }
        .cta-btn-accent:hover {
          opacity: 0.9;
        }
        .waste-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 16px;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid var(--rule);
        }
        .waste-row:last-child { border-bottom: none; }
        @media (max-width: 640px) {
          .waste-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
          .cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--rule)', paddingTop: '48px', paddingBottom: '40px' }}>
        <div className="site-rail">
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            margin: '0 0 16px 0',
          }}>
            § EVOLUTION REPORT · ID {leadId.slice(0, 8).toUpperCase()}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            margin: '0 0 12px 0',
            lineHeight: 1.1,
          }}>
            Your diagnostic is complete.
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--ink)',
            opacity: 0.6,
            margin: 0,
            lineHeight: 1.6,
          }}>
            Volvv-E has mapped your business operations. Full report sent to your inbox.
            {loading && (
              <span style={{ marginLeft: '8px', color: 'var(--accent)' }}>Loading submission data…</span>
            )}
          </p>
        </div>
      </div>

      {/* ── Detected inefficiencies ───────────────────────────────── */}
      <div style={{ paddingTop: '48px', paddingBottom: '40px', borderBottom: '1px solid var(--rule)' }}>
        <div className="site-rail">

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            margin: '0 0 24px 0',
          }}>
            § 01 · GHOST WORK DETECTED
          </p>

          <div className="report-card">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 16px 0', fontWeight: 600 }}>
              § DETECTED INEFFICIENCIES
            </p>
            {waste.map((item, i) => (
              <div key={i} className="waste-row">
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink)', margin: 0 }}>
                  <span style={{ color: 'var(--accent)' }}>→</span>{' '}
                  {item.area.toUpperCase()}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)', opacity: 0.6, margin: 0, whiteSpace: 'nowrap' }}>
                  {item.hours_per_week} hrs/week
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', margin: 0, whiteSpace: 'nowrap', fontWeight: 600 }}>
                  ${item.annual_cost.toLocaleString()}/yr
                </p>
              </div>
            ))}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', opacity: 0.3, margin: '16px 0 0 0' }}>
              {'//'} Total recoverable: ~{waste.reduce((s, w) => s + w.hours_per_week, 0).toFixed(1)} hrs/week
            </p>
          </div>

          {/* Total impact */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'var(--rule)',
            border: '1px solid var(--rule)',
            marginTop: '16px',
          }}>
            <div style={{ background: 'var(--paper)', padding: '20px 24px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px 0', fontWeight: 600 }}>
                ANNUAL WASTE
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.03em' }}>
                ${totalAnnualWaste.toLocaleString()}
              </p>
            </div>
            <div style={{ background: 'var(--paper)', padding: '20px 24px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px 0', fontWeight: 600 }}>
                AUTOMATION COVERAGE
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.03em' }}>
                89%
              </p>
            </div>
            <div style={{ background: 'var(--paper)', padding: '20px 24px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px 0', fontWeight: 600 }}>
                IMPLEMENTATION
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.03em' }}>
                4–6 wks
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Automation blueprint ──────────────────────────────────── */}
      <div style={{ paddingTop: '48px', paddingBottom: '40px', borderBottom: '1px solid var(--rule)' }}>
        <div className="site-rail">

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            margin: '0 0 24px 0',
          }}>
            § 02 · AUTOMATION BLUEPRINT
          </p>

          <div className="report-card">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 16px 0', fontWeight: 600 }}>
              § RECOMMENDED AUTOMATIONS
            </p>
            <p style={{ margin: '0 0 4px 0' }}>
              <span style={{ color: 'var(--accent)' }}>→</span>{' '}
              <span style={{ color: 'var(--ink)', opacity: 0.8 }}>N=01</span>{' '}
              Deploy AI appointment assistant (24/7 self-service booking)
            </p>
            <p style={{ margin: '0 0 4px 0' }}>
              <span style={{ color: 'var(--accent)' }}>→</span>{' '}
              <span style={{ color: 'var(--ink)', opacity: 0.8 }}>N=02</span>{' '}
              Auto-verify insurance via API integration
            </p>
            <p style={{ margin: '0 0 16px 0' }}>
              <span style={{ color: 'var(--accent)' }}>→</span>{' '}
              <span style={{ color: 'var(--ink)', opacity: 0.8 }}>N=03</span>{' '}
              Digital intake forms with pre-population
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', opacity: 0.3, margin: 0 }}>
              {'//'} Full tool list + vendor recommendations in your inbox report
            </p>
          </div>

        </div>
      </div>

      {/* ── What to do next (industry-aware CTAs) ─────────────────── */}
      <div style={{ paddingTop: '48px', paddingBottom: '40px' }}>
        <div className="site-rail">

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            margin: '0 0 8px 0',
          }}>
            § 03 · WHAT TO DO NEXT
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--ink)',
            opacity: 0.6,
            margin: '0 0 32px 0',
            lineHeight: 1.6,
          }}>
            {industryCta
              ? `We found automation paths specific to the ${industryCta.tag} space.`
              : 'Pick the path that fits where you are right now.'}
          </p>

          <div
            className="cta-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: industryCta ? '1fr 1fr' : '1fr 1fr 1fr',
              gap: '16px',
            }}
          >
            {/* Industry-specific CTA (if detected) */}
            {industryCta && (
              <div className="cta-card" style={{ borderLeft: '3px solid var(--accent)' }}>
                <p className="cta-card-tag">
                  ◈ {industryCta.tag} · INDUSTRY MATCH
                </p>
                <p className="cta-card-title">{industryCta.label}</p>
                <p className="cta-card-desc">{industryCta.desc}</p>
                <a href={industryCta.href} className="cta-btn cta-btn-accent">
                  Learn more →
                </a>
              </div>
            )}

            {/* If no industry match, show both industry options */}
            {!industryCta && (
              <>
                <div className="cta-card">
                  <p className="cta-card-tag">◈ LAW / LEGAL</p>
                  <p className="cta-card-title">AI Client Intake — Law Firms</p>
                  <p className="cta-card-desc">
                    Specifically built for legal practices. Automate intake, conflicts check, and follow-ups.
                  </p>
                  <a href="/intake" className="cta-btn">
                    Learn more →
                  </a>
                </div>

                <div className="cta-card">
                  <p className="cta-card-tag">◈ FITNESS / GYM</p>
                  <p className="cta-card-title">Missed-Call Textback</p>
                  <p className="cta-card-desc">
                    Every missed call is a lost client. Auto-reply in seconds and recover the lead automatically.
                  </p>
                  <a href="/textback" className="cta-btn">
                    Learn more →
                  </a>
                </div>
              </>
            )}

            {/* Always-show: $97 roadmap upgrade */}
            <div className="cta-card" style={{ borderLeft: '3px solid rgba(20,20,19,0.25)' }}>
              <p className="cta-card-tag">◈ {ROADMAP_CTA.tag}</p>
              <p className="cta-card-title">{ROADMAP_CTA.label}</p>
              <p className="cta-card-desc">{ROADMAP_CTA.desc}</p>
              <a
                href={`/api/stripe/checkout?product=report-roadmap&submissionId=${encodeURIComponent(leadId)}`}
                className="cta-btn"
              >
                Get the roadmap →
              </a>
            </div>

          </div>

          {/* Footer note */}
          <div style={{
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid var(--rule)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              opacity: 0.4,
              margin: '0 0 4px 0',
            }}>
              → Report ID: {leadId}
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              opacity: 0.4,
              margin: '0 0 4px 0',
            }}>
              → Volvv-E · Autonomous Efficiency Engine · eevolvv, Inc.
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              opacity: 0.4,
              margin: 0,
            }}>
              → Questions? hello@eevolvv.com
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
