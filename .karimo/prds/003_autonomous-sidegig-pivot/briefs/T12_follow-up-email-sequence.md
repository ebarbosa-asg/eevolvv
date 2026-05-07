# Task Brief: 3-Email Follow-Up Sequence + Cron

**ID:** T12
**PRD:** autonomous-sidegig-pivot
**Complexity:** 4/5
**Priority:** should
**Model:** sonnet
**Depends on:** T08

---

## Objective

Build a post-diagnostic follow-up sequence for leads who receive a report but don't convert. Three email templates (24h, 72h, 7-day) are sent by a Vercel cron that runs daily at 9am. The cron checks `submissions` for unconverted leads, tracks sent follow-ups via a new column, and stops the sequence the moment a lead appears in the `clients` table.

---

## Context

**Verify before starting:**
- `lib/email-helpers.ts` exists (T08 complete)
- `emails/WelcomeEmail.tsx` pattern understood (T08 complete)

**`submissions` table (from `lib/supabase.ts` and migration 001):**
- `email` — recipient address
- `created_at` — when the diagnostic was submitted
- `email_sent` — boolean, true when the report email was sent
- New column needed: `followup_sent_at` — jsonb or text[], tracks which follow-ups sent

**Conversion check:** A lead is "converted" if their email exists in the `clients.email` column (created by T06 when payment completes).

**Cron authentication pattern (from existing `/api/cron/agents`):**
Check `CRON_SECRET` header or use Vercel's built-in `Authorization: Bearer <CRON_SECRET>` pattern. In `vercel.json`, the path `/api/cron/followup` is listed. Protect with:
```typescript
const cronSecret = req.headers.get('authorization')?.replace('Bearer ', '')
if (cronSecret !== process.env.CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

**Existing `vercel.json` cron entry:**
```json
{ "path": "/api/cron/agents", "schedule": "0 9 * * *" }
```
Add new entry alongside — same `0 9 * * *` schedule is fine (they run in parallel).

**Follow-up email content strategy:**
- FollowUp1 (24h): "Your eevolvv report is live — here are your top 3 opportunities." Direct, references the report they received. CTA to `/pricing`.
- FollowUp2 (72h): Softer. "Still thinking it over?" Social proof + objection handling. CTA to `/pricing`.
- FollowUp3 (7d): Urgency. "Last chance to lock in launch pricing." CTA to `/pricing`.

**Unsubscribe link:** Include a placeholder link `{BASE_URL}/unsubscribe?email={email}` in all emails. The unsubscribe endpoint is out of scope for this task — just include the link.

---

## Implementation

### Files to Create

- `emails/FollowUp1.tsx` — 24-hour follow-up template
- `emails/FollowUp2.tsx` — 72-hour follow-up template
- `emails/FollowUp3.tsx` — 7-day follow-up template
- `app/api/cron/followup/route.ts` — Vercel cron route
- `supabase/migrations/007_followup_tracking.sql` — Adds `followup_sent_at` column

### Files to Modify

- `vercel.json` — Add new cron entry
- `lib/email-helpers.ts` — Add `sendFollowUp()` helper

### Step-by-Step

1. Create `supabase/migrations/007_followup_tracking.sql`:

```sql
-- Migration 007 — Follow-up email tracking
-- PRD: autonomous-sidegig-pivot
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS followup_sent_at jsonb DEFAULT '[]';
-- Array of timestamps: ["2026-05-07T09:00:00Z", "2026-05-09T09:00:00Z", ...]
-- Index: null or entry count for cron query performance
CREATE INDEX IF NOT EXISTS idx_submissions_email_sent ON submissions (email_sent) WHERE email_sent = true;
```

2. Create `emails/FollowUp1.tsx`:

```tsx
import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font } from '@react-email/components'

interface FollowUp1Props {
  name?: string
  businessName?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function FollowUp1Email({ name, businessName }: FollowUp1Props) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const biz = businessName || 'your business'

