# Task Brief: Client Portal (/client/[token])

**ID:** T15
**PRD:** autonomous-sidegig-pivot
**Complexity:** 4/5
**Priority:** must
**Model:** sonnet
**Depends on:** T05, T06, T09

---

## Objective

Build `app/client/[token]/page.tsx` — a token-validated client dashboard where paying clients can see their build status, subscription info, and deliverables. Token validation reuses the `onboarding_tokens.token` (same token from the onboarding email). Each page load updates `clients.last_portal_visit_at` — this column feeds T22's churn detection.

---

## Context

**Verify before starting:**
- `onboarding_tokens` table exists with `token`, `client_id` columns (T05 complete)
- `clients`, `subscriptions`, `builds` tables exist (T05 complete)
- `clients.last_portal_visit_at` column exists (T05 complete)

**Token reuse:** The same token from `onboarding_tokens.token` is used for both the onboarding page (`/onboard/[token]`) and the client portal (`/client/[token]`). No separate auth system.

**Pattern: `app/onboard/[token]/page.tsx` (T09):**
- Server component validates token via Supabase
- Returns error state inline on invalid/expired token
- Passes validated data to client component

**Design system (`components/ds/`):**
Available: `Button`, `Card`, `CardHeader`, `CardContent`, `Input`, `Textarea`, `Label`, `Badge`, `SectionMarker`, `TerminalBlock`, `DataRow`, `KPIStat`

**Build status progression:**
`queued → in_progress → qa → deploying → live` (+ `failed`, `paused`)

**Visual status indicator:** Show a progress bar using eevolvv's `▓▓▓▓░░░░` pattern (JetBrains Mono) or a simple step indicator.

**Subscription self-service:**
- "Change plan" → links to the upgrade/downgrade flow (T19 wires this)
- "Cancel membership" → links to cancellation flow (T20 wires this)
- For now: both can be placeholder buttons with `href="/pricing"` — T19/T20 will replace with actual handlers

**`last_portal_visit_at` update:** This must be a server-side update on page load. Use a server action or a small API route called from the client component on mount. Server component approach: update before rendering.

---

## Implementation

### Files to Create

- `app/client/[token]/page.tsx` — Server component; validates token, fetches data, updates last_portal_visit_at
- `app/client/[token]/ClientDashboard.tsx` — Client component; interactive elements (T19, T20 will add buttons)

### Files to Modify

None.

### Step-by-Step

1. Create `app/client/[token]/page.tsx`:

```tsx
import { supabase } from '@/lib/supabase'
import { ClientDashboard } from './ClientDashboard'

interface PageProps {
  params: { token: string }
}

export default async function ClientPortalPage({ params }: PageProps) {
  const { token } = params

  if (!supabase) {
    return <ErrorState message="Service temporarily unavailable. Contact hello@eevolvv.com." />
  }

  // Validate token
  const { data: tokenRow } = await supabase
    .from('onboarding_tokens')
    .select('id, client_id, status, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (!tokenRow) {
    return <ErrorState message="This portal link is invalid. Contact hello@eevolvv.com." />
  }

  const clientId = tokenRow.client_id

  // Update last portal visit (non-blocking — don't wait)
  supabase
    .from('clients')
    .update({ last_portal_visit_at: new Date().toISOString() })
    .eq('id', clientId)
    .then()

  // Fetch client data
  const [clientResult, subscriptionResult, buildsResult] = await Promise.all([
    supabase.from('clients').select('id, name, email, tier').eq('id', clientId).single(),
    supabase.from('subscriptions').select('id, status, billing_interval, current_period_end, cancel_at_period_end, stripe_price_id').eq('client_id', clientId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('builds').select('id, tier, status, assigned_to, build_url, notes, created_at, started_at, completed_at').eq('client_id', clientId).order('created_at', { ascending: false }).limit(5),
  ])

  const client = clientResult.data
  const subscription = subscriptionResult.data
  const builds = buildsResult.data ?? []
  const latestBuild = builds[0] ?? null

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>
              EEVOLVV · CLIENT PORTAL
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
              {client?.name ?? 'Your Portal'}
            </h1>
            <div style={{ fontSize: 13, opacity: 0.5 }}>{client?.email}</div>
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--accent)', opacity: 0.7 }}>
            {(client?.tier ?? 'seed').toUpperCase()} PLAN
          </div>
        </div>

        <ClientDashboard
          token={token}
          client={client}
          subscription={subscription}
          latestBuild={latestBuild}
          builds={builds}
        />
      </div>
    </main>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, textAlign: 'center' as const }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>EEVOLVV</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 16px' }}>Portal unavailable</h1>
        <p style={{ opacity: 0.65, lineHeight: 1.6 }}>{message}</p>
      </div>
    </main>
  )
}
```

