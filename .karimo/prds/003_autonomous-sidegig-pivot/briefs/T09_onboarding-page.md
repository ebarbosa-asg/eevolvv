# Task Brief: Onboarding Page (/onboard/[token])

**ID:** T09
**PRD:** autonomous-sidegig-pivot
**Complexity:** 4/5
**Priority:** must
**Model:** sonnet
**Depends on:** T05, T06

---

## Objective

Build `app/onboard/[token]/page.tsx` — a token-validated server component that validates the onboarding token from `onboarding_tokens`, then renders an `OnboardingForm` client component. On form submission, the responses are saved, the token is marked completed, and a `builds` record is created with `status: queued`. This is the first touchpoint a paying client has with eevolvv after checkout.

---

## Context

**Verify before starting:**
- `onboarding_tokens` table exists (T05 complete)
- `clients`, `builds` tables exist with required columns (T05 complete)
- `sendWelcomeEmail()` exists (T08 complete — for reference only, not called here)

**Token pattern to follow — `app/run/[shareToken]/` (if exists) or `app/os/ghost-locker/[codename]/page.tsx`:**
The OS already has token-validated pages. Check `app/os/ghost-locker/[codename]/page.tsx` for the server component validation pattern.

**Existing design system (`components/ds/`):**
Available components: `Button`, `Card`, `CardHeader`, `CardContent`, `Input`, `Textarea`, `Label`, `Badge`, `SectionMarker`, `TerminalBlock`, `DataRow`, `KPIStat`

**Key behavior:**
- Server component validates token against `onboarding_tokens` table
- If token invalid/expired: render error state inline (no redirect)
- If token valid: pass `{ clientId, tier, token }` to `OnboardingForm` client component
- `OnboardingForm` calls `PATCH /api/onboard/[token]` to save responses
- On success: mark `onboarding_tokens.completed_at`, update `builds` status, show confirmation

**Form fields by tier:**
- **All tiers:** Business name (prefill from clients.name), business description, primary goal, 3 biggest pain points, existing tools/integrations, preferred communication channel (email/phone/Slack)
- **Core + Evolve additional:** App type (what kind of app), integrations needed (list), user authentication required (yes/no)
- **Evolve additional:** Org size, tech stack, key stakeholders (names + roles)

---

## Implementation

### Files to Create

- `app/onboard/[token]/page.tsx` — Server component; validates token
- `app/onboard/[token]/OnboardingForm.tsx` — Client component; renders form
- `app/api/onboard/[token]/route.ts` — PATCH handler; saves responses

### Files to Modify

None.

### Step-by-Step

1. Create `app/api/onboard/[token]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { token } = params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Validate token
  const { data: tokenRow, error: tokenErr } = await supabase
    .from('onboarding_tokens')
    .select('id, client_id, status, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (tokenErr || !tokenRow) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  if (tokenRow.status === 'completed') {
    return NextResponse.json({ error: 'Onboarding already completed' }, { status: 409 })
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 410 })
  }

  const clientId = tokenRow.client_id

  // Save responses and mark completed
  const now = new Date().toISOString()
  const { error: updateErr } = await supabase
    .from('onboarding_tokens')
    .update({ responses: body, status: 'completed', completed_at: now })
    .eq('id', tokenRow.id)

  if (updateErr) {
    console.error('[onboard] token update error:', updateErr.message)
    return NextResponse.json({ error: 'Failed to save responses' }, { status: 500 })
  }

  // Update client record with business info
  await supabase
    .from('clients')
    .update({
      name: body.businessName as string || undefined,
      notes: JSON.stringify(body), // store full intake as notes
    })
    .eq('id', clientId)

  // Create or update build record to queued status
  // Check if build already exists for this client
  const { data: existingBuild } = await supabase
    .from('builds')
    .select('id')
    .eq('client_id', clientId)
    .eq('status', 'queued')
    .maybeSingle()

  if (!existingBuild) {
    // T06 creates the build record; if missing, create it here
    const { data: clientData } = await supabase
      .from('clients')
      .select('tier')
      .eq('id', clientId)
      .single()

    await supabase.from('builds').insert({
      client_id: clientId,
      tier: clientData?.tier ?? 'seed',
      status: 'queued',
    })
  }

  return NextResponse.json({ success: true })
}
```

