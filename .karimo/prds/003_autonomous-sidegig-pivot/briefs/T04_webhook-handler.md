# Task Brief: Webhook Handler

**ID:** T04
**PRD:** autonomous-sidegig-pivot
**Complexity:** 4/5
**Priority:** must
**Model:** sonnet
**Depends on:** T01, T05

---

## Objective

Build `app/api/stripe/webhook/route.ts` — a POST endpoint that verifies Stripe webhook signatures and routes events to typed handler functions. Also create the shell `lib/webhook-handlers.ts` with placeholder implementations that T06 and T18 will fill in. This is the central nervous system of the payment pipeline: every Stripe event passes through here.

---

## Context

**Verify before starting:**
- `lib/stripe.ts` exports `stripe` (T01 complete)
- `supabase/migrations/006_subscriptions_builds.sql` exists with `subscriptions` and `clients` tables (T05 complete)

**Critical Stripe webhook requirement:** Stripe requires the **raw request body** (not parsed JSON) to verify signatures. In Next.js App Router, use `req.text()` to get the raw body string, then pass to `stripe.webhooks.constructEvent()`.

**Do not** use `req.json()` in the webhook route — it will invalidate the signature.

**Pattern: `app/api/diagnostic/route.ts`:**
- `import { NextRequest, NextResponse } from 'next/server'`
- Import Supabase: `import { supabase } from '@/lib/supabase'`
- Guard missing services: return 503
- Log errors with `[module]` prefix: `console.error('[webhook]', err)`

**Stripe webhook events to handle in this task:**
1. `checkout.session.completed` → call `createClientRecord()` (implemented by T06)
2. `invoice.payment_succeeded` → update `subscriptions.status` to `active`
3. `invoice.payment_failed` → handled by T18 (stub here)
4. `customer.subscription.updated` → update subscription status/price in DB
5. `customer.subscription.deleted` → handled by T18 (stub here)

**Stripe requirement:** Unhandled events must return HTTP 200 (not 404). Failed handlers must also return 200 (log error, don't throw).

---

## Implementation

### Files to Create

- `app/api/stripe/webhook/route.ts` — Webhook POST handler with signature verification
- `lib/webhook-handlers.ts` — Handler function shells (T06 will fill `createClientRecord`, T18 will fill dunning handlers)

### Files to Modify

None in this task.

### Step-by-Step

1. Create `lib/webhook-handlers.ts`:

```typescript
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

/**
 * Called by T06. Implemented fully in T06.
 * Stub here to allow T04 webhook router to compile.
 */
export async function createClientRecord(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log('[webhook-handlers] createClientRecord stub — implement in T06', session.id)
}

/**
 * Handle checkout.session.completed
 * Full implementation added by T06.
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  await createClientRecord(session)
}

/**
 * Handle invoice.payment_succeeded
 * Updates subscription status to active.
 */
export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  if (!supabase || !invoice.subscription) return
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscriptionId)
  if (error) console.error('[webhook-handlers] payment_succeeded update error:', error.message)
}

/**
 * Handle invoice.payment_failed
 * Full dunning implementation added by T18.
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log('[webhook-handlers] handleInvoicePaymentFailed stub — implement in T18', invoice.id)
}

/**
 * Handle customer.subscription.updated
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
  if (error) console.error('[webhook-handlers] subscription_updated error:', error.message)
}

/**
 * Handle customer.subscription.deleted
 * Full implementation added by T18.
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('[webhook-handlers] handleSubscriptionDeleted stub — implement in T18', subscription.id)
}
```

2. Create `app/api/stripe/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from '@/lib/webhook-handlers'

// IMPORTANT: Disable body parsing — Stripe requires raw body for signature verification
export const config = {
  api: { bodyParser: false },
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 })
  }

  // Get raw body — required for Stripe signature verification
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  // Route to handler — always return 200, even on handler errors
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      default:
        // Stripe requires 200 for all events, even unhandled ones
        console.log(`[webhook] unhandled event type: ${event.type}`)
    }
  } catch (err) {
    // Log but DO NOT throw — return 200 so Stripe does not retry
    console.error(`[webhook] handler error for ${event.type}:`, err)
  }

  return NextResponse.json({ received: true })
}
```

3. Register the webhook endpoint in Stripe dashboard:
   - URL: `https://eevolvv.com/api/stripe/webhook`
   - Events to listen to: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret into `STRIPE_WEBHOOK_SECRET` env var

4. For local testing, install Stripe CLI and run:
   ```bash
   stripe listen --forward-to localhost:3004/api/stripe/webhook
   ```

---

## Code Patterns to Follow

```typescript
// Raw body parsing (critical for Stripe)
const rawBody = await req.text()

// Signature verification
event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)

// Always return 200 even on handler error
try {
  await handler(event.data.object)
} catch (err) {
  console.error('[webhook] handler error:', err)
}
return NextResponse.json({ received: true })
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `STRIPE_SECRET_KEY` | Stripe client (via `lib/stripe.ts`) |
| `STRIPE_WEBHOOK_SECRET` | Signature verification (`whsec_...` from Stripe dashboard) |

---

## Acceptance Criteria

- [ ] `POST /api/stripe/webhook` verifies Stripe webhook signature using raw body
- [ ] Returns 400 if signature is invalid or missing
- [ ] Routes `checkout.session.completed` to `handleCheckoutSessionCompleted()`
- [ ] Routes `invoice.payment_succeeded` to `handleInvoicePaymentSucceeded()` which updates `subscriptions.status = active`
- [ ] Routes `invoice.payment_failed` to `handleInvoicePaymentFailed()` (stub that T18 fills)
- [ ] Routes `customer.subscription.updated` to `handleSubscriptionUpdated()`
- [ ] Routes `customer.subscription.deleted` to `handleSubscriptionDeleted()` (stub that T18 fills)
- [ ] Unhandled event types return 200 with `{ received: true }`
- [ ] Handler exceptions are caught and logged — never return non-200 from a valid event
- [ ] `lib/webhook-handlers.ts` created with all 5 handler function shells
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `POST /api/stripe/webhook` endpoint | Stripe dashboard (configured to point here) |
| `lib/webhook-handlers.ts` — `createClientRecord()` stub | T06 (fills implementation) |
| `lib/webhook-handlers.ts` — `handleInvoicePaymentFailed()` stub | T18 (fills dunning logic) |
| `lib/webhook-handlers.ts` — `handleSubscriptionDeleted()` stub | T18 (fills churn logic) |
| `handleSubscriptionUpdated()` implementation | T19 (subscription changes) |

---

## Do Not

- Do not use `req.json()` — will break Stripe signature verification; use `req.text()`
- Do not implement `createClientRecord()` in full — that is T06's responsibility
- Do not implement dunning in `handleInvoicePaymentFailed` — that is T18
- Do not return non-200 status codes for valid Stripe events (even on handler failure)
- Do not add `export const runtime = 'edge'` — edge runtime doesn't support `req.text()` the same way
- Do not touch `.env*` files other than `.env.example`
