import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// TODO: add session auth

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  if (key) {
    const { data, error } = await supabase.from('os_state').select('value').eq('key', key).single()
    if (error) return NextResponse.json({ value: null })
    return NextResponse.json({ value: data?.value ?? null })
  }

  const { data, error } = await supabase.from('os_state').select('key, value')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const result: Record<string, unknown> = {}
  for (const row of data ?? []) result[row.key] = row.value
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const body = await req.json() as { key: string; value: unknown }
  const { key, value } = body

  const { error } = await supabase.from('os_state').upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
