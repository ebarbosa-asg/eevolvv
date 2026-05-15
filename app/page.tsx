'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { VolvvE } from '@/components/VolvvE'
import { SectionMarker } from '@/components/ds/SectionMarker'
import { KPIStat } from '@/components/ds/KPIStat'
import { Button } from '@/components/ds/Button'
import { Card, CardContent } from '@/components/ds/Card'
import { CountingNumber } from '@/components/ui/counting-number'

// ─── Hero Rotating Phrases ────────────────────────────────────────────────────
const HERO_PHRASES = [
  'CORNER STORE', 'GYM', 'RESTAURANT', 'LAW FIRM',
  'STARTUP', 'ENTERPRISE', 'BODEGA', 'CLINIC', 'LOGISTICS',
  'REAL ESTATE', 'AGENCY', 'FRANCHISE', 'MANUFACTURER',
] as const

// ─── Flap Character Component ─────────────────────────────────────────────────
function FlapChar({ char, isWide }: { char: string; isWide: boolean }) {
  return (
    <span className="flap-cell" aria-hidden="true">
      <span className="flap-half top" style={{ transition: 'background 0.4s ease, border-color 0.4s ease' }}>
        <span><i data-wide={isWide ? '1' : '0'}>{char}</i></span>
      </span>
      <span className="flap-half bottom" style={{ transition: 'background 0.4s ease, border-color 0.4s ease' }}>
        <span><i data-wide={isWide ? '1' : '0'}>{char}</i></span>
      </span>
    </span>
  )
}

// ─── Pain Calendar Data ───────────────────────────────────────────────────────
const weeklyData = [
  {
    day: 'MON',
    tasks: [
      { label: 'Appt confirmations', hours: 2.5, color: 'bg-accent/20' },
      { label: 'Insurance calls', hours: 1.5, color: 'bg-accent/15' },
      { label: 'Intake forms', hours: 1.0, color: 'bg-accent/10' },
      { label: 'Follow-ups', hours: 1.0, color: 'bg-accent/10' },
    ],
  },
  {
    day: 'TUE',
    tasks: [
      { label: 'Appt reminders', hours: 2.0, color: 'bg-accent/20' },
      { label: 'Insurance calls', hours: 2.0, color: 'bg-accent/15' },
      { label: 'New patient setup', hours: 1.5, color: 'bg-accent/10' },
      { label: 'Referrals', hours: 0.5, color: 'bg-accent/10' },
    ],
  },
  {
    day: 'WED',
    tasks: [
      { label: 'No-show follow-ups', hours: 1.5, color: 'bg-accent/20' },
      { label: 'Insurance verify', hours: 2.0, color: 'bg-accent/15' },
      { label: 'Form processing', hours: 1.5, color: 'bg-accent/10' },
      { label: 'Callbacks', hours: 1.0, color: 'bg-accent/10' },
    ],
  },
  {
    day: 'THU',
    tasks: [
      { label: 'Appt confirmations', hours: 2.0, color: 'bg-accent/20' },
      { label: 'Insurance calls', hours: 1.5, color: 'bg-accent/15' },
      { label: 'Patient intake', hours: 1.5, color: 'bg-accent/10' },
      { label: 'Schedule coord', hours: 1.0, color: 'bg-accent/10' },
    ],
  },
  {
    day: 'FRI',
    tasks: [
      { label: 'Week follow-ups', hours: 2.0, color: 'bg-accent/20' },
      { label: 'Insurance catch-up', hours: 1.5, color: 'bg-accent/15' },
      { label: 'Form cleanup', hours: 1.0, color: 'bg-accent/10' },
      { label: 'Next week prep', hours: 1.5, color: 'bg-accent/10' },
    ],
  },
]

const totalHours = weeklyData.reduce(
  (sum, day) => sum + day.tasks.reduce((s, t) => s + t.hours, 0),
  0
)
const hourlyRate = 40
const monthlyWaste = totalHours * hourlyRate * 4

