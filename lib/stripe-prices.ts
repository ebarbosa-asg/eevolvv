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
