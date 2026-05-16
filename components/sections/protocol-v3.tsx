'use client'

import { useState, useEffect } from 'react'
import { PixelIcon, ICON_EYE, ICON_WRENCH, ICON_ROCKET } from '@/components/pixel-icons'

const STAGES = [
  {
    code: '01',
    title: 'We Watch',
    sub: '7 days. Zero disruption.',
    mode: 'Scanner',
    icon: ICON_EYE,
    log: [
      ['MOUNT', 'gmail · twilio · cal · stripe'],
      ['SAMPLE', '7d · 168h · rolling'],
      ['DETECT', 'patterns ≥ 3 repeats'],
    ] as [string, string][],
  },
  {
    code: '02',
    title: 'We Build',
    sub: 'Custom AI agents.',
    mode: 'Builder',
    icon: ICON_WRENCH,
    log: [
      ['SCAFFOLD', '1 agent per task'],
      ['WIRE', 'tools · memory · guards'],
      ['QA', '< 0.4% error budget'],
    ] as [string, string][],
  },
  {
    code: '03',
    title: 'We Deploy',
    sub: 'Live in 72 hours.',
    mode: 'Operator',
    icon: ICON_ROCKET,
    log: [
      ['SHADOW', 'side-by-side · 48h'],
      ['SWITCH', 'human-on-the-loop'],
      ['MAINTAIN', 'monthly recalibration'],
    ] as [string, string][],
  },
]

export default function ProtocolV3() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(false)

  useEffect(() => {
    if (!auto) return
    let i = 0
    setActive(0)
    const t = setInterval(() => {
      i++
      if (i >= STAGES.length) { setAuto(false); clearInterval(t); return }
      setActive(i)
    }, 2200)
    return () => clearInterval(t)
  }, [auto])

  return (
    <section className="scope proto-section" id="protocol">
      <div className="site-rail">
        <div className="sec-head">
          <span className="sec-marker mono">§ 01</span>
          <h2 className="sec-head-title">
            The <span className="serif" style={{ color: 'var(--accent)' }}>protocol</span>. We watch, build, deploy.
          </h2>
          <span className="sec-marker mono" style={{ textAlign: 'right', opacity: 0.5 }}>3 STAGES · 7 DAYS</span>
        </div>

        <div className="proto-grid">
          {STAGES.map((stage, i) => {
            const isActive = active === i
            const modeKey = stage.mode.toLowerCase()
            return (
              <div
                key={stage.code}
                onClick={() => { setAuto(false); setActive(i) }}
                className={`proto-card${isActive ? ' active' : ''}`}
              >
                <div className="proto-card-head">
                  <span className="proto-stage-badge mono">§ {stage.code}</span>
                  <span className="proto-mode mono">VOLVV-E / {stage.mode.toUpperCase()}</span>
                </div>

                <div className="proto-icon-wrap">
                  <div className="proto-icon">
                    <PixelIcon grid={stage.icon} size={64} label={stage.title} />
                  </div>
                  {modeKey === 'scanner' && (
                    <div className="proto-decor scanner-rings" aria-hidden="true">
                      <span /><span /><span />
                    </div>
                  )}
                  {modeKey === 'builder' && (
                    <div className="proto-decor builder-sparks" aria-hidden="true">
                      <span /><span /><span /><span />
                    </div>
                  )}
                  {modeKey === 'operator' && (
                    <div className="proto-decor operator-trail" aria-hidden="true">
                      <span /><span /><span />
                    </div>
                  )}
                </div>

                <h3 className="proto-title">{stage.title}</h3>
                <p className="proto-sub mono">{stage.sub}</p>

                <div className="term proto-log">
                  <div className="term-body" style={{ padding: '12px 14px', fontSize: 11, lineHeight: 1.8 }}>
                    {stage.log.map(([k, v]) => (
                      <div key={k}>
                        <span className="arrow">→</span> {k}{' '}
                        <span className="sub-arrow">↳</span> {v}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="proto-footer">
          <span className="mono proto-footer-note">→ COMPOUNDS_MONTHLY ↳ context never resets</span>
          <button
            onClick={() => setAuto(true)}
            disabled={auto}
            className="btn-ghost"
            style={{ padding: '12px 22px' }}
          >
            {auto ? '▷ Running…' : 'Run protocol →'}
          </button>
        </div>
      </div>
    </section>
  )
}
