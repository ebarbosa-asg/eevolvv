import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  let body: { token?: string; quote?: string; metric?: string; name?: string; vertical?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { token, quote, metric, name, vertical } = body

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }
  if (!quote || !quote.trim()) {
    return NextResponse.json({ error: 'Quote is required' }, { status: 400 })
  }

  // Find the testimonial row by token
  const { data: existing, error: findErr } = await supabase
    .from('testimonials')
    .select('id, quote')
    .eq('token', token)
    .maybeSingle()

  if (findErr) {
    console.error('[testimonial/submit] find error:', findErr)
    return NextResponse.json({ error: 'Could not find your feedback link.' }, { status: 404 })
  }

  if (!existing) {
    return NextResponse.json({ error: 'This feedback link is not valid.' }, { status: 404 })
  }

  // Already submitted
  if (existing.quote && existing.quote.trim()) {
    return NextResponse.json({ ok: true, alreadySubmitted: true })
  }

  // Save the testimonial content (not published until admin approves)
  const { error: updateErr } = await supabase
    .from('testimonials')
    .update({
      quote: quote.trim(),
      metric_headline: metric?.trim() || null,
      client_name: name?.trim() || null,
      vertical: vertical?.trim() || null,
    })
    .eq('token', token)

  if (updateErr) {
    console.error('[testimonial/submit] update error:', updateErr)
    return NextResponse.json({ error: 'Failed to save your feedback. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
