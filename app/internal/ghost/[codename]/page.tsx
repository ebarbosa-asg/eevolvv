import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getClient, getFileContent, PHASES, type Phase, type ClientDetail } from '@/lib/ghost-locker'

// ── Phase step ────────────────────────────────────────────────────────────

function PhaseStep({
  phase, label, index, currentIndex, isLocked,
}: {
  phase: Phase; label: string; index: number
  currentIndex: number; isLocked: boolean
}) {
  const done    = isLocked || index < currentIndex
  const current = !isLocked && index === currentIndex

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '8px 0' }}>
      {/* Indicator */}
      <div style={{ flexShrink: 0, paddingTop: '1px' }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: done
            ? isLocked ? '#4ade80' : 'var(--accent)'
            : current
            ? 'rgba(140,43,26,0.3)'
            : 'rgba(250,247,240,0.08)',
          border: current ? '1px solid var(--accent)' : 'none',
          fontSize: '10px', fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          color: done ? (isLocked ? '#141413' : 'var(--paper)') : current ? 'var(--accent)' : 'rgba(250,247,240,0.3)',
          fontWeight: 700,
        }}>
          {done ? (isLocked && index === 4 ? '🔒' : '✓') : index + 1}
        </div>
      </div>

      {/* Label */}
      <div style={{ paddingTop: '1px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '11px', letterSpacing: '0.15em',
          color: done
            ? (isLocked ? '#4ade80' : 'var(--accent)')
            : current ? 'var(--paper)'
            : 'rgba(250,247,240,0.3)',
          textTransform: 'uppercase',
          fontWeight: current ? 600 : 400,
        }}>
          {label}
        </div>
        {current && (
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '10px', color: 'rgba(250,247,240,0.4)',
            marginTop: '2px', letterSpacing: '0.05em',
          }}>
            IN PROGRESS ▶
          </div>
        )}
      </div>
    </div>
  )
}

// ── File status row ───────────────────────────────────────────────────────

function FileRow({ label, path, exists }: { label: string; path: string; exists: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '5px 0',
      borderBottom: '1px solid rgba(250,247,240,0.05)',
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '10px', width: '10px',
        color: exists ? '#4ade80' : 'rgba(250,247,240,0.2)',
      }}>
        {exists ? '✓' : '○'}
      </span>
      <span style={{
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '11px',
        color: exists ? 'rgba(250,247,240,0.7)' : 'rgba(250,247,240,0.2)',
      }}>
        {path}
      </span>
    </div>
  )
}

// ── Agent command block ────────────────────────────────────────────────────

