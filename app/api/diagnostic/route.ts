import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'
import { buildSystemPrompt } from '@/lib/diagnosticPrompts'
import { supabase, saveSubmission, markEmailSent } from '@/lib/supabase'
import { checkRateLimit } from '@/lib/rateLimit'
import { render } from '@react-email/render'
import { EvolutionReportEmail } from '@/emails/EvolutionReport'
import { getPostHogClient } from '@/lib/posthog-server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

async function checkRateLimitDb(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '3', 10)
  if (!supabase) return checkRateLimit(ip)

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count, error } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', oneHourAgo)

  if (error) return checkRateLimit(ip)

  const used = count ?? 0
  if (used >= MAX) return { allowed: false, remaining: 0 }
  return { allowed: true, remaining: MAX - used - 1 }
}

export async function POST(req: NextRequest) {
  const startMs = Date.now()

  // ── Rate limiting ─────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const { allowed, remaining } = await checkRateLimitDb(ip)
  if (!allowed) {
    const phRateLimit = getPostHogClient()
    phRateLimit.capture({ distinctId: ip, event: 'diagnostic_rate_limited', properties: { ip } })
    await phRateLimit.shutdown()
    return NextResponse.json(
      { error: 'Too many requests. You can generate up to 3 reports per hour. Please try again later.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    )
  }

  // ── Parse + validate ──────────────────────────────────────────────────────
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const {
    name, email, businessName, businessType, industry,
    revenue, teamSize, topPains, tools, customerJourney,
    errorPoints, hoursFreed, tier,
  } = body

  if (!businessType?.trim() || !topPains?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Missing required fields: businessType, topPains, email.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  // ── Persist initial record ────────────────────────────────────────────────
  const submissionId = await saveSubmission({
    name, email,
    business_name: businessName,
    business_type: businessType,
    industry, revenue,
    team_size: teamSize,
    top_pains: topPains,
    tools, customer_journey: customerJourney,
    error_points: errorPoints,
    hours_freed: hoursFreed,
    tier, ip_address: ip,
    status: 'pending',
  })

  // ── Generate Claude report ────────────────────────────────────────────────
  const systemPrompt = buildSystemPrompt(industry ?? '')

  const userMessage = `BUSINESS INTAKE DATA:

Business Name: ${businessName || 'Not provided'}
Business Type: ${businessType}
Industry: ${industry || 'Not specified'}
Annual Revenue Range: ${revenue || 'Not specified'}
Team Size: ${teamSize || 'Not specified'}

TOP 3 TIME-CONSUMING PAIN POINTS:
${topPains}

CURRENT TOOLS & SOFTWARE:
${tools || 'Not specified'}

CUSTOMER JOURNEY (start to finish):
${customerJourney || 'Not provided'}

WHERE ERRORS/DELAYS MOST HAPPEN:
${errorPoints || 'Not specified'}

IF THEY HAD 20 EXTRA HOURS/WEEK, THEY WOULD:
${hoursFreed || 'Not specified'}

INTERESTED TIER: ${tier === 'unsure' ? 'Not sure yet — infer best Seed / Grow / Scale / Enterprise fit from their profile' : tier === 'retainer' ? 'Evolve Retainer' : tier || 'grow'}
Contact: ${name || 'Not provided'} — ${email}

Generate their eevolvv report now.`

  let report: string
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMessage }],
    })
    report = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Report generation failed. Please try again.'
  } catch (err) {
    console.error('[diagnostic] Claude error:', err)

    if (submissionId) {
      await supabase?.from('submissions').update({ status: 'error', duration_ms: Date.now() - startMs }).eq('id', submissionId)
    }

    return NextResponse.json(
      { error: 'AI report generation failed. Please try again in a moment.' },
      { status: 502 }
    )
  }

  const durationMs = Date.now() - startMs

  // ── Update Supabase with report ───────────────────────────────────────────
  if (submissionId) {
    await supabase?.from('submissions')
      .update({ report, status: 'completed', duration_ms: durationMs })
      .eq('id', submissionId)
  }

  // ── Send email (non-blocking) ─────────────────────────────────────────────
  if (resend && email) {
    ;(async () => {
      try {
        const html = await render(
          EvolutionReportEmail({ name, businessName, businessType, industry, tier, report })
        )
        const { error: emailError } = await resend.emails.send({
          from: process.env.FROM_EMAIL ?? 'hello@eevolvv.com',
          to: email,
          subject: `Your eevolvv report is ready${businessName ? ` — ${businessName}` : ''}`,
          html,
        })
        if (emailError) {
          console.error('[resend] email send error:', emailError)
        } else if (submissionId) {
          await markEmailSent(submissionId)
        }
      } catch (err) {
        console.error('[resend] unexpected error:', err)
      }
    })()
  }

  const ph = getPostHogClient()
  ph.identify({ distinctId: email, properties: { email, name, business_name: businessName, business_type: businessType, industry, tier } })
  ph.capture({
    distinctId: email,
    event: 'diagnostic_report_generated',
    properties: {
      business_name: businessName || businessType,
      business_type: businessType,
      industry,
      tier,
      duration_ms: durationMs,
      submission_id: submissionId,
    },
  })
  await ph.shutdown()

  return NextResponse.json(
    {
      success: true,
      report,
      businessName: businessName || businessType,
      email, name, tier,
      submissionId,
      durationMs,
      timestamp: new Date().toISOString(),
    },
    { headers: { 'X-RateLimit-Remaining': String(remaining) } }
  )
}
