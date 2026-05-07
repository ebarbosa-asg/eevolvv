# Task Brief: PostHog Funnel Tracking

**ID:** T24
**PRD:** autonomous-sidegig-pivot
**Complexity:** 2/5
**Priority:** should
**Model:** sonnet
**Depends on:** T07, T09, T16

---

## Objective

Instrument the full conversion funnel with PostHog events at 8 key touchpoints — from `diagnostic_started` to `build_live`. Client-side events use `posthog-js` (already imported in `ChatEngine.tsx`). Server-side events use the PostHog Node.js client (`lib/posthog-server.ts`). No PII in event properties.

---

## Context

**Verify before starting:**
- `components/TierCards.tsx` exists (T07 complete)
- `app/onboard/[token]/OnboardingForm.tsx` exists (T09 complete)
- `app/os/builds/BuildQueueTable.tsx` exists (T16 complete)

**Existing PostHog pattern — `app/api/diagnostic/route.ts` (server-side):**
```typescript
import { getPostHogClient } from '@/lib/posthog-server'
// ...
const ph = getPostHogClient()
ph.capture({ distinctId: email, event: 'event_name', properties: { ... } })
await ph.shutdown()
```

**Existing PostHog pattern — `components/ChatEngine.tsx` (client-side):**
```typescript
import posthog from 'posthog-js'
// ...
posthog.capture('diagnostic_cta_clicked', { cta: 'book_strategy_call', business_name: report?.businessName })
```

**PostHog Node.js client is already set up** at `lib/posthog-server.ts`:
```typescript
import { PostHog } from 'posthog-node'
export function getPostHogClient() {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST, flushAt: 1, flushInterval: 0,
  })
}
```

**No PII rule:** Never include `email` in event properties. Use `client_id` (UUID) instead of email. Use `business_type`, `industry` instead of business name. Use `submission_id` for diagnostic events.

**8 events to implement:**

| Event | Where | Client/Server | Trigger |
|-------|-------|--------------|---------|
| `diagnostic_started` | `ChatEngine.tsx` | client | First user message |
| `report_generated` | `app/api/diagnostic/route.ts` | server | Successful report send |
| `payment_wall_viewed` | `ChatEngine.tsx` | client | TierCards render (revealStage ≥ 4) |
| `tier_selected` | `components/TierCards.tsx` | client | CTA button clicked |
| `checkout_completed` | `lib/webhook-handlers.ts` | server | `checkout.session.completed` |
| `onboarding_completed` | `app/onboard/[token]/OnboardingForm.tsx` | client | Form submitted successfully |
| `build_started` | `app/os/builds/BuildQueueTable.tsx` | client | Status → `in_progress` |
| `build_live` | `app/os/builds/BuildQueueTable.tsx` | client | Status → `live` |

---

## Implementation

### Files to Modify

- `components/ChatEngine.tsx` — Add `diagnostic_started`, `payment_wall_viewed`
- `components/TierCards.tsx` — Update/confirm `tier_selected`, `checkout_started` (T07 added placeholders)
- `app/api/diagnostic/route.ts` — Update `report_generated` (already has `diagnostic_report_generated` — rename/supplement)
- `lib/webhook-handlers.ts` — Add `checkout_completed`
- `app/onboard/[token]/OnboardingForm.tsx` — Add `onboarding_completed`
- `app/os/builds/BuildQueueTable.tsx` — Add `build_started`, `build_live`

### Files to Create

None.

### Step-by-Step

**1. `components/ChatEngine.tsx` — Add `diagnostic_started`:**

Find where the first user message is sent (the `handleSend` function or where `phase` changes from `chatting`). The first time a user message is sent, capture:

```typescript
// In handleSend() or wherever the first message is processed:
if (userMsgCount === 0) {
  posthog.capture('diagnostic_started', {
    source: document.referrer?.includes('pricing') ? 'pricing' : 'homepage',
  })
}
```

**Add `payment_wall_viewed`:** Find the `useEffect` watching `revealStage`. When `revealStage` reaches 4 (or wherever TierCards become visible):

```typescript
useEffect(() => {
  if (revealStage === 4) {
    posthog.capture('payment_wall_viewed', { trigger: 'chat_end' })
  }
}, [revealStage])
```

**2. `components/TierCards.tsx` — Confirm/update events:**

T07 added `tier_selected` and `checkout_started` already. Verify they have the correct properties per the acceptance criteria:

```typescript
// tier_selected — on CTA click, before API call:
posthog.capture('tier_selected', { tier, interval, price: price.amountDisplay })

// checkout_started — after successful API response with URL:
posthog.capture('checkout_started', { tier, interval })
```

These should already be in place from T07. Just verify the properties match.

**3. `app/api/diagnostic/route.ts` — Update `report_generated`:**

The existing event is `diagnostic_report_generated`. The PRD specifies `report_generated`. Add the new event name alongside (or replace). The existing event fires at line 183-195:

