'use client'

import { useState } from 'react'
import {
  PixelIcon,
  ICON_TOOTH,
  ICON_SCALES,
  ICON_HOUSE,
  ICON_HAMMER,
  ICON_PULSE,
  ICON_SCISSORS,
  ICON_CAR,
  ICON_BAG,
} from '@/components/pixel-icons'

interface Task {
  n: string
  h: number
  s: number
}

interface Industry {
  id: string
  label: string
  icon: string[]
  tasks: Task[]
}

const INDUSTRIES: Industry[] = [
  { id: 'dental', label: 'Dental', icon: ICON_TOOTH,
    tasks: [{ n: 'Appt Confirmations', h: 2.5, s: 800 }, { n: 'Insurance Verify', h: 2.0, s: 1200 },
            { n: 'Patient Intake', h: 1.5, s: 600 }, { n: 'No-Show Follow-ups', h: 1.0, s: 400 }] },
  { id: 'legal', label: 'Legal', icon: ICON_SCALES,
    tasks: [{ n: 'Client Intake', h: 3.0, s: 2400 }, { n: 'Document Review', h: 4.0, s: 3200 },
            { n: 'Scheduling', h: 1.5, s: 800 }, { n: 'Status Updates', h: 1.0, s: 1000 }] },
  { id: 'realestate', label: 'Real Estate', icon: ICON_HOUSE,
    tasks: [{ n: 'Lead Qualification', h: 2.5, s: 1800 }, { n: 'Showing Schedule', h: 1.5, s: 600 },
            { n: 'Follow-up Seq', h: 2.0, s: 1200 }, { n: 'Doc Collection', h: 1.5, s: 800 }] },
  { id: 'contractors', label: 'Contractors', icon: ICON_HAMMER,
    tasks: [{ n: 'Estimate Requests', h: 2.0, s: 1500 }, { n: 'Job Scheduling', h: 1.5, s: 900 },
            { n: 'Invoice Follow-ups', h: 1.5, s: 2000 }, { n: 'Review Requests', h: 0.5, s: 500 }] },
  { id: 'medical', label: 'Medical', icon: ICON_PULSE,
    tasks: [{ n: 'Appt Reminders', h: 2.0, s: 1600 }, { n: 'Rx Refills', h: 1.5, s: 1200 },
            { n: 'Lab Results', h: 1.0, s: 800 }, { n: 'Insurance Pre-Auth', h: 2.5, s: 2400 }] },
  { id: 'salon', label: 'Salon', icon: ICON_SCISSORS,
    tasks: [{ n: 'Booking + Reminders', h: 2.0, s: 900 }, { n: 'Waitlist Mgmt', h: 1.0, s: 400 },
            { n: 'Review Requests', h: 0.5, s: 600 }, { n: 'No-Show Recovery', h: 1.0, s: 700 }] },
  { id: 'auto', label: 'Auto Shop', icon: ICON_CAR,
    tasks: [{ n: 'Estimate Quotes', h: 2.5, s: 1600 }, { n: 'Status Updates', h: 1.5, s: 800 },
            { n: 'Parts Ordering', h: 1.0, s: 1100 }, { n: 'Review Asks', h: 0.5, s: 400 }] },
  { id: 'ecom', label: 'E-commerce', icon: ICON_BAG,
    tasks: [{ n: 'Support Tickets', h: 4.0, s: 2200 }, { n: 'Inventory Sync', h: 1.0, s: 600 },
            { n: 'Abandoned Cart', h: 1.5, s: 1800 }, { n: 'Return Triage', h: 1.5, s: 900 }] },
]

