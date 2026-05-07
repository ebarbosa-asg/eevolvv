# Task Brief: Monthly Automated Client Report

**ID:** T21
**PRD:** autonomous-sidegig-pivot
**Complexity:** 4/5
**Priority:** should
**Model:** sonnet
**Depends on:** T05, T06, T08

---

## Objective

Build a Vercel cron that fires on the 1st of each month at 8am UTC and sends a personalized monthly summary email to every active client. The cron queries all active subscriptions, gathers per-client build and agent run data, and sends sequentially with 100ms delay. Failed individual sends are logged but don't halt the batch.

---

## Context

**Verify before starting:**
- `subscriptions`, `clients`, `builds` tables exist (T05 complete)
- `lib/email-helpers.ts` exists (T08 complete) — add `sendMonthlyReport()` here
- `vercel.json` has the existing cron structure (T12 may have added entries)

**Agent runs table:** `agent_runs` table exists (from migration 002). Columns include `client_id`, `status`, `created_at`. Query for count within the past 30 days.

**Sequential sending with delay:** Use a `for...of` loop (not `Promise.all`) to send one email at a time, with `await new Promise(r => setTimeout(r, 100))` between sends. This avoids Resend rate limit issues at launch.

**Cron secret protection:** Same pattern as T12 — `Authorization: Bearer {CRON_SECRET}` header.

**Schedule:** `0 8 1 * *` — 8am UTC on the 1st of each month.

**Portal URL:** `{BASE_URL}/client/{token}` from `onboarding_tokens`.

---

## Implementation

### Files to Create

- `app/api/cron/monthly-report/route.ts` — Vercel cron GET handler
- `emails/MonthlyReport.tsx` — Monthly summary email template

### Files to Modify

- `lib/email-helpers.ts` — Add `sendMonthlyReport()`
- `vercel.json` — Add monthly-report cron entry

### Step-by-Step

1. Create `emails/MonthlyReport.tsx`:

```tsx
import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font } from '@react-email/components'

interface MonthlyReportProps {
  name?: string
  tier: string
  month: string
  buildStatus: string
  buildUrl?: string
  agentRunCount: number
  nextBillingDate?: string
  portalUrl: string
}

export function MonthlyReportEmail({
  name, tier, month, buildStatus, buildUrl, agentRunCount, nextBillingDate, portalUrl,
}: MonthlyReportProps) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  return (
    <Html lang="en" dir="ltr">
      <Head><Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" webFont={undefined} fontWeight={400} fontStyle="normal" /></Head>
      <Preview>{month} Update — Your eevolvv {tierLabel} Summary</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>EEVOLVV</Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {month} Update
          </Heading>
          <Text style={{ fontSize: 13, color: '#141413', opacity: 0.5, margin: '0 0 32px', letterSpacing: '0.06em' }}>
            YOUR EEVOLVV {tierLabel.toUpperCase()} SUMMARY
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.6, margin: '0 0 24px' }}>{greeting}</Text>

          {/* Build Status */}
          <Section style={{ marginBottom: 24, border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' as const }}>
              § 01 · BUILD STATUS
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', margin: 0, fontWeight: 500 }}>
              Status: {buildStatus.replace('_', ' ').toUpperCase()}
            </Text>
            {buildUrl && (
              <Text style={{ fontSize: 12, color: '#8C2B1A', margin: '6px 0 0' }}>
                {buildUrl}
              </Text>
            )}
          </Section>

          {/* Activity */}
          <Section style={{ marginBottom: 24, border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' as const }}>
              § 02 · THIS MONTH
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', margin: '0 0 8px' }}>
              → AI agent runs: <strong>{agentRunCount}</strong>
            </Text>
            <Text style={{ fontSize: 12, color: '#141413', opacity: 0.6, margin: 0 }}>
              Your AI agents ran {agentRunCount} automated tasks this month.
            </Text>
          </Section>

          {/* Subscription */}
          <Section style={{ marginBottom: 24, border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' as const }}>
              § 03 · SUBSCRIPTION
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', margin: '0 0 4px' }}>
              Plan: <strong>{tierLabel}</strong>
            </Text>
            {nextBillingDate && (
              <Text style={{ fontSize: 13, color: '#141413', opacity: 0.6, margin: 0 }}>
                Next billing: {nextBillingDate}
              </Text>
            )}
          </Section>

          <Section style={{ marginTop: 28, textAlign: 'center' as const }}>
            <Button href={portalUrl} style={{ background: '#141413', color: '#faf7f0', padding: '14px 28px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', fontFamily: 'Courier New, monospace' }}>
              VIEW YOUR PORTAL →
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
import { MonthlyReportEmail } from '@/emails/MonthlyReport'

export async function sendMonthlyReport({
  email, name, tier, month, buildStatus, buildUrl, agentRunCount, nextBillingDate, portalUrl,
}: {
  email: string; name?: string; tier: string; month: string; buildStatus: string;
  buildUrl?: string; agentRunCount: number; nextBillingDate?: string; portalUrl: string;
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  try {
    const html = await render(MonthlyReportEmail({ name, tier, month, buildStatus, buildUrl, agentRunCount, nextBillingDate, portalUrl }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${month} Update — Your eevolvv ${tierLabel} Summary`,
      html,
    })
    if (error) { console.error('[email-helpers] sendMonthlyReport:', error); return { success: false, error: String(error) } }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendMonthlyReport unexpected:', err)
    return { success: false, error: String(err) }
  }
}
```

3. Create `app/api/cron/monthly-report/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendMonthlyReport } from '@/lib/email-helpers'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

function getMonthLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const month = getMonthLabel()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Get all active subscriptions with client data
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('id, client_id, status, billing_interval, current_period_end')
    .eq('status', 'active')

  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0, message: 'No active subscriptions' })
  }

  let sent = 0
  let failed = 0

  for (const sub of subscriptions) {
    try {
      // Fetch client
      const { data: client } = await supabase
        .from('clients')
        .select('email, name, tier')
        .eq('id', sub.client_id)
        .single()

      if (!client?.email) continue

      // Fetch latest build
      const { data: latestBuild } = await supabase
        .from('builds')
        .select('status, build_url')
        .eq('client_id', sub.client_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Fetch agent run count for last 30 days
      const { count: agentRunCount } = await supabase
        .from('agent_runs')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', sub.client_id)
        .gte('created_at', thirtyDaysAgo)

      // Get onboarding token for portal URL
      const { data: tokenRow } = await supabase
        .from('onboarding_tokens')
        .select('token')
        .eq('client_id', sub.client_id)
        .maybeSingle()

      const portalUrl = tokenRow?.token
        ? `${BASE_URL}/client/${tokenRow.token}`
        : `${BASE_URL}/pricing`

      const nextBillingDate = sub.current_period_end
        ? new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : undefined

      const result = await sendMonthlyReport({
        email: client.email,
        name: client.name ?? undefined,
        tier: client.tier ?? 'seed',
        month,
        buildStatus: latestBuild?.status ?? 'queued',
        buildUrl: latestBuild?.build_url ?? undefined,
        agentRunCount: agentRunCount ?? 0,
        nextBillingDate,
        portalUrl,
      })

      if (result.success) sent++
      else failed++

      // Delay between sends to avoid rate limiting
      await new Promise(r => setTimeout(r, 100))
    } catch (err) {
      console.error('[monthly-report] error for subscription', sub.id, err)
      failed++
    }
  }

  return NextResponse.json({
    sent,
    failed,
    total: subscriptions.length,
    month,
  })
}
```

4. Update `vercel.json` — add monthly-report cron entry (append-only):

Read the current vercel.json, then ADD the following cron entry to the existing crons array.
Do NOT replace the file:

```json
{
  "path": "/api/cron/monthly-report",
  "schedule": "0 8 1 * *"
}
```

The final crons array must contain ALL existing entries plus this new one.

---

## Code Patterns to Follow

```typescript
// Sequential send with delay (avoid Resend rate limits)
for (const item of items) {
  await sendEmail(...)
  await new Promise(r => setTimeout(r, 100))
}

// Cron protection
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return 401

// Continue on individual failure
try { result = await send() } catch { failed++ }
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `CRON_SECRET` | Cron route protection |
| `RESEND_API_KEY` | Email sending |
| `FROM_EMAIL` | Sender address |
| `NEXT_PUBLIC_BASE_URL` | Portal URL construction |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | DB queries |

---

## Acceptance Criteria

- [ ] `GET /api/cron/monthly-report` protected by `CRON_SECRET` Bearer token
- [ ] Queries all `subscriptions` where `status = 'active'`
- [ ] For each client: gathers latest build status/URL, agent run count (last 30 days), next billing date
- [ ] `emails/MonthlyReport.tsx` created with sections: Build Status, This Month, Subscription, CTA
- [ ] Subject: `[Month] Update — Your eevolvv [Tier] Summary`
- [ ] `sendMonthlyReport()` added to `lib/email-helpers.ts`
- [ ] Sends sequentially with 100ms delay between emails
- [ ] Failed individual sends logged — batch continues
- [ ] Returns `{ sent, failed, total, month }` on completion
- [ ] `vercel.json` updated with `0 8 1 * *` schedule for `/api/cron/monthly-report` (append-only — existing entries preserved)
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `sendMonthlyReport()` in `lib/email-helpers.ts` | None downstream |
| Monthly report email | Client (human) |

---

## Do Not

- Do not use `Promise.all` for email sends — use sequential loop with delay
- Do not halt the entire batch on a single email failure
- Do not add `POST` method to this route — Vercel crons use `GET`
- Do not send to `past_due` or `canceled` subscriptions — active only
- Do not generate AI content for the report — use structured data from DB only
