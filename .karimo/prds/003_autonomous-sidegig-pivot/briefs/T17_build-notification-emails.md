# Task Brief: Build Status Notification Emails

**ID:** T17
**PRD:** autonomous-sidegig-pivot
**Complexity:** 3/5
**Priority:** must
**Model:** sonnet
**Depends on:** T08, T16

---

## Objective

Create three react-email templates (`BuildStarted.tsx`, `BuildReadyForReview.tsx`, `BuildLive.tsx`) and wire them into `app/api/builds/update-status/route.ts` created by T16. Each email is sent to the client when a specific build status transition occurs. Add corresponding helper functions to `lib/email-helpers.ts`.

---

## Context

**Verify before starting:**
- `lib/email-helpers.ts` exists with Resend setup and `sendWelcomeEmail()` pattern (T08 complete)
- `app/api/builds/update-status/route.ts` exists with status transition logic (T16 complete)
- `builds` table has `client_id`, `tier`, `status`, `build_url` columns (T05 complete)
- `clients` table has `email`, `name` columns (T05 complete)

**Status transitions that trigger emails:**
- `queued → in_progress` → `BuildStarted.tsx`
- `qa` → `deploying` (Approve QA) → `BuildReadyForReview.tsx` (staging preview if available)
- `deploying → live` → `BuildLive.tsx` with production URL

**Getting client email from build:** The `PATCH /api/builds/update-status` handler has `build.client_id`. Join to `clients` to get email and name.

**Client portal URL:** `{BASE_URL}/client/{token}` where token comes from `onboarding_tokens`. Look up token by `client_id`.

**Pattern from `lib/email-helpers.ts` (T08):**
```typescript
export async function sendXEmail({...}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }
  try {
    const html = await render(XEmailComponent({ ... }))
    const { error } = await resend.emails.send({ from, to, subject, html })
    if (error) { console.error(...); return { success: false, error: String(error) } }
    return { success: true }
  } catch (err) {
    console.error(...)
    return { success: false, error: String(err) }
  }
}
```

---

## Implementation

### Files to Create

- `emails/BuildStarted.tsx`
- `emails/BuildReadyForReview.tsx`
- `emails/BuildLive.tsx`

### Files to Modify

- `lib/email-helpers.ts` — Add 3 new send functions
- `app/api/builds/update-status/route.ts` — Add email triggers on status transitions

### Step-by-Step

1. Create `emails/BuildStarted.tsx`:

```tsx
import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font } from '@react-email/components'

interface BuildStartedProps {
  name?: string
  tier: string
  sla: string
  portalUrl: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function BuildStartedEmail({ name, tier, sla, portalUrl }: BuildStartedProps) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  return (
    <Html lang="en" dir="ltr">
      <Head><Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" webFont={undefined} fontWeight={400} fontStyle="normal" /></Head>
      <Preview>We've started building your {tierLabel} — {sla} SLA from now.</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>EEVOLVV</Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            We've started your {tierLabel} build.
          </Heading>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7, margin: '0 0 12px' }}>{greeting}</Text>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7 }}>
            Your technician has claimed your build and work has begun. Build SLA: <strong>{sla}</strong> from today.
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7 }}>
            You'll receive another email when your build is ready for review.
          </Text>
          <Section style={{ marginTop: 28, textAlign: 'center' as const }}>
            <Button href={portalUrl} style={{ background: '#141413', color: '#faf7f0', padding: '14px 28px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', fontFamily: 'Courier New, monospace' }}>
              VIEW YOUR PORTAL →
            </Button>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>EEVOLVV · hello@eevolvv.com</Text>
        </Container>
      </Body>
    </Html>
  )
}
```

2. Create `emails/BuildReadyForReview.tsx`:

Subject: "Your build is ready for review — [Tier]"
Content: "Your [Tier] build has passed our QA check and is ready for you to review. [Preview link if available]. Visit your client portal to check the status and provide feedback."
CTA: "REVIEW YOUR BUILD →" → portal URL

3. Create `emails/BuildLive.tsx`:

Subject: "Your [Tier] site is live →"
Content: "[BUSINESS_NAME]'s site is now live. Here's your URL:" → prominent build_url. "What's next: [monthly update, uptime monitoring, etc.]"
Two CTAs: "VISIT YOUR SITE →" (build_url) and "VIEW PORTAL →" (portal URL)

4. Add to `lib/email-helpers.ts`:

```typescript
import { BuildStartedEmail } from '@/emails/BuildStarted'
import { BuildReadyForReviewEmail } from '@/emails/BuildReadyForReview'
import { BuildLiveEmail } from '@/emails/BuildLive'

const TIER_SLAS: Record<string, string> = {
  seed: '72 hours',
  core: '7–10 days',
  evolve: '14–21 days',
}

export async function sendBuildStarted({
  email, name, tier, portalUrl,
}: { email: string; name?: string; tier: string; portalUrl: string }): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  try {
    const html = await render(BuildStartedEmail({ name, tier, sla: TIER_SLAS[tier] ?? '7–10 days', portalUrl }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL, to: email,
      subject: `We've started building your ${tierLabel} — build clock is running`,
      html,
    })
    if (error) { console.error('[email-helpers] sendBuildStarted:', error); return { success: false, error: String(error) } }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendBuildStarted unexpected:', err)
    return { success: false, error: String(err) }
  }
}

