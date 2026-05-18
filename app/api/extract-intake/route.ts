import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai-provider'
import { getPostHogClient } from '@/lib/posthog-server'

const EXTRACT_PROMPT = `You are a data extraction assistant. Given a conversation between an AI assistant and a business owner, extract structured intake data as a JSON object.

Fields to extract (use empty string "" if not mentioned):
- name: the person's name
- email: their email address
- businessName: name of the business
- businessType: type of business (e.g. "Restaurant", "Gym", "Law Firm", "Corner Store")
- industry: full industry label matching one of: Restaurant / Food & Beverage, Gym / Fitness / Wellness, Retail / E-commerce, Legal / Law Firm, Medical / Healthcare, Real Estate, Construction / Trades, Accounting / Finance, Marketing / Agency, Manufacturing, Logistics / Supply Chain, Technology / SaaS, Hospitality / Hotel, Education, Non-Profit, Corner Store / Bodega, Kirana Store, Sari-Sari Store — or leave blank if none match
- revenue: annual revenue range or rough estimate
- teamSize: number of employees or rough range
- topPains: combine their 2-3 main operational pain points into a single descriptive string
- tools: software and tools they currently use
- customerJourney: how their customer flow works start to finish
- errorPoints: where errors, delays, or bottlenecks happen
- hoursFreed: what they'd do with 20 extra hours per week
- tier: infer best fit — micro (corner stores/solo), seed (small local), grow (small biz), scale (SMB), enterprise (multi-location/large)

Return ONLY valid JSON. No explanation, no markdown fences.`

export async function POST(req: NextRequest) {
  let body: {
    conversation: { role: 'user' | 'assistant'; content: string }[]
    tier?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { conversation, tier, defaultIndustry } = body as typeof body & { defaultIndustry?: string }
  if (!conversation?.length) {
    return NextResponse.json({ error: 'conversation required' }, { status: 400 })
  }

  const transcript = conversation
    .map(m => `${m.role === 'user' ? 'Business owner' : 'eevolvv AI'}: ${m.content}`)
    .join('\n\n')

  let extracted: Record<string, string>
  try {
    const raw = await complete(
      `${EXTRACT_PROMPT}\n\nCONVERSATION:\n${transcript}${tier ? `\n\nPreferred tier hint: ${tier}` : ''}`,
      { maxTokens: 600 },
    )
    const match = raw.match(/\{[\s\S]*\}/)
    extracted = match ? JSON.parse(match[0]) : {}
    
    // Track intake completion
    try {
      const ph = getPostHogClient()
      ph.capture({
        distinctId: extracted.email || 'anonymous',
        event: 'intake_completed',
        properties: { businessType: extracted.businessType, industry: extracted.industry, tier: extracted.tier },
      })
      ph.shutdown()
    } catch (err) {
      console.error('[extract-intake] PostHog error:', err)
    }
  } catch (err) {
    console.error('[extract-intake] extraction error:', err)
    return NextResponse.json({ error: 'Failed to extract intake data from conversation.' }, { status: 502 })
  }

  // If we know the industry from the landing page, always use that — don't trust the extraction
  if (defaultIndustry) extracted.industry = defaultIndustry

  if (!extracted.email?.trim() || !extracted.businessType?.trim()) {
    return NextResponse.json(
      {
        error: 'The conversation did not capture enough information. Please ensure you provided your email address and business type.',
        extracted,
      },
      { status: 422 },
    )
  }

  const diagnosticUrl = `${req.nextUrl.origin}/api/diagnostic`
  const diagnosticRes = await fetch(diagnosticUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(req.headers.get('x-forwarded-for') ? { 'x-forwarded-for': req.headers.get('x-forwarded-for')! } : {}),
      ...(req.headers.get('x-real-ip') ? { 'x-real-ip': req.headers.get('x-real-ip')! } : {}),
    },
    body: JSON.stringify({ ...extracted, tier: tier || extracted.tier || 'grow' }),
  })

  const result = await diagnosticRes.json()
  return NextResponse.json(result, { status: diagnosticRes.status })
}
