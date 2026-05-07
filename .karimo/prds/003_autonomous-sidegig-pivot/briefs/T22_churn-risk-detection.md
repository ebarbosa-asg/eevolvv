# Task Brief: Churn Risk Detection Cron

**ID:** T22
**PRD:** autonomous-sidegig-pivot
**Complexity:** 3/5
**Priority:** should
**Model:** sonnet
**Depends on:** T05, T06, T09, T15

---

## Objective

Build a weekly Vercel cron (Monday 9am UTC) that checks three churn signals, flags at-risk clients in the DB, and sends an internal OS alert to `hello@eevolvv.com` listing at-risk clients with their triggering signal. This gives E early warning to intervene before churn happens.

---

## Context

**Verify before starting:**
- `clients` table has `churn_risk boolean`, `last_portal_visit_at timestamptz` (T05 complete)
- `onboarding_tokens` table has `completed_at`, `client_id` (T05 complete)
- `subscriptions` table has `status`, `current_period_end`, `client_id` (T05 complete)
- `clients.last_portal_visit_at` is updated on each portal visit (T15 complete)

**Three churn signals:**

1. **Signal 1 — No onboarding completed >7 days post-payment:**
   ```sql
   onboarding_tokens.completed_at IS NULL
   AND clients.created_at < NOW() - INTERVAL '7 days'
   AND subscriptions.status = 'active'
   ```

2. **Signal 2 — No portal visit >30 days:**
   ```sql
   (clients.last_portal_visit_at IS NULL OR clients.last_portal_visit_at < NOW() - INTERVAL '30 days')
   AND subscriptions.status = 'active'
   AND clients.created_at > NOW() - INTERVAL '30 days' -- exclude very new clients without portal access yet
   ```
   Actually: exclude clients created within 30 days from signal 2, since they haven't had 30 days to visit.

3. **Signal 3 — Subscription renewing within 7 days with low engagement (portal visit >14 days ago):**
   ```sql
   subscriptions.current_period_end < NOW() + INTERVAL '7 days'
   AND subscriptions.current_period_end > NOW()
   AND (clients.last_portal_visit_at IS NULL OR clients.last_portal_visit_at < NOW() - INTERVAL '14 days')
   AND subscriptions.status = 'active'
   ```

**Internal alert email:** Send to `hello@eevolvv.com`. This is an internal monitoring email — not a client-facing email. Use a simple template or plain text format.

**Migration 008:** The `tasks.yaml` specifies `supabase/migrations/008_churn_tracking.sql`. However, `clients.churn_risk` and `clients.last_portal_visit_at` were already added in migration 006 (T05). Migration 008 is still needed if those columns were missed, OR as a no-op placeholder. Check migration 005 and 006 before deciding if 008 is needed.

Since T05's brief includes those columns, migration 008 may be a safety net. Create it as:
```sql
-- Migration 008 — Churn tracking safety net
-- Adds columns if T05 migration missed them
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS churn_risk boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_portal_visit_at timestamptz;
```

---

## Implementation

### Files to Create

- `app/api/cron/churn-detection/route.ts` — Weekly cron GET handler
- `supabase/migrations/008_churn_tracking.sql` — Safety net migration

### Files to Modify

- `vercel.json` — Add churn-detection cron entry

### Step-by-Step

1. Create `supabase/migrations/008_churn_tracking.sql`:

```sql
-- Migration 008 — Churn tracking safety net
-- These columns were added in 006, but this ensures they exist.
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS churn_risk boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_portal_visit_at timestamptz;
-- Create index for churn detection queries
CREATE INDEX IF NOT EXISTS idx_clients_churn_risk ON clients (churn_risk) WHERE churn_risk = true;
CREATE INDEX IF NOT EXISTS idx_clients_last_portal ON clients (last_portal_visit_at);
```

