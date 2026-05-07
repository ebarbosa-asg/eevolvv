# Task Brief: Payment Wall in ChatEngine.tsx

**ID:** T07
**PRD:** autonomous-sidegig-pivot
**Complexity:** 4/5
**Priority:** must
**Model:** sonnet
**Depends on:** T02, T03

---

## Objective

Replace the Calendly CTA block in `components/ChatEngine.tsx` (starting at line 480) with a tier selection payment wall showing Seed/Core/Evolve cards. Each card routes through `POST /api/stripe/checkout` to Stripe's hosted checkout. Annual pricing is shown by default with a monthly toggle. This is the primary revenue capture point — every diagnostic report ends here.

---

## Context

**Verify before starting:**
- `lib/stripe-prices.ts` exports `TIER_CONFIGS`, `getPriceId()` (T02 complete)
- `POST /api/stripe/checkout` exists and returns `{ url }` (T03 complete)

**Exact code to replace (ChatEngine.tsx lines 480–509):**

```tsx
{/* CTA */}
<div
  className="diagnostic-report-cta"
  style={{
    marginTop: 24, border: '1px solid var(--ink)',
    padding: '28px 32px',
    display: 'grid', gridTemplateColumns: '1fr auto',
    gap: 24, alignItems: 'center',
    opacity: revealStage >= 4 ? 1 : 0,
    transform: revealStage >= 4 ? 'translateY(0)' : 'translateY(12px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  }}
>
  <div>
    <div style={{ fontSize: 18, fontWeight: 500 }}>Ready to make this real?</div>
    <p style={{ fontSize: 13, opacity: 0.65, marginTop: 4 }}>
      Book your 30-min strategy call and let&apos;s build the roadmap together.
    </p>
  </div>
  <a
    href={calendlyUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="mono btn-gradient"
    style={{ padding: '16px 28px', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, whiteSpace: 'nowrap', display: 'inline-block' }}
    onClick={() => posthog.capture('diagnostic_cta_clicked', { cta: 'book_strategy_call', business_name: report?.businessName })}
  >
    BOOK STRATEGY CALL →
  </a>
</div>
```

**Design system rules (from CLAUDE.md):**
- Use `components/ds/` components — no raw Tailwind classes
- Tokens: `--paper`, `--ink`, `--accent`, `--rule`
- Section markers: JetBrains Mono, 11px, 0.22em tracking, accent color
- CTA buttons: use `className="mono btn-gradient"` for primary or `className="mono"` with border for secondary
- Section label format: `§ XX · LABEL` in mono

**ChatEngine.tsx phase state machine:**
- `phase` is `'chatting' | 'extracting' | 'report' | 'error'` (line 7)
- The CTA renders inside the `renderReport()` function which is called when `phase === 'report'`
- `revealStage` controls reveal animation — maintain this for the payment wall fade-in
- `report` object has `businessName`, `email`, `name` from the API response

**PostHog events already in ChatEngine.tsx:**
- `posthog.capture(...)` is called directly (PostHog loaded client-side via `posthog-js`)
- T24 adds `payment_wall_viewed`, `tier_selected`, `checkout_started` — add those placeholders here

---

## Implementation

### Files to Create

- `components/TierCards.tsx` — Extracted tier selection component

### Files to Modify

- `components/ChatEngine.tsx` — Replace Calendly CTA block (lines 480–509) with `<TierCards>` usage

### Step-by-Step