2. Create `app/onboard/[token]/page.tsx` (Server Component):

```tsx
import { supabase } from '@/lib/supabase'
import { OnboardingForm } from './OnboardingForm'

interface PageProps {
  params: { token: string }
}

export default async function OnboardingPage({ params }: PageProps) {
  const { token } = params

  if (!supabase) {
    return <ErrorState message="Service temporarily unavailable. Please try again or contact hello@eevolvv.com." />
  }

  // Validate token
  const { data: tokenRow } = await supabase
    .from('onboarding_tokens')
    .select('id, client_id, status, expires_at, responses')
    .eq('token', token)
    .maybeSingle()

  if (!tokenRow) {
    return <ErrorState message="This onboarding link is invalid or has expired. Please contact hello@eevolvv.com to get a new link." />
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return <ErrorState message="This onboarding link has expired (30-day limit). Please contact hello@eevolvv.com to get a new link." />
  }

  if (tokenRow.status === 'completed') {
    return <CompletedState />
  }

  // Fetch client info for tier-aware form
  const { data: client } = await supabase
    .from('clients')
    .select('name, email, tier')
    .eq('id', tokenRow.client_id)
    .single()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 12, fontWeight: 600 }}>
            EEVOLVV · ONBOARDING
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px', color: 'var(--ink)' }}>
            Let's build your {(client?.tier ?? 'seed').charAt(0).toUpperCase() + (client?.tier ?? 'seed').slice(1)}.
          </h1>
          <p style={{ fontSize: 15, opacity: 0.65, margin: 0, lineHeight: 1.5 }}>
            5 minutes of your time. Your build SLA starts when you submit.
          </p>
        </div>
        <OnboardingForm
          token={token}
          clientId={tokenRow.client_id}
          tier={(client?.tier as 'seed' | 'core' | 'evolve') ?? 'seed'}
          defaultName={client?.name ?? ''}
        />
      </div>
    </main>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' as const }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>EEVOLVV</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 16px', color: 'var(--ink)' }}>Link unavailable</h1>
        <p style={{ fontSize: 15, opacity: 0.65, lineHeight: 1.6, margin: '0 0 24px' }}>{message}</p>
        <a href="mailto:hello@eevolvv.com" style={{ color: 'var(--accent)', fontSize: 14 }}>hello@eevolvv.com</a>
      </div>
    </main>
  )
}

function CompletedState() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' as const }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>EEVOLVV</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 16px', color: 'var(--ink)' }}>Onboarding complete.</h1>
        <p style={{ fontSize: 15, opacity: 0.65, lineHeight: 1.6 }}>
          You've already completed onboarding. Your build is in the queue. Watch for an email when work begins.
        </p>
      </div>
    </main>
  )
}
```

3. Create `app/onboard/[token]/OnboardingForm.tsx` (Client Component):

