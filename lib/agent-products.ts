export type PlanKey = 'seed' | 'core' | 'evolve'
export type AddOnKey =
  | 'website'
  | 'sco-management'
  | 'extra-automation'
  | 'ads-setup'
  | 'custom-dashboard'

export type ProductStatus = 'included' | 'active' | 'available' | 'paid' | 'queued'

export type ProductItem = {
  key: string
  name: string
  type: 'agent' | 'automation' | 'integration' | 'growth' | 'website' | 'report' | 'file'
  status: ProductStatus
  price?: string
  cadence?: string
  description: string
  proof: string
}

export type PlanDefinition = {
  key: PlanKey
  publicName: string
  shortName: string
  tagline: string
  monthly: number
  annual: number
  automationAllowance: string
  includesSco: boolean
  includesAdsSeo: boolean
  humanPromise: string
  features: string[]
  lockerProducts: ProductItem[]
}

export const WEBSITE_ADD_ON = {
  key: 'website' as const,
  name: 'Website Build',
  price: '$2,000 one-time',
  description:
    'A conversion-ready website built as a tangible file inside the client agent page. Includes responsive design, core pages or sections, contact CTA, basic metadata, and handoff notes.',
}

export const ADD_ONS: Record<AddOnKey, ProductItem> = {
  website: {
    key: 'website',
    name: WEBSITE_ADD_ON.name,
    type: 'website',
    status: 'available',
    price: WEBSITE_ADD_ON.price,
    cadence: 'one-time',
    description: WEBSITE_ADD_ON.description,
    proof: 'Website URL, page inventory, launch checklist, and edit notes appear in the Ghost Locker.',
  },
  'sco-management': {
    key: 'sco-management',
    name: 'SCO Management',
    type: 'growth',
    status: 'available',
    price: '$500/mo add-on',
    cadence: 'monthly',
    description:
      'Search, ChatGPT, and local discovery optimization. We turn business proof, service pages, FAQs, and recommendations into findable content.',
    proof: 'Monthly SCO action log, page/update list, query targets, and next recommendations.',
  },
  'extra-automation': {
    key: 'extra-automation',
    name: 'Extra Integration / Automation',
    type: 'automation',
    status: 'available',
    price: '$300-$750/mo',
    cadence: 'monthly',
    description:
      'Adds one additional workflow beyond the plan allowance. One workflow has one primary job, trigger, destination, and success check.',
    proof: 'Scope card, integration list, test result, owner runbook, and live status.',
  },
  'ads-setup': {
    key: 'ads-setup',
    name: 'Ads Campaign Setup',
    type: 'growth',
    status: 'available',
    price: '$750 one-time',
    cadence: 'one-time',
    description:
      'Campaign structure, landing page recommendation, conversion tracking checklist, and launch notes. Ad spend is separate.',
    proof: 'Campaign map, keyword/audience notes, spend approval, tracking checklist.',
  },
  'custom-dashboard': {
    key: 'custom-dashboard',
    name: 'Custom Dashboard',
    type: 'report',
    status: 'available',
    price: '$1,500-$5,000 one-time',
    cadence: 'one-time',
    description:
      'A dashboard for the metrics the owner needs to see repeatedly: leads, jobs, campaigns, revenue, or agent output.',
    proof: 'Dashboard URL or screenshot, source list, update cadence, and owner notes.',
  },
}

const baseLockerProducts: ProductItem[] = [
  {
    key: 'agent-page',
    name: 'Client Agent Page',
    type: 'agent',
    status: 'included',
    description:
      'The private operating page where the client sees what the agent can do, what has been built, and what can be unlocked next.',
    proof: 'Private URL, authorized emails, product locker, recommendations, and build files.',
  },
  {
    key: 'weekly-recommendations',
    name: 'Weekly Recommendations',
    type: 'report',
    status: 'included',
    cadence: 'weekly',
    description:
      'A weekly list of the highest-leverage business actions: fix, automate, publish, follow up, or ask eevolvv to build.',
    proof: 'Recommendation cards with status, owner decision, and next step.',
  },
]

