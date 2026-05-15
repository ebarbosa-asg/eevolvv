/**
 * Lead scoring for diagnostic submissions.
 *
 * Score is 0-100. Higher = closer to checkout.
 *
 * Inputs are the raw intake form fields. Output is a structured score record
 * persisted alongside the submission, plus surfaced in PostHog for
 * segment-aware funnel analysis and follow-up routing.
 *
 * Segments map to the email nurture tracks defined in
 * `docs/marketing-automation-gameplan.md` § 4 → Email Nurture.
 */

export type LeadSegment =
  | 'local_service'
  | 'appointment_based'
  | 'ecommerce'
  | 'agency'
  | 'multi_location'
  | 'partner'
  | 'general_smb'

export type LeadUrgency = 'low' | 'medium' | 'high'

export type RecommendedTier =
  | 'agent_one'
  | 'agent_three'
  | 'agent_five'
  | 'enterprise'

export interface LeadScoringInput {
  industry?: string
  businessType?: string
  revenue?: string
  teamSize?: string
  topPains?: string
  tools?: string
  hoursFreed?: string
  tier?: string
  referralSource?: string
  partnerId?: string
}

export interface LeadScoringResult {
  score: number
  segment: LeadSegment
  urgency: LeadUrgency
  recommendedTier: RecommendedTier
  estimatedMonthlyRevenue: number | null
  missedRevenueEstimate: number | null
  toolCount: number | null
  hoursWastedPerWeek: number | null
}

// ─── Revenue parsing ────────────────────────────────────────────────────────

const REVENUE_MIDPOINT_MONTHLY: Record<string, number> = {
  '$0–$10K': 4_000,
  '$10K–$50K': 25_000,
  '$50K–$100K': 75_000,
  '$100K–$250K': 175_000,
  '$250K–$500K': 375_000,
  '$500K–$1M': 750_000,
  '$1M–$2M': 1_500_000,
  '$2M–$5M': 3_500_000,
  '$5M+': 8_000_000,
}

function parseRevenueAnnual(revenue?: string): number | null {
  if (!revenue) return null
  for (const [label, annual] of Object.entries(REVENUE_MIDPOINT_MONTHLY)) {
    if (revenue.includes(label)) return annual
  }
  return null
}

function parseTeamSize(team?: string): number | null {
  if (!team) return null
  const ranges: Array<[string, number]> = [
    ['1', 1],
    ['2–5', 3],
    ['6–10', 8],
    ['11–25', 18],
    ['26–50', 38],
    ['50+', 75],
  ]
  for (const [label, mid] of ranges) {
    if (team.includes(label)) return mid
  }
  return null
}

// ─── Segment classification ─────────────────────────────────────────────────

const LOCAL_SERVICE = ['roofing', 'contractor', 'plumb', 'cleaning', 'auto', 'hvac', 'electrician', 'landscap', 'home service', 'pest']
const APPOINTMENT = ['salon', 'spa', 'medspa', 'dental', 'chiropract', 'gym', 'fitness', 'studio', 'clinic', 'childcare', 'therap']
const ECOMMERCE = ['ecommerce', 'e-commerce', 'shopify', 'retail', 'shop', 'store', 'dtc']
const AGENCY = ['agency', 'consult', 'marketing', 'design firm', 'creative']
const MULTI_LOCATION = ['franchise', 'multi-location', 'multi location', 'multiple locations', 'group', 'chain']

function classifySegment(input: LeadScoringInput): LeadSegment {
  if (input.partnerId) return 'partner'

  const haystack = `${input.industry ?? ''} ${input.businessType ?? ''} ${input.topPains ?? ''}`.toLowerCase()

  const has = (list: string[]) => list.some(t => haystack.includes(t))

  if (has(MULTI_LOCATION)) return 'multi_location'
  if (has(LOCAL_SERVICE)) return 'local_service'
  if (has(APPOINTMENT)) return 'appointment_based'
  if (has(ECOMMERCE)) return 'ecommerce'
  if (has(AGENCY)) return 'agency'
  return 'general_smb'
}

// ─── Urgency classification ─────────────────────────────────────────────────

const HIGH_URGENCY = ['urgent', 'asap', 'losing', 'bleeding', 'desperate', 'crisis', 'breaking', 'cannot keep up', "can't keep up", 'overwhelmed', 'drowning', 'every day']
const MED_URGENCY = ['soon', 'this quarter', 'need to', 'have to', 'must', 'priority']