  return (
    <Html lang="en" dir="ltr">
      <Head><Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" webFont={undefined} fontWeight={400} fontStyle="normal" /></Head>
      <Preview>Your eevolvv report for {biz} — your top 3 automation opportunities</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>EEVOLVV</Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Section style={{ marginBottom: 32 }}>
            <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Your report is waiting to be acted on.
            </Heading>
            <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.6, margin: 0 }}>{greeting}</Text>
            <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.6 }}>
              We sent your eevolvv report for {biz} yesterday. The opportunities we identified don't get smaller while you wait — they get more expensive to fix.
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.6 }}>
              If you're ready to start building: the Seed tier ($950/yr) gets you a live, automated landing page in 72 hours.
            </Text>
          </Section>
          <Section style={{ marginBottom: 32, textAlign: 'center' as const }}>
            <Button href={`${BASE_URL}/pricing`} style={{ background: '#141413', color: '#faf7f0', padding: '16px 32px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', display: 'inline-block', fontFamily: 'Courier New, monospace' }}>
              SEE PRICING →
            </Button>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 16 }} />
          <Section>
            <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
              EEVOLVV · hello@eevolvv.com · <a href={`${BASE_URL}/unsubscribe?email=`} style={{ color: '#141413', opacity: 0.4 }}>Unsubscribe</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
```

3. Create `emails/FollowUp2.tsx` (72h — softer tone, social proof):

Similar structure to FollowUp1. Subject: "Still thinking it over? Here's what other businesses have found." Body: 2 short social proof bullets (generic — "A local service business automated their intake form in 72 hours. 8 hours/week freed."), softer CTA ("No pressure — but here's what Seed includes"), Button: "EXPLORE SEED →" linking to `/pricing`.

4. Create `emails/FollowUp3.tsx` (7d — urgency):

Subject: "Last chance — your eevolvv report expires in 24 hours." Body: reference the report, emphasize that the free diagnostic window is closing, CTA to act now. Button: "START BUILDING NOW →" linking to `/pricing`.

5. Add to `lib/email-helpers.ts`:

```typescript
import { FollowUp1Email } from '@/emails/FollowUp1'
import { FollowUp2Email } from '@/emails/FollowUp2'
import { FollowUp3Email } from '@/emails/FollowUp3'

export type FollowUpSequence = 1 | 2 | 3

export async function sendFollowUpEmail({
  email,
  name,
  businessName,
  sequence,
}: {
  email: string
  name?: string
  businessName?: string
  sequence: FollowUpSequence
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }

  const subjects: Record<FollowUpSequence, string> = {
    1: `Your eevolvv report${businessName ? ` for ${businessName}` : ''} — top 3 opportunities`,
    2: 'Still thinking it over? Here\'s what eevolvv clients found',
    3: 'Last chance to lock in your eevolvv build',
  }

  const templates: Record<FollowUpSequence, React.ReactElement> = {
    1: React.createElement(FollowUp1Email, { name, businessName }),
    2: React.createElement(FollowUp2Email, { name, businessName }),
    3: React.createElement(FollowUp3Email, { name, businessName }),
  }

  try {
    const html = await render(templates[sequence])
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subjects[sequence],
      html,
    })
    if (error) {
      console.error(`[email-helpers] sendFollowUpEmail (seq ${sequence}) error:`, error)
      return { success: false, error: String(error) }
    }
    return { success: true }
  } catch (err) {
    console.error(`[email-helpers] sendFollowUpEmail (seq ${sequence}) unexpected:`, err)
    return { success: false, error: String(err) }
  }
}
```

6. Create `app/api/cron/followup/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendFollowUpEmail } from '@/lib/email-helpers'

