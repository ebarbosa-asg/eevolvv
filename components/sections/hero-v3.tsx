'use client'

import { useState, useEffect } from 'react'
import { EvoFrame } from '@/components/pixel-icons'

const HERO_PHRASES = [
  'CORNER STORE', 'GYM', 'RESTAURANT', 'LAW FIRM', 'STARTUP',
  'ENTERPRISE', 'BODEGA', 'CLINIC', 'LOGISTICS', 'REAL ESTATE',
  'AGENCY', 'FRANCHISE', 'MANUFACTURER',
]

const SCAN_LINES: [string, string][] = [
  ['DENTAL', '47 tasks · 16.2h ghosted'],
  ['LEGAL', 'doc.review · agent.005 live'],
  ['ECOM', 'cart.recovery · 1.8h saved'],
  ['SALON', 'no-show · 0.4% errors'],
  ['CONTRACTORS', 'invoice.follow → +$2.1k/mo'],
  ['CHIRO', 'intake.form · agent.012 built'],
  ['REAL_ESTATE', 'lead.qual · 89% automatable'],
]

const EVO_STAGES = [
  { label: 'MANUAL', desc: 'paper · phone · memory', metric: '40h/wk', state: 'ghosted' },
  { label: 'SCRIPTS', desc: 'spreadsheets · macros', metric: '32h/wk', state: 'leaking' },
  { label: 'TOOLS', desc: 'crm · zapier · saas', metric: '24h/wk', state: 'patched' },
  { label: 'HYBRID', desc: 'humans + agents', metric: '12h/wk', state: 'compounding' },
  { label: 'AUTONOMOUS', desc: 'eevolvv · forever customer', metric: '<2h/wk', state: 'evolved' },
]

