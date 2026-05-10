'use client'

import { useState, useRef } from 'react'
import posthog from 'posthog-js'

interface OnboardingFormProps {
  token: string
  clientId: string
  tier: 'seed' | 'core' | 'evolve'
  defaultName?: string
  industry?: string
}

export function OnboardingForm({ token, tier, defaultName, industry }: OnboardingFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pageLoadMs = useRef<number>(Date.now())

  const isFitness = industry === 'Fitness / Gym / Studio'

  const [form, setForm] = useState({
    businessName: defaultName ?? '',
    businessDescription: '',
    primaryGoal: '',
    topPains: '',
    existingTools: '',
    commChannel: 'email',
    // Core+
    appType: '',
    integrationsNeeded: '',
    authRequired: '',
    // Evolve
    orgSize: '',
    techStack: '',
    keyStakeholders: '',
    // Fitness fields
    gymSoftware: '',
    softwareUsername: '',
    softwarePassword: '',
    apiKey: '',
    memberCount: '',
    monthlyChurnRate: '',
  })

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/onboard/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Submission failed. Please try again.')
        setLoading(false)
        return
      }
      // T24: onboarding_completed — time_to_complete_minutes measures form engagement
      const timeToCompleteMinutes = Math.round((Date.now() - pageLoadMs.current) / 60000 * 10) / 10
      posthog.capture('onboarding_completed', {
        tier,
        time_to_complete_minutes: timeToCompleteMinutes,
      })
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  if (submitted) {
    const slaMap: Record<string, string> = { seed: '72 hours', core: '7–10 days', evolve: '14–21 days' }
    return (
      <div style={{ border: '1px solid var(--ink)', padding: 32 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>§ · BUILD QUEUED</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 12px' }}>You&apos;re in the queue.</h2>
        <p style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.6, margin: 0 }}>
          Build SLA: <strong>{slaMap[tier] ?? '72 hours'}</strong> from when your technician claims your build. You&apos;ll receive an email the moment work begins.
        </p>

        {isFitness && (
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8 }}>→ NEXT STEP</div>
            <p style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.6, margin: '0 0 16px' }}>
              Book a 15-minute kickoff call so we can confirm your software access and start building.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/hello-eevolvv'}
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                display: 'inline-block',
                padding: '14px 24px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                textDecoration: 'none',
                fontSize: 11,
                letterSpacing: '0.18em',
                fontWeight: 700,
              }}
            >
              BOOK KICKOFF CALL →
            </a>
          </div>
        )}
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: '1px solid var(--rule)', background: 'transparent',
    fontSize: 14, color: 'var(--ink)', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, letterSpacing: '0.14em',
    color: 'var(--ink)', opacity: 0.6, marginBottom: 6, fontWeight: 600,
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* All tiers */}
      <div>
        <label style={labelStyle}>BUSINESS NAME *</label>
        <input required style={inputStyle} value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Your business name" />
      </div>
      <div>
        <label style={labelStyle}>DESCRIBE YOUR BUSINESS *</label>
        <textarea required rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.businessDescription} onChange={e => set('businessDescription', e.target.value)} placeholder="What does your business do? Who do you serve?" />
      </div>
      <div>
        <label style={labelStyle}>PRIMARY GOAL FOR THIS BUILD *</label>
        <textarea required rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.primaryGoal} onChange={e => set('primaryGoal', e.target.value)} placeholder="What&apos;s the #1 thing this build needs to accomplish?" />
      </div>
      <div>
        <label style={labelStyle}>TOP 3 PAIN POINTS *</label>
        <textarea required rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.topPains} onChange={e => set('topPains', e.target.value)} placeholder="List your 3 biggest operational headaches" />
      </div>
      <div>
        <label style={labelStyle}>EXISTING TOOLS &amp; SOFTWARE</label>
        <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.existingTools} onChange={e => set('existingTools', e.target.value)} placeholder="CRM, email platform, accounting software, etc." />
      </div>
      <div>
        <label style={labelStyle}>PREFERRED COMMUNICATION CHANNEL</label>
        <select style={inputStyle} value={form.commChannel} onChange={e => set('commChannel', e.target.value)}>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="slack">Slack</option>
        </select>
      </div>

      {/* Fitness fields */}
      {isFitness && (
        <>
          <hr style={{ borderColor: 'var(--rule)', margin: '8px 0' }} />
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: -8 }}>
            § · FITNESS SETUP
          </div>

          <div>
            <label style={labelStyle}>GYM MANAGEMENT SOFTWARE *</label>
            <select required style={inputStyle} value={form.gymSoftware} onChange={e => set('gymSoftware', e.target.value)}>
              <option value="">Select your software</option>
              <option value="Mindbody">Mindbody</option>
              <option value="Glofox">Glofox</option>
              <option value="Zen Planner">Zen Planner</option>
              <option value="Pike13">Pike13</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', opacity: 0.55, padding: '8px 0' }}>
            ↳ Your credentials are transmitted over HTTPS and stored encrypted. We use them only to connect your software and build your automations.
          </div>

          <div>
            <label style={labelStyle}>SOFTWARE LOGIN (USERNAME / EMAIL) *</label>
            <input required type="text" style={inputStyle} value={form.softwareUsername} onChange={e => set('softwareUsername', e.target.value)} placeholder="login@example.com" />
          </div>
          <div>
            <label style={labelStyle}>SOFTWARE PASSWORD *</label>
            <input required type="password" style={inputStyle} value={form.softwarePassword} onChange={e => set('softwarePassword', e.target.value)} placeholder="••••••••" />
          </div>

          <div>
            <label style={labelStyle}>API KEY (OPTIONAL)</label>
            <input type="text" style={inputStyle} value={form.apiKey} onChange={e => set('apiKey', e.target.value)} placeholder="Found in your software's developer / integrations settings" />
          </div>

          <div>
            <label style={labelStyle}>CURRENT ACTIVE MEMBER COUNT *</label>
            <input required type="number" min="1" style={inputStyle} value={form.memberCount} onChange={e => set('memberCount', e.target.value)} placeholder="e.g. 250" />
          </div>

          <div>
            <label style={labelStyle}>MONTHLY CHURN RATE (%) *</label>
            <input required type="number" min="0" max="100" step="0.1" style={inputStyle} value={form.monthlyChurnRate} onChange={e => set('monthlyChurnRate', e.target.value)} placeholder="e.g. 5.5" />
          </div>

          <div style={{
            background: 'rgba(20,20,19,0.04)',
            borderLeft: '3px solid var(--accent)',
            padding: '16px 20px',
          }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 10, fontWeight: 700 }}>
              → MONTH 1 BUILD
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--ink)' }}>
              Churn Early-Warning System
            </div>
            <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
              We will build your churn early-warning system. This flags at-risk members 30 days before they cancel — based on declining check-in frequency, skipped classes, and failed EFT payments — and triggers a re-engagement sequence automatically.
            </div>
          </div>
        </>
      )}

      {/* Core + Evolve */}
      {(tier === 'core' || tier === 'evolve') && (
        <>
          <hr style={{ borderColor: 'var(--rule)', margin: '8px 0' }} />
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: -8 }}>
            § · {tier.toUpperCase()} DETAILS
          </div>
          <div>
            <label style={labelStyle}>WHAT TYPE OF APP / WEB APP?</label>
            <input style={inputStyle} value={form.appType} onChange={e => set('appType', e.target.value)} placeholder="e.g. client portal, booking system, internal dashboard" />
          </div>
          <div>
            <label style={labelStyle}>INTEGRATIONS NEEDED</label>
            <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.integrationsNeeded} onChange={e => set('integrationsNeeded', e.target.value)} placeholder="Stripe, Google Calendar, HubSpot, QuickBooks..." />
          </div>
          <div>
            <label style={labelStyle}>USER AUTHENTICATION REQUIRED?</label>
            <select style={inputStyle} value={form.authRequired} onChange={e => set('authRequired', e.target.value)}>
              <option value="">Not sure</option>
              <option value="yes">Yes — users need accounts/login</option>
              <option value="no">No — public or internal only</option>
            </select>
          </div>
        </>
      )}

      {/* Evolve only */}
      {tier === 'evolve' && (
        <>
          <div>
            <label style={labelStyle}>ORGANIZATION SIZE</label>
            <input style={inputStyle} value={form.orgSize} onChange={e => set('orgSize', e.target.value)} placeholder="e.g. 12 employees, 3 departments" />
          </div>
          <div>
            <label style={labelStyle}>EXISTING TECH STACK</label>
            <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.techStack} onChange={e => set('techStack', e.target.value)} placeholder="Current software, databases, cloud providers..." />
          </div>
          <div>
            <label style={labelStyle}>KEY STAKEHOLDERS (NAME · ROLE)</label>
            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.keyStakeholders} onChange={e => set('keyStakeholders', e.target.value)} placeholder="Jane Smith · CTO&#10;Bob Jones · Operations Manager" />
          </div>
        </>
      )}

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(140,43,26,0.08)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mono"
        style={{
          padding: '16px 0', background: 'var(--ink)', color: 'var(--paper)',
          border: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'SUBMITTING...' : 'SUBMIT & START BUILD →'}
      </button>
    </form>
  )
}
