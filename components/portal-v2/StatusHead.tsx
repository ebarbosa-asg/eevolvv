'use client'

type Props = {
  company: string
  planName: string
  allRunning: boolean
}

export function StatusHead({ company, planName, allRunning }: Props) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 0',
      borderBottom: '1px solid var(--rule)',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: allRunning ? '#22c55e' : '#eab308',
            boxShadow: allRunning ? '0 0 8px rgba(34,197,94,0.5)' : 'none',
            animation: allRunning ? 'pulse-dot 2s ease-in-out infinite' : 'none',
          }}
        />
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em' }}>
          {company}
        </span>
      </div>
      <span
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.14em',
          padding: '5px 10px',
          border: '1px solid var(--rule)',
          color: 'rgba(20,20,19,0.55)',
        }}
      >
        {planName}
      </span>
    </div>
  )
}