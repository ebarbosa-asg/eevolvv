'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, SectionMarker, Badge, StatusPill } from '@/components/ds'
import type { BadgeVariant } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'
import { HealthDot } from '../components/shared'

type AgentRow = {
  id: string
  name: string
  type: string | null
  status: 'dev' | 'staging' | 'live' | 'paused' | 'error'
  integrations: string[] | null
  repo_url: string | null
  deploy_url: string | null
  last_run_at: string | null
  health: 'green' | 'yellow' | 'red'
  client_company: string | null
  client_id: string | null
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function agentStatusToVariant(status: string): BadgeVariant {
  if (status === 'live') return 'success'
  if (status === 'staging') return 'warning'
  if (status === 'error') return 'danger'
  return 'neutral'
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/os/agents')
      .then(r => r.json())
      .then((d: AgentRow[]) => setAgents(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="AGENTS" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <SectionMarker num="03" label="AGENT REGISTRY" className="mb-6" />

        {loading && (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-12 bg-ink/5 rounded animate-pulse" />
            ))}
          </div>
        )}

        {!loading && agents.length === 0 && (
          <Card>
            <CardContent>
              <p className="mono text-[11px] uppercase tracking-[0.1em] text-ink/25 text-center py-6">
                No agents yet
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && agents.length > 0 && (
          <Card className="overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-rule">
                  {['Agent', 'Client', 'Type', 'Status', 'Integrations', 'Health', 'Last Run'].map(h => (
                    <th
                      key={h}
                      className="mono text-[11px] uppercase tracking-[0.1em] text-ink/40 font-normal text-left px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.map(a => (
                  <tr
                    key={a.id}
                    className={`border-b border-rule/50 last:border-0 transition-colors ${
                      a.client_id ? 'cursor-pointer hover:bg-ink/[0.02]' : ''
                    }`}
                    onClick={() => {
                      if (a.client_id) {
                        window.location.href = `/os/clients/${a.client_id}/agents/${a.id}`
                      }
                    }}
                  >
                    <td className="px-4 py-3 font-semibold text-sm">{a.name}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">
                      {a.client_id ? (
                        <Link
                          href={`/os/clients/${a.client_id}`}
                          onClick={e => e.stopPropagation()}
                          className="text-accent no-underline hover:underline"
                        >
                          {a.client_company ?? '—'}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 mono text-[11px] text-ink/50">{a.type ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusPill variant={agentStatusToVariant(a.status)}>
                        {a.status}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(a.integrations ?? []).map(i => (
                          <Badge key={i} variant="neutral">
                            {i}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <HealthDot health={a.health} />
                    </td>
                    <td className="px-4 py-3 mono text-[11px] text-ink/40">
                      {a.last_run_at ? relativeTime(a.last_run_at) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
