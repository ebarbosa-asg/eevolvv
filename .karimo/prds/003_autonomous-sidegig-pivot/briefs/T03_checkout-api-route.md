# Task Brief: Checkout API Route

**ID:** T03
**PRD:** autonomous-sidegig-pivot
**Complexity:** 3/5
**Priority:** must
**Model:** sonnet
**Depends on:** T01, T02

---

## Objective

Build `app/api/stripe/checkout/route.ts` — a POST endpoint that accepts a `priceId` and optional `email`, creates a Stripe Checkout Session in `subscription` mode, and returns the hosted checkout URL for client-side redirect. This is the bridge between the payment wall UI (T07) and Stripe's hosted checkout.

---

## Context

**Verify before starting:**
- `lib/stripe.ts` exists and exports `stripe` (T01 complete)
- `lib/stripe-prices.ts` exists and exports `PRICE_IDS` (T02 complete)

**Pattern to follow — `app/api/diagnostic/route.ts`:**
- Import from `next/server`: `NextRequest`, `NextResponse`
- Guard against missing service: `if (!stripe) return NextResponse.json(...)` (like `if (!supabase)`)
- Parse body with try/catch: `body = await req.json()` with `catch { return 400 }`
- Return typed errors with appropriate HTTP status codes
- Use `console.error('[stripe]', err)` logging prefix pattern

**Stripe Checkout Session shape:**
- Mode: `subscription`
- `success_url` must include `{CHECKOUT_SESSION_ID}` template literal for post-payment verification
- `cancel_url` returns user to pricing page
- `customer_email` pre-fills the Stripe checkout form
- `subscription_data.metadata` stores tier info for T06 fulfillment

---

## Implementation

### Files to Create

- `app/api/stripe/checkout/route.ts` — POST handler

### Files to Modify

None.

### Step-by-Step

1. Create directory: `app/api/stripe/`

2. Create `app/api/stripe/checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PRICE_IDS, getTierFromPriceId, getIntervalFromPriceId } from '@/lib/stripe-prices'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 })
  }

  let body: { priceId?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { priceId, email } = body

  if (!priceId || typeof priceId !== 'string') {
    return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
  }

  // Validate priceId is one of our known prices
  const allPriceIds = Object.values(PRICE_IDS).flatMap(t => Object.values(t))
  if (!allPriceIds.includes(priceId)) {
    return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
  }

  const tier = getTierFromPriceId(priceId)
  const interval = getIntervalFromPriceId(priceId)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE_URL}/onboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      ...(email ? { customer_email: email } : {}),
      subscription_data: {
        metadata: {
          tier: tier ?? '',
          interval: interval ?? '',
          source: 'chat_payment_wall',
        },
      },
      metadata: {
        tier: tier ?? '',
        interval: interval ?? '',
      },
      allow_promotion_codes: true,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout] session creation error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    )
  }
}
```

3. Add `NEXT_PUBLIC_BASE_URL` to `.env.example` if not already present:
   ```
   NEXT_PUBLIC_BASE_URL=https://eevolvv.com
   ```

---

## Code Patterns to Follow

```typescript
// Guard pattern (from lib/supabase.ts + diagnostic/route.ts)
if (!stripe) return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 })

// Body parsing with error handling (from app/api/diagnostic/route.ts:57-62)
try {
  body = await req.json()
} catch {
  return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
}

// Error logging prefix pattern
console.error('[stripe/checkout] session creation error:', err)
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `STRIPE_SECRET_KEY` | Authenticates Stripe API calls (via `lib/stripe.ts`) |
| `NEXT_PUBLIC_BASE_URL` | Constructs `success_url` and `cancel_url` |

---

## Acceptance Criteria

- [ ] `POST /api/stripe/checkout` accepts `{ priceId: string, email?: string }` body
- [ ] Returns `{ url: string }` — the Stripe-hosted checkout URL
- [ ] `success_url` is `{BASE_URL}/onboard/success?session_id={CHECKOUT_SESSION_ID}`
- [ ] `cancel_url` is `{BASE_URL}/pricing`
- [ ] `customer_email` pre-filled when `email` is provided
- [ ] `subscription_data.metadata` includes `tier` and `interval`
- [ ] Returns 400 if `priceId` missing or not in known price IDs
- [ ] Returns 503 if Stripe client is not configured
- [ ] Returns 500 with user-friendly message on Stripe API errors
- [ ] Does not throw uncaught exceptions — all errors caught and returned as JSON
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `POST /api/stripe/checkout` endpoint | T07 (payment wall CTA), T10 (pricing page CTA) |
| `success_url` pattern with `session_id` | T04 (webhook), T09 (onboarding page) |
| `subscription_data.metadata.tier` | T06 (client creation fulfillment) |

---

## Do Not

- Do not implement webhook handling here — that is T04
- Do not create the client record here — fulfillment happens in T06 after T04 receives the webhook
- Do not use `stripe.paymentIntents` — this is subscription mode only, use `stripe.checkout.sessions`
- Do not expose raw Stripe errors to the client — log and return generic message
- Do not touch `lib/stripe.ts` or `lib/stripe-prices.ts`
