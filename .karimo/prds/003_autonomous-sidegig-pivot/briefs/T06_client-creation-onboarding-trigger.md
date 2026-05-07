# Task Brief: Webhook → Client Creation + Onboarding Trigger

**ID:** T06
**PRD:** autonomous-sidegig-pivot
**Complexity:** 5/5
**Priority:** must
**Model:** opus
**Depends on:** T04, T05

---

## Objective

Implement the full `createClientRecord()` function in `lib/webhook-handlers.ts`, replacing the stub left by T04. This function is the automation bridge: when a Stripe checkout completes, it atomically creates the client record, subscription record, onboarding token, initial build queue entry, and triggers welcome emails — all idempotently. This is the highest-complexity task in the pipeline because failure here means a paying client gets no onboarding.

---

## Context

**Verify before starting:**
- `lib/webhook-handlers.ts` exists with `createClientRecord()` stub (T04 complete)
- Tables `clients`, `subscriptions`, `builds`, `onboarding_tokens` exist (T05 complete)
- `emails/WelcomeEmail.tsx` and `lib/email-helpers.ts` exist with `sendWelcomeEmail()` and `sendOnboardingEmail()` (T08 complete)

**Note on task ordering:** T06 depends on T08 for `sendWelcomeEmail()` and `sendOnboardingEmail()`. If implementing before T08 is complete, add stub calls and wire them properly when T08 is done.

**Pattern: `app/api/os/clients/[id]/agents/[agentId]/run/route.ts`:**
- `import { supabase } from '@/lib/supabase'`
- Guard: `if (!supabase) return ...`
- Select with `.single()` and destructure `{ data, error }`
- Insert with `.insert(data).select().single()`
- Update with `.update({...}).eq('id', id)`

**Pattern: `app/api/diagnostic/route.ts`:**
- Non-blocking side effects: `(async () => { ... })()` for email sending
- Try/catch wrapping all async operations
- `console.error('[module]', err)` logging

**Supabase client (from `lib/supabase.ts`):**
```typescript
import { supabase } from '@/lib/supabase'
// Uses service role key — bypasses RLS
// Returns null if env vars not set
```

**Idempotency requirement:** `stripe_subscription_id` has a UNIQUE constraint. Use `upsert` or check for existing record before inserting. If the checkout webhook fires twice for the same session, the second call must be a no-op (no duplicate client, no duplicate email).

**Tier derivation:** Use `getTierFromPriceId()` from `lib/stripe-prices.ts`. The price ID is in `session.line_items[0].price.id` (requires expanding line_items) OR in `session.metadata.tier` which T03 set. Use `session.metadata.tier` as primary, with price ID as fallback.

---

## Implementation

### Files to Modify

- `lib/webhook-handlers.ts` — Replace `createClientRecord()` stub with full implementation

### Files to Create

None.

### Step-by-Step

1. Open `lib/webhook-handlers.ts` (created by T04).

2. Add imports at top:
```typescript
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'
import { getTierFromPriceId, type Tier } from '@/lib/stripe-prices'
// Import email helpers once T08 is complete:
import { sendWelcomeEmail, sendOnboardingEmail } from '@/lib/email-helpers'
```

3. Replace the `createClientRecord()` stub with full implementation:

