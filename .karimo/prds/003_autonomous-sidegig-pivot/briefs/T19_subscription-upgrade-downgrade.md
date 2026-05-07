# Task Brief: Subscription Upgrade/Downgrade Flow

**ID:** T19
**PRD:** autonomous-sidegig-pivot
**Complexity:** 3/5
**Priority:** should
**Model:** sonnet
**Depends on:** T04, T05, T15

---

## Objective

Build `app/api/stripe/update-subscription/route.ts` — a POST endpoint that accepts a client token and new price ID, validates the client's identity, updates their Stripe subscription with proration, and updates the `subscriptions` table. Wire to the "Change Plan" button in `ClientDashboard.tsx`.

---

## Context

**Verify before starting:**
- `app/client/[token]/ClientDashboard.tsx` exists with placeholder "CHANGE PLAN" link (T15 complete)
- `subscriptions` table has `stripe_subscription_id`, `stripe_price_id`, `client_id` columns (T05 complete)
- `onboarding_tokens` table maps tokens to `client_id` (T05 complete)
- `lib/stripe.ts` exports `stripe` (T01 complete)
- `lib/stripe-prices.ts` exports `PRICE_IDS`, `getTierFromPriceId()`, `TIER_CONFIGS` (T02 complete)

**Stripe subscription update:**
```typescript
stripe.subscriptions.update(subscriptionId, {
  items: [{ id: subscriptionItemId, price: newPriceId }],
  proration_behavior: 'create_prorations',
})
```
The subscription item ID is different from the subscription ID. To get it:
```typescript
const sub = await stripe.subscriptions.retrieve(subscriptionId)
const itemId = sub.items.data[0].id
```

**T04's `handleSubscriptionUpdated()` already handles the Stripe webhook event** — when Stripe confirms the subscription change, the webhook fires `customer.subscription.updated` and `handleSubscriptionUpdated()` updates the DB. So this route only needs to: (1) call Stripe, (2) update local DB optimistically, (3) return success.

**Client portal integration:** Replace the placeholder `/pricing` href on "CHANGE PLAN" button in `ClientDashboard.tsx` with a modal that shows tier options and calls this endpoint.

---

## Implementation

### Files to Create

- `app/api/stripe/update-subscription/route.ts` — POST handler

### Files to Modify

- `app/client/[token]/ClientDashboard.tsx` — Replace "CHANGE PLAN" link with modal

### Step-by-Step

1. Create `app/api/stripe/update-subscription/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { getTierFromPriceId, getIntervalFromPriceId, PRICE_IDS } from '@/lib/stripe-prices'

export async function POST(req: NextRequest) {
  if (!stripe || !supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  let body: { token: string; newPriceId: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { token, newPriceId } = body

  if (!token || !newPriceId) {
    return NextResponse.json({ error: 'token and newPriceId are required' }, { status: 400 })
  }

  // Validate price ID is one of our known prices
  const allPriceIds = Object.values(PRICE_IDS).flatMap(t => Object.values(t)).filter(Boolean)
  if (!allPriceIds.includes(newPriceId)) {
    return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
  }

  // Validate token → client
  const { data: tokenRow } = await supabase
    .from('onboarding_tokens')
    .select('client_id')
    .eq('token', token)
    .maybeSingle()

  if (!tokenRow) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  // Get active subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id, stripe_subscription_id, stripe_price_id, status')
    .eq('client_id', tokenRow.client_id)
    .eq('status', 'active')
    .maybeSingle()

  if (!sub) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
  }

  if (sub.stripe_price_id === newPriceId) {
    return NextResponse.json({ error: 'Already on this plan' }, { status: 409 })
  }

  // Get subscription item ID from Stripe
  let stripeSub: Awaited<ReturnType<typeof stripe.subscriptions.retrieve>>
  try {
    stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
  } catch (err) {
    console.error('[update-subscription] retrieve error:', err)
    return NextResponse.json({ error: 'Failed to retrieve subscription' }, { status: 500 })
  }

  const subscriptionItemId = stripeSub.items.data[0]?.id
  if (!subscriptionItemId) {
    return NextResponse.json({ error: 'Subscription item not found' }, { status: 500 })
  }

  // Update Stripe subscription
  try {
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      items: [{ id: subscriptionItemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
    })
  } catch (err) {
    console.error('[update-subscription] Stripe update error:', err)
    return NextResponse.json({ error: 'Failed to update subscription. Please try again.' }, { status: 500 })
  }

  // Optimistic DB update (webhook will also update, but let's be fast for the UI)
  const newTier = getTierFromPriceId(newPriceId)
  const newInterval = getIntervalFromPriceId(newPriceId)
  await supabase
    .from('subscriptions')
    .update({
      stripe_price_id: newPriceId,
      billing_interval: newInterval ?? 'monthly',
      updated_at: new Date().toISOString(),
    })
    .eq('id', sub.id)

  if (newTier) {
    await supabase
      .from('clients')
      .update({ tier: newTier })
      .eq('id', tokenRow.client_id)
  }

  return NextResponse.json({
    success: true,
    newPlan: newTier ? `${newTier.charAt(0).toUpperCase() + newTier.slice(1)} ${(newInterval ?? 'monthly').charAt(0).toUpperCase() + (newInterval ?? 'monthly').slice(1)}` : 'Updated',
  })
}
```

