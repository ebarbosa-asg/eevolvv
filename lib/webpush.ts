import webpush from 'web-push'
import type { SupabaseClient } from '@supabase/supabase-js'

const VAPID_PUBLIC  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? ''
const VAPID_EMAIL   = 'mailto:hello@eevolvv.com'

let ready = false

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  try {
    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE)
    ready = true
  } catch {
    // misconfigured keys — push silently skipped
  }
}

export type StoredSub = {
  endpoint: string
  p256dh:   string
  auth:     string
}

export type PushPayload = {
  title: string
  body:  string
  url?:  string
  tag?:  string
}

export async function sendPush(sub: StoredSub, payload: PushPayload): Promise<boolean> {
  if (!ready) return false
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
      { TTL: 60 * 60 * 24 },
    )
    return true
  } catch {
    return false
  }
}

export async function sendPushToSlug(
  slug: string,
  payload: PushPayload,
  db: SupabaseClient,
): Promise<void> {
  if (!ready) return
  const { data: subs } = await db
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('slug', slug)

  if (!subs?.length) return

  await Promise.allSettled(
    subs.map(s => sendPush(s as StoredSub, payload))
  )
}
