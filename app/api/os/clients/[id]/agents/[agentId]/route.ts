import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// TODO: add session auth

export async function GET(_req: NextRequest, { params }: { params: { id: string; agentId: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.agentId)
    .eq('client_id', params.id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string; agentId: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const body = await req.json()

  const { data, error } = await supabase
    .from('agents')
    .update(body)
    .eq('id', params.agentId)
    .eq('client_id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string; agentId: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', params.agentId)
    .eq('client_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
