'use client'

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
  progress: '#eab308',
  request: '#3b82f6',
  created: '#a1a1aa',
}

export function Timeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div style={{ marginBottom: 24 }}>
        <SectionLabel icon="📅" label="WHAT HAPPENED" />
        <div style={{ padding: '32px 0', textAlign: 'center', border: '1px dashed var(--rule)' }}>
          <span className="mono" style={{ fontSize: 11, color: 'rgba(20,20,19,0.38)' }}>
            Nothing yet — ask for something below
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionLabel icon="📅" label="WHAT HAPPENED" />
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: 11,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(20,20,19,0.12)',
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
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: TYPE_COLORS[e.type],
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(20,20,19,0.38)', marginBottom: 2 }}>
                {e.date}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                <span style={{ marginRight: 6 }}>{e.icon}</span>
                {e.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ icon, label }: { icon: string; label: string }) {
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
      {icon} {label}
    </div>
  )
}