1. Create `components/TierCards.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { TIER_CONFIGS, getPriceId, type Tier } from '@/lib/stripe-prices'
import posthog from 'posthog-js'

interface TierCardsProps {
  email?: string
  visible?: boolean
}

export function TierCards({ email, visible = true }: TierCardsProps) {
  const [interval, setInterval] = useState<'annual' | 'monthly'>('annual')
  const [loading, setLoading] = useState<Tier | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSelectTier(tier: Tier) {
    const priceId = getPriceId(tier, interval)
    if (!priceId) {
      setError('Price configuration error. Please contact hello@eevolvv.com.')
      return
    }

    setLoading(tier)
    setError(null)

    // PostHog event — T24 will add more properties
    posthog.capture('tier_selected', { tier, interval, price: priceId })

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Checkout failed. Please try again.')
        setLoading(null)
        return
      }

      posthog.capture('checkout_started', { tier, interval })
      window.location.href = data.url
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(null)
    }
  }

  if (!visible) return null

  return (
    <div style={{
      marginTop: 24,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>
          § 04 · START BUILDING
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>
          Your roadmap is ready. Choose your build tier.
        </div>
      </div>

      {/* Annual/Monthly toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setInterval('annual')}
          className="mono"
          style={{
            padding: '6px 14px', fontSize: 10, letterSpacing: '0.18em', fontWeight: 600,
            background: interval === 'annual' ? 'var(--ink)' : 'transparent',
            color: interval === 'annual' ? 'var(--paper)' : 'var(--ink)',
            border: '1px solid var(--ink)', cursor: 'pointer',
          }}
        >
          ANNUAL
        </button>
        <button
          onClick={() => setInterval('monthly')}
          className="mono"
          style={{
            padding: '6px 14px', fontSize: 10, letterSpacing: '0.18em', fontWeight: 600,
            background: interval === 'monthly' ? 'var(--ink)' : 'transparent',
            color: interval === 'monthly' ? 'var(--paper)' : 'var(--ink)',
            border: '1px solid var(--ink)', cursor: 'pointer',
          }}
        >
          MONTHLY
        </button>
        {interval === 'annual' && (
          <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>
            2 MONTHS FREE
          </span>
        )}
      </div>

      {/* Tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }}>
        {TIER_CONFIGS.map((config, i) => {
          const price = config.prices[interval]
          const isCore = config.tier === 'core'
          const isLoading = loading === config.tier
          return (
            <div
              key={config.tier}
              style={{
                padding: '24px',
                borderRight: i < TIER_CONFIGS.length - 1 ? '1px solid var(--ink)' : 'none',
                background: isCore ? 'var(--ink)' : 'transparent',
                color: isCore ? 'var(--paper)' : 'var(--ink)',
                display: 'flex', flexDirection: 'column', position: 'relative',
              }}
            >
              {isCore && (
                <div className="mono" style={{
                  position: 'absolute', top: -12, left: 24,
                  background: 'var(--accent)', color: 'var(--paper)',
                  padding: '4px 10px', fontSize: 9, letterSpacing: '0.22em', fontWeight: 600,
                }}>
                  MOST POPULAR
                </div>
              )}
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 8 }}>
                {config.tier.toUpperCase()}
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>{config.name}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>{config.tagline}</div>

              <div style={{
                borderTop: `1px solid ${isCore ? 'rgba(244,241,234,0.18)' : 'var(--rule)'}`,
                paddingTop: 16, marginBottom: 16,
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {price.amountDisplay}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', opacity: 0.55, marginTop: 4 }}>
                  {interval === 'annual' ? '/ YEAR' : '/ MONTH'}
                </div>
                {price.annualSavingsDisplay && interval === 'annual' && (
                  <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 6, letterSpacing: '0.1em' }}>
                    {price.annualSavingsDisplay.toUpperCase()}
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', flex: 1 }}>
                {config.features.map((f, j) => (
                  <li key={j} style={{
                    display: 'grid', gridTemplateColumns: '14px 1fr', gap: 8,
                    padding: '5px 0', fontSize: 12, lineHeight: 1.5, opacity: 0.85,
                  }}>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mono" style={{ fontSize: 10, opacity: 0.5, marginBottom: 12, letterSpacing: '0.1em' }}>
                {config.buildSla.toUpperCase()}
              </div>

              <button
                onClick={() => handleSelectTier(config.tier)}
                disabled={loading !== null}
                className="mono"
                style={{
                  width: '100%', padding: '14px 0',
                  background: isCore ? 'var(--accent)' : 'transparent',
                  color: isCore ? 'var(--paper)' : 'var(--ink)',
                  border: isCore ? 'none' : '1px solid var(--ink)',
                  fontSize: 11, letterSpacing: '0.18em', fontWeight: 600,
                  cursor: loading !== null ? 'not-allowed' : 'pointer',
                  opacity: loading !== null && !isLoading ? 0.5 : 1,
                }}
              >
                {isLoading ? 'LOADING...' : `START ${config.name.toUpperCase()} →`}
              </button>
            </div>
          )
        })}
      </div>

      {error && (
        <div style={{
          marginTop: 12, padding: '12px 16px',
          background: 'rgba(140,43,26,0.08)', border: '1px solid var(--accent)',
          fontSize: 13, color: 'var(--accent)',
        }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.5 }}>
        All plans include a 30-day build delivery guarantee. Cancel anytime after month 3.
      </div>
    </div>
  )
}
```

