'use client'

import { useEffect, useState } from 'react'
import { trackCTA, trackPartnerEvent } from '@/lib/analytics'

const PARTNER_TYPES = [
  { value: 'agency', label: 'Marketing / SEO Agency' },
  { value: 'web_designer', label: 'Web Designer' },
  { value: 'freelancer', label: 'Ad / Freelance Consultant' },
  { value: 'consultant', label: 'Small Business Consultant' },
  { value: 'fractional_coo', label: 'Fractional COO' },
  { value: 'accountant', label: 'Bookkeeper / Accountant' },
  { value: 'coach', label: 'Industry Coach' },
  { value: 'other', label: 'Other' },
]

const PROBLEMS = [
  'Your clients constantly ask about "AI" and you don\'t want to build it yourself.',
  'You see ghost work everywhere — missed leads, slow follow-up, manual reporting — but no time to fix it.',
  'Your strategy work gets undercut by ops chaos at the client.',
]

const WHAT_YOU_GET = [
  '10% of subscription revenue for 12 months on every referred client.',
  '10% on one-time add-ons — websites, dashboards, ads setup, extra automations.',
  'Co-branded diagnostic link and partner landing page.',
  'One-page PDF, referral tracking, simple handoff scripts.',
  'eevolvv runs delivery. You keep the client relationship.',
]

const HOW_IT_WORKS = [
  ['P-01', 'Apply', 'Tell us who you serve and what AI conversations come up most.'],
  ['P-02', 'Get your link', 'We approve and send a co-branded diagnostic link.'],
  ['P-03', 'Refer clients', 'Drop the link in your next conversation. We run the diagnostic.'],
  ['P-04', 'Get paid', '10% monthly for 12 months on every paying client. 10% on add-ons.'],
]