2. Create `app/api/cron/churn-detection/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'hello@eevolvv.com'
const ALERT_EMAIL = 'hello@eevolvv.com'

interface ChurnRisk {
  clientId: string
  email: string | null
  name: string | null
  tier: string | null
  signal: string
  detail: string
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const now = new Date()
  const risks: ChurnRisk[] = []
  const flaggedIds = new Set<string>()

  // Signal 1: No onboarding >7 days post-payment
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: noOnboarding } = await supabase
    .from('clients')
    .select(`
      id, email, name, tier, created_at,
      onboarding_tokens!inner(completed_at),
      subscriptions!inner(status)
    `)
    .lt('created_at', sevenDaysAgo)
    .is('onboarding_tokens.completed_at', null)
    .eq('subscriptions.status', 'active')

  for (const c of noOnboarding ?? []) {
    if (!flaggedIds.has(c.id)) {
      flaggedIds.add(c.id)
      risks.push({
        clientId: c.id, email: c.email, name: c.name, tier: c.tier,
        signal: 'NO_ONBOARDING',
        detail: `Signed up ${new Date(c.created_at).toLocaleDateString()} — onboarding not completed`,
      })
    }
  }

  // Signal 2: No portal visit >30 days (exclude clients created within 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: noPortalVisit } = await supabase
    .from('clients')
    .select(`
      id, email, name, tier, last_portal_visit_at, created_at,
      subscriptions!inner(status)
    `)
    .lt('created_at', thirtyDaysAgo)
    .eq('subscriptions.status', 'active')
    .or(`last_portal_visit_at.is.null,last_portal_visit_at.lt.${thirtyDaysAgo}`)

  for (const c of noPortalVisit ?? []) {
    if (!flaggedIds.has(c.id)) {
      flaggedIds.add(c.id)
      risks.push({
        clientId: c.id, email: c.email, name: c.name, tier: c.tier,
        signal: 'NO_PORTAL_VISIT',
        detail: `Last portal visit: ${c.last_portal_visit_at ? new Date(c.last_portal_visit_at).toLocaleDateString() : 'never'}`,
      })
    }
  }

  // Signal 3: Renewal within 7 days + low engagement
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const { data: renewingSoon } = await supabase
    .from('subscriptions')
    .select(`
      id, current_period_end, client_id,
      clients!inner(id, email, name, tier, last_portal_visit_at)
    `)
    .eq('status', 'active')
    .lt('current_period_end', sevenDaysFromNow)
    .gt('current_period_end', now.toISOString())

  for (const sub of renewingSoon ?? []) {
    const client = (sub as Record<string, unknown>).clients as { id: string; email: string; name: string; tier: string; last_portal_visit_at: string | null } | null
    if (!client) continue
    const lastVisit = client.last_portal_visit_at
    if (!lastVisit || new Date(lastVisit) < new Date(fourteenDaysAgo)) {
      if (!flaggedIds.has(client.id)) {
        flaggedIds.add(client.id)
        risks.push({
          clientId: client.id, email: client.email, name: client.name, tier: client.tier,
          signal: 'RENEWAL_LOW_ENGAGEMENT',
          detail: `Renewing ${new Date(sub.current_period_end).toLocaleDateString()}, last portal visit: ${lastVisit ? new Date(lastVisit).toLocaleDateString() : 'never'}`,
        })
      }
    }
  }

  // Flag all at-risk clients in DB
  if (flaggedIds.size > 0) {
    await supabase
      .from('clients')
      .update({ churn_risk: true })
      .in('id', Array.from(flaggedIds))
  }

  // Send internal alert email
  if (risks.length > 0 && resend) {
    const html = `
      <html><body style="font-family:monospace;background:#141413;color:#faf7f0;padding:32px;">
        <p style="color:#8C2B1A;font-size:11px;letter-spacing:0.22em;font-weight:700;">EEVOLVV · CHURN DETECTION ALERT</p>
        <h1 style="font-size:20px;margin:16px 0;">${risks.length} at-risk client${risks.length > 1 ? 's' : ''} detected</h1>
        <p style="font-size:12px;opacity:0.6;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <hr style="border-color:rgba(255,255,255,0.12);margin:24px 0;">
        ${risks.map(r => `
          <div style="margin-bottom:20px;padding:16px;border:1px solid rgba(255,255,255,0.12);">
            <p style="color:#8C2B1A;font-size:10px;letter-spacing:0.2em;margin:0 0 8px;">${r.signal.replace(/_/g, ' ')}</p>
            <p style="font-size:14px;font-weight:600;margin:0 0 4px;">${r.name || r.email || 'Unknown'} · ${(r.tier || 'seed').toUpperCase()}</p>
            <p style="font-size:12px;opacity:0.6;margin:0;">${r.detail}</p>
          </div>
        `).join('')}
        <p style="font-size:11px;opacity:0.4;margin-top:32px;">EEVOLVV INTERNAL</p>
      </body></html>
    `
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ALERT_EMAIL,
      subject: `[Churn Alert] ${risks.length} at-risk client${risks.length > 1 ? 's' : ''} — ${new Date().toLocaleDateString()}`,
      html,
    })
  }

  return NextResponse.json({
    detected: risks.length,
    flagged: Array.from(flaggedIds),
    signals: risks.map(r => ({ signal: r.signal, email: r.email, name: r.name })),
  })
}
```

3. Update `vercel.json` — add churn-detection cron:

```json
{ "path": "/api/cron/churn-detection", "schedule": "0 9 * * 1" }
```

---

## Code Patterns to Follow

```typescript
// Cron auth pattern (same as T12, T21)
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return 401

// Deduplicate flagged clients
const flaggedIds = new Set<string>()
// ...check signals, add to set...
if (flaggedIds.size > 0) {
  await supabase.from('clients').update({ churn_risk: true }).in('id', Array.from(flaggedIds))
}
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `CRON_SECRET` | Route protection |
| `RESEND_API_KEY` | Internal alert email |
| `FROM_EMAIL` | Sender address |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | DB queries |

---

## Acceptance Criteria

- [ ] `GET /api/cron/churn-detection` protected by `CRON_SECRET`
- [ ] Signal 1 detected: onboarding not completed >7 days post-payment + active subscription
- [ ] Signal 2 detected: no portal visit >30 days (excluding new clients <30 days old)
- [ ] Signal 3 detected: renewal within 7 days with portal visit >14 days ago
- [ ] Detected clients: `clients.churn_risk = true` set in DB
- [ ] Internal alert email sent to `hello@eevolvv.com` listing at-risk clients with signal type and detail
- [ ] No duplicate alerts for same client (deduplication by client ID)
- [ ] Returns `{ detected, flagged, signals }` in response
- [ ] `supabase/migrations/008_churn_tracking.sql` created (safety net)
- [ ] `vercel.json` updated with `0 9 * * 1` schedule
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `clients.churn_risk` written | None downstream — human reviews alert |
| `GET /api/cron/churn-detection` | Vercel cron (scheduled weekly) |

---

## Do Not

- Do not send alert emails to clients — internal only to `hello@eevolvv.com`
- Do not reset `churn_risk = false` in this task — that requires a separate manual action by E
- Do not add a `POST` handler — Vercel crons use `GET`
- Do not query the `submissions` table — that's for diagnostic leads, not paying clients
