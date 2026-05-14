import { PLAN_DEFINITIONS, formatMoney } from '@/lib/agent-products'

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
    name: PLAN_DEFINITIONS.seed.publicName,
    tagline: PLAN_DEFINITIONS.seed.tagline,
    buildSla: 'Agent page + first workflow',
    features: PLAN_DEFINITIONS.seed.features,
    prices: {
      monthly: {
        priceId: PRICE_IDS.seed.monthly,
        tier: 'seed',
        interval: 'monthly',
        amountCents: PLAN_DEFINITIONS.seed.monthly * 100,
        amountDisplay: formatMoney(PLAN_DEFINITIONS.seed.monthly),
      },
      annual: {
        priceId: PRICE_IDS.seed.annual,
        tier: 'seed',
        interval: 'annual',
        amountCents: PLAN_DEFINITIONS.seed.annual * 100,
        amountDisplay: formatMoney(PLAN_DEFINITIONS.seed.annual),
        annualSavingsDisplay: 'Save $998 — 2 months free',
      },
    },
  },
  {
    tier: 'core',
    name: PLAN_DEFINITIONS.core.publicName,
    tagline: PLAN_DEFINITIONS.core.tagline,
    buildSla: 'Agent page + 3 workflows',
    features: PLAN_DEFINITIONS.core.features,
    prices: {
      monthly: {
        priceId: PRICE_IDS.core.monthly,
        tier: 'core',
        interval: 'monthly',
        amountCents: PLAN_DEFINITIONS.core.monthly * 100,
        amountDisplay: formatMoney(PLAN_DEFINITIONS.core.monthly),
      },
      annual: {
        priceId: PRICE_IDS.core.annual,
        tier: 'core',
        interval: 'annual',
        amountCents: PLAN_DEFINITIONS.core.annual * 100,
        amountDisplay: formatMoney(PLAN_DEFINITIONS.core.annual),
        annualSavingsDisplay: 'Save $1,998 — 2 months free',
      },
    },
  },
  {
    tier: 'evolve',
    name: PLAN_DEFINITIONS.evolve.publicName,
    tagline: PLAN_DEFINITIONS.evolve.tagline,
    buildSla: 'Agent page + 5 workflows + growth',
    features: PLAN_DEFINITIONS.evolve.features,
    prices: {
      monthly: {
        priceId: PRICE_IDS.evolve.monthly,
        tier: 'evolve',
        interval: 'monthly',
        amountCents: PLAN_DEFINITIONS.evolve.monthly * 100,
        amountDisplay: formatMoney(PLAN_DEFINITIONS.evolve.monthly),
      },
      annual: {
        priceId: PRICE_IDS.evolve.annual,
        tier: 'evolve',
        interval: 'annual',
        amountCents: PLAN_DEFINITIONS.evolve.annual * 100,
        amountDisplay: formatMoney(PLAN_DEFINITIONS.evolve.annual),
        annualSavingsDisplay: 'Save $3,998 — 2 months free',
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