2. Modify `app/client/[token]/ClientDashboard.tsx` — Replace "CHANGE PLAN" link with modal:

Add state for modal:
```tsx
const [showChangePlan, setShowChangePlan] = useState(false)
const [changePlanLoading, setChangePlanLoading] = useState<string | null>(null)
const [changePlanError, setChangePlanError] = useState<string | null>(null)
const [changePlanSuccess, setChangePlanSuccess] = useState<string | null>(null)
```

Import TIER_CONFIGS:
```tsx
import { TIER_CONFIGS, getPriceId } from '@/lib/stripe-prices'
```

Replace "CHANGE PLAN" anchor with button and add modal below the subscription section:
```tsx
<button onClick={() => setShowChangePlan(true)} className="mono" style={{ padding: '10px 20px', border: '1px solid var(--ink)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink)', background: 'transparent', cursor: 'pointer' }}>
  CHANGE PLAN
</button>
```

Add modal (if `showChangePlan`):
```tsx
{showChangePlan && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,19,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
    <div style={{ background: 'var(--paper)', maxWidth: 560, width: '100%', margin: 24, padding: 32, border: '1px solid var(--ink)' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
        CHANGE PLAN
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 20px' }}>Select your new plan</h2>
      {TIER_CONFIGS.map(config => {
        const price = config.prices.annual
        const isCurrent = client?.tier === config.tier
        return (
          <div key={config.tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--rule)', marginBottom: 8, opacity: isCurrent ? 0.5 : 1 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{config.name}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>{price.amountDisplay}/yr · {config.buildSla}</div>
            </div>
            {isCurrent ? (
              <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', opacity: 0.5 }}>CURRENT PLAN</span>
            ) : (
              <button
                onClick={async () => {
                  setChangePlanLoading(config.tier)
                  setChangePlanError(null)
                  try {
                    const res = await fetch('/api/stripe/update-subscription', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token, newPriceId: price.priceId }),
                    })
                    const data = await res.json()
                    if (res.ok) {
                      setChangePlanSuccess(`Plan updated to ${data.newPlan}`)
                      setTimeout(() => setShowChangePlan(false), 2000)
                    } else {
                      setChangePlanError(data.error ?? 'Update failed')
                    }
                  } catch {
                    setChangePlanError('Network error')
                  } finally {
                    setChangePlanLoading(null)
                  }
                }}
                disabled={changePlanLoading !== null}
                className="mono"
                style={{ padding: '8px 16px', background: 'var(--ink)', color: 'var(--paper)', border: 'none', fontSize: 10, letterSpacing: '0.14em', cursor: 'pointer' }}
              >
                {changePlanLoading === config.tier ? '...' : 'SELECT →'}
              </button>
            )}
          </div>
        )
      })}
      {changePlanError && <div style={{ color: 'var(--accent)', fontSize: 13, marginTop: 12 }}>{changePlanError}</div>}
      {changePlanSuccess && <div style={{ color: '#4ade80', fontSize: 13, marginTop: 12 }}>{changePlanSuccess}</div>}
      <button onClick={() => setShowChangePlan(false)} style={{ marginTop: 16, background: 'none', border: 'none', fontSize: 12, opacity: 0.5, cursor: 'pointer' }}>Close</button>
    </div>
  </div>
)}
```

---

## Code Patterns to Follow

```typescript
// Stripe subscription item retrieval
const stripeSub = await stripe.subscriptions.retrieve(subscriptionId)
const itemId = stripeSub.items.data[0].id

// Proration update
await stripe.subscriptions.update(subscriptionId, {
  items: [{ id: itemId, price: newPriceId }],
  proration_behavior: 'create_prorations',
})
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `STRIPE_SECRET_KEY` | Stripe API |
| `SUPABASE_URL` | DB |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS |

---

## Acceptance Criteria

- [ ] `POST /api/stripe/update-subscription` accepts `{ token, newPriceId }`
- [ ] Token validated against `onboarding_tokens`
- [ ] Returns 409 if already on the requested plan
- [ ] Calls `stripe.subscriptions.update()` with proration
- [ ] Updates `subscriptions.stripe_price_id` and `billing_interval` in DB
- [ ] Updates `clients.tier` in DB
- [ ] Returns `{ success: true, newPlan: string }`
- [ ] "CHANGE PLAN" in ClientDashboard opens modal with tier selector
- [ ] Modal shows current plan as non-selectable; other plans selectable
- [ ] Success closes modal after 2-second delay with success message
- [ ] Error shown inline in modal
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `POST /api/stripe/update-subscription` | T15 client portal (wired here), T24 (event tracking) |

---

## Do Not

- Do not use `stripe.subscriptions.cancel()` here — that is T20
- Do not add new status values to `subscriptions` table
- Do not show all 6 price options (monthly + annual per tier) in the modal — annual only for simplicity
- Do not touch `app/api/stripe/webhook/route.ts` — `handleSubscriptionUpdated()` already handles the Stripe event
