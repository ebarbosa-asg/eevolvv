'use client'

import { useState } from 'react'
import { CheckIcon, ClockIcon, GearIcon, BoxIcon } from './icons'
import type { ClientDeliverableRecord } from '@/lib/deliverables'

type WorkItem = {
  title: string
  stage: string
  deliverable?: string
  proof?: string
  owner?: string
  timing?: string
}

type NormalizedItem = {
  id: string
  title: string
  status: string
  promise: string
  proof: string[]
  owner: string
  timing: string
}

type Props = {
  deliverables: ClientDeliverableRecord[] | null
  fallbackItems: WorkItem[]
  loading?: boolean
}

const STAGES: Array<{ key: string; label: string; dot: string }> = [
  { key: 'intake',    label: 'IN REVIEW',  dot: '#a1a1aa' },
  { key: 'queued',    label: 'QUEUED',     dot: '#a1a1aa' },
  { key: 'building',  label: 'BUILDING',   dot: '#eab308' },
  { key: 'review',    label: 'REVIEW',     dot: '#3b82f6' },
  { key: 'live',      label: 'LIVE',       dot: '#22c55e' },
]

function normalize(
  deliverables: ClientDeliverableRecord[] | null,
  fallback: WorkItem[],
): NormalizedItem[] {
  if (deliverables !== null && deliverables.length > 0) {
    return deliverables
      .filter(d => d.status !== 'recommended') // recommended live in Add-ons tab
      .map(d => ({
        id: d.id,
        title: d.title,
        status: d.status,
        promise: d.promise,
        proof: d.proof ?? [],
        owner: 'eevolvv',
        timing: d.delivery_window,
      }))
  }
  // Fallback to page.activeWork while API loads
  return fallback.map((w, i) => ({
    id: String(i),
    title: w.title,
    status: w.stage,
    promise: w.deliverable ?? w.title,
    proof: w.proof ? [w.proof] : [],
    owner: w.owner ?? 'eevolvv',
    timing: w.timing ?? '',
  }))
}

export function DeliverablesTab({ deliverables, fallbackItems, loading }: Props) {
  const items = normalize(deliverables, fallbackItems)

  if (loading && deliverables === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              height: 52,
              border: '1px solid var(--rule)',
              background: 'rgba(20,20,19,0.04)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
        <style>{`@keyframes pulse { 0%,100% { opacity:.5 } 50% { opacity:1 } }`}</style>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', border: '1px dashed var(--rule)' }}>
        <BoxIcon size={24} style={{ opacity: 0.2, marginBottom: 12 }} />
        <div className="mono" style={{ fontSize: 11, color: 'rgba(20,20,19,0.38)', letterSpacing: '0.12em' }}>
          NO ACTIVE WORK
        </div>
        <div style={{ fontSize: 13, color: 'rgba(20,20,19,0.45)', marginTop: 6 }}>
          Ask below to kick off your first deliverable.
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {STAGES.map(stage => {
        const stageItems = items.filter(i => i.status === stage.key)
        if (stageItems.length === 0) return null
        return (
          <div key={stage.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: stage.dot,
                boxShadow: stage.key === 'live' ? '0 0 6px rgba(34,197,94,0.6)' : 'none',
              }} />
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(20,20,19,0.45)' }}>
                {stage.label}
              </span>
              <span className="mono" style={{ fontSize: 9, color: 'rgba(20,20,19,0.3)' }}>
                · {stageItems.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stageItems.map(item => (
                <DeliverableCard key={item.id} item={item} stage={stage} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DeliverableCard({ item, stage }: { item: NormalizedItem; stage: { key: string; dot: string } }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const iconColor =
    stage.key === 'live'     ? '#22c55e' :
    stage.key === 'building' ? '#eab308' :
    stage.key === 'review'   ? '#3b82f6' :
    'rgba(20,20,19,0.35)'

  const Icon =
    stage.key === 'live'     ? CheckIcon :
    stage.key === 'building' ? GearIcon  :
    BoxIcon

  return (
    <div style={{
      border: '1px solid var(--rule)',
      background: hovered ? 'rgba(20,20,19,0.025)' : 'transparent',
      transition: 'background 0.12s',
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '14px 16px',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ color: iconColor, flexShrink: 0 }}>
          <Icon size={14} />
        </span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{item.title}</span>
        {item.timing && (
          <span className="mono" style={{
            fontSize: 10,
            color: stage.key === 'building' ? '#eab308' : 'rgba(20,20,19,0.35)',
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}>
            {item.timing}
          </span>
        )}
        <span style={{ color: 'rgba(20,20,19,0.35)', flexShrink: 0, fontSize: 10 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 14px 42px', borderTop: '1px solid var(--rule)' }}>
          {item.promise && (
            <p style={{ margin: '10px 0 6px', fontSize: 13, lineHeight: 1.6, color: 'rgba(20,20,19,0.65)' }}>
              {item.promise}
            </p>
          )}
          {item.proof.length > 0 && (
            <div style={{ marginTop: 6 }}>
              {item.proof.map((p, i) => (
                <p key={i} className="mono" style={{ margin: '0 0 4px', fontSize: 11, color: stage.key === 'live' ? '#22c55e' : 'rgba(20,20,19,0.45)' }}>
                  → {p}
                </p>
              ))}
            </div>
          )}
          {item.owner && (
            <p className="mono" style={{ margin: '8px 0 0', fontSize: 10, color: 'rgba(20,20,19,0.35)', letterSpacing: '0.08em' }}>
              OWNER: {item.owner}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