2. Create `app/client/[token]/ClientDashboard.tsx`:

```tsx
'use client'

interface Build {
  id: string
  tier: string
  status: string
  assigned_to: string | null
  build_url: string | null
  notes: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
}

interface Subscription {
  id: string
  status: string
  billing_interval: string
  current_period_end: string | null
  cancel_at_period_end: boolean
  stripe_price_id: string
}

interface Client {
  id: string
  name: string | null
  email: string | null
  tier: string | null
}

interface Props {
  token: string
  client: Client | null
  subscription: Subscription | null
  latestBuild: Build | null
  builds: Build[]
}

const STATUS_ORDER = ['queued', 'in_progress', 'qa', 'deploying', 'live']
const STATUS_LABELS: Record<string, string> = {
  queued: 'In Queue',
  in_progress: 'Building',
  qa: 'QA Review',
  deploying: 'Deploying',
  live: 'Live',
  failed: 'Failed',
  paused: 'Paused',
}

export function ClientDashboard({ token, client, subscription, latestBuild, builds }: Props) {
  const buildStatusIndex = latestBuild ? STATUS_ORDER.indexOf(latestBuild.status) : -1
  const totalSteps = STATUS_ORDER.length
  const filledBlocks = Math.max(0, buildStatusIndex + 1)
  const progressBar = '▓'.repeat(filledBlocks) + '░'.repeat(totalSteps - filledBlocks)

  const nextBillingDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not available'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Build Status */}
      <section style={{ border: '1px solid var(--rule)', padding: 28 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
          § 01 · BUILD STATUS
        </div>
        {latestBuild ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: 500 }}>
                {STATUS_LABELS[latestBuild.status] ?? latestBuild.status}
              </div>
              <span className="mono" style={{
                fontSize: 9, letterSpacing: '0.14em', padding: '4px 10px',
                background: latestBuild.status === 'live' ? '#4ade80' : 'var(--ink)',
                color: latestBuild.status === 'live' ? '#141413' : 'var(--paper)',
              }}>
                {latestBuild.status.toUpperCase()}
              </span>
            </div>
            <div className="mono" style={{ fontSize: 14, letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: 12 }}>
              {progressBar}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
              {STATUS_ORDER.map((s, i) => (
                <div key={s} style={{ fontSize: 9, textAlign: 'center' as const, opacity: i <= buildStatusIndex ? 1 : 0.3 }} className="mono">
                  {STATUS_LABELS[s].toUpperCase()}
                </div>
              ))}
            </div>
            {latestBuild.assigned_to && (
              <div style={{ marginTop: 16, fontSize: 12, opacity: 0.55 }}>
                Technician: <strong>{latestBuild.assigned_to}</strong>
              </div>
            )}
            {latestBuild.status === 'live' && latestBuild.build_url && (
              <div style={{ marginTop: 20 }}>
                <a
                  href={latestBuild.build_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono"
                  style={{ display: 'inline-block', padding: '14px 24px', background: 'var(--ink)', color: 'var(--paper)', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700 }}
                >
                  VISIT YOUR SITE →
                </a>
              </div>
            )}
          </>
        ) : (
          <p style={{ opacity: 0.55, fontSize: 14 }}>No build in progress yet. Complete your onboarding to start.</p>
        )}
      </section>

      {/* Subscription Info */}
      <section style={{ border: '1px solid var(--rule)', padding: 28 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
          § 02 · SUBSCRIPTION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'PLAN', value: `${(client?.tier ?? 'seed').toUpperCase()} · ${(subscription?.billing_interval ?? 'monthly').toUpperCase()}` },
            { label: 'STATUS', value: subscription?.status?.toUpperCase() ?? 'UNKNOWN' },
            { label: 'NEXT BILLING', value: nextBillingDate },
            { label: 'AUTO-RENEW', value: subscription?.cancel_at_period_end ? 'OFF — Cancels at period end' : 'ON' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>

        {subscription?.cancel_at_period_end && (
          <div style={{ padding: '12px 16px', background: 'rgba(140,43,26,0.06)', border: '1px solid var(--accent)', fontSize: 13, color: 'var(--accent)', marginBottom: 16 }}>
            Cancellation scheduled — active until {nextBillingDate}
          </div>
        )}

        {/* Plan management — T19 and T20 will wire these */}
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/pricing" className="mono" style={{ padding: '10px 20px', border: '1px solid var(--ink)', fontSize: 10, letterSpacing: '0.14em', textDecoration: 'none', color: 'var(--ink)' }}>
            CHANGE PLAN
          </a>
          {!subscription?.cancel_at_period_end && (
            <a href="/pricing" className="mono" style={{ padding: '10px 20px', border: '1px solid rgba(20,20,19,0.3)', fontSize: 10, letterSpacing: '0.14em', textDecoration: 'none', color: 'var(--ink)', opacity: 0.55 }}>
              CANCEL MEMBERSHIP
            </a>
          )}
        </div>
      </section>

      {/* Build history */}
      {builds.length > 1 && (
        <section style={{ border: '1px solid var(--rule)', padding: 28 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 03 · BUILD HISTORY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {builds.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--rule)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{b.tier.toUpperCase()} BUILD</div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{new Date(b.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', opacity: 0.6 }}>
                    {STATUS_LABELS[b.status]?.toUpperCase() ?? b.status.toUpperCase()}
                  </span>
                  {b.build_url && (
                    <a href={b.build_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--accent)' }}>
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Support */}
      <div style={{ fontSize: 13, opacity: 0.5, textAlign: 'center' as const, paddingTop: 8 }}>
        Questions? <a href="mailto:hello@eevolvv.com" style={{ color: 'var(--accent)' }}>hello@eevolvv.com</a>
      </div>
    </div>
  )
}
```

