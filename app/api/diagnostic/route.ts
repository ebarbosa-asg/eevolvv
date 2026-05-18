import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai-provider'
import { supabase } from '../../../lib/supabase'
import { Resend } from 'resend'
import { getPostHogClient } from '../../../lib/posthog-server'
import { createContact, searchContact } from '../../../lib/hubspot'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function trackServerEvent(event: string, properties: Record<string, unknown> = {}) {
  try {
    const ph = getPostHogClient()
    ph.capture({
      distinctId: properties.email?.toString() || properties.ip?.toString() || 'anonymous',
      event,
      properties,
    })
    ph.flush()
  } catch (err) {
    console.error('[diagnostic] PostHog error:', err)
  }
}

const DIAGNOSTIC_PROMPT = `You are eevolvv's diagnostic engine. Generate a comprehensive Evolution Report for a business based on their intake data.

REPORT STRUCTURE (markdown):

# Executive Summary
2-3 sentences: current state, automation opportunity, projected ROI.

## The Automation Opportunity
List 5-7 specific automations we'd build for them. Format:
**[Automation Name]** — What it does and what manual work it replaces.

## Ghost Work Analysis
Identify 3-4 "invisible" inefficiencies they don't realize are costing them. Use data they provided.

## Implementation Roadmap
Phase 1 (Week 1-2): Quick wins (2-3 automations)
Phase 2 (Month 1): Core operations (2-3 automations)
Phase 3 (Month 2-3): Growth stack (1-2 advanced automations)

## ROI Projection
Calculate hours saved per week, cost savings per month, revenue upside (be specific, use their numbers).

TONE: Direct, confident, consultant-grade. Use specifics from their business. No fluff.`

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service configuration missing' }, { status: 503 })
  }

  let body: {
    name?: string
    email: string
    businessName?: string
    businessType: string
    industry?: string
    revenue?: string
    teamSize?: string
    topPains: string
    tools?: string
    customerJourney?: string
    errorPoints?: string
    hoursFreed?: string
    tier?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email, businessType, tier = 'core' } = body

  if (!email || !businessType) {
    return NextResponse.json({ error: 'email and businessType are required' }, { status: 400 })
  }

  // Rate limiting check (3 per hour per IP)
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { count: recentCount } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', oneHourAgo)

  if (recentCount && recentCount >= 3) {
    // Check if they're a paying subscriber (bypass rate limit)
    const { data: activeClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .eq('status', 'active')
      .maybeSingle()

    if (!activeClient) {
      return NextResponse.json(
        { error: 'Rate limit: 3 reports per hour. Upgrade to bypass limits.' },
        { status: 429 },
      )
    }
  }

  // Insert submission record
  const { data: submission, error: insertError } = await supabase
    .from('submissions')
    .insert({
      name: body.name || null,
      email,
      business_name: body.businessName || null,
      business_type: businessType,
      industry: body.industry || null,
      revenue: body.revenue || null,
      team_size: body.teamSize || null,
      top_pains: body.topPains,
      tools: body.tools || null,
      customer_journey: body.customerJourney || null,
      error_points: body.errorPoints || null,
      hours_freed: body.hoursFreed || null,
      tier,
      ip_address: ip,
      status: 'pending',
    })
    .select()
    .single()

  if (insertError || !submission) {
    console.error('[diagnostic] insert error:', insertError)
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }

  // Generate report with AI
  const intakeData = JSON.stringify(body, null, 2)
  let reportMarkdown = ''

  try {
    reportMarkdown = await complete(
      `${DIAGNOSTIC_PROMPT}\n\nINTAKE DATA:\n${intakeData}\n\nGenerate the Evolution Report now:`,
      { maxTokens: 2500 },
    )
  } catch (err) {
    console.error('[diagnostic] AI error:', err)
    await supabase.from('submissions').update({ status: 'failed' }).eq('id', submission.id)
    return NextResponse.json({ error: 'Report generation failed' }, { status: 502 })
  }

  if (!reportMarkdown.trim()) {
    await supabase.from('submissions').update({ status: 'failed' }).eq('id', submission.id)
    return NextResponse.json({ error: 'Empty report generated' }, { status: 502 })
  }

  // Update submission with report
  await supabase
    .from('submissions')
    .update({ report: reportMarkdown, status: 'completed' })
    .eq('id', submission.id)

  // Send email with Resend
  if (resend) {
    try {
      await resend.emails.send({
        from: 'eevolvv <reports@eevolvv.com>',
        to: email,
        subject: `Your Evolution Report is ready — ${body.businessName || businessType}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #141413;">Your Evolution Report is Ready</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #52525b; margin-bottom: 24px;">
              We analyzed ${body.businessName || 'your business'} and identified ${body.topPains ? '5-7' : 'multiple'} automation opportunities that could save you hours every week.
            </p>
            <a href="https://eevolvv.com/report/${submission.id}" style="display: inline-block; background: #141413; color: #faf7f0; padding: 14px 28px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 4px; margin-bottom: 32px;">
              View Your Full Report →
            </a>
            <p style="font-size: 14px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #e4e4e7; padding-top: 16px;">
              This report is valid for 90 days. Ready to build it? Choose your tier and we start immediately.
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[diagnostic] Resend error:', emailErr)
      // Don't fail the request if email fails
    }
  }

  // Track with PostHog
  trackServerEvent('diagnostic_completed', {
    email,
    tier,
    businessType,
    submissionId: submission.id,
    revenue: body.revenue || 'unknown',
})

  // Sync to HubSpot CRM (non-critical — won't break the response)
  try {
    const existing = await searchContact(email)
    if (!existing) {
      await createContact({
        email,
        firstName: (body as any).name?.split(' ')[0] || '',
        lastName: (body as any).name?.split(' ').slice(1).join(' ') || '',
        phone: '',
        company: (body as any).businessName || '',
        industry: businessType,
        message: `Evolution Report: ${(body as any).topPains || 'Business diagnostic'} | Revenue: ${(body as any).revenue || '?'} | Team: ${(body as any).teamSize || '?'}`,
      })
    }
  } catch {
    // HubSpot sync is non-critical
  }

  return NextResponse.json({
    success: true,
    submissionId: submission.id,
    reportUrl: `/report/${submission.id}`,
    message: 'Report generated and sent to your email',
  })
}
