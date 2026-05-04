'use client'

import { Fragment, useState, useEffect } from 'react'
import { Card, CardContent, SectionMarker, Badge, KPIStat, TerminalBlock } from '@/components/ds'
import type { BadgeVariant } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'
import type { Submission } from '../page'

type Metrics = { events: Record<string, { '7d': number; '30d': number }> }

const FUNNEL_EVENTS = [
  'diagnostic_chat_started',
  'diagnostic_intake_completed',
  'diagnostic_report_generated',
  'diagnostic_cta_clicked',
] as const

const CONVERSION_PAIRS = [
  { from: 'diagnostic_chat_started', to: 'diagnostic_intake_completed' },
  { from: 'diagnostic_intake_completed', to: 'diagnostic_report_generated' },
  { from: 'diagnostic_report_generated', to: 'diagnostic_cta_clicked' },
]

function submissionStatusToBadge(status: string | null): BadgeVariant {
  if (status === 'completed') return 'success'
  if (status === 'error') return 'danger'
  return 'warning'
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function FeedClient({ submissions }: { submissions: Submission[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(true)
  const [metricsError, setMetricsError] = useState(false)

  useEffect(() => {
    fetch('/api/os/metrics')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Metrics) => setMetrics(d))
      .catch(() => setMetricsError(true))
      .finally(() => setMetricsLoading(false))
  }, [])

  const total = submissions.length
  const completed = submissions.filter(s => s.status === 'completed').length
  const emailsSent = submissions.filter(s => s.email_sent).length
  const errors = submissions.filter(s => s.status === 'error').length

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="FEED" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <SectionMarker num="01" label="DIAGNOSTIC FEED" className="mb-6" />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent>
              <KPIStat value={total} label="TOTAL" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <KPIStat value={completed} label="COMPLETED" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <KPIStat value={emailsSent} label="EMAILS SENT" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <KPIStat
                value={total > 0 ? `${Math.round((errors / total) * 100)}%` : '0%'}
                label="ERROR RATE"
              />
            </CardContent>
          </Card>
        </div>

        {/* Submissions table */}
        <Card className="mb-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '560px' }}>
              <thead>
                <tr className="border-b border-rule">
                  {['Name', 'Business', 'Tier', 'Status', 'When', '✉'].map(h => (
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
                {submissions.map(s => (
                  <Fragment key={s.id}>
                    <tr
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                      className="border-b border-rule/30 cursor-pointer hover:bg-ink/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">{s.name ?? '—'}</td>
                      <td className="px-4 py-3 text-sm">{s.business_name ?? '—'}</td>
                      <td className="px-4 py-3 mono text-[11px] uppercase">{s.tier ?? '—'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={submissionStatusToBadge(s.status)}>
                          {s.status ?? '—'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 mono text-[11px] text-ink/60">
                        {relativeTime(s.created_at)}
                      </td>
                      <td className="px-4 py-3 text-base">{s.email_sent ? '✓' : '—'}</td>
                    </tr>
                    {expanded === s.id && s.report && (
                      <tr>
                        <td colSpan={6} className="px-4 pb-4">
                          <TerminalBlock
                            lines={s.report
                              .split('\n')
                              .filter(Boolean)
                              .map(line => ({ type: 'primary' as const, value: line }))}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center mono text-sm text-ink/40"
                    >
                      No submissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* PostHog funnel metrics */}
        {!metricsLoading && !metricsError && metrics && (
          <Card>
            <CardContent className="flex flex-wrap gap-5 items-center">
              {FUNNEL_EVENTS.map((evt, i) => {
                const d = metrics.events?.[evt]
                const pair = CONVERSION_PAIRS[i]
                const fc = pair ? metrics.events?.[pair.from]?.['7d'] : null
                const tc = pair ? metrics.events?.[pair.to]?.['7d'] : null
                const pct = fc && tc && fc > 0 ? Math.round((tc / fc) * 100) : null
                return (
                  <Fragment key={evt}>
                    <span className="flex gap-1.5 items-baseline">
                      <span className="mono text-[11px] text-ink/35">
                        {evt.replace('diagnostic_', '')}
                      </span>
                      <span className="mono text-[11px] text-accent">{d?.['7d'] ?? '—'}</span>
                      <span className="mono text-[11px] text-ink/25">/ {d?.['30d'] ?? '—'}</span>
                    </span>
                    {i < CONVERSION_PAIRS.length && pct !== null && (
                      <span className="mono text-[11px] text-ink/30">→ {pct}%</span>
                    )}
                  </Fragment>
                )
              })}
              <a
                href="https://us.posthog.com/project/407291/dashboard/1537727"
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-[11px] text-accent ml-auto no-underline hover:underline"
              >
                PostHog →
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
