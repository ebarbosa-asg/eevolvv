'use client'

import { useState } from 'react'
import { CheckIcon, ClockIcon, GearIcon, BoxIcon } from './icons'

type WorkItem = {
  title: string
  stage: string
  deliverable?: string
  proof?: string
  owner?: string
  timing?: string
  metric?: string
  detail?: string
}

type Props = {
  items: WorkItem[]
}

const STAGES: Array<{ key: string; label: string; dot: string; description: string }> = [
  { key: 'intake',   label: 'IN REVIEW',  dot: '#a1a1aa', description: 'Scoped, not yet started' },
  { key: 'paid',     label: 'PAID',       dot: '#a1a1aa', description: 'Confirmed, queued' },
  { key: 'building', label: 'BUILDING',   dot: '#eab308', description: 'Active build in progress' },
  { key: 'live',     label: 'LIVE',       dot: '#22c55e', description: 'Running and measured' },
]

function stageIcon(stage: string) {
  if (stage === 'live') return <CheckIcon size={14} />
  if (stage === 'building') return <GearIcon size={14} />
  if (stage === 'intake' || stage === 'paid') return <BoxIcon size={14} />
  return <ClockIcon size={14} />
}

export function DeliverablesTab({ items }: Props) {
  if (items.length === 0) {
    return (
      <div style={{
        padding: '48px 0',
        textAlign: 'center',
        border: '1px dashed var(--rule)',
      }}>
        <BoxIcon size={24} style={{ opacity: 0.25, marginBottom: 12 }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {STAGES.map(stage => {
        const stageItems = items.filter(i => i.stage === stage.key)
        if (stageItems.length === 0) return null
        return (
          <div key={stage.key}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: stage.dot,
                boxShadow: stage.key === 'live' ? '0 0 6px rgba(34,197,94,0.6)' : 'none',
              }} />
              <span className="mono" style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'rgba(20,20,19,0.45)',
              }}>
                {stage.label}
              </span>
              <span className="mono" style={{
                fontSize: 9,
                color: 'rgba(20,20,19,0.3)',
                letterSpacing: '0.06em',
              }}>
                · {stageItems.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stageItems.map(item => (
                <DeliverableCard key={item.title} item={item} stage={stage} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DeliverableCard({
  item,
  stage,
}: {
  item: WorkItem
  stage: { key: string; dot: string; label: string }
}) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        background: hovered ? 'rgba(20,20,19,0.025)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
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
        <span style={{ color: stage.dot === '#22c55e' ? '#22c55e' : stage.dot === '#eab308' ? '#eab308' : 'rgba(20,20,19,0.35)', flexShrink: 0 }}>
          {stageIcon(stage.key)}
        </span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
          {item.title}
        </span>
        {item.timing && (
          <span className="mono" style={{ fontSize: 10, color: stage.key === 'building' ? '#eab308' : 'rgba(20,20,19,0.35)', letterSpacing: '0.06em', flexShrink: 0 }}>
            {item.timing}
          </span>
        )}
        {item.proof && (
          <span className="mono" style={{
            fontSize: 10,
            color: stage.key === 'live' ? '#22c55e' : 'rgba(20,20,19,0.38)',
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}>
            {item.proof.split('.')[0]}
          </span>
        )}
      </button>

      {expanded && (
        <div style={{
          padding: '0 16px 16px 42px',
          borderTop: '1px solid var(--rule)',
        }}>
          {item.deliverable && (
            <p style={{ margin: '12px 0 8px', fontSize: 13, lineHeight: 1.6, color: 'rgba(20,20,19,0.65)' }}>
              {item.deliverable}
            </p>
          )}
          {item.proof && (
            <p className="mono" style={{ margin: '0 0 8px', fontSize: 11, color: stage.key === 'live' ? '#22c55e' : 'rgba(20,20,19,0.45)', letterSpacing: '0.04em' }}>
              → {item.proof}
            </p>
          )}
          {item.owner && (
            <p className="mono" style={{ margin: 0, fontSize: 10, color: 'rgba(20,20,19,0.35)', letterSpacing: '0.08em' }}>
              OWNER: {item.owner}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
