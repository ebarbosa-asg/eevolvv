# Task Brief: Failed Payment + Dunning Webhook Handlers

**ID:** T18
**PRD:** autonomous-sidegig-pivot
**Complexity:** 3/5
**Priority:** must
**Model:** sonnet
**Depends on:** T04, T05

---

## Objective

Implement the `handleInvoicePaymentFailed()` and `handleSubscriptionDeleted()` functions in `lib/webhook-handlers.ts` (stubs created by T04). Failed payment: update subscription status to `past_due`, send dunning email with Stripe billing portal link. Subscription deleted: mark client churned, pause active builds.

---

## Context

**Verify before starting:**
- `lib/webhook-handlers.ts` exists with `handleInvoicePaymentFailed()` and `handleSubscriptionDeleted()` stubs (T04 complete)
- `subscriptions` table has `status` column with `past_due` and `canceled` values (T05 complete)
- `clients.churn_risk` boolean column exists (T05 complete)
- `builds` table has `paused` status value (T05 complete)
- `lib/email-helpers.ts` exists (T08 complete) — add `sendPaymentFailed()` here

**Stripe billing portal:** Clients can update payment methods via Stripe's hosted billing portal. Create the portal session using `stripe.billingPortal.sessions.create()`. This requires the client's Stripe customer ID and a return URL.

**Create `app/api/stripe/billing-portal/route.ts`** — a GET endpoint that accepts the client's token as a query parameter, looks up their `stripe_customer_id`, and returns a portal URL.

**Pattern: `lib/webhook-handlers.ts` existing functions:**
All handlers follow the pattern:
1. Guard `if (!supabase) return`
2. Extract Stripe object ID
3. Query DB
4. Update DB
5. Log errors, never throw

---

## Implementation

### Files to Create

- `emails/PaymentFailed.tsx` — Dunning email template
- `app/api/stripe/billing-portal/route.ts` — GET endpoint returning Stripe billing portal URL

### Files to Modify

- `lib/webhook-handlers.ts` — Fill `handleInvoicePaymentFailed()` and `handleSubscriptionDeleted()` stubs
- `lib/email-helpers.ts` — Add `sendPaymentFailed()`

### Step-by-Step

1. Create `emails/PaymentFailed.tsx`:

```tsx
import * as React from 'react'
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font } from '@react-email/components'

interface PaymentFailedProps {
  name?: string
  amountDue?: string
  tier?: string
  billingPortalUrl: string
}

export function PaymentFailedEmail({ name, amountDue, tier, billingPortalUrl }: PaymentFailedProps) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const tierLabel = tier ? ` ${tier.charAt(0).toUpperCase() + tier.slice(1)}` : ''
  return (
    <Html lang="en" dir="ltr">
      <Head><Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" webFont={undefined} fontWeight={400} fontStyle="normal" /></Head>
      <Preview>Action required — payment failed for your eevolvv{tierLabel} subscription.</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>EEVOLVV</Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Heading as="h1" style={{ fontSize: 24, fontWeight: 600, color: '#141413', margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Action required: payment failed.
          </Heading>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7, margin: '0 0 12px' }}>{greeting}</Text>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7 }}>
            We were unable to process your payment{amountDue ? ` of ${amountDue}` : ''} for your eevolvv{tierLabel} subscription.
          </Text>
          <Section style={{ margin: '24px 0', background: 'rgba(140,43,26,0.06)', border: '1px solid rgba(140,43,26,0.2)', padding: '16px 20px' }}>
            <Text style={{ fontSize: 13, color: '#8C2B1A', margin: 0, lineHeight: 1.6 }}>
              <strong>Important:</strong> Your build remains active for the next 7 days while we retry. After 3 failed attempts, your subscription will be paused.
            </Text>
          </Section>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7 }}>
            Update your payment method to keep your build running.
          </Text>
          <Section style={{ marginTop: 24, textAlign: 'center' as const }}>
            <Button href={billingPortalUrl} style={{ background: '#8C2B1A', color: '#faf7f0', padding: '14px 28px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', fontFamily: 'Courier New, monospace' }}>
              UPDATE PAYMENT METHOD →
            </Button>
          </Section>
          <Text style={{ fontSize: 13, color: '#141413', opacity: 0.6, lineHeight: 1.6, marginTop: 24 }}>
            Questions? Reply to this email. E monitors this inbox directly.
          </Text>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>EEVOLVV · hello@eevolvv.com</Text>
        </Container>
      </Body>
    </Html>
  )
}
```

2. Add to `lib/email-helpers.ts`:

```typescript
import { PaymentFailedEmail } from '@/emails/PaymentFailed'

export async function sendPaymentFailed({
  email, name, amountDue, tier, billingPortalUrl,
}: {
  email: string
  name?: string
  amountDue?: string
  tier?: string
  billingPortalUrl: string
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }
  try {
    const html = await render(PaymentFailedEmail({ name, amountDue, tier, billingPortalUrl }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Action required — payment failed for your eevolvv subscription',
      html,
    })
    if (error) { console.error('[email-helpers] sendPaymentFailed:', error); return { success: false, error: String(error) } }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendPaymentFailed unexpected:', err)
    return { success: false, error: String(err) }
  }
}
```

3. Create `app/api/stripe/billing-portal/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export async function GET(req: NextRequest) {
  if (!stripe || !supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  // Find client via onboarding token
  const { data: tokenRow } = await supabase
    .from('onboarding_tokens')
    .select('client_id')
    .eq('token', token)
    .maybeSingle()

  if (!tokenRow) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  const { data: client } = await supabase
    .from('clients')
    .select('stripe_customer_id')
    .eq('id', tokenRow.client_id)
    .single()

  if (!client?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: client.stripe_customer_id,
      return_url: `${BASE_URL}/client/${token}`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[billing-portal] Stripe error:', err)
    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 })
  }
}
```

