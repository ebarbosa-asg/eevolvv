# Task Brief: Quarterly Re-Calibration Trigger

**ID:** T23
**PRD:** autonomous-sidegig-pivot
**Complexity:** 2/5
**Priority:** could
**Model:** sonnet
**Depends on:** T06, T08

---

## Objective

Build a daily Vercel cron (10am UTC) that checks for active clients hitting their 90-day subscription anniversary (within a 24-hour window), then sends a tier-appropriate quarterly re-calibration email: Evolve clients get a Calendly link for a 2-hour strategy session; Seed/Core clients get a link to restart their diagnostic with recalibration context pre-loaded.

---

## Context

**Verify before starting:**
- `subscriptions` table has `created_at`, `client_id`, `status` (T05 complete)
- `clients` table has `tier`, `email`, `name` (T05 complete)
- `lib/email-helpers.ts` exists (T08 complete) — add `sendQuarterlyRecalibration()` here

**90-day window:** Query subscriptions where `created_at` is between 90 and 91 days ago. A daily cron at 10am means the window is:
```sql
subscriptions.created_at BETWEEN (NOW() - INTERVAL '91 days') AND (NOW() - INTERVAL '90 days')
```

**Calendly URL:** `https://calendly.com/hello-eevolvv` — from `NEXT_PUBLIC_CALENDLY_URL` env var (already set).

**Diagnostic re-run link for Seed/Core:** `/diagnostic?recalibration=true&client_id={clientId}`. The diagnostic route (`app/api/diagnostic/route.ts`) doesn't currently use these params — the link is for future automation. For now, it just opens the diagnostic chat with context pre-seeded.

**Schedule:** `0 10 * * *` — daily 10am UTC. Only fires for clients at exactly the 90-day mark (within a 24-hour window), so the daily frequency ensures no client is missed due to exact-second timing.

---

## Implementation

### Files to Create

- `app/api/cron/quarterly-recalibration/route.ts` — Daily cron GET handler
- `emails/QuarterlyRecalibration.tsx` — Re-calibration email template

### Files to Modify

- `lib/email-helpers.ts` — Add `sendQuarterlyRecalibration()`
- `vercel.json` — Add quarterly-recalibration cron entry

### Step-by-Step

1. Create `emails/QuarterlyRecalibration.tsx`:

```tsx
import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font } from '@react-email/components'

interface QuarterlyRecalibrationProps {
  name?: string
  tier: string
  isEvolve: boolean
  calendlyUrl?: string
  recalibrationUrl?: string
  clientId?: string
}

export function QuarterlyRecalibrationEmail({
  name, tier, isEvolve, calendlyUrl, recalibrationUrl, clientId,
}: QuarterlyRecalibrationProps) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  const ctaUrl = isEvolve
    ? (calendlyUrl ?? 'https://calendly.com/hello-eevolvv')
    : (recalibrationUrl ?? 'https://eevolvv.com/diagnostic')
  const ctaLabel = isEvolve ? 'BOOK YOUR RE-CALIBRATION →' : 'START RE-CALIBRATION →'

  return (
    <Html lang="en" dir="ltr">
      <Head><Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" webFont={undefined} fontWeight={400} fontStyle="normal" /></Head>
      <Preview>Your quarterly re-calibration is due — {tierLabel}</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>EEVOLVV</Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Your quarterly re-calibration is due.
          </Heading>
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.45, margin: '0 0 28px', letterSpacing: '0.08em' }}>
            90 DAYS · {tierLabel.toUpperCase()} PLAN
          </Text>

          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7, margin: '0 0 12px' }}>{greeting}</Text>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7 }}>
            It's been 90 days. Your AI has been running, learning your business patterns, and adapting to your workflows. Now it's time to sharpen it.
          </Text>

          <Section style={{ margin: '24px 0', border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' as const }}>
              § · WHAT RE-CALIBRATION INCLUDES
            </Text>
            {isEvolve ? (
              <>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.8, margin: 0 }}>
                  → 2-hour strategy session with E<br />
                  → Review of your AI agent performance over Q1<br />
                  → Identify 3 new automation opportunities<br />
                  → Update agent context with Q2 business goals<br />
                  → Prioritized build roadmap for next quarter
                </Text>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.8, margin: 0 }}>
                  → Run updated diagnostic with your current business state<br />
                  → AI identifies new automation opportunities<br />
                  → Compare against your original report<br />
                  → Agent context updated for next quarter<br />
                  → Takes about 10 minutes
                </Text>
              </>
            )}
          </Section>

          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7 }}>
            {isEvolve
              ? 'Book your session below. We\'ll send a prep document 24 hours before.'
              : 'Click below to run your re-calibration diagnostic. It uses your existing business context — you just need to update what\'s changed in the past 90 days.'
            }
          </Text>

          <Section style={{ marginTop: 28, textAlign: 'center' as const }}>
            <Button href={ctaUrl} style={{ background: '#141413', color: '#faf7f0', padding: '16px 32px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', fontFamily: 'Courier New, monospace' }}>
              {ctaLabel}
            </Button>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
            EEVOLVV · hello@eevolvv.com · Questions? Reply directly.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

2. Add to `lib/email-helpers.ts`:

```typescript
import { QuarterlyRecalibrationEmail } from '@/emails/QuarterlyRecalibration'

