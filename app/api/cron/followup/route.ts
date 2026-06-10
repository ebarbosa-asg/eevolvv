import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendFollowUpEmail, sendTestimonialRequest } from '@/lib/email-helpers'

const MAX_AGE_DAYS = 14 // only process submissions from the last 14 days
const TESTIMONIAL_REQUEST_DELAY_DAYS = 14 // send testimonial request 14 days after First Fix purchase

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const now = new Date()
  const cutoff = new Date(now.getTime() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000)
  const followupSent: string[] = []
  const followupFailed: string[] = []
  const testimonialSent: string[] = []

  // ── Follow-up sequence ────────────────────────────────────────────────────
  const { data: submissions, error: subError } = await supabase
    .from('submissions')
    .select('id, email, name, business_name, created_at, followup_sent_at')
    .eq('email_sent', true)
    .gte('created_at', cutoff.toISOString())
    .not('email', 'is', null)

  if (subError) {
    console.error('[cron/followup] submissions query error:', subError)
    return NextResponse.json({ error: subError.message }, { status: 500 })
  }

  // Get all converted client / first-fix emails for suppression
  const { data: clients } = await supabase.from('clients').select('email')
  const convertedEmails = new Set(
    (clients ?? []).map((c: { email: string | null }) => c.email).filter(Boolean)
  )

  for (const sub of submissions ?? []) {
    if (convertedEmails.has(sub.email)) continue

    const sentAt: string[] = Array.isArray(sub.followup_sent_at) ? sub.followup_sent_at : []
    const diffHours = (now.getTime() - new Date(sub.created_at).getTime()) / (1000 * 60 * 60)

    let sequence: 1 | 2 | 3 | null = null

    if (sentAt.length === 0 && diffHours >= 24) {
      sequence = 1
    } else if (sentAt.length === 1 && diffHours >= 72) {
      sequence = 2
    } else if (sentAt.length === 2 && diffHours >= 168) {
      sequence = 3
    }

    if (!sequence) continue

    const result = await sendFollowUpEmail({
      email: sub.email,
      name: sub.name ?? undefined,
      businessName: sub.business_name ?? undefined,
      sequence,
    })

    if (result.success) {
      await supabase
        .from('submissions')
        .update({ followup_sent_at: [...sentAt, now.toISOString()] })
        .eq('id', sub.id)
      followupSent.push(sub.email)
    } else {
      console.error(`[cron/followup] seq ${sequence} failed for ${sub.email}:`, result.error)
      followupFailed.push(sub.email)
    }
  }

  // ── Testimonial requests ──────────────────────────────────────────────────
  // Find testimonial rows that are: unpublished, no quote yet, created >= 14 days ago,
  // and have not had a request sent (we track this by setting published_at to a sentinel
  // value, or we can check a separate flag. We'll use a simple approach: if quote is empty
  // and created_at >= 14 days ago and published_at is null → send request, set published_at
  // to a sentinel 'requested' timestamp so we don't send again)
  const testimonialCutoff = new Date(now.getTime() - TESTIMONIAL_REQUEST_DELAY_DAYS * 24 * 60 * 60 * 1000)

  const { data: pendingTestimonials } = await supabase
    .from('testimonials')
    .select('id, token, client_email, client_name, created_at, published_at, published, quote')
    .eq('published', false)
    .is('published_at', null)      // published_at null = request not yet sent
    .lte('created_at', testimonialCutoff.toISOString())
    .not('client_email', 'is', null)

  for (const t of pendingTestimonials ?? []) {
    if (!t.client_email) continue

    const result = await sendTestimonialRequest({
      email: t.client_email,
      name: t.client_name ?? undefined,
      token: t.token,
    })

    if (result.success) {
      // Mark published_at with a sentinel ('requested') to prevent re-sending
      // We use a past date so we can distinguish from actual publish date later
      await supabase
        .from('testimonials')
        .update({ published_at: new Date(0).toISOString() }) // epoch = "requested"
        .eq('id', t.id)
      testimonialSent.push(t.client_email)
    } else {
      console.error(`[cron/followup] testimonial request failed for ${t.client_email}:`, result.error)
    }
  }

  return NextResponse.json({
    followup_sent: followupSent.length,
    followup_failed: followupFailed.length,
    testimonial_requests_sent: testimonialSent.length,
  })
}
