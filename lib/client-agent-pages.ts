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
    company: 'Studio 23 Roofing',
    contactName: 'Studio 23',
    industry: 'Roofing / Local Services',
    agentName: 'Studio 23 Growth Agent',
    agentRole: 'Roofing lead, website, follow-up, and local visibility operator',
    plan: 'core',
    allowedEmails: ['info@studio23roofing.com'],
    paidAddOns: studio23PaidAddOns,
    headline: 'Run Studio 23 from one agent page.',
    summary:
      'Ask for growth ideas, request implementations, see what is paid for, and track every deliverable eevolvv ships.',
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
        title: 'Lead capture automation from website form',
        status: 'active',
        description:
          'Every form submission auto-creates a lead profile in CRM, alerts owner via SMS, and schedules follow-up at the configured interval. 3 leads captured this week.',
      },
      {
        title: 'Missed-lead follow-up sequence',
        status: 'active',
        description:
          'Unreplied leads enter a 3-touch SMS + email sequence over 5 days. 40% recovery rate measured on test batch.',
      },
      {
        title: 'Service-area content for SCO',
        status: 'queued',
        price: ADD_ONS['sco-management'].price,
        description:
          'Build the service-area content and Q&A base that helps Google, ChatGPT, and local customers understand what Studio 23 does. 12 articles in draft.',
      },
      {
        title: 'Website build — 5-page public site',
        status: 'recommended',
        price: '$2,000 one-time',
        description:
          'Create the public website as a tangible product: home, services, gallery, contact, about. Includes launch checklist and SEO base.',
      },
      {
        title: 'Weekly roof inspection reports',
        status: 'recommended',
        description:
          'AI-generated weekly report summarizing new leads, pending follow-ups, website traffic, and SCO performance. Sent every Monday.',
      },
    ],
    activeWork: [
      {
        title: 'Lead Catcher',
        stage: 'live',
        deliverable: 'Website form → CRM → SMS alert → follow-up. 14 leads captured this week.',
        proof: '3 leads this week. 2 followed up within 5 min. 1 booked.',
        owner: 'eevolvv',
        timing: 'Live since May 15',
      },
      {
        title: 'Auto Follower',
        stage: 'live',
        deliverable: '3-touch SMS + email sequence over 5 days for unreplied leads.',
        proof: '8 sequences active. 40% recovery rate.',
        owner: 'eevolvv',
        timing: 'Live since May 16',
      },
      {
        title: 'Chatbot',
        stage: 'building',
        deliverable: 'AI chat that qualifies roof concerns and books free estimates.',
        proof: 'Prototype built. Integration in progress.',
        owner: 'eevolvv',
        timing: 'ETA May 25',
      },
      {
        title: 'Google Profile',
        stage: 'intake',
        deliverable: 'Complete GBP audit: posts, photos, Q&A, review management.',
        proof: 'Audit started. Photos updated.',
        owner: 'Studio 23 + eevolvv',
        timing: 'Next review',
      },
    ],
    proofItems: [
      {
        label: 'Plan',
        value: 'Agent Three',
        detail: '3 active automations or integrations included. Currently using: lead intake, follow-up sequence, and estimate chatbot (building).',
      },
      {
        label: 'Leads this week',
        value: '3 captured',
        detail: 'All from website form. Average response time: 4.2 minutes. 1 estimate booked.',
      },
      {
        label: 'Automations live',
        value: '2 of 3',
        detail: 'Lead intake + follow-up sequence active. Chatbot in build.',
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
