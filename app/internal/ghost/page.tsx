import Link from 'next/link'
import { getClients, getStats, PHASES, type ClientBuild, type Phase } from '@/lib/ghost-locker'

// ── Phase bar ─────────────────────────────────────────────────────────────

function PhaseBar({ phase, isLocked }: { phase: Phase; isLocked: boolean }) {
  const idx    = PHASES.indexOf(phase)
  const filled = isLocked ? 5 : idx + 1

  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {PHASES.map((p, i) => {
        const done    = i < filled
        const current = i === idx && !isLocked
        return (
          <div key={p} style={{
            height: '3px',
            flex: 1,
            borderRadius: '2px',
            background: done
              ? isLocked
                ? '#4ade80'
                : 'var(--accent)'
              : current
              ? 'rgba(var(--accent-rgb, 140,43,26),0.4)'
              : 'rgba(250,247,240,0.1)',
            transition: 'background 0.3s',
          }} />
        )
      })}
    </div>
  )
}

// ── Phase badge ───────────────────────────────────────────────────────────

function PhaseBadge({ phase, isLocked }: { phase: Phase; isLocked: boolean }) {
  const colors: Record<Phase, string> = {
    INTAKE:    'rgba(250,247,240,0.15)',
    BLUEPRINT: 'rgba(140,43,26,0.25)',
    BUILD:     'rgba(140,43,26,0.45)',
    EVAL:      'rgba(140,43,26,0.65)',
    LOCK:      'rgba(74,222,128,0.15)',
  }
  const textColors: Record<Phase, string> = {
    INTAKE:    'rgba(250,247,240,0.5)',
    BLUEPRINT: 'var(--accent)',
    BUILD:     'var(--accent)',
    EVAL:      'var(--accent)',
    LOCK:      '#4ade80',
  }

  return (
    <span style={{
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: '10px',
      letterSpacing: '0.15em',
      padding: '2px 8px',
      borderRadius: '2px',
      background: isLocked ? 'rgba(74,222,128,0.15)' : colors[phase],
      color: isLocked ? '#4ade80' : textColors[phase],
      textTransform: 'uppercase',
    }}>
      {isLocked ? '🔒 LOCKED' : phase}
    </span>
  )
}

// ── Client card ───────────────────────────────────────────────────────────

