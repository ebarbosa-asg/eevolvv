import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// TODO: add session auth

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const body = await req.json()

  const { data, error } = await supabase
    .from('activity_log')
    .insert({
      client_id: params.id,
      actor: body.actor ?? 'system',
      action: body.action,
      meta: body.meta ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