2. In `components/ChatEngine.tsx`, find the report CTA block (lines 480–509) and replace it:

**Remove:**
```tsx
{/* CTA */}
<div className="diagnostic-report-cta" style={{ ... }}>
  ... (the entire calendly CTA block through line 509)
</div>
```

**Replace with:**
```tsx
{/* Payment wall — shown when report phase is complete */}
<TierCards
  email={report?.email}
  visible={revealStage >= 4}
/>
```

3. Add import at the top of `ChatEngine.tsx` (after existing imports):
```tsx
import { TierCards } from '@/components/TierCards'
```

4. Add PostHog event for `payment_wall_viewed` (T24 will expand this):
   In the effect or location where `revealStage` reaches 4, add:
   ```tsx
   // In useEffect watching revealStage:
   if (revealStage === 4) {
     posthog.capture('payment_wall_viewed', { trigger: 'chat_end' })
   }
   ```

5. Run `npm run build` — verify no TypeScript errors.

---

## Code Patterns to Follow

```tsx
// Existing ChatEngine PostHog pattern
posthog.capture('event_name', { property: value })

// Existing btn-gradient class usage (ChatEngine.tsx line 503)
className="mono btn-gradient"
style={{ padding: '16px 28px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600 }}

// revealStage animation pattern (ChatEngine.tsx line 488-490)
opacity: revealStage >= 4 ? 1 : 0,
transform: revealStage >= 4 ? 'translateY(0)' : 'translateY(12px)',
transition: 'opacity 0.6s ease, transform 0.6s ease',
```

---

## Environment Variables

No new env vars needed. The component calls `/api/stripe/checkout` which reads `STRIPE_SECRET_KEY`.

---

## Acceptance Criteria

- [ ] Payment wall appears after report delivery when `revealStage >= 4`
- [ ] Three tier cards: Seed, Core, Evolve — in that order
- [ ] Annual/Monthly toggle present; annual is the default selected state
- [ ] Core tier has "MOST POPULAR" badge
- [ ] Each card shows: tier name, price for selected interval, features list, build SLA, CTA button
- [ ] Annual pricing shows savings callout ("2 MONTHS FREE")
- [ ] Clicking CTA calls `POST /api/stripe/checkout` with correct `priceId` and user `email`
- [ ] On success, redirects to Stripe-hosted checkout URL
- [ ] Loading state shown on the clicked button during API call
- [ ] Error message shown below cards if API fails or network error
- [ ] Calendly CTA block fully removed from `ChatEngine.tsx`
- [ ] No raw Tailwind classes — styling via CSS custom properties
- [ ] `npm run build` passes with no type errors

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `components/TierCards.tsx` | T24 (PostHog events), T11 reference |
| `payment_wall_viewed` PostHog event placeholder | T24 (fully instruments) |

---

## Do Not

- Do not modify the ChatEngine phase state machine or report rendering logic — only replace the CTA block
- Do not remove `posthog` import from ChatEngine.tsx — it's used for other events
- Do not use `next/navigation`'s `router.push()` for the Stripe redirect — use `window.location.href`
- Do not hardcode price IDs — import from `lib/stripe-prices.ts`
- Do not add raw Tailwind classes (`text-red-500`, `flex`, etc.) — use CSS custom properties
- Do not block rendering while the checkout fetch is in flight — only disable the clicked button