---

## Code Patterns to Follow

```typescript
// Parallel Supabase fetches
const [result1, result2] = await Promise.all([
  supabase.from('table1').select('...').single(),
  supabase.from('table2').select('...').maybeSingle(),
])

// Non-blocking update (fire and forget)
supabase.from('clients').update({ last_portal_visit_at: new Date().toISOString() }).eq('id', clientId).then()
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `SUPABASE_URL` | DB client |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS |

---

## Acceptance Criteria

- [ ] `GET /client/[token]` validates token server-side
- [ ] Invalid token shows error state with `hello@eevolvv.com`
- [ ] Valid token renders dashboard with client name + email in header
- [ ] Build Status section shows current status, progress bar, status label
- [ ] Progress bar uses `▓▓░░░` pattern (JetBrains Mono) reflecting current stage
- [ ] "VISIT YOUR SITE →" button shown when `builds.status = live` with `build_url`
- [ ] Subscription section shows plan, status, next billing date, auto-renew status
- [ ] Cancellation notice shown when `cancel_at_period_end = true`
- [ ] "CHANGE PLAN" and "CANCEL MEMBERSHIP" buttons present (can link to `/pricing` as placeholder)
- [ ] `clients.last_portal_visit_at` updated on every page load
- [ ] Build history shown when more than 1 build exists
- [ ] Uses eevolvv design tokens
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `app/client/[token]/ClientDashboard.tsx` | T19 (adds Change Plan modal), T20 (adds Cancel modal) |
| `clients.last_portal_visit_at` written | T22 (churn detection signal 2) |
| `GET /client/[token]` URL | T17 (build emails link here), T21 (monthly report links here) |

---

## Do Not

- Do not add user authentication beyond the token — token IS the session
- Do not expose internal client IDs in URL or visible DOM
- Do not make the portal editable (subscription updates are T19/T20) — read-only for now
- Do not add the Stripe billing portal link yet — that is T18/T19's responsibility
- Do not touch `middleware.ts`