export function PartnersClient() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    trackPartnerEvent('partner_page_viewed')
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      partnerType: String(fd.get('partnerType') ?? ''),
      audience: String(fd.get('audience') ?? ''),
      monthlyClients: String(fd.get('monthlyClients') ?? ''),
      motivation: String(fd.get('motivation') ?? ''),
      source: typeof document !== 'undefined' ? document.referrer || '' : '',
    }

    trackCTA({ location: 'partners_intake_submit', label: 'APPLY FOR PARTNER ACCESS', target: 'partners_intake' })

    try {
      const res = await fetch('/api/partners/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Submission failed')
      }
      trackPartnerEvent('partner_intake_submitted', { partner_type: payload.partnerType })
      setSubmitted(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      trackPartnerEvent('partner_intake_failed', { reason: message })
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  function onFirstFocus() {
    if (!hasInteracted) {
      setHasInteracted(true)
      trackPartnerEvent('partner_intake_started')
    }
  }

  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 32px 76px', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 20 }}>
            § 01 · PARTNER PROGRAM
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 0.98, letterSpacing: '-0.035em', fontWeight: 700, margin: 0, maxWidth: 980 }}>
            Give your clients a free AI ghost work assessment.<br />
            <span style={{ color: 'var(--accent)' }}>We build the workflows. You keep the relationship.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, opacity: 0.7, maxWidth: 680, margin: '28px 0 36px' }}>
            eevolvv partners route their clients into a free diagnostic, watch us ship the agent page,
            and earn 10% of subscription revenue for the first 12 months — plus 10% on every add-on.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="#apply"
              onClick={() => trackCTA({ location: 'partners_hero_primary', label: 'APPLY TO PARTNER', target: 'partners_intake' })}
              className="mono btn-gradient"
              style={{ padding: '16px 28px', fontSize: 12, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none' }}
            >
              APPLY TO PARTNER →
            </a>
            <a
              href="/#diagnostic"
              onClick={() => trackCTA({ location: 'partners_hero_secondary', label: 'TRY THE DIAGNOSTIC', target: 'diagnostic' })}
              className="mono"
              style={{ padding: '15px 24px', fontSize: 11, letterSpacing: '0.16em', fontWeight: 700, textDecoration: 'none', color: 'var(--ink)', border: '1px solid var(--ink)' }}
            >
              TRY THE DIAGNOSTIC FIRST
            </a>
          </div>
        </div>
      </section>

      {/* ── Stat bar ──────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', borderBottom: '3px solid var(--accent)' }}>
        <div className="site-rail mx-auto" style={{ padding: '60px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          <div>
            <div style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--accent)', lineHeight: 1 }}>10%</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.7, marginTop: 12 }}>SUBSCRIPTION REVENUE</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', opacity: 0.5, marginTop: 4 }}>FOR 12 MONTHS</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--accent)', lineHeight: 1 }}>10%</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.7, marginTop: 12 }}>ONE-TIME ADD-ONS</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', opacity: 0.5, marginTop: 4 }}>WEBSITES · DASHBOARDS · ADS</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--accent)', lineHeight: 1 }}>0</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.7, marginTop: 12 }}>DELIVERY OVERHEAD</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', opacity: 0.5, marginTop: 4 }}>WE RUN THE BUILD</div>
          </div>
        </div>
      </section>

      {/* ── Who this is for ───────────────────────────────────────────── */}
      <section style={{ padding: '76px 32px', borderBottom: '1px solid var(--rule)' }}>
        <div className="site-rail mx-auto growth-landing-three">
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
              § 02 · WHO THIS IS FOR
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.028em', fontWeight: 700, margin: 0 }}>
              You already own the trust. We own the build.
            </h2>
          </div>
          {PROBLEMS.map((problem, i) => (
            <div key={problem} className="growth-landing-cell">
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 12 }}>P-0{i + 1}</div>
              <p style={{ fontSize: 15, lineHeight: 1.58, opacity: 0.7, margin: 0 }}>{problem}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you get ──────────────────────────────────────────────── */}
      <section style={{ padding: '76px 32px', borderBottom: '1px solid var(--ink)', background: 'rgba(20,20,19,0.02)' }}>
        <div className="site-rail mx-auto growth-landing-split">
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
              § 03 · WHAT YOU GET
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.028em', fontWeight: 700, margin: 0 }}>
              Tangible economics, not a vanity badge.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.64, marginTop: 20, maxWidth: 520 }}>
              Referral revenue is paid after eevolvv receives payment and the refund / dispute window clears.
              No commission on ad spend, pass-through software, or refunds.
            </p>
          </div>
          <div style={{ border: '1px solid var(--ink)' }}>
            {WHAT_YOU_GET.map((item, i) => (
              <div key={item} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', borderBottom: i < WHAT_YOU_GET.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                <div className="mono" style={{ padding: '18px 16px', borderRight: '1px solid var(--rule)', color: 'var(--accent)', fontSize: 10, letterSpacing: '0.18em' }}>
                  Y-0{i + 1}
                </div>
                <div style={{ padding: '18px 20px', fontSize: 15, lineHeight: 1.5 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section style={{ padding: '76px 32px', borderBottom: '1px solid var(--rule)' }}>
        <div className="site-rail mx-auto">
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
            § 04 · HOW IT WORKS
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.028em', fontWeight: 700, margin: '0 0 36px' }}>
            Four steps. Twenty minutes of setup.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0, border: '1px solid var(--ink)' }}>
            {HOW_IT_WORKS.map(([code, title, body]) => (
              <div key={code} style={{ padding: 24, borderRight: '1px solid var(--rule)' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 12 }}>{code}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.7, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application form ──────────────────────────────────────────── */}
      <section id="apply" className="anchor-scroll" style={{ padding: '88px 32px 100px' }}>
        <div className="site-rail mx-auto" style={{ maxWidth: 760 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
            § 05 · APPLY
          </div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 54px)', lineHeight: 1.03, letterSpacing: '-0.03em', fontWeight: 700, margin: 0 }}>
            Apply for partner access.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, opacity: 0.66, marginTop: 16, marginBottom: 36, maxWidth: 580 }}>
            We approve partners weekly. Most applications hear back within 3 business days.
          </p>

          {submitted ? (
            <div style={{ border: '1px solid var(--ink)', padding: '40px 32px', background: 'rgba(20,20,19,0.025)' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}>
                APPLICATION RECEIVED
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>You&rsquo;re in the queue.</div>
              <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.7, margin: 0 }}>
                We&rsquo;ll review your application and reply within 3 business days with your co-branded diagnostic link, partner PDF, and onboarding script.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} onFocus={onFirstFocus} style={{ display: 'grid', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                <Field label="YOUR NAME *" name="name" required />
                <Field label="WORK EMAIL *" name="email" type="email" required />
                <Field label="COMPANY / BRAND" name="company" />
                <SelectField label="PARTNER TYPE" name="partnerType" options={PARTNER_TYPES} />
              </div>
              <Field label="WHO DO YOU SERVE? (industries, business size, geography)" name="audience" />
              <SelectField
                label="HOW MANY CLIENTS DO YOU TYPICALLY ADVISE PER MONTH?"
                name="monthlyClients"
                options={[
                  { value: '1-5', label: '1–5' },
                  { value: '6-20', label: '6–20' },
                  { value: '20+', label: '20+' },
                ]}
              />
              <TextareaField
                label="WHY PARTNER WITH EEVOLVV? (briefly — what AI questions do your clients ask you?)"
                name="motivation"
              />

              {error && (
                <div className="mono" style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.08em' }}>
                  → {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mono btn-gradient"
                style={{
                  padding: '18px 28px',
                  fontSize: 12,
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  border: 'none',
                  cursor: submitting ? 'wait' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                  justifySelf: 'start',
                }}
              >
                {submitting ? 'SENDING…' : 'APPLY FOR PARTNER ACCESS →'}
              </button>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', opacity: 0.5 }}>
                BY APPLYING YOU AGREE TO eevolvv&rsquo;s STANDARD REFERRAL TERMS.
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

// ─── Form atoms ───────────────────────────────────────────────────────────

function Field({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.65 }}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        style={{
          padding: '14px 16px',
          background: 'transparent',
          border: '1px solid var(--ink)',
          fontSize: 14,
          color: 'var(--ink)',
          fontFamily: 'inherit',
          width: '100%',
        }}
      />
    </label>
  )
}

function SelectField({ label, name, options }: { label: string; name: string; options: Array<{ value: string; label: string }> }) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.65 }}>{label}</span>
      <select
        name={name}
        defaultValue=""
        style={{
          padding: '14px 16px',
          background: 'transparent',
          border: '1px solid var(--ink)',
          fontSize: 14,
          color: 'var(--ink)',
          fontFamily: 'inherit',
          width: '100%',
        }}
      >
        <option value="" disabled>Select…</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

function TextareaField({ label, name }: { label: string; name: string }) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.65 }}>{label}</span>
      <textarea
        name={name}
        rows={4}
        style={{
          padding: '14px 16px',
          background: 'transparent',
          border: '1px solid var(--ink)',
          fontSize: 14,
          color: 'var(--ink)',
          fontFamily: 'inherit',
          width: '100%',
          resize: 'vertical',
        }}
      />
    </label>
  )
}
