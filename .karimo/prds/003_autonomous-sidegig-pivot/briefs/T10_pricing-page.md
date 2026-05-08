# Task Brief: Standalone /pricing Page

**ID:** T10
**PRD:** autonomous-sidegig-pivot
**Complexity:** 2/5
**Priority:** must
**Model:** sonnet
**Depends on:** T02

---

## Objective

Build `app/pricing/page.tsx` — a standalone, SEO-optimized pricing page displaying all three subscription tiers with an annual/monthly toggle. CTAs capture email inline before redirecting to Stripe checkout. This page is the destination for all "Start Building →" CTAs from the homepage and follow-up emails.

---

## Context

**Verify before starting:**
- `lib/stripe-prices.ts` exports `TIER_CONFIGS` (T02 complete)
- `app/api/stripe/checkout/route.ts` exists (T03 likely in progress — this page calls it)

**Existing pricing section in `app/page.tsx` (lines 1000–1055):**
The homepage `Pricing` function uses a 5-tier grid with `TIERS` data array. The new standalone page replaces this with the 3-tier subscription model only (Seed/Core/Evolve). The homepage pricing section will be updated in T11.

**Design patterns from `app/page.tsx`:**
- `SectionHeader` component (defined inline in page.tsx) — copy the pattern, don't import it
- Grid layout: `display: 'grid', gridTemplateColumns: 'repeat(3,1fr)'` with border separation
- Core tier highlighted with `background: 'var(--ink)', color: 'var(--paper)'`
- Section markers: `<div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)' }}>`
- Annual badge pattern for "MOST POPULAR"

**This is a Server Component** (no `'use client'` directive) — the pricing data is static. The `PricingTiers` client component handles the toggle and CTA interaction.

**SEO metadata:** Use Next.js App Router `export const metadata` pattern.

---

## Implementation

### Files to Create

- `app/pricing/page.tsx` — Server component with SEO metadata
- `app/pricing/PricingTiers.tsx` — Client component for interactive tier cards + email capture

### Files to Modify

None.

### Step-by-Step

1. Create `app/pricing/PricingTiers.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { TIER_CONFIGS, getPriceId, type Tier } from '@/lib/stripe-prices'

export function PricingTiers() {
  const [interval, setInterval] = useState<'annual' | 'monthly'>('annual')
  const [emailInputs, setEmailInputs] = useState<Record<Tier, string>>({ seed: '', core: '', evolve: '' })
  const [loading, setLoading] = useState<Tier | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleStart(tier: Tier) {
    const email = emailInputs[tier].trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(e => ({ ...e, [tier]: 'Enter a valid email to continue.' }))
      return
    }
    setErrors(e => ({ ...e, [tier]: '' }))
    setLoading(tier)

    const priceId = getPriceId(tier, interval)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setErrors(e => ({ ...e, [tier]: data.error ?? 'Something went wrong. Try again.' }))
        setLoading(null)
      }
    } catch {
      setErrors(e => ({ ...e, [tier]: 'Network error. Please try again.' }))
      setLoading(null)
    }
  }

  return (
    <>
      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
        {(['annual', 'monthly'] as const).map(opt => (
          <button
            key={opt}
            onClick={() => setInterval(opt)}
            className="mono"
            style={{
              padding: '8px 18px', fontSize: 10, letterSpacing: '0.18em', fontWeight: 600,
              background: interval === opt ? 'var(--ink)' : 'transparent',
              color: interval === opt ? 'var(--paper)' : 'var(--ink)',
              border: '1px solid var(--ink)', cursor: 'pointer',
            }}
          >
            {opt.toUpperCase()}
          </button>
        ))}
        {interval === 'annual' && (
          <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>
            2 MONTHS FREE ON ANNUAL
          </span>
        )}
      </div>

      {/* Tier grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }}>
        {TIER_CONFIGS.map((config, i) => {
          const price = config.prices[interval]
          const isCore = config.tier === 'core'
          const isLoading = loading === config.tier
          return (
            <div
              key={config.tier}
              style={{
                padding: 32,
                borderRight: i < 2 ? '1px solid var(--ink)' : 'none',
                background: isCore ? 'var(--ink)' : 'transparent',
                color: isCore ? 'var(--paper)' : 'var(--ink)',
                display: 'flex', flexDirection: 'column', position: 'relative',
              }}
            >
              {isCore && (
                <div className="mono" style={{
                  position: 'absolute', top: -12, left: 32,
                  background: 'var(--accent)', color: 'var(--paper)',
                  padding: '4px 10px', fontSize: 9, letterSpacing: '0.22em', fontWeight: 700,
                }}>
                  MOST POPULAR
                </div>
              )}
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.5, marginBottom: 10 }}>
                {config.tier.toUpperCase()}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                {config.name}
              </div>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 24, lineHeight: 1.5 }}>
                {config.tagline}
              </div>

              <div style={{
                borderTop: `1px solid ${isCore ? 'rgba(244,241,234,0.18)' : 'var(--rule)'}`,
                paddingTop: 20, marginBottom: 20,
              }}>
                <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em' }}>
                  {price.amountDisplay}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', opacity: 0.5, marginTop: 4 }}>
                  {interval === 'annual' ? '/ YEAR · BILLED ONCE' : '/ MONTH · CANCEL ANYTIME'}
                </div>
                {price.annualSavingsDisplay && interval === 'annual' && (
                  <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 8, letterSpacing: '0.1em' }}>
                    {price.annualSavingsDisplay.toUpperCase()}
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                {config.features.map((f, j) => (
                  <li key={j} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 10, padding: '7px 0', fontSize: 13, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span style={{ opacity: 0.85 }}>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mono" style={{ fontSize: 10, opacity: 0.45, marginBottom: 16, letterSpacing: '0.1em' }}>
                {config.buildSla.toUpperCase()}
              </div>

              {/* Email capture + CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={emailInputs[config.tier]}
                  onChange={e => setEmailInputs(prev => ({ ...prev, [config.tier]: e.target.value }))}
                  style={{
                    padding: '11px 14px',
                    border: `1px solid ${isCore ? 'rgba(244,241,234,0.3)' : 'var(--rule)'}`,
                    background: 'transparent',
                    color: isCore ? 'var(--paper)' : 'var(--ink)',
                    fontSize: 13, outline: 'none', fontFamily: 'inherit',
                  }}
                />
                {errors[config.tier] && (
                  <div style={{ fontSize: 11, color: 'var(--accent)' }}>{errors[config.tier]}</div>
                )}
                <button
                  onClick={() => handleStart(config.tier)}
                  disabled={loading !== null}
                  className="mono"
                  style={{
                    padding: '14px 0', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700,
                    background: isCore ? 'var(--accent)' : 'var(--ink)',
                    color: 'var(--paper)',
                    border: 'none', cursor: loading !== null ? 'not-allowed' : 'pointer',
                    opacity: loading !== null && !isLoading ? 0.5 : 1,
                  }}
                >
                  {isLoading ? 'LOADING...' : `START ${config.name.toUpperCase()} →`}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 80 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 24, fontWeight: 600 }}>
          § 02 · COMMON QUESTIONS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Monthly plans cancel at end of billing period. Annual plans are non-refundable after the build starts.' },
            { q: 'What if my build takes longer than the SLA?', a: 'We extend your subscription by the delay — free of charge. SLA guarantees apply from when your technician claims your build.' },
            { q: 'Can I upgrade from Seed to Core?', a: 'Yes. Upgrade at any time from your client portal. Stripe prorates the difference automatically.' },
            { q: 'What does "managed service" mean?', a: 'We host, monitor, update, and maintain your build. You get a monthly report and one content/agent update per month included.' },
          ].map(({ q, a }) => (
            <div key={q}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>{q}</div>
              <div style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
```

