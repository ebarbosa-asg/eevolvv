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

export type ClientAgentPage = {
  slug: string
  company: string
  contactName: string
  industry: string
  plan: PlanKey
  allowedEmails: string[]
  paidAddOns: AddOnKey[]
  headline: string
  summary: string
  recommendations: ClientAction[]
  products: ProductItem[]
}

const studio23PaidAddOns: AddOnKey[] = []

export const CLIENT_AGENT_PAGES: ClientAgentPage[] = [
  {
    slug: 'studio23',
    company: 'Studio 23',
    contactName: 'Studio 23',
    industry: 'Roofing / Local Services',
    plan: 'core',
    allowedEmails: ['info@studio23roofing.com'],
    paidAddOns: studio23PaidAddOns,
    headline: 'Studio 23 agent page',
    summary:
      'Your agent page is the operating home for recommendations, automations, website work, SCO opportunities, reports, and files.',
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