export async function sendQuarterlyRecalibration({
  email, name, tier, clientId,
}: {
  email: string; name?: string; tier: string; clientId?: string;
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }
  const isEvolve = tier === 'evolve'
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/hello-eevolvv'
  const recalibrationUrl = clientId
    ? `${BASE_URL}/diagnostic?recalibration=true&client_id=${clientId}`
    : `${BASE_URL}/diagnostic`
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  try {
    const html = await render(QuarterlyRecalibrationEmail({
      name, tier, isEvolve, calendlyUrl, recalibrationUrl, clientId,
    }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your quarterly re-calibration is due — ${tierLabel}`,
      html,
    })
    if (error) { console.error('[email-helpers] sendQuarterlyRecalibration:', error); return { success: false, error: String(error) } }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendQuarterlyRecalibration unexpected:', err)
    return { success: false, error: String(err) }
  }
}
```

3. Create `app/api/cron/quarterly-recalibration/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendQuarterlyRecalibration } from '@/lib/email-helpers'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  // Find subscriptions hitting 90-day anniversary (within 24-hour window)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const ninetyOneDaysAgo = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString()

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('id, client_id, created_at')
    .eq('status', 'active')
    .lt('created_at', ninetyDaysAgo)
    .gt('created_at', ninetyOneDaysAgo)

  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0, message: 'No clients at 90-day mark today' })
  }

  let sent = 0
  let failed = 0

  for (const sub of subscriptions) {
    try {
      const { data: client } = await supabase
        .from('clients')
        .select('email, name, tier')
        .eq('id', sub.client_id)
        .single()

      if (!client?.email) { failed++; continue }

      const result = await sendQuarterlyRecalibration({
        email: client.email,
        name: client.name ?? undefined,
        tier: client.tier ?? 'seed',
        clientId: sub.client_id,
      })

      if (result.success) sent++
      else failed++

      await new Promise(r => setTimeout(r, 100))
    } catch (err) {
      console.error('[quarterly-recalibration] error for subscription', sub.id, err)
      failed++
    }
  }

  return NextResponse.json({ sent, failed, total: subscriptions.length })
}
```

4. Update `vercel.json` — add quarterly-recalibration cron entry (append-only):

Read the current vercel.json, then ADD the following cron entry to the existing crons array.
Do NOT replace the file:

```json
{
  "path": "/api/cron/recalibration",
  "schedule": "0 6 * * 3"
}
```

The final crons array must contain ALL existing entries plus this new one.

Note: path is /api/cron/recalibration (short form), schedule is 0 6 * * 3 (Wednesday 6am) — offset from other cron jobs to avoid simultaneous execution.

---

## Code Patterns to Follow

```typescript
// 90-day window query
const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
const ninetyOneDaysAgo = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString()
// query: .lt('created_at', ninetyDaysAgo).gt('created_at', ninetyOneDaysAgo)
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `CRON_SECRET` | Route protection |
| `RESEND_API_KEY` | Email sending |
| `FROM_EMAIL` | Sender address |
| `NEXT_PUBLIC_BASE_URL` | Re-calibration URL |
| `NEXT_PUBLIC_CALENDLY_URL` | Evolve Calendly link (already set as `https://calendly.com/hello-eevolvv`) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | DB |

---

## Acceptance Criteria

- [ ] `GET /api/cron/quarterly-recalibration` protected by `CRON_SECRET`
- [ ] Queries subscriptions with `created_at` in the 90–91 day window (24-hour window)
- [ ] Only sends to `status = 'active'` subscriptions
- [ ] Evolve tier: email includes Calendly link (`NEXT_PUBLIC_CALENDLY_URL`)
- [ ] Seed/Core tiers: email includes link to `/diagnostic?recalibration=true&client_id={id}`
- [ ] `emails/QuarterlyRecalibration.tsx` created with tier-aware content
- [ ] `sendQuarterlyRecalibration()` added to `lib/email-helpers.ts`
- [ ] `vercel.json` updated with quarterly-recalibration cron entry (append-only — existing entries preserved)
- [ ] Sequential sends with 100ms delay
- [ ] Returns `{ sent, failed, total }` on completion
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `sendQuarterlyRecalibration()` in `lib/email-helpers.ts` | None downstream |
| Re-calibration emails | Clients (human) |

---

## Do Not

- Do not filter by specific tiers — send to all active tiers, tier-appropriate content
- Do not use `Promise.all` — sequential loop with delay
- Do not add `POST` handler
- Do not modify the diagnostic route (`app/api/diagnostic/route.ts`) to handle recalibration params — that's future work; the link just opens the existing diagnostic
