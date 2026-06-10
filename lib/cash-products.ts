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

export const FIRST_FIX_PRODUCT = {
  key: 'first-fix',
  name: 'First Fix',
  price: '$1,997',
  amountCents: 199700,
  envVar: 'STRIPE_PRICE_FIRST_FIX',
  tagline: 'One automation. Built and live in 7 days.',
  description:
    'We scope one automation from your diagnostic report, build it, integrate it with your tools, test it, and hand it off fully documented — in 7 days flat.',
  features: [
    'Scoped from your diagnostic report',
    'Built and integrated with your tools',
    'Tested and documented',
    'Live in 7 days or we work until it is',
    'Becomes a case study (with your permission)',
  ],
  proof: 'Workflow documentation, integration list, test result, and owner runbook.',
} as const

export type CashProductKey = typeof REPORT_ROADMAP_PRODUCT.key | typeof FIRST_FIX_PRODUCT.key