export default function IndustriesV3() {
  const [active, setActive] = useState(0)
  const industry = INDUSTRIES[active]
  const totalH = industry.tasks.reduce((s, t) => s + t.h, 0)
  const totalS = industry.tasks.reduce((s, t) => s + t.s, 0)
  const maxH = Math.max(...industry.tasks.map((t) => t.h))

  return (
    <section className="scope" id="industries">
      <div className="site-rail">
        <div className="sec-head">
          <span className="sec-marker mono">§ 02</span>
          <h2 className="sec-head-title">
            What we evolve, by{' '}
            <span className="serif" style={{ color: 'var(--accent)' }}>vertical</span>.
          </h2>
          <span className="sec-marker mono" style={{ textAlign: 'right', opacity: 0.5 }}>
            {INDUSTRIES.length} VERTICALS
          </span>
        </div>

        {/* Tabs */}
        <div
          className="ind-tabs"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${INDUSTRIES.length}, minmax(0,1fr))`,
          }}
        >
          {INDUSTRIES.map((ind, i) => (
            <button
              key={ind.id}
              onClick={() => setActive(i)}
              style={{
                background: i === active ? 'var(--ink)' : 'transparent',
                color: i === active ? 'var(--paper)' : 'var(--ink)',
                border: 'none',
                borderRight: i < INDUSTRIES.length - 1 ? '1px solid var(--ink)' : 'none',
                padding: '18px 12px 14px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'inherit',
                transition: 'background .25s ease, color .25s ease',
              }}
            >
              <span style={{ color: i === active ? 'var(--accent)' : 'var(--ink)' }}>
                <PixelIcon grid={ind.icon} size={28} label={ind.label} />
              </span>
              <span
                className="mono"
                style={{ fontSize: 10, letterSpacing: '.18em', fontWeight: 700, textTransform: 'uppercase' }}
              >
                {ind.label}
              </span>
            </button>
          ))}
        </div>

        {/* Bar chart panel */}
        <div style={{ border: '1px solid var(--ink)', background: 'var(--paper)', padding: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24,
            paddingBottom: 18, borderBottom: '1px solid var(--rule)',
          }}>
            <div style={{
              width: 64, height: 64, background: 'var(--ink)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PixelIcon grid={industry.icon} size={42} label="" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>
                ACTIVE VERTICAL · § 03.{String(active + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-.025em', lineHeight: 1 }}>
                {industry.label}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '.22em', color: 'rgba(20,20,19,.4)', marginBottom: 2 }}>
                RECOVERY
              </div>
              <div className="mono" style={{ fontSize: 30, fontWeight: 600, color: 'var(--accent)', letterSpacing: '-.02em' }}>
                ${totalS.toLocaleString()}<span style={{ fontSize: 14, opacity: 0.5 }}>/mo</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {industry.tasks.map((task, i) => {
              const pct = (task.h / maxH) * 100
              return (
                <div
                  key={task.n}
                  className="ind-row"
                  style={{ display: 'grid', gridTemplateColumns: '200px 1fr 110px', gap: 18, alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-.005em' }}>{task.n}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'rgba(20,20,19,.4)', letterSpacing: '.14em', marginTop: 2 }}>
                      → {task.h.toFixed(1)}H/WK
                    </div>
                  </div>
                  <div style={{ height: 28, background: 'rgba(20,20,19,.05)', position: 'relative', overflow: 'hidden' }}>
                    <div
                      key={`${active}-${i}`}
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: `repeating-linear-gradient(90deg, var(--accent) 0 6px, oklch(0.4 0.13 25) 6px 12px)`,
                        animation: 'barGrow .7s cubic-bezier(.2,.8,.2,1) both',
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                    <span
                      className="mono"
                      style={{
                        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                        fontSize: 10, letterSpacing: '.14em', color: 'rgba(20,20,19,.4)',
                      }}
                    >
                      ▓▓▓▓▓░░░░░
                    </span>
                  </div>
                  <div className="mono" style={{ textAlign: 'right', fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>
                    ${task.s.toLocaleString()}<span style={{ opacity: 0.4, fontSize: 11 }}>/mo</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{
            marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--ink)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '.16em', color: 'rgba(20,20,19,.6)' }}>
              ↳ {totalH.toFixed(1)} HOURS / WK · {industry.tasks.length} AGENTS
            </span>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '.16em', color: 'var(--accent)', fontWeight: 700 }}>
              ${(totalS * 12).toLocaleString()}/YR RECOVERED →
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
