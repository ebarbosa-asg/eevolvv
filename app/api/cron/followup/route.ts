import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendFollowUpEmail } from '@/lib/email-helpers'

export async function GET(req: NextRequest) {
  // Auth check — Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const now = new Date()
  const sent: string[] = []
  const failed: string[] = []

  // Fetch all submissions where the diagnostic email was sent
  const { data: submissions, error: subError } = await supabase
    .from('submissions')
    .select('id, email, name, business_name, created_at, followup_sent_at, industry')
    .eq('email_sent', true)
    .not('email', 'is', null)

  if (subError) {
    console.error('[cron/followup] submissions query error:', subError)
    return NextResponse.json({ error: subError.message }, { status: 500 })
  }

  if (!submissions?.length) {
    return NextResponse.json({ sent: 0, failed: 0 })
  }

  // Get all converted client emails for exclusion
  const { data: clients } = await supabase.from('clients').select('email')
  const convertedEmails = new Set(
    (clients ?? []).map((c: { email: string | null }) => c.email).filter(Boolean)
  )

  for (const sub of submissions) {
    // Skip leads who have already converted to paying clients
    if (convertedEmails.has(sub.email)) continue

    const sentAt: string[] = Array.isArray(sub.followup_sent_at) ? sub.followup_sent_at : []
    const createdAt = new Date(sub.created_at)
    const diffMs = now.getTime() - createdAt.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    // Determine which sequence to send based on sentAt length and elapsed time
    let sequence: 1 | 2 | 3 | null = null

    if (sentAt.length === 0 && diffHours >= 24 && diffHours < 72) {
      sequence = 1
    } else if (sentAt.length === 1 && diffHours >= 72 && diffHours < 168) {
      sequence = 2
    } else if (sentAt.length === 2 && diffHours >= 168) {
      sequence = 3
    }

    if (!sequence) continue

    const result = await sendFollowUpEmail({
      email: sub.email,
      name: sub.name ?? undefined,
      businessName: sub.business_name ?? undefined,
      industry: sub.industry ?? undefined,
      sequence,
    })

    if (result.success) {
      // Append timestamp to track this send
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ followup_sent_at: [...sentAt, now.toISOString()] })
        .eq('id', sub.id)

      if (updateError) {
        console.error(`[cron/followup] followup_sent_at update failed for ${sub.email}:`, updateError)
      }

      sent.push(sub.email)
    } else {
      console.error(`[cron/followup] sendFollowUpEmail failed for ${sub.email} (seq ${sequence}):`, result.error)
      failed.push(sub.email)
    }
  }

  return NextResponse.json({
    sent: sent.length,
    failed: failed.length,
    sent_emails: sent,
  })
}
