import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { sendWeeklyReport } from '@/lib/email-helpers'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'
const BATCH_SIZE = 10

// ── Week label ────────────────────────────────────────────────────────────────
// Produces e.g. "Week of Jun 9–15, 2026"
function getWeekLabel(now: Date): string {
  // Week starts on Monday
  const day = now.getDay() // 0=Sun, 1=Mon, …
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const monthFmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short' })
  const dayFmt = (d: Date) => d.getDate()
  const yearFmt = (d: Date) => d.getFullYear()

  // If same month: "Jun 9–15, 2026". If crossing month: "Jun 30–Jul 6, 2026"
  if (monthFmt(monday) === monthFmt(sunday)) {
    return `Week of ${monthFmt(monday)} ${dayFmt(monday)}–${dayFmt(sunday)}, ${yearFmt(sunday)}`
  }
  return `Week of ${monthFmt(monday)} ${dayFmt(monday)}–${monthFmt(sunday)} ${dayFmt(sunday)}, ${yearFmt(sunday)}`
}

// ── Claude summary ────────────────────────────────────────────────────────────
async function generateSummary(
  anthropic: Anthropic,
  automationRuns: number,
  metricSummary: string,
): Promise<{ summary: string; recommendation: string }> {
  const FALLBACK = {
    summary:
      automationRuns > 0
        ? `Your AI automation ran ${automationRuns} time${automationRuns === 1 ? '' : 's'} this week, handling tasks automatically on your behalf.`
        : 'No automation activity was logged this week. Your system is configured and standing by.',
    recommendation:
      automationRuns > 0
        ? 'Review the runs in your dashboard to confirm everything processed as expected.'
        : 'Consider sharing your pilot link with more contacts to generate activity this week.',
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 120,
      messages: [
        {
          role: 'user',
          content: `You are writing a brief weekly update for a small business owner.
Their AI automation ran ${automationRuns} times this week.
${metricSummary}
Write 1-2 plain sentences summarizing the week, then one actionable recommendation.
Keep it under 60 words total. Be direct and specific, not generic.
Format: [summary] | [recommendation]`,
        },
      ],
    })

    const raw =
      message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const parts = raw.split(' | ')
    if (parts.length >= 2) {
      return {
        summary: parts[0].trim(),
        recommendation: parts.slice(1).join(' | ').trim(),
      }
    }
    // Claude returned something but didn't follow the format — use full text as summary
    return { summary: raw, recommendation: FALLBACK.recommendation }
  } catch (err) {
    console.error('[weekly-report] Claude error — using fallback:', err)
    return FALLBACK
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Auth
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const now = new Date()
  const weekLabel = getWeekLabel(now)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let processed = 0
  let sent = 0
  let skipped = 0
  const errors: string[] = []

  // ── Query active pilot builds ─────────────────────────────────────────────
  const { data: builds, error: buildsError } = await supabase
    .from('builds')
    .select('id, client_id, product_type, status')
    .in('product_type', ['intake-pilot', 'textback-pilot'])
    .not('status', 'in', '("failed","paused")')
    .limit(BATCH_SIZE)

  if (buildsError) {
    console.error('[weekly-report] builds query error:', buildsError)
    return NextResponse.json({ error: buildsError.message }, { status: 500 })
  }

  if (!builds?.length) {
    return NextResponse.json({ processed: 0, sent: 0, skipped: 0, errors: [], message: 'No active pilot builds' })
  }

  for (const build of builds) {
    processed++

    try {
      // ── Fetch client ──────────────────────────────────────────────────────
      const { data: client } = await supabase
        .from('clients')
        .select('email, name, churn_risk')
        .eq('id', build.client_id)
        .single()

      if (!client?.email) {
        console.warn('[weekly-report] no email for client_id:', build.client_id)
        skipped++
        continue
      }

      // ── Fetch agent runs for past 7 days ──────────────────────────────────
      const { data: runs, count: runCount } = await supabase
        .from('agent_runs')
        .select('id, metric_name, metric_value, response_time_ms', { count: 'exact' })
        .eq('client_id', build.client_id)
        .gte('created_at', sevenDaysAgo)

      const automationRuns = runCount ?? 0

      // ── Kill switch: churning client with no activity ─────────────────────
      if (client.churn_risk === true && automationRuns === 0) {
        console.log(`[weekly-report] skipping churn-risk client with no runs: ${client.email}`)
        skipped++
        continue
      }

      // ── Derive metrics from runs ──────────────────────────────────────────
      // Use the most recent run's metric fields if available
      const latestRun = runs?.[0] ?? null
      const metricName: string | undefined = latestRun?.metric_name ?? undefined
      const metricValue: string | undefined = latestRun?.metric_value ?? undefined

      // Average response time in seconds if recorded
      let responseTime: string | undefined
      if (runs && runs.length > 0) {
        const timings = runs
          .map((r: { response_time_ms?: number | null }) => r.response_time_ms)
          .filter((t: number | null | undefined): t is number => typeof t === 'number')
        if (timings.length > 0) {
          const avgMs = timings.reduce((a: number, b: number) => a + b, 0) / timings.length
          responseTime = `avg ${Math.round(avgMs / 1000)} seconds`
        }
      }

      // ── Pilot product label ───────────────────────────────────────────────
      const pilotProduct =
        build.product_type === 'intake-pilot'
          ? 'AI Client Intake'
          : 'Missed-Call Textback'

      // ── Build metric summary string for Claude ────────────────────────────
      const metricLines: string[] = []
      if (metricName && metricValue) metricLines.push(`${metricName}: ${metricValue}`)
      if (responseTime) metricLines.push(`Average response time: ${responseTime}`)
      const metricSummary = metricLines.join('\n')

      // ── Generate AI summary ───────────────────────────────────────────────
      const { summary, recommendation } = await generateSummary(
        anthropic,
        automationRuns,
        metricSummary,
      )

      // ── Portal URL ────────────────────────────────────────────────────────
      const { data: tokenRow } = await supabase
        .from('onboarding_tokens')
        .select('token')
        .eq('client_id', build.client_id)
        .maybeSingle()

      const portalUrl = tokenRow?.token
        ? `${BASE_URL}/client/${tokenRow.token}`
        : `${BASE_URL}/os`

      // ── Send email ────────────────────────────────────────────────────────
      const result = await sendWeeklyReport({
        email: client.email,
        name: client.name ?? undefined,
        weekLabel,
        pilotProduct,
        metricName,
        metricValue,
        responseTime,
        automationRuns,
        summary,
        recommendation,
        portalUrl,
      })

      if (result.success) {
        sent++
      } else {
        console.error(`[weekly-report] send failed for ${client.email}:`, result.error)
        errors.push(`${client.email}: ${result.error}`)
      }

      // Small delay to avoid Resend rate limits
      await new Promise(r => setTimeout(r, 120))
    } catch (err) {
      console.error('[weekly-report] unexpected error for build', build.id, err)
      errors.push(`build ${build.id}: ${String(err)}`)
    }
  }

  return NextResponse.json({ processed, sent, skipped, errors })
}