function CommandBlock({ codename, phase }: { codename: string; phase: Phase }) {
  const NEXT: Record<Phase, string> = {
    INTAKE:    `blueprint`,
    BLUEPRINT: `build`,
    BUILD:     `eval`,
    EVAL:      `lock`,
    LOCK:      `doctor`,
  }
  const next = NEXT[phase]

  return (
    <div style={{
      background: 'rgba(20,20,19,0.4)',
      border: '1px solid rgba(250,247,240,0.08)',
      borderLeft: '3px solid var(--accent)',
      borderRadius: '0 8px 8px 0',
      padding: '16px 20px',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: '12px', lineHeight: '1.8',
    }}>
      <div style={{ color: 'rgba(250,247,240,0.3)', marginBottom: '8px' }}>
        // continue in Claude
      </div>
      <div>
        <span style={{ color: 'var(--accent)' }}>→ CURRENT  </span>
        <span style={{ color: 'var(--paper)' }}>
          /ghost:{phase.toLowerCase()} {codename}
        </span>
      </div>
      {phase !== 'LOCK' && (
        <div>
          <span style={{ color: 'rgba(250,247,240,0.4)' }}>↳ NEXT     </span>
          <span style={{ color: 'rgba(250,247,240,0.5)' }}>
            /ghost:{next} {codename}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ClientDetailPage({
  params,
}: {
  params: { codename: string }
}) {
  const client = getClient(params.codename)
  if (!client) notFound()

  const currentPhaseIndex = client.phaseIndex
  const files = client.files

  // Try to show a meaningful preview of the current phase's main file
  const previewFile = {
    INTAKE:    'intake.md',
    BLUEPRINT: 'blueprint.md',
    BUILD:     'build/system-prompt.md',
    EVAL:      'eval/results.md',
    LOCK:      'handoff/client-docs.md',
  }[client.phase]

  const preview = files[previewFile]
    ? getFileContent(client.codename, previewFile)?.slice(0, 1200)
    : null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink)',
      color: 'var(--paper)',
      fontFamily: 'Space Grotesk, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid rgba(250,247,240,0.08)',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <Link href="/internal/ghost" style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '11px', color: 'rgba(250,247,240,0.4)',
          textDecoration: 'none', letterSpacing: '0.1em',
        }}>
          ← GHOST LOCKER
        </Link>
        <span style={{ color: 'rgba(250,247,240,0.15)' }}>/</span>
        <span style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '11px', color: 'var(--accent)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          {client.codename}
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── Left sidebar ── */}
        <div style={{
          width: '260px', flexShrink: 0,
          borderRight: '1px solid rgba(250,247,240,0.08)',
          padding: '32px 24px',
          display: 'flex', flexDirection: 'column', gap: '32px',
        }}>
          {/* Identity */}
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: '10px', letterSpacing: '0.2em',
              color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '6px',
            }}>
              {client.codename}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--paper)', lineHeight: 1.3 }}>
              {client.agentName !== client.codename ? client.agentName : '—'}
            </div>
            {client.operator && (
              <div style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '10px', color: 'rgba(250,247,240,0.4)',
                marginTop: '6px',
              }}>
                OPS: {client.operator}
              </div>
            )}
          </div>

          {/* Phase progress */}
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: '10px', letterSpacing: '0.2em',
              color: 'rgba(250,247,240,0.35)', textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              PHASE PROGRESS
            </div>
            {PHASES.map((phase, i) => (
              <PhaseStep
                key={phase}
                phase={phase}
                label={phase}
                index={i}
                currentIndex={currentPhaseIndex}
                isLocked={client.isLocked}
              />
            ))}
          </div>

          {/* File manifest */}
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: '10px', letterSpacing: '0.2em',
              color: 'rgba(250,247,240,0.35)', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              FILE STATUS
            </div>
            {Object.entries(files).map(([path, exists]) => (
              <FileRow key={path} label={path} path={path} exists={exists} />
            ))}
          </div>
        </div>

        {/* ── Main panel ── */}
        <div style={{ flex: 1, padding: '40px 48px', overflow: 'auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: '11px', letterSpacing: '0.2em',
              color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px',
            }}>
              § GL-{String(currentPhaseIndex + 1).padStart(2, '0')} · {client.phase}
              {client.isLocked ? ' · LOCKED' : ' · IN PROGRESS'}
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
              {client.agentName !== client.codename ? client.agentName : client.codename}
            </h1>
          </div>

          {/* Key stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px', marginBottom: '32px',
          }}>
            {[
              { label: 'COMPLEXITY', value: client.complexity ? `${client.complexity} · ${client.complexityLabel}` : '—' },
              { label: 'EVAL SCORE', value: client.evalScore !== undefined ? `${client.evalScore}%` : '—', green: (client.evalScore ?? 0) >= 80 },
              { label: client.isLocked ? 'LOCKED' : 'STARTED', value: client.isLocked ? client.lockedDate : client.started || '—' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(250,247,240,0.04)',
                border: '1px solid rgba(250,247,240,0.08)',
                borderRadius: '6px', padding: '16px',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: '10px', letterSpacing: '0.15em',
                  color: 'rgba(250,247,240,0.35)', textTransform: 'uppercase', marginBottom: '6px',
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: '16px', fontWeight: 600,
                  color: stat.green ? '#4ade80' : 'var(--paper)',
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Next command */}
          {!client.isLocked && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '10px', letterSpacing: '0.2em',
                color: 'rgba(250,247,240,0.35)', textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                CONTINUE IN CLAUDE
              </div>
              <CommandBlock codename={client.codename} phase={client.phase} />
            </div>
          )}

          {/* File preview */}
          {preview && (
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '10px', letterSpacing: '0.2em',
                color: 'rgba(250,247,240,0.35)', textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                {previewFile} · PREVIEW
              </div>
              <div style={{
                background: 'rgba(20,20,19,0.4)',
                border: '1px solid rgba(250,247,240,0.08)',
                borderRadius: '8px', padding: '24px',
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '12px', lineHeight: '1.8',
                color: 'rgba(250,247,240,0.7)',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                maxHeight: '480px', overflow: 'auto',
              }}>
                {preview}
                {preview.length >= 1200 && (
                  <span style={{ color: 'rgba(250,247,240,0.3)' }}>
                    {'\n\n'}... (truncated — open file for full content)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!preview && !client.isLocked && (
            <div style={{
              border: '1px dashed rgba(250,247,240,0.1)',
              borderRadius: '8px', padding: '48px 32px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '11px', color: 'rgba(250,247,240,0.3)',
                letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px',
              }}>
                NO {client.phase} FILE YET
              </div>
              <div style={{ color: 'rgba(250,247,240,0.4)', fontSize: '13px' }}>
                Run <code style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  color: 'var(--accent)', fontSize: '12px',
                }}>/ghost:{client.phase.toLowerCase()} {client.codename}</code> in Claude to continue
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
