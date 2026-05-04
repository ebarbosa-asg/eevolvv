'use client'

import { useState, useEffect, useRef } from 'react'
import { VolvvE, VolvvECorner, type GhostState } from '@/components/VolvvE'

// ── Types ────────────────────────────────────────────────────────────
type TaskStatus = 'pending' | 'running' | 'done' | 'error'
type WaveStatus = 'waiting' | 'running' | 'done' | 'error'

interface Task {
  id: string
  label: string
  detail: string
  status: TaskStatus
  startedAt?: number
  finishedAt?: number
  output?: string
}

interface Wave {
  id: string
  label: string
  status: WaveStatus
  tasks: Task[]
}

// ── Demo data (replace with real KARIMO API) ─────────────────────────
const DEMO_WAVES: Wave[] = [
  {
    id: 'w1',
    label: 'W-01 · RESEARCH',
    status: 'done',
    tasks: [
      { id: 't1', label: 'Scan codebase', detail: 'app/, components/, lib/', status: 'done', output: '→ 47 files indexed\n↳ 3 patterns identified' },
      { id: 't2', label: 'Web research', detail: 'Competitor landscape + recent news', status: 'done', output: '→ 12 sources scraped\n↳ PRD context built' },
    ],
  },
  {
    id: 'w2',
    label: 'W-02 · PLAN',
    status: 'running',
    tasks: [
      { id: 't3', label: 'Generate PRD', detail: 'Feature spec + acceptance criteria', status: 'done', output: '→ PRD written: 1,240 words\n↳ 8 tasks decomposed' },
      { id: 't4', label: 'Create task graph', detail: 'Dependencies + parallel waves', status: 'running', startedAt: Date.now() - 12000 },
      { id: 't5', label: 'Estimate effort', detail: 'Token + time budget per wave', status: 'pending' },
    ],
  },
  {
    id: 'w3',
    label: 'W-03 · BUILD',
    status: 'waiting',
    tasks: [
      { id: 't6', label: 'Write component', detail: 'VolvvE.tsx pixel sprite + states', status: 'pending' },
      { id: 't7', label: 'Update ChatEngine', detail: 'Swap mascot → ghost avatar', status: 'pending' },
      { id: 't8', label: 'Create workspace', detail: 'KARIMO page with ghost presence', status: 'pending' },
    ],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────
function elapsed(ms?: number) {
  if (!ms) return ''
  const s = Math.floor((Date.now() - ms) / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function statusColor(s: TaskStatus | WaveStatus) {
  if (s === 'done')    return '#4ade80'
  if (s === 'running') return 'var(--accent)'
  if (s === 'error')   return '#f87171'
  return 'rgba(20,20,19,0.28)'
}

function statusLabel(s: TaskStatus | WaveStatus) {
  if (s === 'done')    return '★ DONE'
  if (s === 'running') return '▷ RUNNING'
  if (s === 'error')   return '! ERROR'
  if (s === 'waiting') return '◈ QUEUED'
  return '░ PENDING'
}

function ghostForWave(waves: Wave[]): GhostState {
  if (waves.some(w => w.status === 'error'))   return 'error'
  if (waves.every(w => w.status === 'done'))   return 'done'
  if (waves.some(w => w.status === 'running')) return 'thinking'
  return 'idle'
}

// ── Sub-components ────────────────────────────────────────────────────

function TaskRow({ task, tick }: { task: Task; tick: number }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      padding: '12px 0',
      borderBottom: '1px solid var(--rule)',
    }}>
      {/* Status dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        marginTop: 6,
        flexShrink: 0,
        background: statusColor(task.status),
        boxShadow: task.status === 'running' ? `0 0 8px ${statusColor(task.status)}` : 'none',
        animation: task.status === 'running' ? 'karimo-pulse 1.4s ease-in-out infinite' : 'none',
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 13, color: 'var(--ink)' }}>
            {task.label}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', opacity: 0.8 }}>
            {statusLabel(task.status)}
          </span>
          {task.status === 'running' && task.startedAt && (
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, opacity: 0.45, marginLeft: 'auto' }}>
              {elapsed(task.startedAt)}
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.45, marginBottom: task.output ? 8 : 0 }}>
          ↳ {task.detail}
        </div>
        {task.output && (
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            lineHeight: 1.9,
            color: 'var(--ink)',
            background: 'rgba(20,20,19,.04)',
            border: '1px solid var(--rule)',
            borderLeft: '3px solid var(--accent)',
            padding: '8px 12px',
            whiteSpace: 'pre',
          }}>
            {task.output}
          </div>
        )}
      </div>
    </div>
  )
}

function WaveCard({ wave, expanded, onToggle, tick }: {
  wave: Wave
  expanded: boolean
  onToggle: () => void
  tick: number
}) {
  return (
    <div style={{
      border: '1px solid var(--rule)',
      borderLeft: `3px solid ${statusColor(wave.status)}`,
      marginBottom: 12,
      transition: 'border-color 0.3s',
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.18em', opacity: 0.9 }}>
          {wave.label}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: statusColor(wave.status), letterSpacing: '0.12em' }}>
          {statusLabel(wave.status)}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.35 }}>
          {wave.tasks.filter(t => t.status === 'done').length}/{wave.tasks.length} tasks · {expanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Task list */}
      {expanded && (
        <div style={{ padding: '0 18px 8px' }}>
          {wave.tasks.map(task => (
            <TaskRow key={task.id} task={task} tick={tick} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────
export default function KarimoPage() {
  const [waves] = useState<Wave[]>(DEMO_WAVES)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ w2: true })
  const [tick, setTick] = useState(0)

  // Live clock for elapsed times
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const ghostState = ghostForWave(waves)
  const runningCount = waves.flatMap(w => w.tasks).filter(t => t.status === 'running').length
  const doneCount    = waves.flatMap(w => w.tasks).filter(t => t.status === 'done').length
  const totalCount   = waves.flatMap(w => w.tasks).length

  const pctDone = Math.round((doneCount / totalCount) * 100)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes karimo-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes karimo-scan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        body { background: var(--paper, #faf7f0); }
      ` }} />

      <div style={{
        minHeight: '100vh',
        background: 'var(--paper)',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        {/* ── Top bar ───────────────────────────────────────────────── */}
        <div style={{
          borderBottom: '1px solid var(--rule)',
          padding: '0 32px',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'sticky',
          top: 0,
          background: 'var(--paper)',
          zIndex: 40,
        }}>
          {/* Ghost in header */}
          <VolvvE state={ghostState} scale={3} />

          <div style={{ width: 1, height: 20, background: 'var(--rule)', margin: '0 4px' }} />

          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)' }}>
            § KARIMO · AGENT WORKSPACE
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--ink)', opacity: 0.45 }}>
                {doneCount}/{totalCount}
              </span>
              <div style={{ width: 80, height: 3, background: 'rgba(20,20,19,.1)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: `${pctDone}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.6s ease' }} />
                {runningCount > 0 && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    animation: 'karimo-scan 1.6s linear infinite',
                  }} />
                )}
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--accent)', opacity: 0.7 }}>
                {pctDone}%
              </span>
            </div>

            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: statusColor(ghostState === 'thinking' ? 'running' : ghostState === 'done' ? 'done' : ghostState === 'error' ? 'error' : 'pending'), letterSpacing: '0.15em' }}>
              {ghostState === 'thinking' ? `▷ ${runningCount} AGENT${runningCount !== 1 ? 'S' : ''} RUNNING` :
               ghostState === 'done'     ? '★ ALL DONE' :
               ghostState === 'error'    ? '! ERROR' : '◈ IDLE'}
            </span>
          </div>
        </div>

        {/* ── Main layout ───────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0, maxWidth: 1280, margin: '0 auto' }}>

          {/* ── Left: Wave timeline ──────────────────────────────────── */}
          <div style={{ padding: '32px 32px 80px', borderRight: '1px solid var(--rule)' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 8 }}>
                § 01 · EXECUTION WAVES
              </div>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 22, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
                Agent run in progress
              </h1>
            </div>

            {waves.map(wave => (
              <WaveCard
                key={wave.id}
                wave={wave}
                expanded={!!expanded[wave.id]}
                onToggle={() => setExpanded(e => ({ ...e, [wave.id]: !e[wave.id] }))}
                tick={tick}
              />
            ))}

            {/* Log stream */}
            <div style={{ marginTop: 32 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 12 }}>
                § 02 · LIVE LOG
              </div>
              <div style={{
                background: 'rgba(20,20,19,.04)',
                border: '1px solid var(--rule)',
                borderLeft: '3px solid var(--accent)',
                padding: '14px 16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                lineHeight: 2,
                color: 'var(--ink)',
              }}>
                <div style={{ opacity: 0.35 }}>// agent log — latest first</div>
                <div>→ TASK&nbsp;&nbsp;&nbsp;&nbsp; ↳ create-task-graph · started</div>
                <div style={{ color: '#4ade80' }}>→ DONE&nbsp;&nbsp;&nbsp;&nbsp; ↳ generate-prd · 1,240 words written</div>
                <div style={{ color: '#4ade80' }}>→ DONE&nbsp;&nbsp;&nbsp;&nbsp; ↳ web-research · 12 sources indexed</div>
                <div style={{ color: '#4ade80' }}>→ DONE&nbsp;&nbsp;&nbsp;&nbsp; ↳ scan-codebase · 47 files indexed</div>
                <div style={{ opacity: 0.35 }}>→ RUN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↳ wave 01 complete — wave 02 started</div>
              </div>
            </div>
          </div>

          {/* ── Right: Ghost status panel ────────────────────────────── */}
          <div style={{ padding: '32px 24px', position: 'sticky', top: 52, height: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Ghost hero */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              padding: '28px 0 24px',
              borderBottom: '1px solid var(--rule)',
            }}>
              <VolvvE state={ghostState} scale={6} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 4 }}>
                  {ghostState === 'thinking' ? '▷ PROCESSING'  :
                   ghostState === 'done'     ? '★ COMPLETE'    :
                   ghostState === 'error'    ? '! HALTED'      : '◈ STANDING BY'}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'var(--ink)', opacity: 0.5 }}>
                  {ghostState === 'thinking' ? `${runningCount} task${runningCount !== 1 ? 's' : ''} executing in parallel` :
                   ghostState === 'done'     ? 'All tasks completed successfully' :
                   ghostState === 'error'    ? 'One or more tasks failed' :
                   'Waiting for next run'}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 4 }}>
                § METRICS
              </div>
              {[
                { label: 'TASKS DONE',   value: `${doneCount}/${totalCount}` },
                { label: 'WAVES',        value: `${waves.filter(w => w.status === 'done').length}/${waves.length}` },
                { label: 'RUNNING NOW',  value: `${runningCount}` },
                { label: 'PROGRESS',     value: `${pctDone}%` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--rule)',
                }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.45, letterSpacing: '0.12em' }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.45, letterSpacing: '0.1em', marginBottom: 8 }}>
                ▓{'▓'.repeat(Math.floor(pctDone / 10))}{'░'.repeat(10 - Math.floor(pctDone / 10))} {pctDone}%
              </div>
              <div style={{ height: 3, background: 'rgba(20,20,19,.1)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: `${pctDone}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            {/* Action hint */}
            <div style={{ marginTop: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.3, textAlign: 'center' }}>
              ↳ auto-refreshing every 5s
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