2. Create `app/pricing/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { PricingTiers } from './PricingTiers'

export const metadata: Metadata = {
  title: 'Pricing — eevolvv | AI-Managed Business Builds',
  description: 'Seed from $99/mo, Core from $499/mo, Evolve from $1,999/mo. Annual pricing saves 2 months. AI-built and managed — landing pages, web apps, and full-stack systems.',
  openGraph: {
    title: 'Pricing — eevolvv',
    description: 'AI-built and managed business systems. Seed, Core, and Evolve tiers.',
    url: 'https://eevolvv.com/pricing',
  },
}

export default function PricingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '80px 32px' }}>
      <div className="site-rail mx-auto">
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 01 · PRICING
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 16px', color: 'var(--ink)', lineHeight: 1.1 }}>
            Every business has a<br />starting point.
          </h1>
          <p style={{ fontSize: 17, opacity: 0.65, maxWidth: 540, margin: 0, lineHeight: 1.6 }}>
            A service, not software. We build, host, monitor, and maintain your AI-powered system — so you can focus on your business.
          </p>
        </div>

        <PricingTiers />

        {/* Bottom CTA */}
        <div style={{ marginTop: 80, padding: '40px', border: '1px solid var(--ink)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>NOT SURE WHERE TO START?</div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>Get your free AI diagnostic first.</div>
            <p style={{ fontSize: 14, opacity: 0.65, margin: '6px 0 0', lineHeight: 1.5 }}>The diagnostic tells you exactly which tier fits your business and why.</p>
          </div>
          <a
            href="/#diagnostic"
            className="mono"
            style={{ padding: '16px 28px', background: 'var(--ink)', color: 'var(--paper)', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            GET FREE REPORT →
          </a>
        </div>
      </div>
    </main>
  )
}
```

---

## Code Patterns to Follow

```tsx
// Next.js metadata export pattern (App Router)
export const metadata: Metadata = { title: '...', description: '...' }

// Server component + client component split
// page.tsx = Server, PricingTiers.tsx = 'use client'

// Section marker style (from app/page.tsx:1006)
<div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
  § 01 · PRICING
</div>
```

---

## Environment Variables

No new env vars needed.

---

## Acceptance Criteria

- [ ] `GET /pricing` renders without authentication
- [ ] Page has proper SEO metadata: title, description, OpenGraph
- [ ] Three tier columns: Seed, Core, Evolve
- [ ] Annual/Monthly toggle — annual shown by default
- [ ] Annual pricing shows "2 months free" savings callout
- [ ] Core tier has "MOST POPULAR" badge
- [ ] Each tier shows: name, price, features list (5+ items), build SLA
- [ ] Each tier has an email input field + "Start [Tier] →" button
- [ ] Invalid email shows error message inline
- [ ] Valid email + button click calls `POST /api/stripe/checkout` and redirects to Stripe URL
- [ ] FAQ section present (minimum 4 questions)
- [ ] Bottom CTA links to `/#diagnostic`
- [ ] Uses eevolvv design tokens (no raw Tailwind, no hardcoded hex except in CSS)
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `GET /pricing` page URL | T03 (`cancel_url`), T11 (homepage links here), T12 (follow-up emails link here) |
| `app/pricing/PricingTiers.tsx` | T11 (reference for homepage update) |

---

## Do Not

- Do not add authentication to this route — must be publicly accessible
- Do not use the old 5-tier pricing data from `app/page.tsx` — use `TIER_CONFIGS` from `lib/stripe-prices.ts`
- Do not use router.push() for Stripe redirect — use `window.location.href`
- Do not add the Evolve Retainer "add-on" band from the old homepage — out of scope for this task
- Do not import from `app/page.tsx` — it's a client component and mixing would break server rendering