// ─── Industry Data ────────────────────────────────────────────────────────────
const industries = [
  {
    id: 'dental',
    label: 'Dental',
    icon: '🦷',
    automations: [
      { title: 'Appointment Confirmations', before: '2 hrs/day calling', after: 'AI texts + calls 24/7', savings: '$800/mo' },
      { title: 'Insurance Verification', before: '1 hr/patient manual', after: 'Instant API check', savings: '$1,200/mo' },
      { title: 'Patient Intake Forms', before: 'Paper + manual entry', after: 'Digital + auto-populate', savings: '$600/mo' },
      { title: 'No-Show Follow-ups', before: 'Manual calls', after: 'Auto-reschedule', savings: '$400/mo' },
    ],
  },
  {
    id: 'legal',
    label: 'Law Firms',
    icon: '⚖️',
    automations: [
      { title: 'Client Intake', before: '30 min/call screening', after: 'AI qualification bot', savings: '$2,400/mo' },
      { title: 'Document Review', before: 'Hours of manual review', after: 'AI extracts clauses', savings: '$3,200/mo' },
      { title: 'Scheduling', before: 'Back-and-forth emails', after: 'Self-service booking', savings: '$800/mo' },
      { title: 'Status Updates', before: 'Manual client calls', after: 'Auto case updates', savings: '$1,000/mo' },
    ],
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    icon: '🏠',
    automations: [
      { title: 'Lead Qualification', before: 'Manual call screening', after: 'AI pre-qualifies', savings: '$1,800/mo' },
      { title: 'Showing Scheduling', before: 'Coordination calls', after: 'Self-service booking', savings: '$600/mo' },
      { title: 'Follow-up Sequences', before: 'Manual check-ins', after: 'Automated nurture', savings: '$1,200/mo' },
      { title: 'Document Collection', before: 'Chasing paperwork', after: 'Auto-request system', savings: '$800/mo' },
    ],
  },
  {
    id: 'contractors',
    label: 'Contractors',
    icon: '🔨',
    automations: [
      { title: 'Estimate Requests', before: 'Phone tag + quotes', after: 'AI qualification', savings: '$1,500/mo' },
      { title: 'Job Scheduling', before: 'Manual coordination', after: 'Auto-schedule by zone', savings: '$900/mo' },
      { title: 'Invoice Follow-ups', before: 'Chasing payments', after: 'Auto reminders', savings: '$2,000/mo' },
      { title: 'Review Requests', before: 'Manual ask', after: 'Auto post-job', savings: '$500/mo' },
    ],
  },
  {
    id: 'medical',
    label: 'Medical',
    icon: '🏥',
    automations: [
      { title: 'Appt Reminders', before: 'Staff calls 24h before', after: 'Multi-channel auto', savings: '$1,600/mo' },
      { title: 'Prescription Refills', before: 'Phone requests', after: 'Patient self-service', savings: '$1,200/mo' },
      { title: 'Lab Results Delivery', before: 'Manual calls', after: 'Secure auto-delivery', savings: '$800/mo' },
      { title: 'Insurance Pre-Auth', before: 'Manual paperwork', after: 'AI-assisted', savings: '$2,400/mo' },
    ],
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null)
  const [url, setUrl] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [activeIndustry, setActiveIndustry] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [roiHours, setRoiHours] = useState(20)
  const [roiAgents, setRoiAgents] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % HERO_PHRASES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const currentPhrase = HERO_PHRASES[phraseIndex]
  const isWideChar = (c: string) => ['M', 'W'].includes(c)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hasWebsite && url) {
      window.location.href = `/#diagnostic?url=${encodeURIComponent(url)}`
    } else if (!hasWebsite && businessName) {
      window.location.href = `/#diagnostic?business=${encodeURIComponent(businessName)}`
    }
  }

  const roiMonthlyWaste = roiHours * hourlyRate * 4
  const roiEevolvvCost = 500 + roiAgents * 50
  const roiSavings = roiMonthlyWaste - roiEevolvvCost

  return (
    <main className="bg-paper text-ink selection:bg-ink selection:text-paper font-sans">

      {/* ══════════════════════════════════════════════════════════════════════════
          HERO — Split-Flap + Dual-Path CTA
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mono text-[10px] text-accent tracking-[0.5em] font-bold mb-8 uppercase">
            Autonomous Infrastructure · 2026
          </div>

          <div className="mb-6">
            <span className="serif text-5xl md:text-7xl font-normal tracking-tight" style={{ transform: 'skewX(-3deg)', display: 'inline-block' }}>
              We evolve every
            </span>
          </div>

          <div className="mb-8">
            <span className="flap-stage hero-flap-stage" style={{ color: 'var(--paper)' }}>
              {currentPhrase.split('').map((char, i) => (
                <FlapChar key={i} char={char} isWide={isWideChar(char)} />
              ))}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-normal mb-16 text-ink/70 serif italic">
            into the new era.
          </h1>

          <div className="flex flex-col gap-4 items-center max-w-md mx-auto">
            <button
              onClick={() => setHasWebsite(true)}
              className="w-full bg-ink text-paper px-8 py-4 mono text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-accent transition-all"
            >
              I Have a Website →
            </button>
            <button
              onClick={() => setHasWebsite(false)}
              className="w-full bg-transparent border border-ink/20 text-ink px-8 py-4 mono text-[11px] font-bold tracking-[0.3em] uppercase hover:border-ink transition-all"
            >
              I Don&apos;t Have a Website Yet
            </button>
          </div>

          {hasWebsite !== null && (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto animate-[fadeIn_0.5s_ease]">
              {hasWebsite ? (
                <input
                  type="url"
                  placeholder="ENTER YOUR WEBSITE URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink/20 py-4 px-2 mono text-xs tracking-widest focus:border-accent transition-colors outline-none text-center uppercase"
                  required
                />
              ) : (
                <input
                  type="text"
                  placeholder="ENTER YOUR BUSINESS NAME..."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink/20 py-4 px-2 mono text-xs tracking-widest focus:border-accent transition-colors outline-none text-center uppercase"
                  required
                />
              )}
              <button
                type="submit"
                className="mt-6 w-full btn-gradient px-8 py-4 mono text-[10px] font-bold tracking-[0.4em] uppercase"
              >
                GET FREE REPORT →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          PAIN CALENDAR — Weekly Time Waste Visualization
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-rule bg-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <SectionMarker num="01" label="The Problem" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-6">
              You&apos;re losing{' '}
              <span className="text-accent">
                <CountingNumber value={totalHours} format={(n) => n.toFixed(1)} /> hours/week
              </span>{' '}
              to work a machine could do.
            </h2>
            <p className="text-lg text-ink/60 mt-6 max-w-2xl mx-auto">
              Here&apos;s what a typical week looks like for a dental practice. Every colored block is time your team spends on tasks that could be automated.
            </p>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-5 gap-3 mb-12">
            {weeklyData.map((day, dayIndex) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: dayIndex * 0.1 }}
                onClick={() => setSelectedDay(selectedDay === dayIndex ? null : dayIndex)}
                className={`bg-paper border border-rule rounded-lg p-4 cursor-pointer transition-all ${
                  selectedDay === dayIndex ? 'ring-2 ring-accent' : 'hover:border-ink/20'
                }`}
              >
                <div className="text-center mb-3">
                  <span className="mono text-accent font-bold text-sm">{day.day}</span>
                  <div className="text-2xl font-bold mt-1">
                    {day.tasks.reduce((s, t) => s + t.hours, 0).toFixed(1)}h
                  </div>
                </div>
                <div className="space-y-1.5">
                  {day.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={taskIndex}
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: dayIndex * 0.1 + taskIndex * 0.05 + 0.5 }}
                      className="relative"
                    >
                      <div className={`h-5 ${task.color} rounded-sm flex items-center px-2`}>
                        {selectedDay === dayIndex && (
                          <span className="text-[9px] text-ink/70 truncate mono">{task.label}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <KPIStat value={`${totalHours.toFixed(1)}`} label="HOURS WASTED/WEEK" />
            <KPIStat value={`$${totalHours * hourlyRate}`} label="COST PER WEEK" />
            <KPIStat value={`$${monthlyWaste.toLocaleString()}`} label="MONTHLY WASTE" />
          </div>

          <div className="text-center mt-10">
            <p className="text-ink/60 mb-6">This is you. <span className="text-accent font-medium">Let us show you the fix.</span></p>
            <Button variant="primary" onClick={() => setHasWebsite(true)}>
              Show Me What You&apos;d Automate →
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          SOLUTION STEPS — Watch → Build → Deploy
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-rule">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <SectionMarker num="02" label="The Solution" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-6">
              How it works
            </h2>
            <p className="text-lg text-ink/60 mt-4">Three steps. Seven days. Zero risk.</p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center gap-3 mb-12">
            {['01', '02', '03'].map((num, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`px-6 py-3 rounded-lg mono text-sm font-bold transition-all ${
                  activeStep === i
                    ? 'bg-ink text-paper'
                    : 'bg-paper text-ink/60 border border-rule hover:border-ink/30'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Step Content */}
          {activeStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="mono text-accent text-sm mb-2">STEP 01</div>
                <h3 className="text-3xl font-bold mb-2">We Watch</h3>
                <p className="text-accent mb-4">7 days. Zero disruption.</p>
                <p className="text-ink/60 mb-6">
                  We plug into your existing systems — email, phone, calendar, forms — and observe. No setup. No changes. We just watch and learn.
                </p>
                <ul className="space-y-3">
                  {['Connect to your email & calendar', 'Monitor phone call patterns', 'Track form submissions', 'Map every repetitive task'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-accent">✓</span>
                      <span className="text-ink/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-paper border border-rule rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-accent flex items-center justify-center">
                    <span className="text-4xl">👁️</span>
                  </div>
                  <div className="mono text-[10px] text-accent tracking-widest">OBSERVATION MODE</div>
                  <div className="mt-4 space-y-2">
                    {['📧 Email', '📞 Phone', '📋 Forms', '📅 Calendar'].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex items-center gap-2 text-sm text-ink/60"
                      >
                        <span className="w-2 h-2 bg-accent rounded-full" />
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="mono text-accent text-sm mb-2">STEP 02</div>
                <h3 className="text-3xl font-bold mb-2">We Build</h3>
                <p className="text-accent mb-4">Custom AI agents for your business.</p>
                <p className="text-ink/60 mb-6">
                  Based on what we observed, we build custom AI agents — one for each task. Each agent handles one job, 24/7, without breaks or mistakes.
                </p>
                <ul className="space-y-3">
                  {['Appointment confirmation bot', 'Insurance verification agent', 'Patient intake automation', 'Follow-up call system'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-accent">✓</span>
                      <span className="text-ink/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-paper border border-rule rounded-lg p-6">
                <div className="space-y-3">
                  {[
                    { name: 'Appt Bot', status: 'active' },
                    { name: 'Insurance Agent', status: 'active' },
                    { name: 'Intake Handler', status: 'building' },
                    { name: 'Follow-up System', status: 'queued' },
                  ].map((agent, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-3 bg-paper border border-rule rounded p-3"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500' :
                        agent.status === 'building' ? 'bg-amber-500 animate-pulse' : 'bg-ink/20'
                      }`} />
                      <span className="text-sm mono flex-1">{agent.name}</span>
                      <span className="text-[10px] mono text-ink/40">{agent.status}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="mono text-accent text-sm mb-2">STEP 03</div>
                <h3 className="text-3xl font-bold mb-2">We Deploy</h3>
                <p className="text-accent mb-4">Live in 72 hours.</p>
                <p className="text-ink/60 mb-6">
                  We go live. Your team does less work. Your business runs smoother. And you get a dashboard showing exactly what we automated and how much time we saved.
                </p>
                <ul className="space-y-3">
                  {['Go live in 72 hours', 'Real-time savings dashboard', '24/7 monitoring', 'Instant support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-accent">✓</span>
                      <span className="text-ink/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-paper border border-rule rounded-lg p-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-accent mono">BEFORE</span>
                    <span className="mono text-ink/60">18 hrs/week</span>
                  </div>
                  <div className="h-4 bg-accent/20 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-600 mono">AFTER</span>
                    <span className="mono text-ink/60">2 hrs/week</span>
                  </div>
                  <div className="h-4 bg-green-100 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '11%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                  <p className="text-green-700 text-sm mono">YOU SAVE</p>
                  <p className="text-3xl font-bold text-green-600 mono">16 hrs/week</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Progress */}
          <div className="flex justify-center gap-2 mt-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1 w-12 rounded transition-all ${i <= activeStep ? 'bg-accent' : 'bg-rule'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          INDUSTRY SELECTOR — Tabbed Automation Examples
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-rule bg-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <SectionMarker num="03" label="Industries" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-6">
              What we automate for{' '}
              <span className="text-accent">{industries[activeIndustry].label}</span>
            </h2>
            <p className="text-lg text-ink/60 mt-4">Click an industry to see exactly what we&apos;d automate for your business.</p>
          </div>

          {/* Industry Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {industries.map((ind, i) => (
              <button
                key={ind.id}
                onClick={() => setActiveIndustry(i)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeIndustry === i
                    ? 'bg-ink text-paper'
                    : 'bg-paper text-ink/60 border border-rule hover:border-ink/30'
                }`}
              >
                <span>{ind.icon}</span>
                <span>{ind.label}</span>
              </button>
            ))}
          </div>

          {/* Automation Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {industries[activeIndustry].automations.map((auto, i) => (
              <motion.div
                key={`${industries[activeIndustry].id}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-paper border border-rule rounded-lg p-5"
              >
                <h3 className="font-bold mb-3">{auto.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-accent text-xs mono">BEFORE:</span>
                    <span className="text-ink/50 text-sm">{auto.before}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-xs mono">AFTER:</span>
                    <span className="text-ink/70 text-sm">{auto.after}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-rule">
                  <span className="text-accent font-bold mono text-sm">{auto.savings}</span>
                  <span className="text-ink/40 text-xs">estimated savings</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total Savings */}
          <div className="mt-10 bg-paper border border-rule rounded-lg p-6 text-center">
            <p className="text-ink/50 mb-2">Total estimated savings for {industries[activeIndustry].label}</p>
            <p className="text-4xl font-bold text-accent mono">
              ${industries[activeIndustry].automations.reduce((sum, a) => {
                const num = parseInt(a.savings.replace(/[$,mo]/g, ''))
                return sum + num
              }, 0).toLocaleString()}/mo
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          ROI CALCULATOR — Interactive Pricing
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-rule">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <SectionMarker num="04" label="Pricing" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-6">
              Pay for what we save you
            </h2>
            <p className="text-lg text-ink/60 mt-4">Adjust the sliders to match your business. See your exact ROI.</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Hours Slider */}
                <div>
                  <label className="block text-ink/60 mb-4 text-sm">
                    How many hours/week do you spend on repetitive admin work?
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={roiHours}
                      onChange={(e) => setRoiHours(Number(e.target.value))}
                      className="flex-1 h-2 bg-rule rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                    />
                    <span className="text-2xl font-bold text-accent mono w-20 text-right">{roiHours}h</span>
                  </div>
                </div>

                {/* Agents Slider */}
                <div>
                  <label className="block text-ink/60 mb-4 text-sm">
                    How many different tasks could be automated?
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={roiAgents}
                      onChange={(e) => setRoiAgents(Number(e.target.value))}
                      className="flex-1 h-2 bg-rule rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                    />
                    <span className="text-2xl font-bold text-accent mono w-20 text-right">{roiAgents}</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-rule">
                <div>
                  <h3 className="text-accent mono text-sm mb-4">YOUR COST TODAY</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-ink/60">Hours wasted/week</span><span className="mono">{roiHours} hrs</span></div>
                    <div className="flex justify-between"><span className="text-ink/60">Cost @ ${hourlyRate}/hr</span><span className="mono">${roiHours * hourlyRate}/wk</span></div>
                    <div className="flex justify-between text-lg pt-2 border-t border-rule">
                      <span className="text-accent">Monthly waste</span>
                      <span className="text-accent font-bold mono">${roiMonthlyWaste.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-accent mono text-sm mb-4">EEVOLVV COST</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-ink/60">Base platform</span><span className="mono">$500/mo</span></div>
                    <div className="flex justify-between"><span className="text-ink/60">AI agents ({roiAgents} × $50)</span><span className="mono">${roiAgents * 50}/mo</span></div>
                    <div className="flex justify-between text-lg pt-2 border-t border-rule">
                      <span className="text-accent">Total</span>
                      <span className="text-accent font-bold mono">${roiEevolvvCost}/mo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings */}
              <div className="mt-8 bg-accent/5 border border-accent/20 rounded-lg p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-accent text-xs mono mb-1">YOU SAVE</p>
                    <p className="text-2xl font-bold text-accent mono">${roiSavings.toLocaleString()}/mo</p>
                  </div>
                  <div>
                    <p className="text-accent text-xs mono mb-1">HOURS RECOVERED</p>
                    <p className="text-2xl font-bold text-accent mono">{Math.round(roiHours * 0.85)}h/wk</p>
                  </div>
                  <div>
                    <p className="text-accent text-xs mono mb-1">ROI</p>
                    <p className="text-2xl font-bold text-accent mono">{roiEevolvvCost > 0 ? Math.round((roiSavings / roiEevolvvCost) * 100) : 0}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-10">
            <Button variant="primary" size="lg">
              Start Free Diagnostic →
            </Button>
            <p className="text-ink/40 text-sm mt-4">No credit card. No commitment. See your exact savings first.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          SOCIAL PROOF — Stats + Testimonials
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 border-t border-rule bg-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <SectionMarker num="05" label="Results" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-6">
              Real results from real businesses
            </h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <KPIStat value="2,847" label="HOURS SAVED" />
            <KPIStat value="$74,320" label="MONEY RECOVERED" />
            <KPIStat value="47" label="BUSINESSES AUTOMATED" />
            <KPIStat value="94%" label="CLIENT SATISFACTION" />
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { quote: "We were spending 6 hours a week on appointment confirmations. eevolvv's AI handles it all now. Haven't missed an appointment in 3 months.", name: 'Dr. Sarah Chen', title: 'Lakewood Family Dental', location: 'Dallas, TX', savings: '$800/mo' },
              { quote: "I was skeptical. Then they showed me exactly what I was losing. Now I get 15 hours a week back. That's almost 2 full work days.", name: 'Michael Torres', title: 'Torres Law Group', location: 'Austin, TX', savings: '$3,200/mo' },
              { quote: "The diagnostic alone was worth it. They found things I didn't even know were problems. Implementation took 3 days.", name: 'Jennifer Walsh', title: 'Walsh Real Estate', location: 'Houston, TX', savings: '$1,800/mo' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-paper border border-rule rounded-lg p-6 flex flex-col"
              >
                <p className="text-ink/70 mb-6 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="pt-4 border-t border-rule flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ink">{t.name}</p>
                    <p className="text-ink/40 text-sm">{t.title}</p>
                    <p className="text-ink/30 text-xs">{t.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent font-bold mono">{t.savings}</p>
                    <p className="text-ink/30 text-xs">saved</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          FINAL CTA — 7-Day Diagnostic Offer
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-ink text-paper">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mono text-[10px] text-accent tracking-[0.3em] font-bold mb-8 uppercase">
            § 06 · Get Started
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            7-Day Diagnostic.{' '}
            <span className="text-accent">Zero Risk.</span>
          </h2>
          <p className="text-xl text-paper/60 mb-10 max-w-xl mx-auto">
            We&apos;ll watch your business for free. If we can&apos;t save you at least{' '}
            <span className="text-accent font-bold">$2,000/month</span>, you pay nothing.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: '👁️', title: 'We Watch', desc: '7 days of observation' },
              { icon: '📊', title: 'We Analyze', desc: 'Custom efficiency report' },
              { icon: '🤖', title: 'We Build', desc: 'Your automation blueprint' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="font-bold text-paper text-sm">{item.title}</p>
                <p className="text-paper/40 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-8">
            <p className="text-accent font-bold mb-1">100% Money-Back Guarantee</p>
            <p className="text-paper/50 text-sm">If we don&apos;t save you at least $2,000/month, we&apos;ll refund you 100%. No questions asked.</p>
          </div>

          <Button variant="primary" size="lg" onClick={() => setHasWebsite(true)}>
            Get My Free Diagnostic →
          </Button>
          <p className="text-paper/30 text-sm mt-6 mono">No credit card required · Takes 2 minutes to start</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          VOLVV-E CARD (preserved from original)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-ink text-paper border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="mono text-[10px] text-accent tracking-[0.3em] font-bold mb-8 text-center uppercase">
            § 07 · Meet Your Agent
          </div>
          <div className="bg-white/5 border border-white/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-shrink-0">
                <VolvvE scale={10} state="idle" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">Volvv-E</h3>
                <p className="text-paper/70 text-lg leading-relaxed mb-6">
                  Your AI operations agent. Scans for ghost work, builds automation roadmaps, and keeps your business evolving month after month.
                </p>
                <div className="grid grid-cols-2 gap-4 mono text-[9px] text-accent tracking-[0.2em]">
                  <div>→ AVAILABLE 24/7</div>
                  <div>→ 1,200+ PATTERNS</div>
                  <div>→ 10-MIN REPORTS</div>
                  <div>→ ZERO TRAINING</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          FOOTER (preserved from original)
          ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="py-20 px-8 border-t border-rule bg-paper">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <VolvvE scale={2} />
              <span className="text-2xl font-bold tracking-tighter">eevolvv</span>
            </div>
            <p className="text-ink/50 text-sm leading-relaxed max-w-sm">
              We migrate businesses from fragmented manual labor into elite autonomous systems.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col gap-3">
              <span className="mono text-[10px] font-bold tracking-widest text-accent uppercase">Legal</span>
              <a href="/privacy" className="text-ink/60 hover:text-ink text-sm">Privacy</a>
              <a href="/terms" className="text-ink/60 hover:text-ink text-sm">Terms</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="mono text-[10px] font-bold tracking-widest text-accent uppercase">Systems</span>
              <a href="/os" className="text-ink/60 hover:text-ink text-sm">OS Login</a>
              <a href="/os/sales" className="text-ink/60 hover:text-ink text-sm">Sales Hub</a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-rule text-center mono text-[8px] text-ink/20 tracking-[0.5em] uppercase">
          © 2026 eevolvv, Inc. · Delaware C Corp · Global Autonomous Infrastructure
        </div>
      </footer>

    </main>
  )
}