```tsx
'use client'

import { useState } from 'react'

interface OnboardingFormProps {
  token: string
  clientId: string
  tier: 'seed' | 'core' | 'evolve'
  defaultName?: string
}

export function OnboardingForm({ token, clientId, tier, defaultName }: OnboardingFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  if (submitted) {
    const slaMap = { seed: '72 hours', core: '7–10 days', evolve: '14–21 days' }
    return (
      <div style={{ border: '1px solid var(--ink)', padding: 32 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>§ · BUILD QUEUED</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 12px' }}>You're in the queue.</h2>
        <p style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.6, margin: 0 }}>
          Build SLA: <strong>{slaMap[tier]}</strong> from when your technician claims your build. You'll receive an email the moment work begins.
        </p>
      </div>
    )
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1px solid var(--rule)', background: 'transparent',
    fontSize: 14, color: 'var(--ink)', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    display: 'block', fontSize: 11, letterSpacing: '0.14em',
    color: 'var(--ink)', opacity: 0.6, marginBottom: 6, fontWeight: 600,
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' as const, gap: 24 }}>
      {/* All tiers */}
      <div>
        <label style={labelStyle}>BUSINESS NAME *</label>
        <input required style={inputStyle} value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Your business name" />
      </div>
      <div>
        <label style={labelStyle}>DESCRIBE YOUR BUSINESS *</label>
        <textarea required rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} value={form.businessDescription} onChange={e => set('businessDescription', e.target.value)} placeholder="What does your business do? Who do you serve?" />
      </div>
      <div>
        <label style={labelStyle}>PRIMARY GOAL FOR THIS BUILD *</label>
        <textarea required rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} value={form.primaryGoal} onChange={e => set('primaryGoal', e.target.value)} placeholder="What's the #1 thing this build needs to accomplish?" />
      </div>
      <div>
        <label style={labelStyle}>TOP 3 PAIN POINTS *</label>
        <textarea required rows={4} style={{ ...inputStyle, resize: 'vertical' as const }} value={form.topPains} onChange={e => set('topPains', e.target.value)} placeholder="List your 3 biggest operational headaches" />
      </div>
      <div>
        <label style={labelStyle}>EXISTING TOOLS & SOFTWARE</label>
        <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} value={form.existingTools} onChange={e => set('existingTools', e.target.value)} placeholder="CRM, email platform, accounting software, etc." />
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
            <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} value={form.integrationsNeeded} onChange={e => set('integrationsNeeded', e.target.value)} placeholder="Stripe, Google Calendar, HubSpot, QuickBooks..." />
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
            <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} value={form.techStack} onChange={e => set('techStack', e.target.value)} placeholder="Current software, databases, cloud providers..." />
          </div>
          <div>
            <label style={labelStyle}>KEY STAKEHOLDERS (NAME · ROLE)</label>
            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} value={form.keyStakeholders} onChange={e => set('keyStakeholders', e.target.value)} placeholder="Jane Smith · CTO&#10;Bob Jones · Operations Manager" />
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
```

---

## Code Patterns to Follow

```tsx
// Server component Supabase query (from app/api/diagnostic/route.ts)
const { data, error } = await supabase.from('table').select('...').eq('column', value).maybeSingle()

// Token validation pattern (guard + early return)
if (!tokenRow) return <ErrorState message="..." />
if (new Date(tokenRow.expires_at) < new Date()) return <ErrorState message="..." />
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `SUPABASE_URL` | DB client |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS |

---

## Acceptance Criteria

- [ ] `GET /onboard/[token]` renders with valid token (validates server-side)
- [ ] Invalid or missing token shows inline error state with support email
- [ ] Expired token (30+ days) shows expired error state
- [ ] Already-completed token shows "already completed" state
- [ ] Form fields present for all tiers: business name, description, primary goal, pain points, tools, comm channel
- [ ] Core + Evolve tiers show additional fields (app type, integrations, auth)
- [ ] Evolve tier shows further fields (org size, tech stack, stakeholders)
- [ ] Form submission calls `PATCH /api/onboard/[token]`
- [ ] On success: `onboarding_tokens.completed_at` set, `status = completed`, responses saved as JSON
- [ ] Success state shows build SLA appropriate to tier
- [ ] Error state shown if API call fails
- [ ] Uses eevolvv design tokens (CSS custom properties)
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `app/onboard/[token]/page.tsx` | T24 (PostHog events), T13 (SOP references this URL) |
| `onboarding_tokens.completed_at` written on submit | T22 (churn detection signal 1) |
| `app/api/onboard/[token]/route.ts` | T09 (same task), T24 (PostHog `onboarding_completed`) |

---

## Do Not

- Do not put form state in the server component — `OnboardingForm` is the client component
- Do not redirect after successful submission — show inline success state
- Do not expose `clientId` in URL or visible to user — keep it server-side
- Do not add authentication middleware — token IS the session
- Do not touch `middleware.ts`