```typescript
export async function createClientRecord(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (!supabase) {
    console.error('[webhook-handlers] Supabase not configured — cannot create client record')
    return
  }

  const sessionId = session.id
  const email = session.customer_details?.email ?? session.customer_email ?? ''
  const name = session.customer_details?.name ?? ''
  const stripeCustomerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id ?? ''

  // Derive tier from metadata (set by T03) or fall back to price ID
  let tier: Tier = (session.metadata?.tier as Tier) ?? null
  if (!tier && session.amount_total) {
    // Last resort: check subscription metadata from expanded data
    const subId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id ?? ''
    tier = 'seed' // default
    console.warn('[webhook-handlers] Could not derive tier from metadata, defaulting to seed')
  }

  const interval = (session.metadata?.interval as 'monthly' | 'annual') ?? 'monthly'
  const stripeSubscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id ?? ''

  if (!email || !stripeSubscriptionId) {
    console.error('[webhook-handlers] Missing required fields', { email, stripeSubscriptionId, sessionId })
    return
  }

  // ── Idempotency check ──────────────────────────────────────
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id, client_id')
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .maybeSingle()

  if (existingSub) {
    console.log('[webhook-handlers] createClientRecord: already processed', stripeSubscriptionId)
    return
  }

  // ── Create or find client ──────────────────────────────────
  let clientId: string

  // Check if client already exists by email
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existingClient) {
    clientId = existingClient.id
    // Update client with latest Stripe info
    await supabase
      .from('clients')
      .update({
        stripe_customer_id: stripeCustomerId,
        tier,
        churn_risk: false,
      })
      .eq('id', clientId)
  } else {
    // Create new client record
    const { data: newClient, error: clientErr } = await supabase
      .from('clients')
      .insert({
        email,
        name,
        company: name, // company = name at signup; technician can update later
        stripe_customer_id: stripeCustomerId,
        tier,
        churn_risk: false,
      })
      .select('id')
      .single()

    if (clientErr || !newClient) {
      console.error('[webhook-handlers] Failed to create client:', clientErr?.message)
      return
    }
    clientId = newClient.id
  }

  // ── Create subscription record ─────────────────────────────
  const { error: subErr } = await supabase
    .from('subscriptions')
    .insert({
      client_id: clientId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_price_id: session.metadata?.priceId ?? '',
      status: 'active',
      billing_interval: interval,
      current_period_end: null, // Updated when Stripe sends subscription.updated event
    })

  if (subErr) {
    console.error('[webhook-handlers] Failed to create subscription:', subErr.message)
    return
  }

  // ── Create onboarding token ────────────────────────────────
  const { data: tokenRow, error: tokenErr } = await supabase
    .from('onboarding_tokens')
    .insert({
      client_id: clientId,
      // token is auto-generated by DB default: encode(gen_random_bytes(32), 'hex')
      status: 'pending',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select('token')
    .single()

  if (tokenErr || !tokenRow) {
    console.error('[webhook-handlers] Failed to create onboarding token:', tokenErr?.message)
    return
  }

  // ── Create initial build record ────────────────────────────
  const { error: buildErr } = await supabase
    .from('builds')
    .insert({
      client_id: clientId,
      tier,
      status: 'queued',
    })

  if (buildErr) {
    console.error('[webhook-handlers] Failed to create build record:', buildErr?.message)
    // Non-fatal — continue to send emails
  }

  // ── Send emails (non-blocking) ─────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'
  const onboardingUrl = `${baseUrl}/onboard/${tokenRow.token}`
  const firstName = name.split(' ')[0] || 'there'

  ;(async () => {
    try {
      await sendWelcomeEmail({ email, name: firstName, tier })
      await sendOnboardingEmail({ email, name: firstName, tier, token: tokenRow.token })
    } catch (err) {
      console.error('[webhook-handlers] Email send failed:', err)
      // Non-fatal — client record exists, emails can be re-sent manually
    }
  })()

  console.log('[webhook-handlers] createClientRecord complete', {
    clientId,
    tier,
    stripeSubscriptionId,
    onboardingUrl,
  })
}
```

4. Update `handleCheckoutSessionCompleted` to call the full function (it should already — verify the stub was the only thing calling it).

5. Run `npm run build` to verify TypeScript compiles.

---

## Code Patterns to Follow

```typescript
// Idempotency pattern
const { data: existing } = await supabase
  .from('subscriptions')
  .select('id')
  .eq('stripe_subscription_id', stripeSubscriptionId)
  .maybeSingle()
if (existing) return // already processed

// Non-blocking email (from diagnostic/route.ts:158-178)
;(async () => {
  try {
    await sendEmail(...)
  } catch (err) {
    console.error('[module]', err)
  }
})()

// Supabase insert with error check
const { data, error } = await supabase
  .from('table')
  .insert({ ... })
  .select('id')
  .single()
if (error || !data) {
  console.error('[webhook-handlers]', error?.message)
  return
}
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `SUPABASE_URL` | DB client |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS for server-side writes |
| `NEXT_PUBLIC_BASE_URL` | Constructs onboarding URL |

---

## Acceptance Criteria

- [ ] Second call with same `stripe_subscription_id` is a no-op (idempotent)
- [ ] Creates `clients` record with `email`, `name`, `stripe_customer_id`, `tier`
- [ ] If client email already exists, updates `stripe_customer_id` and `tier` instead of inserting duplicate
- [ ] Creates `subscriptions` record with `client_id`, `stripe_subscription_id`, `status: 'active'`, `billing_interval`
- [ ] Creates `onboarding_tokens` record with `client_id`, auto-generated `token`, 30-day `expires_at`
- [ ] Creates `builds` record with `status: 'queued'`, `tier`
- [ ] Calls `sendWelcomeEmail()` and `sendOnboardingEmail()` non-blocking
- [ ] Entire function wrapped in logic that never throws — all errors logged
- [ ] Missing email or subscription ID causes early return with error log (not crash)
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `clients` records in DB | T09, T14, T15, T16, T21, T22 |
| `subscriptions` records in DB | T14, T15, T18, T19, T20, T21 |
| `onboarding_tokens.token` | T09, T15, T19, T20 |
| `builds` records with `status: queued` | T16, T17 |
| Client email sent immediately | T12 (follow-up checks for existing clients) |

---

## Do Not

- Do not move this function out of `lib/webhook-handlers.ts` — T04 imports from there
- Do not implement this inline in the webhook route — keep it in the handler library
- Do not block on email sending — use the non-blocking pattern
- Do not use `upsert` for clients if checking by email — the idempotency check is on `stripe_subscription_id`, not email
- Do not throw errors — log and return
- Do not touch `app/api/stripe/webhook/route.ts` beyond what T04 set up
