import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'
import { getPostHogClient } from '@/lib/posthog-server'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const {
    name, email, company, partnerType, audience,
    monthlyClients, motivation, source,
    utmSource, utmMedium, utmCampaign,
  } = body

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Missing required fields: name, email.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const ip = getClientIp(req)

  if (!supabase) {
    console.warn('[partners/intake] supabase not configured — skipping persistence')
    return NextResponse.json({ success: true, id: null, persisted: false })
  }

  const { data, error } = await supabase
    .from('partners')
    .insert({
      name,
      email,
      company,
      partner_type: partnerType,
      audience,
      monthly_clients: monthlyClients,
      motivation,
      source,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      ip_address: ip,
      status: 'applied',
    })
    .select('id')
    .single()

  if (error) {
    console.error('[partners/intake] insert error:', error.message)
    return NextResponse.json({ error: 'Could not save your application. Please email hello@eevolvv.com.' }, { status: 500 })
  }

  // ── PostHog ──────────────────────────────────────────────────────────────
  const ph = getPostHogClient()
  ph.identify({
    distinctId: email,
    properties: { email, name, company, partner_type: partnerType, partner_application_status: 'applied' },
  })
  ph.capture({
    distinctId: email,
    event: 'partner_application_submitted',
    properties: {
      partner_type: partnerType,
      audience,
      monthly_clients: monthlyClients,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    },
  })
  await ph.shutdown()

  // ── Admin notification ───────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL
  if (resend && adminEmail) {
    ;(async () => {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL ?? 'hello@eevolvv.com',
          to: adminEmail,
          subject: `🤝 New partner application — ${name} (${company || partnerType || 'unknown'})`,
          html: `
            <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px 24px;background:#faf7f0;color:#141413;border:1px solid rgba(20,20,19,0.12);">
              <div style="font-size:10px;letter-spacing:0.22em;color:#8C2B1A;font-weight:700;margin-bottom:20px;">EEVOLVV · NEW PARTNER APPLICATION</div>
              <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
                <tr><td style="padding:7px 0;color:rgba(20,20,19,0.45);width:140px;">Name</td><td style="padding:7px 0;font-weight:600;">${name}</td></tr>
                <tr><td style="padding:7px 0;color:rgba(20,20,19,0.45);">Email</td><td style="padding:7px 0;"><a href="mailto:${email}" style="color:#8C2B1A;text-decoration:none;font-weight:600;">${email}</a></td></tr>
                <tr><td style="padding:7px 0;color:rgba(20,20,19,0.45);">Company</td><td style="padding:7px 0;">${company || '—'}</td></tr>
                <tr><td style="padding:7px 0;color:rgba(20,20,19,0.45);">Partner type</td><td style="padding:7px 0;">${partnerType || '—'}</td></tr>
                <tr><td style="padding:7px 0;color:rgba(20,20,19,0.45);">Audience</td><td style="padding:7px 0;">${audience || '—'}</td></tr>
                <tr><td style="padding:7px 0;color:rgba(20,20,19,0.45);">Monthly clients</td><td style="padding:7px 0;">${monthlyClients || '—'}</td></tr>
                <tr><td style="padding:7px 0;color:rgba(20,20,19,0.45);">Source</td><td style="padding:7px 0;">${source || utmSource || '—'}</td></tr>
              </table>
              ${motivation ? `<div style="background:rgba(20,20,19,0.05);border-left:3px solid #8C2B1A;padding:16px;font-size:13px;line-height:1.7;margin-bottom:24px;font-family:sans-serif;"><div style="font-size:10px;letter-spacing:0.14em;color:#8C2B1A;margin-bottom:10px;font-family:monospace;">MOTIVATION</div>${motivation}</div>` : ''}
            </div>
          `,
        })
      } catch (err) {
        console.error('[partners/intake] admin notification error:', err)
      }
    })()
  }

  return NextResponse.json({ success: true, id: data?.id ?? null, persisted: true })
}