4. Fill in `lib/webhook-handlers.ts` stubs:

**Replace `handleInvoicePaymentFailed()` stub:**
```typescript
import { sendPaymentFailed } from '@/lib/email-helpers'
import { stripe } from '@/lib/stripe'

export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  if (!supabase) { console.error('[webhook-handlers] Supabase not configured'); return }

  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id ?? ''

  if (!subscriptionId) { console.warn('[webhook-handlers] payment_failed: no subscription ID'); return }

  // Update subscription status to past_due
  const { data: sub, error: subErr } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscriptionId)
    .select('client_id')
    .single()

  if (subErr || !sub) {
    console.error('[webhook-handlers] payment_failed: subscription update error:', subErr?.message)
    return
  }

  // Fetch client for email
  const { data: client } = await supabase
    .from('clients')
    .select('email, name, tier, stripe_customer_id')
    .eq('id', sub.client_id)
    .single()

  if (!client?.email) { console.warn('[webhook-handlers] payment_failed: no client email'); return }

  // Create billing portal session for the dunning email
  let billingPortalUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'}/pricing`
  if (stripe && client.stripe_customer_id) {
    try {
      const { data: tokenRow } = await supabase
        .from('onboarding_tokens')
        .select('token')
        .eq('client_id', sub.client_id)
        .maybeSingle()
      const returnUrl = tokenRow?.token
        ? `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'}/client/${tokenRow.token}`
        : `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'}/pricing`
      const session = await stripe.billingPortal.sessions.create({
        customer: client.stripe_customer_id,
        return_url: returnUrl,
      })
      billingPortalUrl = session.url
    } catch (err) {
      console.error('[webhook-handlers] billing portal creation failed:', err)
    }
  }

  // Format amount due
  const amountDue = invoice.amount_due
    ? `$${(invoice.amount_due / 100).toFixed(2)}`
    : undefined

  ;(async () => {
    await sendPaymentFailed({
      email: client.email!, name: client.name ?? undefined,
      amountDue, tier: client.tier ?? undefined, billingPortalUrl,
    })
  })()

  console.log('[webhook-handlers] payment_failed handled for subscription:', subscriptionId)
}
```

**Replace `handleSubscriptionDeleted()` stub:**
```typescript
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  if (!supabase) { console.error('[webhook-handlers] Supabase not configured'); return }

  // Update subscription status to canceled
  const { data: sub } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscription.id)
    .select('client_id')
    .maybeSingle()

  if (!sub?.client_id) {
    console.warn('[webhook-handlers] subscription_deleted: no matching record for', subscription.id)
    return
  }

  // Mark client as churn risk
  await supabase
    .from('clients')
    .update({ churn_risk: true })
    .eq('id', sub.client_id)

  // Pause all non-live builds
  const { error: buildErr } = await supabase
    .from('builds')
    .update({ status: 'paused', updated_at: new Date().toISOString() })
    .eq('client_id', sub.client_id)
    .not('status', 'in', '(live,failed)')

  if (buildErr) console.error('[webhook-handlers] subscription_deleted: build pause error:', buildErr.message)

  console.log('[webhook-handlers] subscription_deleted handled:', subscription.id, 'client:', sub.client_id)
}
```

---

## Code Patterns to Follow

```typescript
// Webhook handler pattern (from T04's existing handlers)
export async function handleX(event: Stripe.X): Promise<void> {
  if (!supabase) { console.error('...'); return }
  // Do work
  // Log, never throw
}

// Billing portal session creation
const session = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: returnUrl,
})
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `STRIPE_SECRET_KEY` | Stripe client (billing portal creation) |
| `SUPABASE_URL` | DB |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS |
| `RESEND_API_KEY` | Email sending |
| `NEXT_PUBLIC_BASE_URL` | Return URL for billing portal |

---

## Acceptance Criteria

- [ ] `handleInvoicePaymentFailed()` updates `subscriptions.status = 'past_due'`
- [ ] `handleInvoicePaymentFailed()` sends `PaymentFailed.tsx` email with Stripe billing portal link
- [ ] Billing portal link is a real Stripe portal URL (not `/pricing` placeholder)
- [ ] `handleSubscriptionDeleted()` updates `subscriptions.status = 'canceled'`
- [ ] `handleSubscriptionDeleted()` sets `clients.churn_risk = true`
- [ ] `handleSubscriptionDeleted()` pauses all non-live builds for the client
- [ ] `GET /api/stripe/billing-portal?token=X` returns `{ url }` pointing to Stripe billing portal
- [ ] `emails/PaymentFailed.tsx` subject: "Action required — payment failed for your eevolvv subscription"
- [ ] `sendPaymentFailed()` added to `lib/email-helpers.ts`, returns `{ success, error? }` — never throws
- [ ] All handlers are idempotent — second call doesn't break anything
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `GET /api/stripe/billing-portal` | T15 (client portal), T19 (update subscription), T20 (cancel flow) |
| `clients.churn_risk` set to true | T22 (churn detection) |
| `sendPaymentFailed()` in `lib/email-helpers.ts` | None downstream |

---

## Do Not

- Do not cancel subscriptions immediately on payment failure — Stripe retries automatically
- Do not pause live builds on payment failure — only on subscription deletion
- Do not call `handleInvoicePaymentFailed` from `handleSubscriptionDeleted` — they are separate events
- Do not modify the webhook router in `app/api/stripe/webhook/route.ts` — it already routes to these handlers