export async function GET(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const now = new Date()
  const sent: string[] = []
  const failed: string[] = []

  // Get all submissions where email was sent
  const { data: submissions } = await supabase
    .from('submissions')
    .select('id, email, name, business_name, created_at, followup_sent_at')
    .eq('email_sent', true)
    .not('email', 'is', null)

  if (!submissions?.length) return NextResponse.json({ sent: 0, failed: 0 })

  // Get all converted client emails for exclusion
  const { data: clients } = await supabase
    .from('clients')
    .select('email')
  const convertedEmails = new Set((clients ?? []).map(c => c.email).filter(Boolean))

  for (const sub of submissions) {
    // Skip converted leads
    if (convertedEmails.has(sub.email)) continue

    const sentAt: string[] = Array.isArray(sub.followup_sent_at) ? sub.followup_sent_at : []
    const createdAt = new Date(sub.created_at)
    const diffMs = now.getTime() - createdAt.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    let sequence: 1 | 2 | 3 | null = null

    // Determine which sequence to send
    if (sentAt.length === 0 && diffHours >= 24 && diffHours < 72) {
      sequence = 1
    } else if (sentAt.length === 1 && diffHours >= 72 && diffHours < 168) {
      sequence = 2
    } else if (sentAt.length === 2 && diffHours >= 168) {
      sequence = 3
    }

    if (!sequence) continue

    const result = await sendFollowUpEmail({
      email: sub.email,
      name: sub.name ?? undefined,
      businessName: sub.business_name ?? undefined,
      sequence,
    })

    if (result.success) {
      // Record this send
      await supabase
        .from('submissions')
        .update({ followup_sent_at: [...sentAt, now.toISOString()] })
        .eq('id', sub.id)
      sent.push(sub.email)
    } else {
      failed.push(sub.email)
    }
  }

  return NextResponse.json({ sent: sent.length, failed: failed.length, sent_emails: sent })
}
```

7. Update `vercel.json` — add follow-up cron entry (append-only):

Read the current vercel.json, then ADD the following cron entry to the existing crons array.
Do NOT replace the file — merge your new entry with the existing ones:

```json
{
  "path": "/api/cron/follow-up",
  "schedule": "0 9 * * *"
}
```

The final crons array must contain ALL existing entries plus this new one.

---

## Code Patterns to Follow

```typescript
// Cron auth check (pattern for all cron routes in this PRD)
const authHeader = req.headers.get('authorization')
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

// Send with delay pattern (used in T21 for batch sends)
// Not needed here — daily cron is sequential
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `CRON_SECRET` | Vercel cron authentication (set in T01's .env.example additions) |
| `RESEND_API_KEY` | Email sending |
| `FROM_EMAIL` | Sender address |
| `NEXT_PUBLIC_BASE_URL` | Pricing page URL in email CTAs |

---

## Acceptance Criteria

- [ ] `emails/FollowUp1.tsx`, `FollowUp2.tsx`, `FollowUp3.tsx` created with correct subjects and content
- [ ] All 3 emails include unsubscribe link
- [ ] `lib/email-helpers.ts` exports `sendFollowUpEmail({ email, name, businessName, sequence })`
- [ ] `sendFollowUpEmail` returns `{ success, error? }` — never throws
- [ ] Migration 007 adds `followup_sent_at jsonb` column to `submissions`
- [ ] Cron route `GET /api/cron/followup` protected by `CRON_SECRET` header
- [ ] Cron checks submissions where `email_sent = true` and not in `clients` table
- [ ] Sequence 1 sent at 24–72h window (sentAt.length = 0)
- [ ] Sequence 2 sent at 72–168h window (sentAt.length = 1)
- [ ] Sequence 3 sent at 168h+ window (sentAt.length = 2)
- [ ] Sequence stops once lead email found in `clients`
- [ ] `followup_sent_at` updated on each successful send
- [ ] `vercel.json` updated with new cron entry (append-only — existing entries preserved)
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `emails/FollowUp1/2/3.tsx` | None downstream (end consumers) |
| `lib/email-helpers.ts` — `sendFollowUpEmail()` | None downstream |
| `supabase/migrations/007_followup_tracking.sql` | DB schema (prerequisite for T12 cron) |
| `vercel.json` updated | T21, T22, T23 (also add cron entries) |

---

## Do Not

- Do not implement the unsubscribe endpoint — just include the link
- Do not send sequence 2 or 3 before sequence 1 is confirmed sent (check array length)
- Do not add a `POST` handler to the cron route — Vercel crons use `GET`
- Do not use `setTimeout` for delays — the cron runs sequentially and daily volume is low at launch
- Do not touch `app/api/cron/agents` — that is the existing agent cron
- Do not modify any tables from migrations 001–006 beyond adding the new column
