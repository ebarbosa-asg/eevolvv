import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getClientAgentPage } from '@/lib/client-agent-pages'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const page = getClientAgentPage(slug)
  if (!page) {
    return NextResponse.json({ events: [] })
  }

  if (!supabase) {
    return NextResponse.json({ events: [] })
  }

  // Get requests for this client
  const { data: requests } = await supabase
    .from('client_requests')
    .select('*')
    .eq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(20)

  const events: Array<{
    date: string
    type: 'completed' | 'progress' | 'request' | 'created'
    icon: string
    text: string
  }> = []

  // Work items as events
  for (const w of page.activeWork || []) {
    if (w.stage === 'live') {
      events.push({
        date: w.timing?.replace('Live', '')?.trim() || '—',
        type: 'completed',
        icon: '🟢',
        text: `${w.title} went live`,
      })
    } else if (w.stage === 'building') {
      events.push({
        date: '—',
        type: 'progress',
        icon: '🟡',
        text: `${w.title} — ${w.deliverable?.slice(0, 80) || 'building'}`,
      })
    }
  }

  // Submitted requests
  for (const r of requests || []) {
    events.push({
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: 'request',
      icon: '🔵',
      text: r.title || 'Client request submitted',
    })
  }

  // Sort newest first
  events.sort((a, b) => {
    const aNum = parseDate(a.date)
    const bNum = parseDate(b.date)
    return bNum - aNum
  })

  return NextResponse.json({ events })
}

function parseDate(d: string): number {
  if (!d || d === '—') return 0
  const parsed = Date.parse(d)
  return isNaN(parsed) ? 0 : parsed
}