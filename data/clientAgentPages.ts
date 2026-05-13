export type ClientAgentFile = {
  label: string
  description: string
  status: 'included' | 'paid' | 'available'
  href?: string
}

export type ClientAgentAction = {
  label: string
  description: string
  status: 'ready' | 'active' | 'locked'
}

export type ClientAgentPageConfig = {
  slug: string
  company: string
  allowedEmails: string[]
  agentName: string
  businessType: string
  stage: 'diagnose' | 'onboard' | 'build' | 'maintain'
  headline: string
  summary: string
  primaryCta: string
  contactHref: string
  files: ClientAgentFile[]
  actions: ClientAgentAction[]
  paidOptions: ClientAgentFile[]
}

export const CLIENT_AGENT_PAGES: Record<string, ClientAgentPageConfig> = {
  studio23: {
    slug: 'studio23',
    company: 'Studio 23 Roofing and Construction LLC',
    allowedEmails: ['info@studio23roofing.com'],
    agentName: 'Studio 23 Agent',
    businessType: 'Roofing and construction',
    stage: 'build',
    headline: 'One page to run leads, files, builds, and next moves.',
    summary:
      'This is the operating page for Studio 23. Website work, SEO/SCO ideas, lead intake, automation plans, and future marketing systems live here as files and agent actions.',
    primaryCta: 'Package an inspection lead',
    contactHref: 'mailto:info@studio23roofing.com',
    files: [
      {
        label: 'Brand website preview',
        description: 'Current Studio 23 website build and visual direction.',
        status: 'included',
        href: '/studio-23',
      },
      {
        label: 'Inspection intake agent',
        description: 'Lead qualification flow for roof, gutter, fence, and storm-damage requests.',
        status: 'included',
        href: '/studio-23/agent',
      },
      {
        label: 'Evolution report',
        description: 'Diagnostic summary, ghost work, and first recommended automations.',
        status: 'included',
      },
      {
        label: 'SEO / SCO idea bank',
        description: 'Search and AI-answer content opportunities for local roofing demand.',
        status: 'included',
      },
      {
        label: 'Automation roadmap',
        description: 'Prioritized build path from intake to CRM, scheduling, and follow-up.',
        status: 'included',
      },
    ],
    actions: [
      {
        label: 'Qualify new inspection request',
        description: 'Collect lead, property, service, urgency, insurance status, and next action.',
        status: 'ready',
      },
      {
        label: 'Prepare callback packet',
        description: 'Turn a lead into a clean email/CRM handoff for the Studio 23 team.',
        status: 'ready',
      },
      {
        label: 'Choose first live automation',
        description: 'Decide whether the next build is CRM sync, booking, follow-up, or claim tracking.',
        status: 'active',
      },
      {
        label: 'Generate local content idea',
        description: 'Create a roofing article, FAQ, or AI-search answer brief from the idea bank.',
        status: 'locked',
      },
    ],
    paidOptions: [
      {
        label: 'CRM sync',
        description: 'Push qualified leads into the chosen CRM with status and owner fields.',
        status: 'available',
      },
      {
        label: 'Storm follow-up system',
        description: 'Automated email/SMS follow-up for hail, wind, and inspection leads.',
        status: 'available',
      },
      {
        label: 'Local SEO content engine',
        description: 'Monthly content briefs and published pages for service-area demand.',
        status: 'available',
      },
    ],
  },
}

export function getClientAgentPage(slug: string) {
  return CLIENT_AGENT_PAGES[slug]
}

export function getClientAgentPageByPath(pathname: string) {
  const match = pathname.match(/^\/os\/([^/]+)(?:\/.*)?$/)
  if (!match) return null
  return getClientAgentPage(match[1]) ?? null
}

export function getAllClientAgentEmails() {
  return Object.values(CLIENT_AGENT_PAGES).flatMap(client => client.allowedEmails)
}
