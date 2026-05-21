import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { isOwnerEmail, getClientAgentPage } from '@/lib/client-agent-pages'
import { sendPushToSlug } from '@/lib/webpush'

const VALID_STATUSES = ['recommended', 'paid', 'intake', 'queued', 'building', 'review', 'live'] as const
type DeliverableStatus = typeof VALID_STATUSES[number]

// Status transitions that warrant a client push notification
const PUSH_ON_STATUS: Partial<Record<DeliverableStatus, { title: (name: string) => string; body: string }>> = {
  building: {
    title: name => `${name} is now building`,
    body:  'eevolvv is actively working on this.',
  },
  live: {
    title: name => `${name} is live`,
    body:  'This gear is running. Check your Activity tab.',
  },
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string; deliverableId: string } },
) {
  const session = await auth()
  const email   = session?.user?.email

  if (!isOwnerEmail(email)) {
    return NextResponse.json({ error: 'Owner only' }, { status: 403 })
  }
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const page = getClientAgentPage(params.slug)
  if (!page) return NextResponse.json({ error: 'Client page not found' }, { status: 404 })

  const body = await req.json()
  const newStatus: DeliverableStatus | undefined = VALID_STATUSES.includes(body.status) ? body.status : undefined
  if (!newStatus) return NextResponse.json({ error: 'invalid status' }, { status: 400 })

  const { data, error } = await supabase
    .from('client_deliverables')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', params.deliverableId)
    .eq('client_slug', params.slug)
    .select('id, title, status')
    .single()

  if (error || !data) return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 500 })

  // Log to activity
  try {
    await supabase.from('activity_log').insert({
      actor: email ?? 'owner',
      action: `${data.title}: status → ${newStatus}`,
      meta: { slug: params.slug, deliverable_id: data.id, status: newStatus },
    })
  } catch { /* non-fatal */ }

  // Push notification to client subscribers if this is a notable transition
  const pushDef = PUSH_ON_STATUS[newStatus]
  if (pushDef) {
    sendPushToSlug(
      params.slug,
      {
        title: pushDef.title(data.title),
        body:  pushDef.body,
        url:   `/os/${params.slug}?tab=activity`,
        tag:   `status-${data.id}`,
      },
      supabase,
    ).catch(() => {})
  }

  return NextResponse.json({ deliverable: data })
}
