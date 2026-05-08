# Task Brief: Subscription Cancellation Flow

**ID:** T20
**PRD:** autonomous-sidegig-pivot
**Complexity:** 2/5
**Priority:** should
**Model:** sonnet
**Depends on:** T04, T05, T15

---

## Objective

Build the subscription cancellation flow: a `POST /api/stripe/cancel-subscription` endpoint that sets `cancel_at_period_end: true` on the Stripe subscription (graceful cancel — not immediate), sends a win-back email before confirming, and updates the DB. Wire to the "Cancel Membership" button in `ClientDashboard.tsx` with a two-step confirmation UI.

---

## Context

**Verify before starting:**
- `app/client/[token]/ClientDashboard.tsx` exists with placeholder "CANCEL MEMBERSHIP" link (T15 complete)
- `subscriptions` table has `cancel_at_period_end` boolean, `stripe_subscription_id` (T05 complete)
- `lib/email-helpers.ts` exists (T08 complete) — add `sendWinBack()` here

**Graceful cancel vs immediate cancel:**
- `cancel_at_period_end: true` — service continues until billing period ends. Client retains access. Stripe auto-cancels at renewal.
- `cancel: true` (immediate) — NOT used here. eevolvv keeps billing active until period end per policy.

**Two-step UI requirement:**
- Step 1: "Cancel Membership" button → shows confirmation dialog ("Are you sure?")
- Step 2: User must click "Confirm Cancellation" → API call fires
- Before the actual cancellation API call: send win-back email first

**Win-back email strategy:**
Send before executing cancellation. Personal tone. Include:
- What they lose (build, hosting, monitoring, monthly updates)
- Option to pause instead (manual escalation to E — include "Reply to this email to discuss pausing")
- Explicit "Click here to confirm cancellation" link = the API call confirmation

---

## Implementation

### Files to Create

- `app/api/stripe/cancel-subscription/route.ts` — POST handler
- `emails/WinBack.tsx` — Win-back email template

### Files to Modify

- `lib/email-helpers.ts` — Add `sendWinBack()`
- `app/client/[token]/ClientDashboard.tsx` — Add two-step cancel confirmation modal

### Step-by-Step

1. Create `emails/WinBack.tsx`:

```tsx
import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font } from '@react-email/components'

interface WinBackProps {
  name?: string
  tier?: string
  periodEnd?: string
}

export function WinBackEmail({ name, tier, periodEnd }: WinBackProps) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const tierLabel = tier ? ` ${tier.charAt(0).toUpperCase() + tier.slice(1)}` : ''
  return (
    <Html lang="en" dir="ltr">
      <Head><Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" webFont={undefined} fontWeight={400} fontStyle="normal" /></Head>
      <Preview>Before you go — a note from E.</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>EEVOLVV · E</Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Heading as="h1" style={{ fontSize: 24, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Before you go.
          </Heading>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, margin: '0 0 12px', opacity: 0.8 }}>{greeting}</Text>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, opacity: 0.8 }}>
            I saw your cancellation request. I'm not going to write a long email. But I do want you to know what you'd be walking away from before it's confirmed:
          </Text>
          <Section style={{ margin: '20px 0', padding: '16px 20px', border: '1px solid rgba(20,20,19,0.14)' }}>
            <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.8, margin: 0 }}>
              → Your{tierLabel} build — hosted and maintained by eevolvv<br />
              → Monthly performance reports<br />
              → Uptime monitoring + incident alerts<br />
              → Content + agent updates included in your plan<br />
              → Quarterly re-calibration (your AI gets sharper each quarter)
            </Text>
          </Section>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, opacity: 0.8 }}>
            If it's a budget issue — reply to this email. We can discuss pausing your subscription instead of canceling. Your build stays live. You pay again when you're ready.
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, opacity: 0.8 }}>
            {periodEnd ? `If you confirm, your service continues until ${periodEnd}. After that, your build will go offline.` : 'If you confirm, your service continues until your current billing period ends.'}
          </Text>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '28px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
            E — Eduardo Barbosa · hello@eevolvv.com<br />
            Reply directly to this email to discuss alternatives.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

2. Add to `lib/email-helpers.ts`:

```typescript
import { WinBackEmail } from '@/emails/WinBack'