export async function sendBuildReadyForReview({
  email, name, tier, portalUrl, previewUrl,
}: { email: string; name?: string; tier: string; portalUrl: string; previewUrl?: string }): Promise<EmailResult> {
  // same pattern as above — render BuildReadyForReviewEmail, send via Resend
  // ...
}

export async function sendBuildLive({
  email, name, tier, buildUrl, portalUrl,
}: { email: string; name?: string; tier: string; buildUrl: string; portalUrl: string }): Promise<EmailResult> {
  // same pattern — render BuildLiveEmail, send via Resend
  // ...
}
```

5. Modify `app/api/builds/update-status/route.ts` — add email triggers after status update succeeds:

After the `supabase.from('builds').update(...)` call succeeds, add:

```typescript
// Fetch client email and onboarding token for portal URL
const { data: client } = await supabase
  .from('clients')
  .select('email, name')
  .eq('id', build.client_id)
  .single()

const { data: tokenRow } = await supabase
  .from('onboarding_tokens')
  .select('token')
  .eq('client_id', build.client_id)
  .maybeSingle()

const portalUrl = tokenRow?.token
  ? `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'}/client/${tokenRow.token}`
  : `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'}/pricing`

if (client?.email) {
  const emailArgs = { email: client.email, name: client.name ?? undefined, tier: build.tier, portalUrl }
  
  ;(async () => {
    try {
      if (status === 'in_progress') {
        await sendBuildStarted(emailArgs)
      } else if (status === 'deploying') {
        await sendBuildReadyForReview({ ...emailArgs })
      } else if (status === 'live') {
        await sendBuildLive({ ...emailArgs, buildUrl: buildUrl ?? '' })
      }
    } catch (err) {
      console.error('[builds/update-status] email send failed:', err)
    }
  })()
}
```

Add import at top of the file:
```typescript
import { sendBuildStarted, sendBuildReadyForReview, sendBuildLive } from '@/lib/email-helpers'
```

---

## Code Patterns to Follow

```tsx
// Email template pattern (from emails/WelcomeEmail.tsx — T08)
export function BuildStartedEmail({ ... }: Props) {
  return <Html>...<Body style={{ background: '#faf7f0' }}>...</Body></Html>
}

// Non-blocking email in API route (from app/api/diagnostic/route.ts)
;(async () => {
  try { await sendEmail(...) } catch (err) { console.error(...) }
})()
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `RESEND_API_KEY` | Email sending (via `lib/email-helpers.ts`) |
| `FROM_EMAIL` | Sender address |
| `NEXT_PUBLIC_BASE_URL` | Portal URL construction |

---

## Acceptance Criteria

- [ ] `emails/BuildStarted.tsx` created; subject contains tier name and SLA
- [ ] `emails/BuildReadyForReview.tsx` created; subject contains "ready for review"
- [ ] `emails/BuildLive.tsx` created; subject contains "live"; includes build URL prominently
- [ ] All 3 templates use `#faf7f0` background, `#141413` text, `#8C2B1A` accent
- [ ] `lib/email-helpers.ts` exports `sendBuildStarted()`, `sendBuildReadyForReview()`, `sendBuildLive()`
- [ ] All 3 send functions return `{ success, error? }` — never throw
- [ ] `app/api/builds/update-status/route.ts` calls `sendBuildStarted` on `queued→in_progress`
- [ ] `app/api/builds/update-status/route.ts` calls `sendBuildReadyForReview` on `qa→deploying`
- [ ] `app/api/builds/update-status/route.ts` calls `sendBuildLive` on `deploying→live`
- [ ] Email sends are non-blocking (fire-and-forget pattern)
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `sendBuildStarted()`, `sendBuildReadyForReview()`, `sendBuildLive()` in `lib/email-helpers.ts` | None downstream |
| Client portal URL in emails | Client (human) |

---

## Do Not

- Do not block the API response waiting for emails to send
- Do not send emails for status transitions other than the 3 specified
- Do not use CSS vars in email templates — hex values only
- Do not add new status transitions to `VALID_TRANSITIONS` — T16 owns that
- Do NOT modify T16's VALID_TRANSITIONS map or the status update/validation logic in `app/api/builds/update-status/route.ts`
- Only APPEND the email-sending block after the successful Supabase update — do not refactor, rename, or restructure T16's code
- If T16's file structure differs from what's described in this brief, adapt the email trigger to fit T16's actual structure rather than rewriting T16's code
