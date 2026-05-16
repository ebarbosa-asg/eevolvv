'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Lead {
  id: string
  email: string
  name: string | null
  company: string | null
  business_type: string | null
  stage: string
  created_at: string
  contract_value: number | null
  agent_count: number
  latest_task: { id: string; status: string; updated_at: string } | null
}

const STAGE_LABELS: Record<string, string> = {
  cold: 'Cold',
  contacted: 'Contacted',
  nurtured: 'Nurtured',
  qualified: 'Qualified',
  closed: 'Closed',
  lost: 'Lost',
}

const STAGE_COLORS: Record<string, string> = {
  cold: '#a1a1aa',
  contacted: '#60a5fa',
  nurtured: '#a78bfa',
  qualified: '#fbbf24',
  closed: '#4ade80',
  lost: '#f87171',
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadLeads()
  }, [])

  async function loadLeads() {
    try {
      const res = await fetch('/api/os/clients')
      if (!res.ok) throw new Error('Failed to load leads')
      const data = await res.json()
      setLeads(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function updateStage(id: string, newStage: string) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/os/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, stage: newStage } : l))
      )
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setUpdating(null)
    }
  }

  const filteredLeads =
    filter === 'all' ? leads : leads.filter((l) => l.stage === filter)

  const stageCounts = leads.reduce(
    (acc, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  if (loading) {
    return (
      <main className="min-h-screen bg-paper text-ink p-8">
        <div className="mono text-xs tracking-widest opacity-40">LOADING PIPELINE...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-paper text-ink p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="mono text-[10px] tracking-[0.3em] text-accent mb-4 font-bold">
          LEAD PIPELINE
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Manage Leads</h1>
        <p className="text-sm opacity-60">
          {leads.length} total leads · {stageCounts.closed || 0} closed ·{' '}
          {stageCounts.qualified || 0} qualified
        </p>
      </header>

      {/* Stage Summary */}
      <section className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {Object.entries(STAGE_LABELS).map(([stage, label]) => (
          <button
            key={stage}
            onClick={() => setFilter(filter === stage ? 'all' : stage)}
            className={`border-2 p-3 text-left transition-colors ${
              filter === stage ? 'border-ink bg-ink/5' : 'border-ink/10'
            }`}
          >
            <div className="mono text-[8px] tracking-[0.3em] uppercase opacity-40 mb-1">
              {label}
            </div>
            <div className="text-2xl font-bold" style={{ color: STAGE_COLORS[stage] }}>
              {stageCounts[stage] || 0}
            </div>
          </button>
        ))}
      </section>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`mono text-[10px] tracking-[0.2em] px-4 py-2 border-2 ${
            filter === 'all' ? 'border-ink bg-ink text-paper' : 'border-ink/20'
          }`}
        >
          ALL
        </button>
        {Object.entries(STAGE_LABELS).map(([stage, label]) => (
          <button
            key={stage}
            onClick={() => setFilter(filter === stage ? 'all' : stage)}
            className={`mono text-[10px] tracking-[0.2em] px-4 py-2 border-2 ${
              filter === stage ? 'border-ink bg-ink text-paper' : 'border-ink/20'
            }`}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="border-2 border-red-500 p-4 mb-6 text-red-600 mono text-xs">
          ERROR: {error}
        </div>
      )}

      {/* Leads Table */}
      <div className="border-2 border-ink/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-40">
                BUSINESS
              </th>
              <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-40">
                EMAIL
              </th>
              <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-40">
                TYPE
              </th>
              <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-40">
                STAGE
              </th>
              <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-40">
                VALUE
              </th>
              <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-40">
                DATE
              </th>
              <th className="text-right p-4 mono text-[9px] tracking-[0.26em] opacity-40">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center opacity-40">
                  No leads found. Striker will populate this automatically.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-ink/5 hover:bg-ink/5">
                  <td className="p-4 font-medium text-sm">
                    {lead.company || lead.name || '—'}
                  </td>
                  <td className="p-4 text-sm opacity-60">{lead.email}</td>
                  <td className="p-4 text-sm opacity-60">
                    {lead.business_type || '—'}
                  </td>
                  <td className="p-4">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ background: STAGE_COLORS[lead.stage] || '#a1a1aa' }}
                    />
                    <span className="text-sm">
                      {STAGE_LABELS[lead.stage] || lead.stage}
                    </span>
                  </td>
                  <td className="p-4 text-sm opacity-60">
                    {lead.contract_value ? `$${lead.contract_value.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4 text-sm opacity-40">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={lead.stage}
                      onChange={(e) => updateStage(lead.id, e.target.value)}
                      disabled={updating === lead.id}
                      className="mono text-[10px] border border-ink/20 px-2 py-1 bg-paper"
                    >
                      {Object.entries(STAGE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <footer className="mt-8 flex gap-4">
        <Link
          href="/os/dashboard"
          className="mono text-xs tracking-[0.2em] border-2 border-ink px-6 py-3 font-bold hover:bg-ink hover:text-paper transition-colors"
        >
          ← BACK TO DASHBOARD
        </Link>
      </footer>
    </main>
  )
}
