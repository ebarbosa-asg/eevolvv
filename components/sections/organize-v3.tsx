'use client'

import { useState, useEffect } from 'react'

type Phase = 'chaos' | 'sorting' | 'sorted'

const ORG_COLS = [
  { id: 'inbox',    label: 'INBOX',    kind: 'mail',   note: 'replied' },
  { id: 'calendar', label: 'CALENDAR', kind: 'cal',    note: 'booked' },
  { id: 'tasks',    label: 'TASKS',    kind: 'task',   note: 'done' },
  { id: 'people',   label: 'PEOPLE',   kind: 'person', note: 'logged' },
]

const ORG_PER_COL = 6

const ORG_ITEMS: { kind: string; col: number; row: number }[] = []
ORG_COLS.forEach((c, ci) => {
  for (let r = 0; r < ORG_PER_COL; r++) ORG_ITEMS.push({ kind: c.kind, col: ci, row: r })
})

function orgRand(n: number): number {
  const x = Math.sin((n + 1) * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function OrgMail() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="22" height="16" fill="currentColor" />
      <rect x="2" y="2" width="18" height="12" fill="var(--paper)" />
      <path d="M 2 2 L 11 9 L 20 2 Z" fill="currentColor" />
    </svg>
  )
}
function OrgCal() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="0" width="2" height="4" fill="currentColor" />
      <rect x="13" y="0" width="2" height="4" fill="currentColor" />
      <rect x="0" y="2" width="18" height="18" fill="currentColor" />
      <rect x="2" y="7" width="14" height="11" fill="var(--paper)" />
      <rect x="4" y="9" width="3" height="3" fill="currentColor" />
      <rect x="11" y="9" width="3" height="3" fill="currentColor" opacity="0.45" />
      <rect x="4" y="13" width="3" height="3" fill="currentColor" opacity="0.45" />
      <rect x="11" y="13" width="3" height="3" fill="currentColor" />
    </svg>
  )
}
function OrgTask() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="18" height="18" fill="currentColor" />
      <rect x="2" y="2" width="14" height="14" fill="var(--paper)" />
      <path d="M 4 9 L 8 13 L 14 5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  )
}
function OrgPerson() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="5" y="0" width="6" height="6" fill="currentColor" />
      <rect x="7" y="2" width="2" height="1" fill="var(--paper)" />
      <rect x="0" y="9" width="16" height="11" fill="currentColor" />
      <rect x="2" y="11" width="12" height="1" fill="var(--paper)" opacity="0.5" />
    </svg>
  )
}

const ORG_ICON_FOR: Record<string, () => JSX.Element> = {
  mail: OrgMail, cal: OrgCal, task: OrgTask, person: OrgPerson,
}

export default function OrganizeV3() {
  const [phase, setPhase] = useState<Phase>('chaos')

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = []
    const loop = () => {
      timers.forEach(clearTimeout)
      timers = []
      setPhase('chaos')
      timers.push(setTimeout(() => setPhase('sorting'), 3200))
      timers.push(setTimeout(() => setPhase('sorted'), 4100))
      timers.push(setTimeout(() => { loop() }, 9000))
    }
    loop()
    return () => timers.forEach(clearTimeout)
  }, [])

  const statusText =
    phase === 'chaos'   ? `⚠ ${ORG_ITEMS.length} ITEMS · UNSORTED` :
    phase === 'sorting' ? '▷ ORGANIZING…' :
                          '✓ ORGANIZED · 4 CATEGORIES'

  return (
    <section className="scope organize-section" id="time-leak">
      <div className="site-rail">
        <div className="sec-head">
          <span className="sec-marker mono">§ 03</span>
          <h2 className="sec-head-title">
            We make the mess{' '}
            <span className="serif" style={{ color: 'var(--accent)' }}>make sense.</span>
          </h2>
          <span className="sec-marker mono" style={{ textAlign: 'right', opacity: 0.5 }}>LIVE · CHAOS → ORDER</span>
        </div>

        <div className={`org-stage org-${phase}`}>
          <div className="org-stage-head">
            <span className="org-head-dot" />
            <span className="org-stage-tag">VOLVV-E · MODE 02 / SORTER</span>
            <span className="org-stage-state">{statusText}</span>
          </div>

          <div className="org-canvas">
            {/* Column dividers */}
            {ORG_COLS.map((_, ci) =>
              ci > 0 ? (
                <div key={ci} className="org-col-divider" style={{ left: `${ci * 25}%` }} />
              ) : null
            )}

            {/* Column headers */}
            {ORG_COLS.map((col, ci) => (
              <div key={col.id} className="org-col-header" style={{ left: `calc(${ci * 25}% + 18px)` }}>
                <span className="org-col-label">{col.label}</span>
                <span className="org-col-count">{String(ORG_PER_COL).padStart(2, '0')}</span>
              </div>
            ))}
            {ORG_COLS.map((col, ci) => (
              <div key={col.id + '-foot'} className="org-col-foot mono" style={{ left: `calc(${ci * 25}% + 18px)` }}>
                ↳ {col.note}
              </div>
            ))}

            {/* Items */}
            {ORG_ITEMS.map((item, i) => {
              const Icon = ORG_ICON_FOR[item.kind]
              const cx = Math.round((4 + orgRand(i * 11) * 90) * 100) / 100
              const cy = Math.round((24 + orgRand(i * 11 + 1) * 280) * 100) / 100
              const cr = Math.round((-45 + orgRand(i * 11 + 2) * 90) * 100) / 100
              const delay = (phase === 'sorting' || phase === 'sorted')
                ? `${item.col * 60 + item.row * 30}ms`
                : '0ms'
              return (
                <div
                  key={i}
                  className={`org-item org-item-${item.kind}`}
                  style={{
                    '--cx': `${cx}%`,
                    '--cy': `${cy}px`,
                    '--cr': `${cr}deg`,
                    '--gx': `calc(${item.col * 25}% + 24px)`,
                    '--gy': `${62 + item.row * 36}px`,
                    transitionDelay: delay,
                  } as React.CSSProperties}
                  aria-hidden="true"
                >
                  <Icon />
                </div>
              )
            })}

            {/* Scan beam */}
            <div className="org-beam" aria-hidden="true" />

            {/* Volvv-E */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/volvv-e.png"
              alt=""
              className="org-vlvv"
              style={{ imageRendering: 'pixelated' }}
              aria-hidden="true"
            />
          </div>

          <div className="org-stage-foot">
            <div className="org-stage-foot-cell">
              <span className="org-foot-label">BEFORE</span>
              <span className="org-foot-val">{ORG_ITEMS.length} loose · no system</span>
            </div>
            <div className="org-stage-foot-cell">
              <span className="org-foot-label">AFTER</span>
              <span className="org-foot-val">4 lanes · nothing dropped</span>
            </div>
            <div className="org-stage-foot-cell">
              <span className="org-foot-label">RUNTIME</span>
              <span className="org-foot-val">continuous · ~1s/pass</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