function ClientCard({ client }: { client: ClientBuild }) {
  return (
    <Link href={`/internal/ghost/${client.codename}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'rgba(250,247,240,0.04)',
        border: '1px solid rgba(250,247,240,0.08)',
        borderRadius: '8px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
        height: '100%',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.background = 'rgba(250,247,240,0.07)'
          el.style.borderColor = 'rgba(250,247,240,0.16)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.background = 'rgba(250,247,240,0.04)'
          el.style.borderColor = 'rgba(250,247,240,0.08)'
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: '11px', letterSpacing: '0.2em',
              color: 'var(--accent)', textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              {client.codename}
            </div>
            <div style={{
              color: 'rgba(250,247,240,0.9)',
              fontSize: '15px', fontWeight: 500,
              lineHeight: 1.3,
            }}>
              {client.agentName !== client.codename ? client.agentName : '—'}
            </div>
          </div>
          <PhaseBadge phase={client.phase} isLocked={client.isLocked} />
        </div>

        {/* Phase bar */}
        <div style={{ marginBottom: '16px' }}>
          <PhaseBar phase={client.phase} isLocked={client.isLocked} />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '6px',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: '10px', color: 'rgba(250,247,240,0.35)',
              letterSpacing: '0.1em',
            }}>
              Phase {PHASES.indexOf(client.phase) + 1} of 5
            </span>
            {client.evalScore !== undefined && (
              <span style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '10px', color: '#4ade80', letterSpacing: '0.1em',
              }}>
                EVAL {client.evalScore}%
              </span>
            )}
          </div>
        </div>

        {/* Meta */}
        <div style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '11px', lineHeight: '1.8',
          borderTop: '1px solid rgba(250,247,240,0.06)',
          paddingTop: '12px',
        }}>
          {client.complexity > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(250,247,240,0.35)' }}>COMPLEXITY</span>
              <span style={{ color: 'rgba(250,247,240,0.7)' }}>
                {client.complexity} · {client.complexityLabel}
              </span>
            </div>
          )}
          {client.started && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(250,247,240,0.35)' }}>STARTED</span>
              <span style={{ color: 'rgba(250,247,240,0.7)' }}>{client.started}</span>
            </div>
          )}
          {client.lockedDate && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(250,247,240,0.35)' }}>LOCKED</span>
              <span style={{ color: '#4ade80' }}>{client.lockedDate}</span>
            </div>
          )}
          {client.nextReview && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(250,247,240,0.35)' }}>NEXT REVIEW</span>
              <span style={{ color: 'rgba(250,247,240,0.7)' }}>{client.nextReview}</span>
            </div>
          )}
          {client.operator && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(250,247,240,0.35)' }}>OPERATOR</span>
              <span style={{ color: 'rgba(250,247,240,0.7)' }}>{client.operator}</span>
            </div>
          )}
        </div>

        {/* CTA arrow */}
        <div style={{
          marginTop: '16px', textAlign: 'right',
          color: 'var(--accent)', fontSize: '14px',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        }}>
          VIEW →
        </div>
      </div>
    </Link>
  )
}

// ── Stat chip ─────────────────────────────────────────────────────────────

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div style={{
      background: 'rgba(250,247,240,0.04)',
      border: '1px solid rgba(250,247,240,0.08)',
      borderRadius: '6px',
      padding: '16px 20px',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '10px', letterSpacing: '0.2em',
        color: 'rgba(250,247,240,0.4)', textTransform: 'uppercase',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '24px', fontWeight: 700,
        color: accent ? '#4ade80' : 'var(--paper)',
      }}>
        {value}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function GhostDashboard() {
  const clients = getClients()
  const stats   = getStats()
  const active  = clients.filter(c => !c.isLocked)
  const locked  = clients.filter(c =>  c.isLocked)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink)',
      color: 'var(--paper)',
      fontFamily: 'Space Grotesk, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid rgba(250,247,240,0.08)',
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '11px', letterSpacing: '0.2em',
            color: 'var(--accent)', textTransform: 'uppercase',
          }}>
            § GL-00 · GHOST LOCKER
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '10px', color: 'rgba(250,247,240,0.3)',
          }}>
            eevolvv internal · agent manufacturing
          </span>
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '10px', color: 'rgba(250,247,240,0.3)',
          letterSpacing: '0.1em',
        }}>
          {stats.active} ACTIVE · {stats.locked} LOCKED
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px' }}>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
          marginBottom: '48px',
        }}>
          <Stat label="Active builds"  value={stats.active} />
          <Stat label="Agents locked"  value={stats.locked} accent />
          <Stat label="Total clients"  value={stats.total} />
          <Stat label="Avg eval score" value={stats.avgEval ? `${Math.round(stats.avgEval)}%` : '—'} />
        </div>

        {/* Active builds */}
        {active.length > 0 ? (
          <section style={{ marginBottom: '56px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '11px', letterSpacing: '0.2em',
                color: 'var(--accent)', textTransform: 'uppercase',
              }}>
                § 01 · ACTIVE BUILDS
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}>
              {active.map(c => <ClientCard key={c.codename} client={c} />)}
            </div>
          </section>
        ) : (
          <section style={{ marginBottom: '56px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '11px', letterSpacing: '0.2em',
                color: 'var(--accent)', textTransform: 'uppercase',
              }}>
                § 01 · ACTIVE BUILDS
              </span>
            </div>
            <div style={{
              border: '1px dashed rgba(250,247,240,0.1)',
              borderRadius: '8px', padding: '48px 32px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '11px', color: 'rgba(250,247,240,0.3)',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                NO ACTIVE BUILDS
              </div>
              <div style={{ color: 'rgba(250,247,240,0.4)', fontSize: '13px' }}>
                Start one in Claude: <code style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  color: 'var(--accent)', fontSize: '12px',
                }}>/ghost:intake {'{codename}'}</code>
              </div>
            </div>
          </section>
        )}

        {/* Locked agents */}
        {locked.length > 0 && (
          <section>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '11px', letterSpacing: '0.2em',
                color: '#4ade80', textTransform: 'uppercase',
              }}>
                § 02 · LOCKED · {locked.length}
              </span>
            </div>
            <div style={{
              border: '1px solid rgba(250,247,240,0.08)',
              borderRadius: '8px', overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(250,247,240,0.08)' }}>
                    {['CODENAME', 'AGENT NAME', 'LOCKED', 'EVAL', 'COMPLEXITY', 'NEXT REVIEW'].map(h => (
                      <th key={h} style={{
                        padding: '12px 20px', textAlign: 'left',
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: '10px', letterSpacing: '0.15em',
                        color: 'rgba(250,247,240,0.35)', fontWeight: 500,
                        textTransform: 'uppercase',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {locked.map((c, i) => (
                    <tr key={c.codename}
                      style={{
                        borderBottom: i < locked.length - 1 ? '1px solid rgba(250,247,240,0.05)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(250,247,240,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <Link href={`/internal/ghost/${c.codename}`} style={{
                          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                          fontSize: '12px', color: 'var(--accent)',
                          textDecoration: 'none', letterSpacing: '0.1em',
                        }}>
                          {c.codename}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 20px', color: 'rgba(250,247,240,0.8)', fontSize: '13px' }}>
                        {c.agentName !== c.codename ? c.agentName : '—'}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: '11px', color: '#4ade80',
                      }}>
                        {c.lockedDate || '—'}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: '11px',
                        color: (c.evalScore ?? 0) >= 90 ? '#4ade80' : 'rgba(250,247,240,0.7)',
                      }}>
                        {c.evalScore !== undefined ? `${c.evalScore}%` : '—'}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: '11px', color: 'rgba(250,247,240,0.5)',
                      }}>
                        {c.complexity ? `${c.complexity} · ${c.complexityLabel}` : '—'}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                        fontSize: '11px', color: 'rgba(250,247,240,0.5)',
                      }}>
                        {c.nextReview || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
