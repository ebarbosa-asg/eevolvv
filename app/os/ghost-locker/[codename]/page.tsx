'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SectionMarker } from '@/components/ds'
import { OSTopbar } from '../../components/OSTopbar'

const PHASES = [
  { key: 'products', label: 'PRODUCTS', num: '00' },
  { key: 'onboard', label: 'ONBOARD', num: '01' },
  { key: 'intake', label: 'INTAKE', num: '02' },
  { key: 'blueprint', label: 'BLUEPRINT', num: '03' },
  { key: 'build', label: 'BUILD', num: '04' },
  { key: 'eval', label: 'EVAL', num: '05' },
  { key: 'lock', label: 'LOCK', num: '06' },
] as const

type PhaseKey = (typeof PHASES)[number]['key']

type PhaseFile = { file: string; exists: boolean; content: string | null }
type PhaseData = { codename: string; phase: string; files: PhaseFile[] }

const MONO = { fontFamily: 'JetBrains Mono, ui-monospace, monospace' } as const

function PhaseTab({
  phase,
  active,
  complete,
  onClick,
}: {
  phase: (typeof PHASES)[number]
  active: boolean
  complete: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...MONO,
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        padding: '8px 14px',
        borderRadius: 8,
        border: active ? '1px solid rgba(20,20,19,0.18)' : '1px solid transparent',
        borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
        background: active ? 'rgba(20,20,19,0.06)' : 'transparent',
        color: active ? 'var(--ink)' : 'rgba(20,20,19,0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{ color: complete ? 'var(--accent)' : 'rgba(20,20,19,0.25)', fontSize: 10 }}>
        {complete ? '▓' : '░'}
      </span>
      <span style={{ color: 'var(--accent)', opacity: 0.6 }}>{phase.num}</span>
      {phase.label}
    </button>
  )
}

function FileBlock({ file }: { file: PhaseFile }) {
  if (!file.exists || !file.content) return null

  const isJson = file.file.endsWith('.json')

  return (
    <div className="mb-6">
      <div
        style={{
          ...MONO,
          fontSize: 10,
          letterSpacing: '0.15em',
          color: 'var(--accent)',
          opacity: 0.7,
          textTransform: 'uppercase' as const,
          marginBottom: 8,
        }}
      >
        // {file.file}
      </div>
      <div
        style={{
          background: 'rgba(20,20,19,0.04)',
          border: '1px solid rgba(20,20,19,0.1)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: 8,
          padding: '20px 24px',
          overflowX: 'auto',
        }}
      >
        <pre
          style={{
            ...MONO,
            fontSize: isJson ? 12 : 13,
            lineHeight: 1.7,
            color: 'rgba(20,20,19,0.8)',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {file.content}
        </pre>
      </div>
    </div>
  )
}

export default function GhostLockerDetailPage({
  params,
}: {
  params: { codename: string }
}) {
  const { codename } = params
  const [activePhase, setActivePhase] = useState<PhaseKey>('products')
  const [phaseData, setPhaseData] = useState<PhaseData | null>(null)
  const [loadingPhase, setLoadingPhase] = useState(false)
  const [phasesComplete, setPhasesComplete] = useState<Record<PhaseKey, boolean>>({
    products: false, onboard: false, intake: false, blueprint: false, build: false, eval: false, lock: false,
  })

  useEffect(() => {
    fetch('/api/os/ghost-locker')
      .then((r) => r.json())
      .then((clients: Array<{ codename: string; phases_complete: Partial<Record<PhaseKey, boolean>> }>) => {
        const client = clients.find((c) => c.codename === codename)
        if (client) setPhasesComplete((prev) => ({ ...prev, ...client.phases_complete }))
      })
      .catch(() => {})
  }, [codename])

  useEffect(() => {
    setLoadingPhase(true)
    setPhaseData(null)
    fetch(`/api/os/ghost-locker/${codename}?phase=${activePhase}`)
      .then((r) => r.json())
      .then((d: PhaseData) => setPhaseData(d))
      .catch(() => {})
      .finally(() => setLoadingPhase(false))
  }, [codename, activePhase])

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title={`GL · ${codename.toUpperCase()}`} />
      <div className="max-w-[1200px] mx-auto px-8 py-10">

        <div className="mb-6">
          <Link
            href="/os/ghost-locker"
            style={{
              ...MONO,
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--accent)',
              opacity: 0.6,
              textDecoration: 'none',
            }}
          >
            ← GHOST LOCKER
          </Link>
        </div>

        <div className="mb-8">
          <SectionMarker num="08" label={codename.toUpperCase()} />
          <div
            style={{
              ...MONO,
              fontSize: 11,
              color: 'rgba(20,20,19,0.4)',
              marginTop: 6,
              letterSpacing: '0.08em',
            }}
          >
            AGENT MANUFACTURING PIPELINE · {PHASES.filter((p) => phasesComplete[p.key]).length} / {PHASES.length} FILE GROUPS COMPLETE
          </div>
        </div>

        {/* Phase selector */}
        <div
          className="flex gap-1 mb-8 flex-wrap p-2 rounded-xl"
          style={{ background: 'rgba(20,20,19,0.03)', border: '1px solid rgba(20,20,19,0.08)' }}
        >
          {PHASES.map((p) => (
            <PhaseTab
              key={p.key}
              phase={p}
              active={activePhase === p.key}
              complete={phasesComplete[p.key]}
              onClick={() => setActivePhase(p.key)}
            />
          ))}
        </div>

        {/* Phase content */}
        {loadingPhase && (
          <div className="flex flex-col gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-32 bg-ink/5 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {!loadingPhase && phaseData && phaseData.files.every((f) => !f.exists) && (
          <div
            style={{
              ...MONO,
              fontSize: 12,
              color: 'rgba(20,20,19,0.3)',
              padding: '40px 0',
              textAlign: 'center' as const,
              letterSpacing: '0.08em',
            }}
          >
            // phase not started — no files yet
          </div>
        )}

        {!loadingPhase && phaseData && (
          <div>
            {phaseData.files.map((f) => (
              <FileBlock key={f.file} file={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
