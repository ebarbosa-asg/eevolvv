import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// TODO: add session auth

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const body = await req.json()

  const { data, error } = await supabase
    .from('agents')
    .insert({
      client_id: params.id,
      name: body.name,
      description: body.description ?? null,
      type: body.type ?? null,
      status: body.status ?? 'dev',
      integrations: body.integrations ?? [],
      repo_url: body.repo_url ?? null,
      deploy_url: body.deploy_url ?? null,
      health: body.health ?? 'green',
      notes: body.notes ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
