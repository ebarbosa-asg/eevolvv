import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// TODO: add session auth

export async function GET() {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data, error } = await supabase
    .from('agents')
    .select(`
      id, name, description, type, status, integrations,
      repo_url, deploy_url, last_run_at, health, notes,
      created_at, updated_at,
      clients(id, company)
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const agents = (data ?? []).map(a => {
    const c = (a.clients as unknown as { id: string; company: string } | null)
    return {
      ...a,
      client_company: c?.company ?? null,
      client_id: c?.id ?? null,
      clients: undefined,
    }
  })

  return NextResponse.json(agents)
}
