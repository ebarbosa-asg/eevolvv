# Task Brief: Stripe Billing Setup

**ID:** T02
**PRD:** autonomous-sidegig-pivot
**Complexity:** 2/5
**Priority:** must
**Model:** sonnet
**Depends on:** T01

---

## Objective

Create 6 Stripe products/prices in the Stripe dashboard (manual step by E), then create `lib/stripe-prices.ts` exporting typed constants that map tier + interval to price IDs read from environment variables. This file is the single source of truth for price IDs referenced by T03 (checkout), T07 (payment wall), T10 (pricing page), and T11 (homepage).

---

## Context

This task is split: E manually creates products in Stripe, then the code file is created referencing those product IDs via env vars (already added to `.env.example` in T01).

**Pricing structure (from PRD):**
| Tier | Monthly | Annual | Savings |
|------|---------|--------|---------|
| Seed | $99/mo | $950/yr | 2 months free ($238 off) |
| Core | $499/mo | $4,790/yr | 2 months free ($1,198 off) |
| Evolve | $1,999/mo | $19,190/yr | 2 months free ($4,798 off) |

Annual plans are priced at "2 months free" discount (10 months × monthly price).

**Pattern:** `lib/supabase.ts` shows how to read from env vars and export. `lib/stripe.ts` (T01) shows the singleton client pattern.

---

## Implementation

### Files to Create

- `lib/stripe-prices.ts` — typed constants for all 6 price IDs, tier feature lists, and display metadata
- `docs/stripe-products.md` — documentation for E to follow when creating products in Stripe dashboard

### Files to Modify

- `.env.example` — already updated in T01; no additional changes needed

### Step-by-Step

**Part 1 — Stripe Dashboard (E does this manually):**

Create 6 products in the Stripe dashboard at https://dashboard.stripe.com/products:

1. **Seed — Monthly**
   - Product name: `eevolvv Seed`
   - Price: $99.00 USD / month
   - Billing: Recurring, monthly
   - Lookup key: `seed_monthly`

2. **Seed — Annual**
   - Product name: `eevolvv Seed`
   - Add another price to same product
   - Price: $950.00 USD / year
   - Billing: Recurring, yearly
   - Lookup key: `seed_annual`

3. **Core — Monthly**
   - Product name: `eevolvv Core`
   - Price: $499.00 USD / month
   - Lookup key: `core_monthly`

4. **Core — Annual**
   - Product name: `eevolvv Core`
   - Price: $4,790.00 USD / year
   - Lookup key: `core_annual`

5. **Evolve — Monthly**
   - Product name: `eevolvv Evolve`
   - Price: $1,999.00 USD / month
   - Lookup key: `evolve_monthly`

6. **Evolve — Annual**
   - Product name: `eevolvv Evolve`
   - Price: $19,190.00 USD / year
   - Lookup key: `evolve_annual`

After creating, copy each `price_XXXX` ID into `.env.local` for the corresponding variable.

**Part 2 — Code:**

Create `lib/stripe-prices.ts`:

```typescript
export type Tier = 'seed' | 'core' | 'evolve'
export type Interval = 'monthly' | 'annual'

export interface PriceConfig {
  priceId: string
  tier: Tier
  interval: Interval
  amountCents: number
  amountDisplay: string
  annualSavingsDisplay?: string
}

export interface TierConfig {
  tier: Tier
  name: string
  tagline: string
  buildSla: string
  features: string[]
  prices: {
    monthly: PriceConfig
    annual: PriceConfig
  }
}

export const PRICE_IDS = {
  seed: {
    monthly: process.env.STRIPE_PRICE_SEED_MONTHLY ?? '',
    annual:  process.env.STRIPE_PRICE_SEED_ANNUAL  ?? '',
  },
  core: {
    monthly: process.env.STRIPE_PRICE_CORE_MONTHLY ?? '',
    annual:  process.env.STRIPE_PRICE_CORE_ANNUAL  ?? '',
  },
  evolve: {
    monthly: process.env.STRIPE_PRICE_EVOLVE_MONTHLY ?? '',
    annual:  process.env.STRIPE_PRICE_EVOLVE_ANNUAL  ?? '',
  },
} as const

export const TIER_CONFIGS: TierConfig[] = [
  {
    tier: 'seed',
    name: 'Seed',
    tagline: 'Your foundation. Automated.',
    buildSla: '72-hour build SLA',
    features: [
      'Landing page + 1 automation workflow',
      '72-hour build delivery',
      'Hosting + uptime monitoring',
      '1 content update per month',
      'Monthly performance summary',
    ],
    prices: {
      monthly: {
        priceId: PRICE_IDS.seed.monthly,
        tier: 'seed',
        interval: 'monthly',
        amountCents: 9900,
        amountDisplay: '$99',
      },
      annual: {
        priceId: PRICE_IDS.seed.annual,
        tier: 'seed',
        interval: 'annual',
        amountCents: 95000,
        amountDisplay: '$950',
        annualSavingsDisplay: 'Save $238 — 2 months free',
      },
    },
  },
  {
    tier: 'core',
    name: 'Core',
    tagline: 'AI-powered. Always on.',
    buildSla: '7–10 day build SLA',
    features: [
      'Web app + 3–5 AI agents',
      'CRM, calendar, and tool integrations',
      '7–10 day build delivery',
      'Hosting + monitoring',
      '2 agent updates per month',
      'Monthly performance report',
    ],
    prices: {
      monthly: {
        priceId: PRICE_IDS.core.monthly,
        tier: 'core',
        interval: 'monthly',
        amountCents: 49900,
        amountDisplay: '$499',
      },
      annual: {
        priceId: PRICE_IDS.core.annual,
        tier: 'core',
        interval: 'annual',
        amountCents: 479000,
        amountDisplay: '$4,790',
        annualSavingsDisplay: 'Save $1,198 — 2 months free',
      },
    },
  },
  {
    tier: 'evolve',
    name: 'Evolve',
    tagline: 'Full-stack. Fully managed.',
    buildSla: '14–21 day build SLA',
    features: [
      'Full-stack build + CRM/ERP integrations',
      'Custom dashboards + data pipelines',
      '14–21 day build delivery',
      'Full managed service',
      'Quarterly re-calibration sessions',
      'Monthly stakeholder report',
    ],
    prices: {
      monthly: {
        priceId: PRICE_IDS.evolve.monthly,
        tier: 'evolve',
        interval: 'monthly',
        amountCents: 199900,
        amountDisplay: '$1,999',
      },
      annual: {
        priceId: PRICE_IDS.evolve.annual,
        tier: 'evolve',
        interval: 'annual',
        amountCents: 1919000,
        amountDisplay: '$19,190',
        annualSavingsDisplay: 'Save $4,798 — 2 months free',
      },
    },
  },
]

/** Get price ID for a given tier and interval */
export function getPriceId(tier: Tier, interval: Interval): string {
  return PRICE_IDS[tier][interval]
}

/** Get full tier config by tier name */
export function getTierConfig(tier: Tier): TierConfig | undefined {
  return TIER_CONFIGS.find(t => t.tier === tier)
}

/** Derive tier from a price ID */
export function getTierFromPriceId(priceId: string): Tier | null {
  for (const [tier, intervals] of Object.entries(PRICE_IDS)) {
    if (Object.values(intervals).includes(priceId)) {
      return tier as Tier
    }
  }
  return null
}

/** Derive billing interval from a price ID */
export function getIntervalFromPriceId(priceId: string): Interval | null {
  for (const [, intervals] of Object.entries(PRICE_IDS)) {
    for (const [interval, id] of Object.entries(intervals)) {
      if (id === priceId) return interval as Interval
    }
  }
  return null
}
```