export const PLAN_DEFINITIONS: Record<PlanKey, PlanDefinition> = {
  seed: {
    key: 'seed',
    publicName: 'Agent One',
    shortName: 'One',
    tagline: 'One agent page. One active automation. Weekly direction.',
    monthly: 499,
    annual: 4990,
    automationAllowance: '1 active integration or automation',
    includesSco: false,
    includesAdsSeo: false,
    humanPromise: 'A real private business page where the owner can see what exists and what to do next.',
    features: [
      'Private client agent page',
      'Weekly recommendations',
      '1 active integration or automation',
      'Ghost Locker product view',
      'Monthly status summary',
      'SCO available as add-on',
      'Website available as $2,000 add-on',
    ],
    lockerProducts: [
      ...baseLockerProducts,
      {
        key: 'automation-allowance',
        name: '1 Active Automation / Integration',
        type: 'automation',
        status: 'included',
        description:
          'One workflow such as lead capture, CRM sync, missed lead follow-up, booking routing, or review request.',
        proof: 'Workflow card, trigger, destination, test result, and runbook.',
      },
    ],
  },
  core: {
    key: 'core',
    publicName: 'Agent Three',
    shortName: 'Three',
    tagline: 'Three connected workflows and a stronger operating layer.',
    monthly: 999,
    annual: 9990,
    automationAllowance: '3 active integrations or automations',
    includesSco: false,
    includesAdsSeo: false,
    humanPromise: 'A visible operations layer for leads, follow-up, reporting, and next actions.',
    features: [
      'Private client agent page',
      'Weekly recommendations',
      '3 active integrations or automations',
      'Ghost Locker product view',
      'Monthly optimization pass',
      'Priority update queue',
      'SCO available as add-on',
      'Website available as $2,000 add-on',
    ],
    lockerProducts: [
      ...baseLockerProducts,
      {
        key: 'automation-allowance',
        name: '3 Active Automations / Integrations',
        type: 'automation',
        status: 'included',
        description:
          'Three connected workflows, for example lead intake, CRM sync, and follow-up.',
        proof: 'Three workflow cards, tests, runbooks, and owner-facing status.',
      },
      {
        key: 'optimization-pass',
        name: 'Monthly Agent Optimization',
        type: 'report',
        status: 'included',
        cadence: 'monthly',
        description:
          'Monthly tune-up of recommendations, automations, open files, and next build candidates.',
        proof: 'Optimization note, changed items, and next priority.',
      },
    ],
  },
  evolve: {
    key: 'evolve',
    publicName: 'Agent Five',
    shortName: 'Five',
    tagline: 'Five workflows plus growth management.',
    monthly: 1999,
    annual: 19990,
    automationAllowance: 'Up to 5 active integrations or automations',
    includesSco: true,
    includesAdsSeo: true,
    humanPromise: 'A serious AI ops layer with growth work visible inside the portal.',
    features: [
      'Private client agent page',
      'Weekly recommendations',
      'Up to 5 active integrations or automations',
      'Ads, SEO, and SCO management included',
      'Monthly growth report',
      'Quarterly strategy recalibration',
      'Website available as $2,000 add-on',
    ],
    lockerProducts: [
      ...baseLockerProducts,
      {
        key: 'automation-allowance',
        name: 'Up To 5 Automations / Integrations',
        type: 'automation',
        status: 'included',
        description:
          'Up to five workflows covering intake, follow-up, reporting, reviews, content, routing, or owner alerts.',
        proof: 'Workflow cards, integration list, tests, runbooks, and live status.',
      },
      {
        key: 'ads-seo-sco',
        name: 'Ads / SEO / SCO Management',
        type: 'growth',
        status: 'included',
        cadence: 'monthly',
        description:
          'Growth management covering search, content, local visibility, campaign structure, and discovery optimization. Ad spend is separate.',
        proof: 'Monthly growth report, action log, content list, ad notes, and next recommendations.',
      },
      {
        key: 'quarterly-strategy',
        name: 'Quarterly Recalibration',
        type: 'report',
        status: 'included',
        cadence: 'quarterly',
        description:
          'A quarterly strategy pass to decide what to improve, remove, automate, or build next.',
        proof: 'Quarterly priorities, completed work, and next 90-day route.',
      },
    ],
  },
}

export const PLAN_ORDER: PlanKey[] = ['seed', 'core', 'evolve']

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString()}`
}

export function getPlanDefinition(plan: PlanKey | string | null | undefined): PlanDefinition {
  if (plan === 'core' || plan === 'evolve' || plan === 'seed') return PLAN_DEFINITIONS[plan]
  return PLAN_DEFINITIONS.seed
}

export function getProductLocker(plan: PlanKey | string | null | undefined, paidAddOns: AddOnKey[] = []) {
  const planDefinition = getPlanDefinition(plan)
  const paid = paidAddOns.map((key) => ({ ...ADD_ONS[key], status: 'paid' as const }))
  const available = (Object.keys(ADD_ONS) as AddOnKey[])
    .filter((key) => !paidAddOns.includes(key))
    .filter((key) => key !== 'sco-management' || !planDefinition.includesSco)
    .map((key) => ADD_ONS[key])

  return [...planDefinition.lockerProducts, ...paid, ...available]
}
