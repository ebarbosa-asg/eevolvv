import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data, error } = await supabase
    .from('pipeline_deals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const body = await req.json()
  if (!body.company?.trim()) {
    return NextResponse.json({ error: 'company is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('pipeline_deals')
    .insert({
      company:         body.company.trim(),
      contact_name:    body.contact_name    ?? null,
      contact_email:   body.contact_email   ?? null,
      stage:           body.stage           ?? 'lead',
      value:           body.value != null ? Number(body.value) : null,
      notes:           body.notes           ?? null,
      last_contact_at: body.last_contact_at ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