Create `docs/stripe-products.md` — document the product creation steps, price IDs once created, and lookup keys.

---

## Code Patterns to Follow

```typescript
// Reading env vars with fallback (pattern from lib/supabase.ts)
const key = process.env.SOME_KEY ?? ''

// Exporting typed constants (pattern from this codebase)
export const PRICE_IDS = { ... } as const
```

---

## Environment Variables

All 6 price ID env vars were added to `.env.example` in T01. After E creates products in Stripe, fill in `.env.local`:

| Variable | Value after Stripe product creation |
|----------|-------------------------------------|
| `STRIPE_PRICE_SEED_MONTHLY` | `price_XXXX` from Stripe dashboard |
| `STRIPE_PRICE_SEED_ANNUAL` | `price_XXXX` from Stripe dashboard |
| `STRIPE_PRICE_CORE_MONTHLY` | `price_XXXX` from Stripe dashboard |
| `STRIPE_PRICE_CORE_ANNUAL` | `price_XXXX` from Stripe dashboard |
| `STRIPE_PRICE_EVOLVE_MONTHLY` | `price_XXXX` from Stripe dashboard |
| `STRIPE_PRICE_EVOLVE_ANNUAL` | `price_XXXX` from Stripe dashboard |

---

## Acceptance Criteria

- [ ] 6 products exist in Stripe dashboard with correct names, prices, and lookup keys
- [ ] `lib/stripe-prices.ts` exports `PRICE_IDS`, `TIER_CONFIGS`, `getPriceId()`, `getTierFromPriceId()`, `getIntervalFromPriceId()`
- [ ] All price IDs are env-var driven — no hardcoded `price_XXXX` strings in code
- [ ] Annual prices exactly equal 10 × monthly price (2 months free)
- [ ] `docs/stripe-products.md` documents all product/price IDs and lookup keys
- [ ] `npm run build` passes with no type errors
- [ ] HUMAN PREREQUISITE: E has logged into Stripe dashboard, created all 6 products (Seed Monthly $99, Seed Annual $950, Core Monthly $499, Core Annual $4,790, Evolve Monthly $1,999, Evolve Annual $19,190), and populated STRIPE_PRICE_SEED_MONTHLY, STRIPE_PRICE_SEED_ANNUAL, STRIPE_PRICE_CORE_MONTHLY, STRIPE_PRICE_CORE_ANNUAL, STRIPE_PRICE_EVOLVE_MONTHLY, STRIPE_PRICE_EVOLVE_ANNUAL in .env.local AND in the Vercel project environment variables. This is a BLOCKING GATE before Wave 2 runtime tests.

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `lib/stripe-prices.ts` — `PRICE_IDS`, `TIER_CONFIGS`, `getPriceId()` | T03, T07, T10, T11 |
| `lib/stripe-prices.ts` — `getTierFromPriceId()` | T06, T14 |
| `lib/stripe-prices.ts` — `getIntervalFromPriceId()` | T06 |
| Stripe product lookup keys | T03 checkout session metadata |

---

## Do Not

- Do not hardcode any `price_XXXX` strings in the code — all must be env var references
- Do not create API routes — that is T03
- Do not touch `package.json` beyond what T01 already did
- Do not modify `lib/stripe.ts` — that was T01
- Do not add any frontend components — those are T07, T10, T11
