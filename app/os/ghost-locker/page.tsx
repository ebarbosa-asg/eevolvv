'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, SectionMarker } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'
import { EmptyState } from '../components/shared'
type GhostClient = {
  codename: string
  company: string
  contact: string
  contact_role: string
  email: string
  tier: string
  contract_value: number
  phase: string
  agents: number
  start_date: string
  status: string
  notes: string
  phases_complete: {
    onboard: boolean
    intake: boolean
    blueprint: boolean
    build: boolean
    eval: boolean
    lock: boolean
  }
}

const PHASES = ['onboard', 'intake', 'blueprint', 'build', 'eval', 'lock'] as const
const MONO = { fontFamily: 'JetBrains Mono, ui-monospace, monospace' } as const

function PhasePip({ complete, label }: { complete: boolean; label: string }) {
  return (
    <span
      style={{
        ...MONO,
        fontSize: 9,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: complete ? 'var(--accent)' : 'rgba(20,20,19,0.25)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <span style={{ fontSize: 10 }}>{complete ? '▓' : '░'}</span>
      {label}
    </span>
  )
}

function StatusChip({ status }: { status: string }) {
  const locked = status === 'locked'
  return (
    <span
      style={{
        ...MONO,
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        padding: '3px 8px',
        borderRadius: 4,
        background: locked ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)',
        color: locked ? '#4ade80' : '#fbbf24',
        border: `1px solid ${locked ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`,
      }}
    >
      {status}
    </span>
  )
}

export default function GhostLockerPage() {
  const [clients, setClients] = useState<GhostClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/os/ghost-locker')
      .then((r) => r.json())
      .then((d: GhostClient[]) => setClients(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const locked = clients.filter((c) => c.status === 'locked').length
  const active = clients.filter((c) => c.status !== 'locked').length
  const totalArr = clients.reduce((sum, c) => sum + (c.contract_value ?? 0), 0)
  const totalAgents = clients.reduce((sum, c) => sum + (c.agents ?? 0), 0)

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="GHOST LOCKER" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">

        <div className="mb-8">
          <SectionMarker num="08" label="AGENT MANUFACTURING PIPELINE" />
          <p className="mono text-[11px] text-ink/40 mt-2 tracking-wide">
            // ghost_locker — every client · every agent · every phase · fully tracked
          </p>
        </div>

        {/* Stats strip */}
        <div
          className="grid grid-cols-4 gap-px mb-8 overflow-hidden rounded-xl"
          style={{ border: '1px solid var(--rule)' }}
        >
          {[
            { label: 'Total builds', value: clients.length },
            { label: 'Locked (live)', value: locked },
            { label: 'In pipeline', value: active },
            { label: 'Total ARR', value: totalArr ? `$${totalArr.toLocaleString()}` : '—' },
          ].map((stat) => (
            <div key={stat.label} className="bg-paper px-6 py-5">
              <div className="mono text-[10px] uppercase tracking-[0.15em] text-ink/35 mb-1">
                {stat.label}
              </div>
              <div
                style={{ ...MONO, fontSize: 22, fontWeight: 600, color: 'var(--accent)' }}
              >
                {loading ? '—' : stat.value}
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col gap-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-14 bg-ink/5 rounded animate-pulse" />
            ))}
          </div>
        )}

        {!loading && clients.length === 0 && (
          <EmptyState message="No active builds — Ghost Locker activates on first client payment" />
        )}

        {!loading && clients.length > 0 && (
          <Card className="overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-rule">
                  {['Codename', 'Company', 'Tier', 'Phase pipeline', 'Agents', 'Contract', 'Status', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="mono text-[10px] uppercase tracking-[0.1em] text-ink/35 font-normal text-left px-4 py-3"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.codename}
                    className="border-b border-rule/50 last:border-0 hover:bg-ink/[0.02] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span
                        style={{
                          ...MONO,
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--accent)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {c.codename}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">{c.company}</td>
                    <td className="px-4 py-4 mono text-[11px] text-ink/50">{c.tier}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {PHASES.map((p) => (
                          <PhasePip
                            key={p}
                            complete={c.phases_complete[p]}
                            label={p}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 mono text-sm text-ink/60">{c.agents}</td>
                    <td className="px-4 py-4 mono text-sm text-ink/60">
                      {c.contract_value ? `$${c.contract_value.toLocaleString()}/yr` : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <StatusChip status={c.status} />
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/os/ghost-locker/${c.codename}`}
                        className="mono text-sm text-accent no-underline hover:opacity-70 transition-opacity"
                      >
                        →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {!loading && clients.length > 0 && (
          <div
            className="mt-6 px-5 py-4 rounded-lg mono text-[11px] leading-7"
            style={{
              background: 'rgba(20,20,19,.04)',
              border: '1px solid var(--rule)',
              borderLeft: '3px solid var(--accent)',
            }}
          >
            <div className="text-ink/30 mb-1">// ghost_locker.log — pipeline stats</div>
            <div>
              <span className="text-accent">→</span>{' '}
              <span className="text-ink/50 uppercase tracking-wider">TOTAL CLIENTS &nbsp;&nbsp;</span>{' '}
              <span className="text-ink/70">↳ {clients.length} engagement{clients.length !== 1 ? 's' : ''} in system</span>
            </div>
            <div>
              <span className="text-accent">→</span>{' '}
              <span className="text-ink/50 uppercase tracking-wider">AGENTS LIVE &nbsp;&nbsp;&nbsp;&nbsp;</span>{' '}
              <span className="text-ink/70">↳ {totalAgents} agent{totalAgents !== 1 ? 's' : ''} deployed in production</span>
            </div>
            <div>
              <span className="text-accent">→</span>{' '}
              <span className="text-ink/50 uppercase tracking-wider">LOCKED BUILDS &nbsp;&nbsp;</span>{' '}
              <span className="text-ink/70">↳ {locked} of {clients.length} reached production</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
