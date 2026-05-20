'use client'

import { CalendarIcon } from './icons'

type Event = {
  date: string
  type: 'completed' | 'progress' | 'request' | 'created'
  icon: string
  text: string
}

type Props = {
  events: Event[]
}

const TYPE_COLORS: Record<string, string> = {
  completed: '#22c55e',
  progress:  '#eab308',
  request:   '#3b82f6',
  created:   '#a1a1aa',
}

const TYPE_ICONS: Record<string, string> = {
  completed: '✓',
  progress:  '▷',
  request:   '→',
  created:   '·',
}

export function Timeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div style={{ marginBottom: 24 }}>
        <SectionLabel />
        <div style={{ padding: '32px 0', textAlign: 'center', border: '1px dashed var(--rule)' }}>
          <CalendarIcon size={20} style={{ opacity: 0.2, marginBottom: 10 }} />
          <div className="mono" style={{ fontSize: 11, color: 'rgba(20,20,19,0.38)', letterSpacing: '0.12em' }}>
            NOTHING YET
          </div>
          <div style={{ fontSize: 13, color: 'rgba(20,20,19,0.45)', marginTop: 6 }}>
            Ask for something below — it shows up here.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionLabel />
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 11,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(20,20,19,0.1)',
        }} />
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 16, position: 'relative' }}>
            <div style={{
              width: 24,
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 2,
              position: 'relative',
              zIndex: 1,
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: TYPE_COLORS[e.type] ?? '#a1a1aa',
                color: '#fff',
                fontSize: 8,
                fontWeight: 700,
                fontFamily: 'inherit',
              }}>
                {TYPE_ICONS[e.type] ?? '·'}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(20,20,19,0.38)', marginBottom: 2 }}>
                {e.date}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                {e.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionLabel() {
  return (
    <div className="mono" style={{
      fontSize: 10,
      letterSpacing: '0.18em',
      color: 'rgba(20,20,19,0.42)',
      marginBottom: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <CalendarIcon size={12} />
      WHAT HAPPENED
    </div>
  )
}
