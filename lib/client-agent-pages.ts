import {
  ADD_ONS,
  PLAN_DEFINITIONS,
  getProductLocker,
  type AddOnKey,
  type PlanKey,
  type ProductItem,
} from '@/lib/agent-products'

export type ClientAction = {
  title: string
  status: 'recommended' | 'queued' | 'active' | 'paid'
  price?: string
  description: string
}

export type AgentCommand = {
  label: string
  prompt: string
  outcome: string
}

export type ClientWorkItem = {
  title: string
  stage: 'paid' | 'intake' | 'building' | 'live' | 'recommended'
  deliverable: string
  proof: string
  owner: string
  timing: string
}

export type ClientProofItem = {
  label: string
  value: string
  detail: string
}

export type ClientAgentPage = {
  slug: string
  company: string
  contactName: string
  industry: string
  agentName: string
  agentRole: string
  plan: PlanKey
  allowedEmails: string[]
  paidAddOns: AddOnKey[]
  headline: string
  summary: string
  commandPrompts: AgentCommand[]
  recommendations: ClientAction[]
  activeWork: ClientWorkItem[]
  proofItems: ClientProofItem[]
  products: ProductItem[]
}

const studio23PaidAddOns: AddOnKey[] = []

export const CLIENT_AGENT_PAGES: ClientAgentPage[] = [
  {
    slug: 'studio23',
    company: 'Studio 23',
    contactName: 'Studio 23',
    industry: 'Roofing / Local Services',
    agentName: 'Studio 23 Growth Agent',
    agentRole: 'Roofing lead, website, follow-up, and local visibility operator',
    plan: 'core',
    allowedEmails: ['info@studio23roofing.com'],
    paidAddOns: studio23PaidAddOns,
    headline: 'Run Studio 23 from one agent page.',
    summary:
      'Ask for business ideas, request implementation, see what is paid for, and track every deliverable eevolvv ships.',
    commandPrompts: [
      {
        label: 'Find growth ideas',
        prompt:
          'Find the three highest-leverage growth ideas for Studio 23 Roofing this week. Prioritize jobs, reviews, website conversion, and local search.',
        outcome: 'Returns ranked ideas with expected impact and the next action to approve.',
      },
      {
        label: 'Improve my website',
        prompt:
          'Review the Studio 23 website plan and tell me what page, section, CTA, or proof point should be built next.',
        outcome: 'Turns website feedback into a clear website deliverable or add-on request.',
      },
      {
        label: 'Request automation',
        prompt:
          'Suggest one roofing workflow that should be automated next. Include trigger, destination, owner alert, and proof that it works.',
        outcome: 'Creates an implementation-ready automation card for eevolvv to build.',
      },
      {
        label: 'Get SCO ideas',
        prompt:
          'Give me Studio 23 service-area SCO ideas that help Google, ChatGPT, and local customers understand what we do.',
        outcome: 'Creates content, FAQ, and local discovery ideas that can become SCO work.',
      },
      {
        label: 'Review leads',
        prompt:
          'Help me understand what lead sources, forms, follow-ups, and missed opportunities Studio 23 should track first.',
        outcome: 'Maps what to capture so leads become owner-readable packets.',
      },
    ],
    recommendations: [
      {
        title: 'Turn every form fill into a lead packet',
        status: 'recommended',
        description:
          'Capture the customer, address, roof concern, urgency, source, and next follow-up in one owner-readable packet.',
      },
      {
        title: 'Add missed-lead follow-up',
        status: 'recommended',
        description:
          'If a lead does not book or reply, trigger a follow-up sequence and owner alert before the opportunity goes cold.',
      },
      {
        title: 'Start SCO management',
        status: 'recommended',
        price: ADD_ONS['sco-management'].price,
        description:
          'Build the service-area content and Q&A base that helps Google, ChatGPT, and local customers understand what Studio 23 does.',
      },
      {
        title: 'Website build',
        status: 'recommended',
        price: ADD_ONS.website.price,
        description:
          'Create the public website as a tangible product in this page: URL, pages, launch checklist, and future edit notes.',
      },
    ],
    activeWork: [
      {
        title: 'Agent page access',
        stage: 'live',
        deliverable: 'Private Studio 23 portal with Google login for authorized users.',
        proof: '/os/studio23 route, access list, and client-facing Ghost Locker.',
        owner: 'eevolvv',
        timing: 'Live now',
      },
      {
        title: 'Roofing intake map',
        stage: 'intake',
        deliverable:
          'A lead packet structure for name, address, roof concern, urgency, source, and follow-up status.',
        proof: 'Intake file and first workflow card in Ghost Locker.',
        owner: 'Studio 23 + eevolvv',
        timing: 'Next approval',
      },
      {
        title: 'Website build option',
        stage: 'recommended',
        deliverable:
          'Flat-rate public website package with page inventory, launch checklist, and edit notes.',
        proof: 'Website product card, scope, and checkout/add-on status.',
        owner: 'Studio 23 decision',
        timing: '$2,000 add-on',
      },
    ],
    proofItems: [
      {
        label: 'Plan',
        value: 'Agent Three',
        detail: '3 active automations or integrations are included in the operating allowance.',
      },
      {
        label: 'Access',
        value: 'Google gated',
        detail: 'Studio 23 gets a private agent page; eevolvv keeps admin access.',
      },
      {
        label: 'Delivery rule',
        value: 'Visible proof',
        detail: 'Every paid item must become a file, URL, checklist, report, workflow, or status card.',
      },
    ],
    products: getProductLocker('core', studio23PaidAddOns),
  },
]

export const OWNER_EMAILS = ['hello@eevolvv.com', 'eduardocbarbosa1998@gmail.com'] as const

export function normalizeEmail(email: string | null | undefined) {
  return (email ?? '').trim().toLowerCase()
}

export function isOwnerEmail(email: string | null | undefined) {
  const normalizedEmail = normalizeEmail(email)
  return (OWNER_EMAILS as readonly string[]).some(
    (ownerEmail) => normalizeEmail(ownerEmail) === normalizedEmail,
  )
}

export function getClientAgentPage(slug: string) {
  return CLIENT_AGENT_PAGES.find((page) => page.slug === slug)
}

export function getAllClientAgentEmails() {
  return Array.from(
    new Set(
      CLIENT_AGENT_PAGES.flatMap((page) =>
        page.allowedEmails.map((email) => normalizeEmail(email)),
      ),
    ),
  )
}

export function getClientAgentPageForEmail(email: string | null | undefined) {
  const normalizedEmail = normalizeEmail(email)
  return CLIENT_AGENT_PAGES.find((page) =>
    page.allowedEmails.some((allowedEmail) => normalizeEmail(allowedEmail) === normalizedEmail),
  )
}

export function canAccessClientAgentPage(email: string | null | undefined, slug: string) {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return false
  if (isOwnerEmail(normalizedEmail)) return true
  const page = getClientAgentPage(slug)
  return Boolean(
    page?.allowedEmails.some((allowedEmail) => normalizeEmail(allowedEmail) === normalizedEmail),
  )
}

export function getPlanForClient(page: ClientAgentPage) {
  return PLAN_DEFINITIONS[page.plan]
}
