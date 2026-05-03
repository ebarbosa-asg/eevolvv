import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// TODO: add session auth

export async function GET() {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data, error } = await supabase
    .from('clients')
    .select(`
      id, name, company, email, phone, business_type, contract_value,
      stage, health, notes, submission_id, created_at, updated_at,
      agents(id),
      service_tasks(id, status, updated_at)
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const clients = (data ?? []).map(c => ({
    ...c,
    agent_count: (c.agents as { id: string }[])?.length ?? 0,
    latest_task: (c.service_tasks as { id: string; status: string; updated_at: string }[])
      ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0] ?? null,
    agents: undefined,
    service_tasks: undefined,
  }))

  return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const body = await req.json()

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: body.name,
      company: body.company,
      email: body.email ?? null,
      phone: body.phone ?? null,
      business_type: body.business_type ?? null,
      contract_value: body.contract_value ?? null,
      stage: body.stage ?? 'diagnose',
      health: body.health ?? 'green',
      notes: body.notes ?? null,
      submission_id: body.submission_id ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
