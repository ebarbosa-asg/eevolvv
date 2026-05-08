'use client'

import { useState } from 'react'
import type { BuildRow } from './page'

const STATUS_ORDER = ['queued', 'in_progress', 'qa', 'deploying', 'live', 'failed', 'paused']
const STATUS_LABELS: Record<string, string> = {
  queued: 'Queued',
  in_progress: 'In Progress',
  qa: 'QA',
  deploying: 'Deploying',
  live: 'Live',
  failed: 'Failed',
  paused: 'Paused',
}

export function BuildQueueTable({ builds }: { builds: BuildRow[] }) {
  const [filter, setFilter] = useState<string>('all')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [buildUrls, setBuildUrls] = useState<Record<string, string>>({})
  const [localBuilds, setLocalBuilds] = useState<BuildRow[]>(builds)

  const filtered = filter === 'all' ? localBuilds : localBuilds.filter(b => b.status === filter)
  const counts = STATUS_ORDER.reduce(
    (acc, s) => {
      acc[s] = localBuilds.filter(b => b.status === s).length
      return acc
    },
    {} as Record<string, number>
  )

  async function updateStatus(buildId: string, status: string, buildUrl?: string) {
    setLoadingId(buildId)
    try {
      const res = await fetch('/api/builds/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId, status, buildUrl }),
      })
      if (res.ok) {
        setLocalBuilds(prev =>
          prev.map(b => (b.id === buildId ? { ...b, status, build_url: buildUrl ?? b.build_url } : b))
        )
      } else {
        const data = await res.json()
        alert(data.error ?? 'Update failed')
      }
    } catch {
      alert('Network error')
    } finally {
      setLoadingId(null)
    }
  }

  function handleMarkLive(buildId: string) {
    const url = buildUrls[buildId]?.trim()
    if (!url) {
      alert('Enter the production URL before marking live.')
      return
    }
    updateStatus(buildId, 'live', url)
  }

  const tabStyle = (s: string): React.CSSProperties => ({
    padding: '7px 14px',
    fontSize: 10,
    letterSpacing: '0.14em',
    fontWeight: 600,
    cursor: 'pointer',
    background: filter === s ? 'var(--accent)' : 'transparent',
    color: 'var(--paper)',
    border: '1px solid rgba(255,255,255,0.12)',
    fontFamily: 'JetBrains Mono, monospace',
    opacity: filter === s ? 1 : 0.6,
  })

  return (
    <div>
      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={tabStyle('all')}>
          ALL ({localBuilds.length})
        </button>
        {STATUS_ORDER.map(
          s =>
            counts[s] > 0 && (
              <button key={s} onClick={() => setFilter(s)} style={tabStyle(s)}>
                {STATUS_LABELS[s].toUpperCase()} ({counts[s]})
              </button>
            )
        )}
      </div>

      {/* Build list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {filtered.length === 0 && (
          <div
            style={{
              padding: '32px 0',
              color: 'var(--paper)',
              opacity: 0.4,
              textAlign: 'center',
              fontSize: 13,
            }}
          >
            No builds in this status.
          </div>
        )}
        {filtered.map(build => (
          <div
            key={build.id}
            style={{
              background: 'rgba(20,20,19,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--paper)' }}>
                  {build.clients?.name || build.clients?.email || 'Unknown'}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--accent)' }}
                >
                  {build.tier.toUpperCase()}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--paper)', opacity: 0.4 }}
                >
                  {STATUS_LABELS[build.status]?.toUpperCase()}
                </span>
              </div>
              <div
                style={{ display: 'flex', gap: 20, fontSize: 11, color: 'var(--paper)', opacity: 0.45 }}
              >
                <span>Created: {new Date(build.created_at).toLocaleDateString()}</span>
                {build.assigned_to && <span>→ {build.assigned_to}</span>}
                {build.build_url && (
                  <a
                    href={build.build_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)' }}
                  >
                    View site
                  </a>
                )}
              </div>
              {/* Build URL input for deploying→live */}
              {build.status === 'deploying' && (
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <input
                    placeholder="https://client-site.vercel.app"
                    value={buildUrls[build.id] ?? ''}
                    onChange={e => setBuildUrls(prev => ({ ...prev, [build.id]: e.target.value }))}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'var(--paper)',
                      fontSize: 12,
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {build.status === 'queued' && (
                <ActionButton
                  label="START BUILD"
                  onClick={() => updateStatus(build.id, 'in_progress')}
                  loading={loadingId === build.id}
                />
              )}
              {build.status === 'in_progress' && (
                <ActionButton
                  label="SUBMIT FOR QA"
                  onClick={() => updateStatus(build.id, 'qa')}
                  loading={loadingId === build.id}
                />
              )}
              {build.status === 'qa' && (
                <>
                  <ActionButton
                    label="APPROVE QA"
                    onClick={() => updateStatus(build.id, 'deploying')}
                    loading={loadingId === build.id}
                  />
                  <ActionButton
                    label="NEEDS REWORK"
                    onClick={() => updateStatus(build.id, 'in_progress')}
                    loading={loadingId === build.id}
                    variant="ghost"
                  />
                </>
              )}
              {build.status === 'deploying' && (
                <ActionButton
                  label="MARK LIVE"
                  onClick={() => handleMarkLive(build.id)}
                  loading={loadingId === build.id}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  loading,
  variant = 'primary',
}: {
  label: string
  onClick: () => void
  loading: boolean
  variant?: 'primary' | 'ghost'
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mono"
      style={{
        padding: '8px 16px',
        fontSize: 9,
        letterSpacing: '0.16em',
        fontWeight: 700,
        background: variant === 'primary' ? 'var(--accent)' : 'transparent',
        color: 'var(--paper)',
        border: '1px solid rgba(255,255,255,0.2)',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {loading ? '...' : label}
    </button>
  )
}
