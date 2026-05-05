import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const POSTHOG_API = 'https://us.posthog.com/api/projects/407291/query/'

const EVENTS = [
  'diagnostic_chat_started',
  'diagnostic_intake_completed',
  'diagnostic_report_generated',
  'diagnostic_cta_clicked',
] as const

async function queryEvent(eventName: string, days: number): Promise<number> {
  const res = await fetch(POSTHOG_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: `SELECT count() FROM events WHERE event = {eventName} AND timestamp >= now() - INTERVAL {days} DAY`,
        values: { eventName, days },
      },
    }),
    cache: 'no-store',
  })
  if (!res.ok) return 0
  const json = await res.json()
  return (json?.results?.[0]?.[0] as number) ?? 0
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const results: Record<string, { '7d': number; '30d': number }> = {}

  await Promise.all(
    EVENTS.map(async (evt) => {
      const [d7, d30] = await Promise.all([queryEvent(evt, 7), queryEvent(evt, 30)])
      results[evt] = { '7d': d7, '30d': d30 }
    })
  )

  return NextResponse.json({ events: results })
}
