import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendPushToSlug } from '@/lib/webpush'
import { isOwnerEmail } from '@/lib/client-agent-pages'
import { auth } from '@/lib/auth'

// POST — send a push notification to all subscribers for a slug.
// Called server-side (owner only) or from internal API handlers.
export async function POST(req: NextRequest) {
  const session = await auth()
  const email = session?.user?.email

  // Allow owner email OR internal calls with CRON_SECRET
  const internalSecret = req.headers.get('x-internal-secret')
  const isInternal = internalSecret === process.env.CRON_SECRET
  const isOwner = isOwnerEmail(email)

  if (!isOwner && !isInternal) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const body = await req.json()
  const { slug, title, body: bodyText, url, tag } = body ?? {}

  if (!slug || !title) {
    return NextResponse.json({ error: 'slug and title required' }, { status: 400 })
  }

  await sendPushToSlug(
    slug,
    { title, body: bodyText ?? '', url: url ?? `/os/${slug}?tab=activity`, tag },
    supabase,
  )

  return NextResponse.json({ sent: true })
}