function fmtTime(d: Date): string {
  return [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

export default function HeroV3() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'typing' | 'hold' | 'deleting'>('typing')
  const [evoOn, setEvoOn] = useState(0)
  const [leaksFound, setLeaksFound] = useState(1247)
  const [agentsOnline, setAgentsOnline] = useState(312)
  const [hrsSaved, setHrsSaved] = useState(8642)
  const [clock, setClock] = useState<Date | null>(null)
  const [scanIdx, setScanIdx] = useState(0)

  // Typewriter
  useEffect(() => {
    const target = HERO_PHRASES[phraseIdx].toLowerCase()
    let timeout: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (typed.length < target.length) {
        timeout = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 38)
      } else {
        timeout = setTimeout(() => setPhase('hold'), 1100)
      }
    } else if (phase === 'hold') {
      timeout = setTimeout(() => setPhase('deleting'), 0)
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => setTyped(typed.slice(0, -1)), 22)
      } else {
        timeout = setTimeout(() => {
          setPhraseIdx((i) => (i + 1) % HERO_PHRASES.length)
          setPhase('typing')
        }, 180)
      }
    }
    return () => clearTimeout(timeout)
  }, [phraseIdx, typed, phase])

  // Live animations
  useEffect(() => {
    const i1 = setInterval(() => setEvoOn((i) => (i + 1) % 6), 600)
    const i2 = setInterval(() => {
      setLeaksFound((n) => n + Math.floor(Math.random() * 3))
      setHrsSaved((n) => n + Math.floor(Math.random() * 6) + 1)
      setAgentsOnline((n) => Math.min(420, n + (Math.random() > 0.75 ? 1 : 0)))
    }, 1400)
    setClock(new Date())
    const i3 = setInterval(() => setClock(new Date()), 1000)
    const i4 = setInterval(() => setScanIdx((i) => (i + 1) % SCAN_LINES.length), 900)
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); clearInterval(i4) }
  }, [])

  const clockStr = clock ? fmtTime(clock) : '--:--:--'

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-radial" />
      </div>

      <div className="site-rail hero-inner">
        {/* Header row */}
        <div className="hero-head">
          <span className="hero-head-counter mono">§ 00</span>
          <span className="hero-head-label mono">Overview · Q2 2026 · A service, not software.</span>
          <span className="hero-head-status">
            <span className="hero-head-dot" />
            LIVE_OPS · {clockStr} UTC
          </span>
        </div>

        {/* Main 2-col */}
        <div className="hero-main">
          <div className="hero-left">
            <h1 className="hero-tagline">
              <span className="serif">We&nbsp;evolve every</span>
              <br />
              <span className="hero-rotor">
                {typed}
                <span className="type-cursor" />
              </span>
            </h1>

            <p className="hero-body">
              From fragmented manual labor → autonomous systems.
              <br />
              <span className="serif" style={{ color: 'var(--accent)' }}>Diagnose. Build. Maintain.</span>
              {' '}Forever customer.
            </p>

            <div className="hero-cta-row">
              <a className="btn-primary" href="#diagnostic">
                Get free report
                <span>→</span>
              </a>
              <a className="btn-ghost" href="#protocol">
                See the protocol
              </a>
            </div>
          </div>

          {/* Live ops panel */}
          <aside className="hero-right">
            <div className="live-ops">
              <div className="live-ops-head">
                <span className="live-ops-head-dot" />
                <span className="live-ops-head-title">LIVE_OPS · streaming</span>
                <span className="live-ops-head-time">{clockStr}</span>
              </div>

              <div className="live-ops-vlvv">
                <div className="scan-rings" aria-hidden="true">
                  <span /><span /><span />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/volvv-e.png" alt="" className="pixelated" style={{ imageRendering: 'pixelated' }} />
                <div className="live-ops-vlvv-tag mono">
                  VOLVV-E · MODE 01 · SCANNER
                </div>
              </div>

              <div className="live-ops-metrics">
                {([
                  ['GHOST TASKS FOUND', leaksFound.toLocaleString(), 0.68],
                  ['AGENTS ONLINE', agentsOnline, 0.78],
                  ['HRS SAVED · WK', hrsSaved.toLocaleString(), 0.91],
                ] as [string, string | number, number][]).map(([label, val, pct]) => (
                  <div key={label} className="live-metric">
                    <span className="live-metric-label">{label}</span>
                    <span className="live-metric-val">{val}</span>
                    <span className="live-metric-bar">
                      <i style={{ width: `${pct * 100}%` }} />
                    </span>
                  </div>
                ))}
              </div>

              <div className="live-ops-log mono">
                {SCAN_LINES.map((line, i) => (
                  <div key={i} className={i === scanIdx ? 'on' : ''}>
                    <span className="arrow">→</span>{' '}
                    <span className="kw">{line[0]}</span>{' '}
                    <span className="sub-arrow">↳</span>{' '}
                    {line[1]}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Evolution timeline */}
        <div className="evo-block">
          <div className="evo-block-rail" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="evo-tick">
                <span className="mono evo-tick-code">§ {String(i).padStart(2, '0')}</span>
              </div>
            ))}
          </div>

          <div className="evo-strip" aria-hidden="true">
            {EVO_STAGES.map((stage, i) => (
              <div key={i} className={`evo-cell${i <= (evoOn % 5) ? ' on' : ''}`}>
                <div className="evo-figure">
                  <EvoFrame which={i} size={68} on={i <= (evoOn % 5)} />
                </div>
                <div className="evo-cell-meta">
                  <span className="mono evo-cell-label">{stage.label}</span>
                  <span className="mono evo-cell-desc">↳ {stage.desc}</span>
                </div>
                <div className="evo-cell-metric">
                  <span className="mono evo-cell-metric-num">{stage.metric}</span>
                  <span className="mono evo-cell-metric-tag">{stage.state}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="evo-footnote mono">
            <span>← FROM MANUAL</span>
            <span className="evo-axis" aria-hidden="true" />
            <span className="evo-footnote-mid">
              <span className="dot">◈</span>
              <span>
                You are{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>here</span>
                {' '}· most SMBs sit at §02
              </span>
            </span>
            <span className="evo-axis" aria-hidden="true" />
            <span>TO AUTONOMOUS →</span>
          </div>
        </div>
      </div>
    </section>
  )
}
