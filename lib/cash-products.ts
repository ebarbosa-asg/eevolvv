export const REPORT_ROADMAP_PRODUCT = {
  key: 'report-roadmap',
  name: 'Full Report + Roadmap',
  price: '$97',
  amountCents: 9700,
  envVar: 'STRIPE_PRICE_REPORT_ROADMAP',
  description:
    'A no-call paid diagnostic upgrade: complete ghost work analysis, prioritized implementation roadmap, and next actions for the customer specific tools and business.',
  proof:
    'Permanent report URL, implementation roadmap, top fixes, tool-specific next steps, and upgrade path into the agent page.',
} as const

export type CashProductKey = typeof REPORT_ROADMAP_PRODUCT.key
