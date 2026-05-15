export type GrowthPageSlug =
  | 'ai-agents-for-small-business'
  | 'missed-lead-follow-up'
  | 'local-business-automation'
  | 'ai-receptionist-small-business'
  | 'website-and-automation'

export type GrowthPage = {
  slug: GrowthPageSlug
  marker: string
  title: string
  accent: string
  description: string
  metaTitle: string
  metaDescription: string
  keywords: string
  stat: string
  statLabel: string
  problems: string[]
  workflows: string[]
  proof: string[]
  tierFit: string
}

export const GROWTH_PAGES: Record<GrowthPageSlug, GrowthPage> = {
  'ai-agents-for-small-business': {
    slug: 'ai-agents-for-small-business',
    marker: 'AI AGENTS FOR SMALL BUSINESS',
    title: 'Your small business does not need another dashboard.',
    accent: 'It needs an agent page.',
    description:
      'eevolvv finds the ghost work inside your business, builds the first AI workflows, and gives you one private page where recommendations, automations, files, reports, and next actions live.',
    metaTitle: 'AI Agents for Small Business — eevolvv',
    metaDescription:
      'AI agents for small businesses that need lead follow-up, booking, reviews, reporting, websites, and weekly recommendations in one private agent page.',
    keywords:
      'AI agents for small business, small business AI automation, AI operations team, workflow automation for small business',
    stat: '1-5',
    statLabel: 'active workflows shipped inside your agent page',
    problems: [
      'Leads arrive from forms, calls, DMs, and referrals with no single owner.',
      'Follow-ups depend on memory instead of a system.',
      'Reports, website edits, reviews, and next actions live in different places.',
    ],
    workflows: [
      'Lead intake and owner alert',
      'Missed-lead follow-up',
      'Review request sequence',
      'Weekly owner brief',
      'Website and SCO action queue',
    ],
    proof: [
      'Private client agent page',
      'Ghost Locker product view',
      'Weekly recommendations',
      'Workflow cards with status and next action',
    ],
    tierFit: 'Best fit: Agent One or Agent Three.',
  },
  'missed-lead-follow-up': {
    slug: 'missed-lead-follow-up',
    marker: 'MISSED LEAD FOLLOW-UP',
    title: 'A slow reply is not a sales problem.',
    accent: 'It is ghost work.',
    description:
      'Most local businesses lose revenue because new inquiries wait in inboxes, voicemails, forms, or DMs. eevolvv builds the workflow that replies fast, routes the lead, and keeps following up.',
    metaTitle: 'Missed Lead Follow-Up Automation — eevolvv',
    metaDescription:
      'Automate missed lead follow-up for local service businesses. Capture inquiries, respond quickly, route to the owner, and keep prospects warm.',
    keywords:
      'missed lead follow up automation, lead response automation, local business lead automation, small business sales automation',
    stat: '5 min',
    statLabel: 'target response window for every new inquiry',
    problems: [
      'Website forms land in an inbox nobody checks fast enough.',
      'Calls and texts get answered only when the owner has time.',
      'Prospects go cold because the second and third follow-up never happens.',
    ],
    workflows: [
      'Instant inquiry acknowledgement',
      'Owner lead packet',
      'Booking or estimate link',
      '3-touch follow-up sequence',
      'Lost-lead recovery queue',
    ],
    proof: [
      'Lead packet template',
      'Follow-up copy',
      'Routing rules',
      'Weekly missed-lead report',
    ],
    tierFit: 'Best fit: Agent One for first workflow, Agent Three when CRM and review flows are included.',
  },
  'local-business-automation': {
    slug: 'local-business-automation',
    marker: 'LOCAL BUSINESS AUTOMATION',
    title: 'The work is local.',
    accent: 'The ghost work is everywhere.',
    description:
      'Local businesses win when they respond faster, show up clearly online, keep customers informed, and stop repeating the same admin work every day. eevolvv turns that into an operating layer.',
    metaTitle: 'Local Business Automation — eevolvv',
    metaDescription:
      'Local business automation for leads, reviews, booking, websites, weekly reports, and owner operations. Start with a free Evolution Assessment.',
    keywords:
      'local business automation, AI automation for local business, service business automation, local SEO automation',
    stat: '23 hrs',
    statLabel: 'typical weekly ghost work hiding inside growing businesses',
    problems: [
      'Customer communication is scattered across phone, email, forms, and social.',
      'Reviews only happen when someone remembers to ask.',
      'The owner has no weekly operating brief with clear next steps.',
    ],
    workflows: [
      'Lead intake and routing',
      'Booking reminders',
      'Review requests',
      'Local content/SCO queue',
      'Weekly owner brief',
    ],
    proof: [
      'Automation map',
      'Owner action list',
      'Review flow',
      'Local discovery recommendations',
    ],
    tierFit: 'Best fit: Agent Three for connected lead, review, and reporting workflows.',
  },
  'ai-receptionist-small-business': {
    slug: 'ai-receptionist-small-business',
    marker: 'AI RECEPTIONIST',
    title: 'Your front desk should not be a bottleneck.',
    accent: 'Neither should your inbox.',
    description:
      'eevolvv builds AI-assisted intake and routing so customers get fast answers, owners get clean packets, and the business stops losing opportunities between calls.',
    metaTitle: 'AI Receptionist for Small Business — eevolvv',
    metaDescription:
      'AI receptionist workflows for small businesses: intake, routing, reminders, FAQs, owner alerts, and follow-up inside a private agent page.',
    keywords:
      'AI receptionist small business, AI phone assistant, AI intake automation, small business receptionist automation',
    stat: '24/7',
    statLabel: 'intake coverage without asking the owner to watch every channel',
    problems: [
      'The same questions get answered over and over.',
      'New leads do not arrive with enough context to act quickly.',
      'Scheduling, reminders, and follow-up live in separate tools.',
    ],
    workflows: [
      'FAQ response assistant',
      'Intake packet',
      'Booking handoff',
      'Reminder flow',
      'Escalation rules',
    ],
    proof: [
      'Intake fields',
      'Response library',
      'Routing map',
      'Escalation checklist',
    ],
    tierFit: 'Best fit: Agent One for intake, Agent Three when booking and review flows are added.',
  },
  'website-and-automation': {
    slug: 'website-and-automation',
    marker: 'WEBSITE + AUTOMATION',
    title: 'A website without follow-up is just a brochure.',
    accent: 'We connect the work behind it.',
    description:
      'eevolvv builds the website as a tangible product inside the client Ghost Locker, then connects the forms, follow-up, reviews, local discovery, and owner recommendations behind it.',
    metaTitle: 'Website and Automation for Small Business — eevolvv',
    metaDescription:
      'Small business website plus automation: conversion-ready site, form routing, follow-up, review requests, SCO recommendations, and agent page.',
    keywords:
      'small business website automation, website and AI automation, local business website build, website follow up automation',
    stat: '$2K',
    statLabel: 'flat website add-on, then workflows compound behind it',
    problems: [
      'The site launches, but the lead process stays manual.',
      'Contact forms do not create a clean owner-readable packet.',
      'Website updates, SEO ideas, and next actions disappear after launch.',
    ],
    workflows: [
      'Conversion-ready website',
      'Form-to-owner packet',
      'Follow-up sequence',
      'Review request flow',
      'SCO action queue',
    ],
    proof: [
      'Website URL',
      'Launch checklist',
      'Ghost Locker file',
      'Weekly improvement queue',
    ],
    tierFit: 'Best fit: any agent tier plus the $2,000 website add-on.',
  },
}

export function getGrowthPage(slug: GrowthPageSlug) {
  return GROWTH_PAGES[slug]
}
