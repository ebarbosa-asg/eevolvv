import { supabase } from '@/lib/supabase'
import { BuildQueueTable } from './BuildQueueTable'

export interface BuildRow {
  id: string
  tier: string
  status: string
  assigned_to: string | null
  build_url: string | null
  notes: string | null
  created_at: string
  started_at: string | null
  updated_at: string
  clients: { id: string; name: string | null; email: string | null }
}

export default async function BuildsPage() {
  if (!supabase) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ opacity: 0.5 }}>Database unavailable.</p>
      </div>
    )
  }

  const { data: builds } = await supabase
    .from('builds')
    .select(`
      id, tier, status, assigned_to, build_url, notes, created_at, started_at, updated_at,
      clients!inner(id, name, email)
    `)
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            color: 'var(--accent)',
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          § 09 · BUILDS
        </div>
        <h1
          style={{ fontSize: 24, fontWeight: 600, margin: '0 0 4px', color: 'var(--paper)' }}
        >
          Build Queue
        </h1>
        <div style={{ fontSize: 13, color: 'var(--paper)', opacity: 0.45 }}>
          {builds?.length ?? 0} builds total
        </div>
      </div>
      <BuildQueueTable builds={(builds ?? []) as unknown as BuildRow[]} />
    </div>
  )
}
