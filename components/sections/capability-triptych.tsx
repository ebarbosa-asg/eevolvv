'use client'

import { useState, useEffect } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// SVG icons (pixel-crisp, matches OrganizeV3)
// ─────────────────────────────────────────────────────────────────────────────

function OrgMail() {
  return (
    <svg width="18" height="14" viewBox="0 0 22 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="22" height="16" fill="currentColor" />
      <rect x="2" y="2" width="18" height="12" fill="var(--paper)" />
      <path d="M 2 2 L 11 9 L 20 2 Z" fill="currentColor" />
    </svg>
  )
}
function OrgCal() {
  return (
    <svg width="16" height="18" viewBox="0 0 18 20" shapeRendering="crispEdges" aria-hidden="true">
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
    <svg width="16" height="16" viewBox="0 0 18 18" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="18" height="18" fill="currentColor" />
      <rect x="2" y="2" width="14" height="14" fill="var(--paper)" />
      <path d="M 4 9 L 8 13 L 14 5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  )
}
function OrgPerson() {
  return (
    <svg width="14" height="18" viewBox="0 0 16 20" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="5" y="0" width="6" height="6" fill="currentColor" />
      <rect x="7" y="2" width="2" height="1" fill="var(--paper)" />
      <rect x="0" y="9" width="16" height="11" fill="currentColor" />
      <rect x="2" y="11" width="12" height="1" fill="var(--paper)" opacity="0.5" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation 1 — Organize (chaos → sort → order loop)
// ─────────────────────────────────────────────────────────────────────────────

type OrgPhase = 'chaos' | 'sorting' | 'sorted'

const ORG_COLS = [
  { id: 'inbox', label: 'INBOX', kind: 'mail', note: 'replied' },
  { id: 'cal',   label: 'CAL',   kind: 'cal',  note: 'booked' },
  { id: 'tasks', label: 'TASKS', kind: 'task', note: 'done'   },
  { id: 'ppl',   label: 'PEOPLE', kind: 'person', note: 'filed' },
]
const PER_COL = 6
const ORG_ITEMS = ORG_COLS.flatMap((c, ci) =>
  Array.from({ length: PER_COL }, (_, r) => ({ kind: c.kind, col: ci, row: r }))
)

const ICON_FOR: Record<string, () => JSX.Element> = {
  mail: OrgMail, cal: OrgCal, task: OrgTask, person: OrgPerson,
}

function det(n: number) {
  const x = Math.sin((n + 1) * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function OrganizeAnim() {
  const [phase, setPhase] = useState<OrgPhase>('chaos')

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = []
    const loop = () => {
      timers.forEach(clearTimeout)
      timers = []
      setPhase('chaos')
      timers.push(setTimeout(() => setPhase('sorting'), 2800))
      timers.push(setTimeout(() => setPhase('sorted'), 4100))
      timers.push(setTimeout(loop, 9200))
    }
    loop()
    return () => timers.forEach(clearTimeout)
  }, [])

  const statusText =
    phase === 'chaos'   ? `⚠ ${ORG_ITEMS.length} ITEMS · UNSORTED` :
    phase === 'sorting' ? '▷ ORGANIZING…' :
                          '✓ ORGANIZED · 4 CATEGORIES'

  return (
    <div className={`cap-org org-stage org-${phase}`} aria-hidden="true">
      <div className="org-stage-head">
        <span className="org-head-dot" />
        <span className="org-stage-tag mono">VOLVV-E · MODE 02 / SORTER</span>
        <span className="org-stage-state mono">{statusText}</span>
      </div>
      <div className="cap-org-canvas">
        {ORG_COLS.map((_, ci) =>
          ci > 0 ? <div key={ci} className="org-col-divider" style={{ left: `${ci * 25}%` }} /> : null
        )}
        {ORG_COLS.map((col, ci) => (
          <div key={col.id} className="org-col-header" style={{ left: `calc(${ci * 25}% + 14px)` }}>
            <span className="org-col-label mono">{col.label}</span>
            <span className="org-col-count mono">{String(PER_COL).padStart(2, '0')}</span>
          </div>
        ))}
        {ORG_ITEMS.map((item, i) => {
          const Icon = ICON_FOR[item.kind]
          const cx = Math.round((3 + det(i * 11)     * 88) * 100) / 100
          const cy = Math.round((18 + det(i * 11 + 1) * 180) * 100) / 100
          const cr = Math.round((-48 + det(i * 11 + 2) * 96) * 100) / 100
          const delay = (phase === 'sorting' || phase === 'sorted')
            ? `${item.col * 55 + item.row * 28}ms` : '0ms'
          return (
            <div
              key={i}
              className="org-item"
              style={{
                '--cx': `${cx}%`,
                '--cy': `${cy}px`,
                '--cr': `${cr}deg`,
                '--gx': `calc(${item.col * 25}% + 16px)`,
                '--gy': `${44 + item.row * 30}px`,
                transitionDelay: delay,
                color: 'var(--accent)',
              } as React.CSSProperties}
            >
              <Icon />
            </div>
          )
        })}
        <div className="org-beam" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/volvv-e.png"
          alt=""
          className="org-vlvv cap-org-vlvv"
          style={{ imageRendering: 'pixelated' }}
          loading="lazy"
        />
      </div>
      <div className="cap-org-foot">
        <div>
          <span className="cap-org-foot-label mono">BEFORE</span>
          <span className="cap-org-foot-val mono">{ORG_ITEMS.length} loose · no system</span>
        </div>
        <div>
          <span className="cap-org-foot-label mono">AFTER</span>
          <span className={`cap-org-foot-val mono ${phase === 'sorted' ? 'sorted' : ''}`}>
            4 lanes · nothing dropped
          </span>
        </div>
        <div>
          <span className="cap-org-foot-label mono">RUNTIME</span>
          <span className="cap-org-foot-val mono">continuous · ~1s/pass</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation 2 — Website Builder (scaffold → live)
// ─────────────────────────────────────────────────────────────────────────────

const BUILD_BLOCKS = [
  { label: 'Hero',     wide: true,  tag: '01' },
  { label: 'Offer',    wide: false, tag: '02' },
  { label: 'Proof',    wide: false, tag: '03' },
  { label: 'FAQ',      wide: false, tag: '04' },
  { label: 'Booking',  wide: false, tag: '05' },
  { label: 'Checkout', wide: true,  tag: '06' },
]

function WebsiteBuilderAnim() {
  const [built, setBuilt] = useState(0)
  const [live, setLive] = useState(false)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    let iv: ReturnType<typeof setInterval>
    let rt: ReturnType<typeof setTimeout>
    const start = () => {
      setBuilt(0)
      setLive(false)
      setScanning(false)
      let count = 0
      iv = setInterval(() => {
        count++
        setBuilt(count)
        if (count >= BUILD_BLOCKS.length) {
          clearInterval(iv)
          setTimeout(() => { setLive(true); setScanning(true) }, 350)
          rt = setTimeout(start, 4800)
        }
      }, 340)
    }
    const init = setTimeout(start, 800)
    return () => { clearTimeout(init); clearInterval(iv); clearTimeout(rt) }
  }, [])

  const pct = Math.round((built / BUILD_BLOCKS.length) * 100)

  return (
    <div className="cap-build-anim" aria-hidden="true">
      <div className="cap-build-bar">
        <span className="cap-build-dots">
          <span /><span /><span />
        </span>
        <span className="cap-build-url mono">eevolvv.com/site</span>
        {live
          ? <span className="cap-live-badge mono">● LIVE</span>
          : <span className="cap-build-pct mono">{pct}%</span>
        }
      </div>
      <div className="cap-build-canvas">
        {BUILD_BLOCKS.map((b, i) => (
          <span
            key={b.label}
            className={`cap-block${b.wide ? ' wide' : ''}${i < built ? ' built' : ' pending'}`}
            style={{ animationDelay: `${i * 30}ms` } as React.CSSProperties}
          >
            {i < built && (
              <>
                <span className="cap-block-tag mono">{b.tag}</span>
                {b.label}
              </>
            )}
          </span>
        ))}
        {scanning && <div className="cap-build-scan" />}
      </div>
      <div className={`cap-build-status mono${live ? ' visible' : ''}`}>
        <span className="cap-build-arrow">→</span>
        {' '}6 modules · 0 errors · DEPLOY READY
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation 3 — Marketing Engine (channels → loop → leads)
// ─────────────────────────────────────────────────────────────────────────────

const MKT_CHANNELS = [
  { label: 'Search', sub: 'pages + schema',    fill: 78, key: 'src' },
  { label: 'Email',  sub: 'follow-up loops',   fill: 91, key: 'eml' },
  { label: 'Social', sub: 'small proof posts', fill: 64, key: 'soc' },
  { label: 'Ads',    sub: 'landing tests',     fill: 55, key: 'ads' },
]

function MarketingAnim() {
  const [active, setActive] = useState(-1)
  const [leads, setLeads] = useState(47)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    let ch = -1
    const iv = setInterval(() => {
      ch = (ch + 1) % MKT_CHANNELS.length
      setActive(ch)
      if (ch === MKT_CHANNELS.length - 1) {
        setTimeout(() => {
          setLeads(p => p + 1)
          setPulse(true)
          setTimeout(() => setPulse(false), 600)
        }, 800)
      }
    }, 1300)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="cap-mkt-anim" aria-hidden="true">
      <div className="cap-mkt-head mono">
        <span>CHANNEL</span>
        <span style={{ textAlign: 'center' }}>ACTIVITY</span>
        <span style={{ textAlign: 'right' }}>MODE</span>
      </div>
      {MKT_CHANNELS.map((ch, i) => (
        <div key={ch.key} className={`cap-mkt-row${i === active ? ' active' : ''}`}>
          <span className="cap-mkt-name mono">{ch.label}</span>
          <div className="cap-mkt-track">
            <div className="cap-mkt-fill" style={{ '--pct': `${ch.fill}%` } as React.CSSProperties} />
            {i === active && <span className="cap-mkt-shine" />}
          </div>
          <span className="cap-mkt-sub mono">{ch.sub}</span>
        </div>
      ))}
      <div className="cap-mkt-footer">
        <div className={`cap-mkt-leads${pulse ? ' pulse' : ''}`}>
          <span className="mono cap-mkt-leads-label">LEADS</span>
          <b className="mono">{leads}</b>
        </div>
        <div className="cap-mkt-loop-tag mono">→ managed loop</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared: tiny Volvv-E marker
// ─────────────────────────────────────────────────────────────────────────────

function MiniVolvvE() {
  return (
    <span className="mini-volvve" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/volvv-e.png" alt="" loading="lazy" />
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function CapabilityTriptych() {
  return (
    <section className="scope capability-section" id="capabilities">
      <div className="site-rail">
        <div className="capability-head">
          <span className="mono">What eevolvv can manage</span>
          <h2>Three systems. One operating layer.</h2>
          <p>
            The free report shows which of these matters first: organize the work,
            rebuild the web presence, or turn marketing into a repeatable loop.
          </p>
        </div>

        <div className="capability-grid">
          {/* ── Card 1: Organize ── */}
          <article className="capability-card capability-organize">
            <div className="cap-card-top">
              <span className="mono">01 · Organize</span>
              <MiniVolvvE />
            </div>
            <OrganizeAnim />
            <h3>Bring the scattered work into one place.</h3>
            <p>Email, forms, calls, tasks, reports, and handoffs become one readable system.</p>
          </article>

          {/* ── Card 2: Website Builder ── */}
          <article className="capability-card capability-website">
            <div className="cap-card-top">
              <span className="mono">02 · Website builder</span>
              <MiniVolvvE />
            </div>
            <WebsiteBuilderAnim />
            <h3>Turn the offer into a clean website.</h3>
            <p>Pages, forms, booking, checkout, proof, and reporting can all connect.</p>
          </article>

          {/* ── Card 3: Marketing ── */}
          <article className="capability-card capability-marketing">
            <div className="cap-card-top">
              <span className="mono">03 · Marketing</span>
              <MiniVolvvE />
            </div>
            <MarketingAnim />
            <h3>Make marketing a managed loop.</h3>
            <p>Search, content, email, ads, and follow-up stop living in separate corners.</p>
          </article>
        </div>
      </div>
    </section>
  )
}