function classifyUrgency(input: LeadScoringInput): LeadUrgency {
  const haystack = `${input.topPains ?? ''} ${input.hoursFreed ?? ''}`.toLowerCase()
  if (HIGH_URGENCY.some(t => haystack.includes(t))) return 'high'
  if (MED_URGENCY.some(t => haystack.includes(t))) return 'medium'
  return 'low'
}

// ─── Tool count + hours ─────────────────────────────────────────────────────

function countTools(tools?: string): number | null {
  if (!tools) return null
  // Heuristic: split on commas, semicolons, " and ", " + ", newlines.
  const parts = tools
    .split(/,|;|\n| and | \+ |\//gi)
    .map(p => p.trim())
    .filter(p => p.length > 1)
  return parts.length || null
}

function extractHoursWasted(text?: string): number | null {
  if (!text) return null
  const m = text.match(/(\d{1,3})\s*(?:hours?|hrs?)/i)
  if (m) return parseInt(m[1], 10)
  return null
}

// ─── Missed revenue estimate ────────────────────────────────────────────────

function estimateMissedRevenue(monthlyRevenue: number | null, urgency: LeadUrgency): number | null {
  if (!monthlyRevenue) return null
  const pctByUrgency: Record<LeadUrgency, number> = {
    high: 0.18,
    medium: 0.1,
    low: 0.05,
  }
  return Math.round(monthlyRevenue * pctByUrgency[urgency])
}

// ─── Tier recommendation ────────────────────────────────────────────────────

function recommendTier(monthlyRevenue: number | null, teamSize: number | null): RecommendedTier {
  const mr = monthlyRevenue ?? 0
  const ts = teamSize ?? 0
  if (mr >= 1_500_000 || ts >= 26) return 'enterprise'
  if (mr >= 375_000 || ts >= 11) return 'agent_five'
  if (mr >= 75_000 || ts >= 6) return 'agent_three'
  return 'agent_one'
}

// ─── Score calculation ─────────────────────────────────────────────────────

export function scoreLead(input: LeadScoringInput): LeadScoringResult {
  const segment = classifySegment(input)
  const urgency = classifyUrgency(input)
  const monthlyRevenue = parseRevenueAnnual(input.revenue)
  const teamSize = parseTeamSize(input.teamSize)
  const toolCount = countTools(input.tools)
  const hoursWasted = extractHoursWasted(input.topPains) ?? extractHoursWasted(input.hoursFreed)
  const recommendedTier = recommendTier(monthlyRevenue, teamSize)
  const missedRevenue = estimateMissedRevenue(monthlyRevenue, urgency)

  let score = 0

  // Revenue band — higher revenue = more able to pay
  if (monthlyRevenue) {
    if (monthlyRevenue >= 1_500_000) score += 28
    else if (monthlyRevenue >= 375_000) score += 22
    else if (monthlyRevenue >= 75_000) score += 16
    else if (monthlyRevenue >= 25_000) score += 10
    else score += 4
  }

  // Urgency
  score += urgency === 'high' ? 22 : urgency === 'medium' ? 12 : 4

  // Tool sprawl — more tools = more integration pain we solve
  if (toolCount) {
    if (toolCount >= 8) score += 14
    else if (toolCount >= 4) score += 9
    else score += 4
  }

  // Hours wasted — explicit pain signal
  if (hoursWasted) {
    if (hoursWasted >= 20) score += 14
    else if (hoursWasted >= 10) score += 9
    else score += 4
  }

  // Team size — bigger teams need more workflow help
  if (teamSize) {
    if (teamSize >= 26) score += 10
    else if (teamSize >= 6) score += 6
    else score += 2
  }

  // Partner-sourced or pre-selected tier shows intent
  if (input.partnerId) score += 8
  if (input.tier && input.tier !== 'unsure') score += 4

  // Cap at 100
  score = Math.min(100, score)

  return {
    score,
    segment,
    urgency,
    recommendedTier,
    estimatedMonthlyRevenue: monthlyRevenue,
    missedRevenueEstimate: missedRevenue,
    toolCount,
    hoursWastedPerWeek: hoursWasted,
  }
}

/**
 * Bucket score into hot/warm/nurture for routing.
 */
export function scoreBucket(score: number): 'hot' | 'warm' | 'nurture' {
  if (score >= 70) return 'hot'
  if (score >= 40) return 'warm'
  return 'nurture'
}