```typescript
ph.capture({
  distinctId: submissionId ?? ip,     // use submission_id, not email, as distinctId
  event: 'report_generated',           // rename from diagnostic_report_generated
  properties: {
    industry,
    node_count: 12,                     // hardcoded — all reports have 12 nodes
    business_type: businessType,
    duration_ms: durationMs,
  },
})
```

Note: `distinctId` was `email` before — change to `submissionId ?? ip` to avoid PII.

**4. `lib/webhook-handlers.ts` — Add `checkout_completed`:**

In `handleCheckoutSessionCompleted()`, after successful `createClientRecord()` call:

```typescript
import { getPostHogClient } from '@/lib/posthog-server'

// After createClientRecord() succeeds:
const ph = getPostHogClient()
ph.capture({
  distinctId: clientId,  // the DB client UUID, not email
  event: 'checkout_completed',
  properties: {
    tier: session.metadata?.tier ?? '',
    interval: session.metadata?.interval ?? '',
    amount: session.amount_total ? session.amount_total / 100 : null,
  },
})
await ph.shutdown()
```

**5. `app/onboard/[token]/OnboardingForm.tsx` — Add `onboarding_completed`:**

In the form submit handler, after successful API response:

```typescript
import posthog from 'posthog-js'

// After setSubmitted(true):
const completedAt = Date.now()
posthog.capture('onboarding_completed', {
  tier,
  time_to_complete_minutes: Math.round((completedAt - pageLoadTime) / 60000),
})
```

Add `pageLoadTime` state:
```typescript
const [pageLoadTime] = useState(() => Date.now())
```

**6. `app/os/builds/BuildQueueTable.tsx` — Add `build_started` and `build_live`:**

In the `updateStatus` function, after the successful API response:

```typescript
import posthog from 'posthog-js'

// After res.ok check:
if (status === 'in_progress') {
  posthog.capture('build_started', {
    tier: build.tier,
    client_id: build.clients?.id,  // UUID, not email
  })
}
if (status === 'live') {
  const daysSinceCreated = build.created_at
    ? Math.round((Date.now() - new Date(build.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : null
  posthog.capture('build_live', {
    tier: build.tier,
    build_url: buildUrl ?? build.build_url,
    days_to_deliver: daysSinceCreated,
    client_id: build.clients?.id,
  })
}
```

---

## Code Patterns to Follow

```typescript
// Server-side PostHog (from app/api/diagnostic/route.ts lines 181-195)
const ph = getPostHogClient()
ph.capture({ distinctId: submissionId, event: 'event_name', properties: { ... } })
await ph.shutdown()

// Client-side PostHog (from ChatEngine.tsx line 505)
posthog.capture('event_name', { property: value })

// No PII rule
// WRONG: properties: { email, name }
// RIGHT: properties: { client_id, tier, industry }
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | PostHog client (already set) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (already set) |

No new env vars needed — PostHog is already configured.

---

## Acceptance Criteria

- [ ] `diagnostic_started` fires in `ChatEngine.tsx` on first user message; properties: `{ source }`
- [ ] `report_generated` fires in `app/api/diagnostic/route.ts` on successful report; properties: `{ industry, node_count }`; `distinctId` is not email
- [ ] `payment_wall_viewed` fires in `ChatEngine.tsx` when `revealStage >= 4`; properties: `{ trigger: 'chat_end' }`
- [ ] `tier_selected` fires in `TierCards.tsx` on CTA click; properties: `{ tier, interval, price }`
- [ ] `checkout_completed` fires in `lib/webhook-handlers.ts` on successful payment; properties: `{ tier, interval, amount }`
- [ ] `onboarding_completed` fires in `OnboardingForm.tsx` on successful submission; properties: `{ tier, time_to_complete_minutes }`
- [ ] `build_started` fires in `BuildQueueTable.tsx` when status transitions to `in_progress`; properties: `{ tier, client_id }`
- [ ] `build_live` fires in `BuildQueueTable.tsx` when status transitions to `live`; properties: `{ tier, build_url, days_to_deliver, client_id }`
- [ ] No `email`, `name`, or other PII in any event properties
- [ ] Server-side events use `getPostHogClient()` with `await ph.shutdown()`
- [ ] Client-side events use `posthog.capture()` directly
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| Full funnel tracking in PostHog | E (human analyzes funnel) — no downstream code |

---

## Do Not

- Do not include email, name, or any personally identifiable information in event properties
- Do not add PostHog to server components — only in API routes (server) or client components (browser)
- Do not add `await ph.shutdown()` in client-side code — only in server-side `getPostHogClient()` usage
- Do not fire `build_started` or `build_live` from the server — these are internal OS events, client-side only
- Do not change the PostHog configuration in `lib/posthog-server.ts` — it's already correct
- Do not add new env vars — PostHog is fully configured
