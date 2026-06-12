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

/**
 * AI Client Intake — 30-Day Pilot (Law Firms)
 * Every new inbound call/form answered in <60s, qualified, pushed into Clio/MyCase.
 * Pilot converts to monthly after 30 days.
 */
export const INTAKE_PILOT_PRODUCT = {
  key: 'intake-pilot',
  name: 'AI Client Intake — 30-Day Pilot',
  price: '$997',
  amountCents: 99700,
  envVar: 'STRIPE_PRICE_INTAKE_PILOT',
  tagline: 'Every new client inquiry answered in under 60 seconds.',
  vertical: 'law',
  pilotMetric: 'Response time + consults booked',
  monthlyKey: 'intake-monthly',
  monthlyPrice: '$499/mo',
  description:
    'A 30-day hands-on pilot: we install an AI intake layer over your existing phone + web contact flow. New inquiries are answered in <60s, qualified against your criteria, and pushed into Clio or MyCase with a follow-up sequence that runs until they sign — or they tell you they went elsewhere.',
  features: [
    'Web + phone intake answered in <60 seconds',
    'Qualified leads pushed into Clio or MyCase',
    'Automated follow-up sequence until signed',
    'Kickoff call on Day 1 to map your intake flow',
    'Live within 14 business days or subscription extended',
    '30-day money-back guarantee',
  ],
  timeline: [
    { day: 'DAY 1', label: 'Kickoff call', detail: 'Map your intake flow, tools, and qualification criteria' },
    { day: 'DAY 3', label: 'Build + integrate', detail: 'AI intake configured for your phone and web contact form' },
    { day: 'DAY 7', label: 'Test + review', detail: 'You review 5 test scenarios; we adjust before going live' },
    { day: 'DAY 14', label: 'Live', detail: 'Real leads flowing in, response time under 60 seconds' },
  ],
  proof: 'Response time log, consults booked count, follow-up sequence report, Clio/MyCase integration record.',
} as const

/**
 * AI Client Intake — Monthly (Law Firms)
 * Ongoing monthly service after the pilot converts.
 */
export const INTAKE_MONTHLY_PRODUCT = {
  key: 'intake-monthly',
  name: 'AI Client Intake — Monthly',
  price: '$499',
  amountCents: 49900,
  envVar: 'STRIPE_PRICE_INTAKE_MONTHLY',
  tagline: 'Ongoing AI intake for your law firm.',
  vertical: 'law',
  description:
    'Ongoing AI client intake management after your pilot: intake layer stays live, follow-up sequences maintained, monthly performance report, and one sequence adjustment per month based on conversion data.',
} as const

/**
 * Missed-Call Textback — 30-Day Pilot (Gyms & Fitness Studios)
 * Every missed call gets an instant text. Every lead gets a follow-up sequence.
 */
export const TEXTBACK_PILOT_PRODUCT = {
  key: 'textback-pilot',
  name: 'Missed-Call Textback — 30-Day Pilot',
  price: '$497',
  amountCents: 49700,
  envVar: 'STRIPE_PRICE_TEXTBACK_PILOT',
  tagline: 'Every missed call answered by text in under 30 seconds.',
  vertical: 'fitness',
  pilotMetric: 'Trials booked from missed calls',
  monthlyKey: 'textback-monthly',
  monthlyPrice: '$299/mo',
  description:
    'A 30-day pilot: every missed call to your gym or studio triggers an instant text-back sequence. Trial leads get a 5-touch follow-up. Trial booked → reminder sequence fires. We track every lead that calls and every trial that books from those calls.',
  features: [
    'Every missed call answered by text in <30 seconds',
    'Automated 5-touch lead follow-up sequence',
    'Trial booking + reminder flow',
    'Kickoff call on Day 1 to map your phone + booking flow',
    'Live within 7 business days or extended free',
    '30-day money-back guarantee',
  ],
  timeline: [
    { day: 'DAY 1', label: 'Kickoff call', detail: 'Map your phone system, booking platform, and follow-up goals' },
    { day: 'DAY 2', label: 'Build + configure', detail: 'Textback sequence configured and connected to your booking flow' },
    { day: 'DAY 5', label: 'Test + review', detail: 'You review 3 test scenarios and approve the messages' },
    { day: 'DAY 7', label: 'Live', detail: 'Every missed call gets an instant text-back' },
  ],
  proof: 'Missed call count, text-back response rate, trials booked from sequence, trial-to-membership conversion.',
} as const

/**
 * Missed-Call Textback — Monthly (Gyms & Fitness Studios)
 * Ongoing monthly service after pilot converts.
 */
export const TEXTBACK_MONTHLY_PRODUCT = {
  key: 'textback-monthly',
  name: 'Missed-Call Textback — Monthly',
  price: '$299',
  amountCents: 29900,
  envVar: 'STRIPE_PRICE_TEXTBACK_MONTHLY',
  tagline: 'Ongoing missed-call textback for your gym or studio.',
  vertical: 'fitness',
  description:
    'Ongoing textback management after your pilot: sequences maintained, monthly performance report, and one sequence adjustment per month based on booking data.',
} as const

export type CashProductKey =
  | typeof REPORT_ROADMAP_PRODUCT.key
  | typeof FIRST_FIX_PRODUCT.key
  | typeof INTAKE_PILOT_PRODUCT.key
  | typeof INTAKE_MONTHLY_PRODUCT.key
  | typeof TEXTBACK_PILOT_PRODUCT.key
  | typeof TEXTBACK_MONTHLY_PRODUCT.key

export const PILOT_PRODUCTS = [INTAKE_PILOT_PRODUCT, TEXTBACK_PILOT_PRODUCT] as const
export const ALL_CASH_PRODUCTS = [
  REPORT_ROADMAP_PRODUCT,
  FIRST_FIX_PRODUCT,
  INTAKE_PILOT_PRODUCT,
  INTAKE_MONTHLY_PRODUCT,
  TEXTBACK_PILOT_PRODUCT,
  TEXTBACK_MONTHLY_PRODUCT,
] as const
