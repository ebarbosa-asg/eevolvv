import { Fragment } from 'react'

const STAGES = ['diagnose', 'onboard', 'build', 'maintain'] as const

export function HealthDot({ health }: { health: 'green' | 'yellow' | 'red' }) {
  const color = health === 'green' ? '#4ade80' : health === 'yellow' ? '#f59e0b' : 'var(--accent)'
  return (
    <span
      style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  )
}

export function StagePipeline({ stage }: { stage: string }) {
  const active = STAGES.indexOf(stage as typeof STAGES[number])
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {STAGES.map((s, i) => (
        <Fragment key={s}>
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: i <= active ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
              flexShrink: 0,
            }}
            title={s}
          />
          {i < STAGES.length - 1 && (
            <div
              style={{
                width: '10px',
                height: '1px',
                background: i < active ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
              }}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '40px 24px',
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(250,247,240,0.2)',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {message}
    </div>
  )
}
