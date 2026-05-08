import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'hello@eevolvv.com'
const ALERT_EMAIL = 'hello@eevolvv.com'

interface ChurnRisk {
  clientId: string
  email: string | null
  name: string | null
  tier: string | null
  signal: string
  detail: string
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const now = new Date()
  const risks: ChurnRisk[] = []
  const flaggedIds = new Set<string>()

  // Get all active subscription client IDs (used across multiple signals)
  const { data: activeSubs } = await supabase
    .from('subscriptions')
    .select('client_id')
    .eq('status', 'active')

  const activeClientIds = (activeSubs ?? []).map(s => s.client_id)

  if (activeClientIds.length === 0) {
    return NextResponse.json({ detected: 0, flagged: [], signals: [] })
  }

  // Signal 1: No onboarding completed >7 days post-payment
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: incompleteOnboarding } = await supabase
    .from('onboarding_tokens')
    .select('client_id, completed_at, created_at')
    .is('completed_at', null)
    .lt('created_at', sevenDaysAgo)

  const noOnboardingClientIds = (incompleteOnboarding ?? [])
    .filter(t => activeClientIds.includes(t.client_id))
    .map(t => t.client_id)

  if (noOnboardingClientIds.length > 0) {
    const { data: noOnboardingClients } = await supabase
      .from('clients')
      .select('id, email, name, tier, created_at')
      .in('id', noOnboardingClientIds)

    for (const c of noOnboardingClients ?? []) {
      if (!flaggedIds.has(c.id)) {
        flaggedIds.add(c.id)
        risks.push({
          clientId: c.id,
          email: c.email,
          name: c.name,
          tier: c.tier,
          signal: 'NO_ONBOARDING',
          detail: `Signed up ${new Date(c.created_at).toLocaleDateString()} — onboarding not completed`,
        })
      }
    }
  }

  // Signal 2: No portal visit >30 days (exclude clients created within last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: noPortalVisit } = await supabase
    .from('clients')
    .select('id, email, name, tier, last_portal_visit_at, created_at')
    .lt('created_at', thirtyDaysAgo)
    .in('id', activeClientIds)
    .or(`last_portal_visit_at.is.null,last_portal_visit_at.lt.${thirtyDaysAgo}`)

  for (const c of noPortalVisit ?? []) {
    if (!flaggedIds.has(c.id)) {
      flaggedIds.add(c.id)
      risks.push({
        clientId: c.id,
        email: c.email,
        name: c.name,
        tier: c.tier,
        signal: 'NO_PORTAL_VISIT',
        detail: `Last portal visit: ${c.last_portal_visit_at ? new Date(c.last_portal_visit_at).toLocaleDateString() : 'never'}`,
      })
    }
  }

  // Signal 3: Renewal within 7 days with low engagement (portal visit >14 days ago)
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()

  const { data: renewingSoon } = await supabase
    .from('subscriptions')
    .select('id, current_period_end, client_id')
    .eq('status', 'active')
    .lt('current_period_end', sevenDaysFromNow)
    .gt('current_period_end', now.toISOString())

  if ((renewingSoon ?? []).length > 0) {
    const renewingClientIds = (renewingSoon ?? []).map(s => s.client_id)

    const { data: renewingClients } = await supabase
      .from('clients')
      .select('id, email, name, tier, last_portal_visit_at')
      .in('id', renewingClientIds)

    const renewingClientMap = new Map(
      (renewingClients ?? []).map(c => [c.id, c])
    )

    for (const sub of renewingSoon ?? []) {
      const client = renewingClientMap.get(sub.client_id)
      if (!client) continue

      const lastVisit = client.last_portal_visit_at
      const isLowEngagement = !lastVisit || new Date(lastVisit) < new Date(fourteenDaysAgo)

      if (isLowEngagement && !flaggedIds.has(client.id)) {
        flaggedIds.add(client.id)
        risks.push({
          clientId: client.id,
          email: client.email,
          name: client.name,
          tier: client.tier,
          signal: 'RENEWAL_LOW_ENGAGEMENT',
          detail: `Renewing ${new Date(sub.current_period_end).toLocaleDateString()}, last portal visit: ${lastVisit ? new Date(lastVisit).toLocaleDateString() : 'never'}`,
        })
      }
    }
  }

  // Flag all at-risk clients in DB
  if (flaggedIds.size > 0) {
    await supabase
      .from('clients')
      .update({ churn_risk: true })
      .in('id', Array.from(flaggedIds))
  }

  // Send internal alert email
  if (risks.length > 0 && resend) {
    const html = `
      <html><body style="font-family:monospace;background:#141413;color:#faf7f0;padding:32px;">
        <p style="color:#8C2B1A;font-size:11px;letter-spacing:0.22em;font-weight:700;">EEVOLVV · CHURN DETECTION ALERT</p>
        <h1 style="font-size:20px;margin:16px 0;">${risks.length} at-risk client${risks.length > 1 ? 's' : ''} detected</h1>
        <p style="font-size:12px;opacity:0.6;">${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <hr style="border-color:rgba(255,255,255,0.12);margin:24px 0;">
        ${risks.map(r => `
          <div style="margin-bottom:20px;padding:16px;border:1px solid rgba(255,255,255,0.12);">
            <p style="color:#8C2B1A;font-size:10px;letter-spacing:0.2em;margin:0 0 8px;">${r.signal.replace(/_/g, ' ')}</p>
            <p style="font-size:14px;font-weight:600;margin:0 0 4px;">${r.name || r.email || 'Unknown'} &middot; ${(r.tier || 'seed').toUpperCase()}</p>
            <p style="font-size:12px;opacity:0.6;margin:0;">${r.detail}</p>
          </div>
        `).join('')}
        <p style="font-size:11px;opacity:0.4;margin-top:32px;">EEVOLVV INTERNAL</p>
      </body></html>
    `
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ALERT_EMAIL,
      subject: `[Churn Alert] ${risks.length} at-risk client${risks.length > 1 ? 's' : ''} — ${now.toLocaleDateString()}`,
      html,
    })
  }

  return NextResponse.json({
    detected: risks.length,
    flagged: Array.from(flaggedIds),
    signals: risks.map(r => ({ signal: r.signal, email: r.email, name: r.name })),
  })
}
