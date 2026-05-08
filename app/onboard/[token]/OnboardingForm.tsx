'use client'

import { useState, useRef } from 'react'
import posthog from 'posthog-js'

interface OnboardingFormProps {
  token: string
  clientId: string
  tier: 'seed' | 'core' | 'evolve'
  defaultName?: string
}

export function OnboardingForm({ token, tier, defaultName }: OnboardingFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pageLoadMs = useRef<number>(Date.now())

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
