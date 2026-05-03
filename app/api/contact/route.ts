import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPostHogClient } from '@/lib/posthog-server'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  const { name, email, phone, message, smsConsent } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!resend) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
  }

  const smsLine = phone
    ? `Phone: ${phone}\nSMS consent: ${smsConsent ? 'YES — opted in' : 'No'}`
    : 'Phone: not provided'

  await resend.emails.send({
    from: 'eevolvv <hello@eevolvv.com>',
    to: 'hello@eevolvv.com',
    reply_to: email,
    subject: `Contact form: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n${smsLine}\n\nMessage:\n${message}`,
  })

  const ph = getPostHogClient()
  ph.identify({ distinctId: email, properties: { email, name } })
  ph.capture({
    distinctId: email,
    event: 'contact_received',
    properties: { has_phone: !!phone, sms_consent: smsConsent === true },
  })
  await ph.shutdown()

  return NextResponse.json({ ok: true })
}
