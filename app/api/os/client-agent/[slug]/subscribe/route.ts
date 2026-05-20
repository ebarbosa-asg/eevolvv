import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { canAccessClientAgentPage, getClientAgentPage } from '@/lib/client-agent-pages'

// POST — save a push subscription for this client slug
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabase)  return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const page = getClientAgentPage(params.slug)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const email = session.user?.email
  if (!canAccessClientAgentPage(email, page.slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { endpoint, keys } = body ?? {}
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
  }

  const ua = req.headers.get('user-agent') ?? undefined

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { slug: page.slug, endpoint, p256dh: keys.p256dh, auth: keys.auth, user_agent: ua },
      { onConflict: 'endpoint' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ subscribed: true })
}

// DELETE — remove a push subscription
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabase)  return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const page = getClientAgentPage(params.slug)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const email = session.user?.email
  if (!canAccessClientAgentPage(email, page.slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { endpoint } = body ?? {}
  if (!endpoint) return NextResponse.json({ error: 'endpoint required' }, { status: 400 })

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint)
    .eq('slug', page.slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ unsubscribed: true })
}