export async function sendWinBack({
  email, name, tier, periodEnd,
}: {
  email: string; name?: string; tier?: string; periodEnd?: string
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }
  const tierLabel = tier ? ` ${tier.charAt(0).toUpperCase() + tier.slice(1)}` : ''
  try {
    const html = await render(WinBackEmail({ name, tier, periodEnd }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Before you go — a message from E about your eevolvv${tierLabel} membership`,
      html,
    })
    if (error) { console.error('[email-helpers] sendWinBack:', error); return { success: false, error: String(error) } }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendWinBack unexpected:', err)
    return { success: false, error: String(err) }
  }
}
```

3. Create `app/api/stripe/cancel-subscription/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { sendWinBack } from '@/lib/email-helpers'

export async function POST(req: NextRequest) {
  if (!stripe || !supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  let body: { token: string; confirmed?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { token, confirmed = false } = body
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  // Validate token → client
  const { data: tokenRow } = await supabase
    .from('onboarding_tokens')
    .select('client_id')
    .eq('token', token)
    .maybeSingle()
  if (!tokenRow) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

  const clientId = tokenRow.client_id

  // Get active subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id, stripe_subscription_id, status, cancel_at_period_end, current_period_end')
    .eq('client_id', clientId)
    .eq('status', 'active')
    .maybeSingle()

  if (!sub) return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })

  if (sub.cancel_at_period_end) {
    return NextResponse.json({ error: 'Subscription is already scheduled for cancellation' }, { status: 409 })
  }

  // Get client info for email
  const { data: client } = await supabase
    .from('clients')
    .select('email, name, tier')
    .eq('id', clientId)
    .single()

  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : undefined

  // Step 1: Send win-back email (do this before confirming)
  if (!confirmed) {
    // Just send the win-back email — don't cancel yet
    // Frontend will ask user to confirm after receiving this
    if (client?.email) {
      ;(async () => {
        await sendWinBack({
          email: client.email!,
          name: client.name ?? undefined,
          tier: client.tier ?? undefined,
          periodEnd,
        })
      })()
    }
    return NextResponse.json({
      winBackSent: true,
      periodEnd,
      message: 'Win-back email sent. Call this endpoint with confirmed: true to proceed.',
    })
  }

  // Step 2: Execute cancellation
  try {
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    })
  } catch (err) {
    console.error('[cancel-subscription] Stripe error:', err)
    return NextResponse.json({ error: 'Failed to cancel subscription. Please try again.' }, { status: 500 })
  }

  // Update DB
  await supabase
    .from('subscriptions')
    .update({ cancel_at_period_end: true, updated_at: new Date().toISOString() })
    .eq('id', sub.id)

  return NextResponse.json({
    success: true,
    periodEnd,
    message: `Cancellation scheduled. Service active until ${periodEnd ?? 'period end'}.`,
  })
}
```

4. Modify `app/client/[token]/ClientDashboard.tsx` — Add two-step cancel modal:

Add state:
```tsx
const [cancelStep, setCancelStep] = useState<0 | 1 | 2>(0)
// 0 = hidden, 1 = initial confirmation, 2 = waiting for win-back confirm
const [cancelLoading, setCancelLoading] = useState(false)
const [cancelError, setCancelError] = useState<string | null>(null)
const [cancelPeriodEnd, setCancelPeriodEnd] = useState<string | null>(null)
```

Replace "CANCEL MEMBERSHIP" anchor with button + modal:

```tsx
{!subscription?.cancel_at_period_end && (
  <button
    onClick={() => setCancelStep(1)}
    className="mono"
    style={{ padding: '10px 20px', border: '1px solid rgba(20,20,19,0.3)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink)', background: 'transparent', cursor: 'pointer', opacity: 0.55 }}
  >
    CANCEL MEMBERSHIP
  </button>
)}

{cancelStep > 0 && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,19,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
    <div style={{ background: 'var(--paper)', maxWidth: 480, width: '100%', margin: 24, padding: 32, border: '1px solid var(--ink)' }}>
      {cancelStep === 1 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 16px' }}>Cancel your membership?</h2>
          <p style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.6 }}>
            We'll send you an email with more information first. After you receive it, you'll have a second chance to confirm or reconsider.
          </p>
          {cancelError && <div style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 12 }}>{cancelError}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              onClick={async () => {
                setCancelLoading(true)
                setCancelError(null)
                try {
                  const res = await fetch('/api/stripe/cancel-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, confirmed: false }),
                  })
                  const data = await res.json()
                  if (res.ok) {
                    setCancelPeriodEnd(data.periodEnd ?? null)
                    setCancelStep(2)
                  } else {
                    setCancelError(data.error ?? 'Something went wrong')
                  }
                } catch {
                  setCancelError('Network error')
                } finally {
                  setCancelLoading(false)
                }
              }}
              disabled={cancelLoading}
              className="mono"
              style={{ padding: '12px 20px', background: 'var(--accent)', color: 'var(--paper)', border: 'none', fontSize: 10, letterSpacing: '0.14em', cursor: 'pointer' }}
            >
              {cancelLoading ? '...' : 'SEND ME THE INFO →'}
            </button>
            <button onClick={() => setCancelStep(0)} style={{ background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', opacity: 0.55 }}>
              Keep my membership
            </button>
          </div>
        </>
      )}
      {cancelStep === 2 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 16px' }}>We've sent you an email.</h2>
          <p style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.6 }}>
            Check your inbox for a message from E. If you still want to cancel after reading it, click below.
            {cancelPeriodEnd && ` Your service will remain active until ${cancelPeriodEnd}.`}
          </p>
          {cancelError && <div style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 12 }}>{cancelError}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              onClick={async () => {
                setCancelLoading(true)
                setCancelError(null)
                try {
                  const res = await fetch('/api/stripe/cancel-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, confirmed: true }),
                  })
                  const data = await res.json()
                  if (res.ok) {
                    setCancelStep(0)
                    window.location.reload()
                  } else {
                    setCancelError(data.error ?? 'Cancellation failed')
                  }
                } catch {
                  setCancelError('Network error')
                } finally {
                  setCancelLoading(false)
                }
              }}
              disabled={cancelLoading}
              className="mono"
              style={{ padding: '12px 20px', background: 'rgba(20,20,19,0.8)', color: 'var(--paper)', border: 'none', fontSize: 10, letterSpacing: '0.14em', cursor: 'pointer', opacity: 0.7 }}
            >
              {cancelLoading ? '...' : 'CONFIRM CANCELLATION'}
            </button>
            <button onClick={() => setCancelStep(0)} style={{ background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', opacity: 0.55 }}>
              Keep my membership
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
```

---

## Acceptance Criteria

- [ ] `POST /api/stripe/cancel-subscription` with `{ token, confirmed: false }` sends win-back email and returns `{ winBackSent: true, periodEnd }`
- [ ] `POST /api/stripe/cancel-subscription` with `{ token, confirmed: true }` calls `stripe.subscriptions.update({ cancel_at_period_end: true })`
- [ ] `subscriptions.cancel_at_period_end` set to `true` in DB after confirmed cancellation
- [ ] Returns 409 if already scheduled for cancellation
- [ ] "CANCEL MEMBERSHIP" button in ClientDashboard opens two-step modal
- [ ] Step 1: Explanation + "Send me the info →" button
- [ ] Step 2: "We've sent you an email" + "Confirm Cancellation" button
- [ ] Win-back email sent before first confirmation step
- [ ] `emails/WinBack.tsx` created with personal tone, what client loses, pause option, from E
- [ ] `sendWinBack()` added to `lib/email-helpers.ts`, returns `{ success, error? }`
- [ ] After confirmed cancellation: page reloads and shows "Cancellation scheduled — active until [date]" state (from T15)
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `POST /api/stripe/cancel-subscription` | T15 client portal (wired here) |
| `sendWinBack()` in `lib/email-helpers.ts` | None downstream |

---

## Do Not

- Do not use `stripe.subscriptions.cancel()` or `stripe.subscriptions.del()` — use `update({ cancel_at_period_end: true })`
- Do not terminate service immediately — cancel at period end only
- Do not skip the two-step confirmation — it's a product requirement
- Do not add automatic downgrade offers — that is future work
