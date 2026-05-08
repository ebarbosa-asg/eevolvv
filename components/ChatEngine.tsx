'use client'

import { useState, useEffect, useRef } from 'react'
import posthog from 'posthog-js'
import Confetti from 'react-confetti'
import { usePDF } from 'react-to-pdf'
import { VolvvE, VolvvEAvatar, type GhostState } from '@/components/VolvvE'
import { TierCards } from '@/components/TierCards'
import { formatReport } from '@/lib/format-report'

type Phase = 'chatting' | 'extracting' | 'report' | 'error'
type Msg = { role: 'user' | 'ai'; text: string; id: number }
type ApiMsg = { role: 'user' | 'assistant'; content: string }

const OPENING = "Hi! I'm eevolvv's AI diagnostic assistant.\n\nWhat kind of business do you run — and what's your name?"

const ACTIVITY_LINES = [
  '> Parsing business profile',
  '> Loading 1,200+ automation templates',
  '> Identifying workflow bottlenecks',
  '> Mapping customer journey touchpoints',
  '> Computing labor cost savings',
  '> Cross-referencing industry benchmarks',
  '> Generating ROI projections',
  '> Building your 90-day roadmap',
  '> Finalizing your eevolvv report',
]

const APPROX_QUESTIONS = 10

/** Returns the ghost state based on chat phase + streaming */
function resolveGhostState(phase: Phase, isStreaming: boolean): GhostState {
  if (phase === 'error')     return 'error'
  if (phase === 'report')    return 'done'
  if (phase === 'extracting' || isStreaming) return 'thinking'
  return 'idle'
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(pct, 100) / 100)
  return (
    <svg width={92} height={92} viewBox="0 0 92 92" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
      <circle cx={46} cy={46} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
      <circle
        cx={46} cy={46} r={r}
        fill="none" stroke="var(--accent)" strokeWidth={3}
        strokeLinecap="butt"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}

export default function ChatEngine({ defaultTier }: { defaultTier: string }) {
  const [phase, setPhase] = useState<Phase>('chatting')
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: OPENING, id: 0 }])
  const [apiMsgs, setApiMsgs] = useState<ApiMsg[]>([])
  const [streamText, setStreamText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [input, setInput] = useState('')
  const [report, setReport] = useState<{
    text: string
    businessName?: string
    email?: string
    stats?: { hoursFreed: number; automations: number; annualSavings: number } | null
    tier?: string
    submissionId?: string
  } | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [userMsgCount, setUserMsgCount] = useState(0)

  // Ghost state (derived — no extra useState needed)
  const ghostState: GhostState = resolveGhostState(phase, isStreaming)

  // Extraction
  const [typedLines, setTypedLines] = useState<string[]>([])
  const [currentLineText, setCurrentLineText] = useState('')
  const [allLinesComplete, setAllLinesComplete] = useState(false)
  const [extractPct, setExtractPct] = useState(0)

  // Report reveal
  const [revealStage, setRevealStage] = useState(0)
  const [reportStats, setReportStats] = useState<{ label: string; value: string }[]>([])

  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInteracted = useRef(false)
  const msgIdRef = useRef(1)
  const extractionStarted = useRef(false)
  const driftIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { toPDF, targetRef: pdfTargetRef } = usePDF({ filename: 'eevolvv-evolution-report.pdf' })

  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streamText])

  useEffect(() => {
    if (phase === 'chatting' && !isStreaming && hasInteracted.current) {
      inputRef.current?.focus()
    }
  }, [phase, isStreaming])

  // Terminal typewriter
  useEffect(() => {
    if (phase !== 'extracting') return
    if (extractionStarted.current) return
    extractionStarted.current = true

    let cancelled = false
    let lineIdx = 0
    let charIdx = 0
    let completedLines: string[] = []
    const totalChars = ACTIVITY_LINES.reduce((s, l) => s + l.length, 0)
    let charsDone = 0

    function tick() {
      if (cancelled) return
      const line = ACTIVITY_LINES[lineIdx]
      if (charIdx <= line.length) {
        setCurrentLineText(line.slice(0, charIdx))
        charsDone++
        setExtractPct(Math.min(92, Math.round((charsDone / totalChars) * 92)))
        charIdx++
        setTimeout(tick, 22)
      } else {
        completedLines = [...completedLines, line]
        setTypedLines([...completedLines])
        setCurrentLineText('')
        lineIdx++
        charIdx = 0
        if (lineIdx < ACTIVITY_LINES.length) {
          setTimeout(tick, 340)
        } else {
          setAllLinesComplete(true)
          // Drift 92→99 over 8 seconds while waiting for API
          let driftPct = 92
          driftIntervalRef.current = setInterval(() => {
            driftPct = Math.min(99, driftPct + 7 / (8000 / 200))
            setExtractPct(Math.round(driftPct))
            if (driftPct >= 99) {
              clearInterval(driftIntervalRef.current!)
              driftIntervalRef.current = null
            }
          }, 200)
        }
      }
    }

    setTimeout(tick, 500)
    return () => {
      cancelled = true
      extractionStarted.current = false
      if (driftIntervalRef.current) {
        clearInterval(driftIntervalRef.current)
        driftIntervalRef.current = null
      }
    }
  }, [phase])

  // Report stagger reveal
  useEffect(() => {
    if (phase !== 'report' || !report) return
    if (report.stats && (report.stats.hoursFreed > 0 || report.stats.automations > 0 || report.stats.annualSavings > 0)) {
      setReportStats([
        { label: 'HRS / WEEK FREED', value: String(report.stats.hoursFreed) },
        { label: 'AUTOMATIONS FOUND', value: String(report.stats.automations) },
        { label: 'EST. ANNUAL SAVINGS', value: `$${report.stats.annualSavings.toLocaleString()}` },
      ])
    } else {
      setReportStats([
        { label: 'WORKFLOWS MAPPED', value: '3+' },
        { label: 'AUTOMATIONS FOUND', value: '5+' },
        { label: 'ROI POTENTIAL', value: 'HIGH' },
      ])
    }
    setShowConfetti(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const timings = [100, 500, 1000, 1600]
    timings.forEach((ms, i) => setTimeout(() => setRevealStage(i + 1), ms))
  }, [phase, report])

  // PostHog: fire payment_wall_viewed when payment wall becomes visible
  useEffect(() => {
    if (revealStage === 4) {
      posthog.capture('payment_wall_viewed', { trigger: 'chat_end' })
    }
  }, [revealStage])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    const isFirstMessage = !hasInteracted.current
    hasInteracted.current = true
    const userId = msgIdRef.current++
    const nextApiMsgs: ApiMsg[] = [...apiMsgs, { role: 'user', content: trimmed }]
    setApiMsgs(nextApiMsgs)
    setMessages(m => [...m, { role: 'user', text: trimmed, id: userId }])
    setUserMsgCount(c => c + 1)

    if (isFirstMessage) {
      posthog.capture('diagnostic_started', {
        source: typeof window !== 'undefined' && document.referrer?.includes('pricing') ? 'pricing' : 'homepage',
      })
      posthog.capture('diagnostic_chat_started', { tier: defaultTier })
    }
    setInput('')
    setIsStreaming(true)
    setStreamText('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextApiMsgs }),
      })
      if (!res.ok || !res.body) throw new Error(`Chat error ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const raw = decoder.decode(value, { stream: true })
        for (const line of raw.split('\n')) {
          if (!line.startsWith('data: ')) continue
          try {
            const ev = JSON.parse(line.slice(6))
            if (ev.type === 'delta') {
              full += ev.text
              setStreamText(full.replace(/\[READY\]\s*$/m, '').trim())
            } else if (ev.type === 'error') {
              throw new Error(ev.message)
            }
          } catch { /* skip malformed */ }
        }
      }

      const visibleText = full.replace(/\[READY\]\s*$/m, '').trim()
      const isReady = /\[READY\]/.test(full)
      const aiId = msgIdRef.current++

      setStreamText('')
      setIsStreaming(false)
      setMessages(m => [...m, { role: 'ai', text: visibleText, id: aiId }])
      const nextWithAssistant: ApiMsg[] = [...nextApiMsgs, { role: 'assistant', content: full }]
      setApiMsgs(nextWithAssistant)

      if (isReady) {
        posthog.capture('diagnostic_intake_completed', { tier: defaultTier, message_count: userMsgCount + 1 })
        setPhase('extracting')
        await generateReport(nextWithAssistant)
      }
    } catch (err) {
      setIsStreaming(false)
      setStreamText('')
      const errMsg = err instanceof Error ? err.message : 'Connection failed. Please try again.'
      posthog.capture('diagnostic_error', { stage: 'chat', error: errMsg })
      setErrorMsg(errMsg)
      setPhase('error')
    }
  }

  const generateReport = async (conversation: ApiMsg[]) => {
    try {
      const res = await fetch('/api/extract-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation, tier: defaultTier }),
      })
      const data = await res.json()
      if (res.status === 429) throw new Error("You've generated 3 reports this hour — your limit resets in 60 minutes.")
      if (!res.ok) throw new Error(data.error || `Report generation failed (${res.status})`)
      if (data.success && data.report) {
        if (data.email) {
          posthog.identify(data.email, {
            email: data.email,
            name: data.name,
            business_name: data.businessName,
            tier: data.tier,
          })
        }
        posthog.capture('diagnostic_report_viewed', {
          business_name: data.businessName,
          tier: data.tier,
          submission_id: data.submissionId,
        })
        setReport({ text: data.report, businessName: data.businessName, email: data.email, stats: data.stats, tier: data.tier, submissionId: data.submissionId })
        if (driftIntervalRef.current) {
          clearInterval(driftIntervalRef.current)
          driftIntervalRef.current = null
        }
        setExtractPct(100)
        setTimeout(() => setPhase('report'), 700)
      } else {
        throw new Error(data.error || 'Report generation failed')
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Report generation failed. Please try again.'
      posthog.capture('diagnostic_error', { stage: 'report_generation', error: errMsg })
      setErrorMsg(errMsg)
      setPhase('error')
    }
  }

  const reset = () => {
    setPhase('chatting')
    setMessages([{ role: 'ai', text: OPENING, id: 0 }])
    setApiMsgs([])
    setStreamText('')
    setInput('')
    setReport(null)
    setErrorMsg(null)
    setUserMsgCount(0)
    setTypedLines([])
    setCurrentLineText('')
    setAllLinesComplete(false)
    setExtractPct(0)
    setRevealStage(0)
    setReportStats([])
    setShowConfetti(false)
    msgIdRef.current = 1
    extractionStarted.current = false
    if (driftIntervalRef.current) {
      clearInterval(driftIntervalRef.current)
      driftIntervalRef.current = null
    }
  }

  const progressPct = Math.min(100, Math.round((userMsgCount / APPROX_QUESTIONS) * 100))

  // ── Error ──────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div style={{ padding: '56px 32px', textAlign: 'center', background: 'var(--paper)' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>● ERROR</div>
        <p style={{ fontSize: 15, opacity: 0.7, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
          {errorMsg || 'Something went wrong. Please try again.'}
        </p>
        <button onClick={reset} className="mono btn-gradient" style={{ padding: '14px 28px', border: 0, cursor: 'pointer', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600 }}>
          TRY AGAIN →
        </button>
      </div>
    )
  }

  // ── Extracting ─────────────────────────────────────────────────────────────
  if (phase === 'extracting') {
    return (
      <div style={{ background: 'var(--ink)', color: 'var(--paper)', position: 'relative', overflow: 'hidden', minHeight: 420 }}>
        {/* Scan beam */}
        <div className="diagnostic-scan-beam" />

        {/* Blueprint grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '40px 32px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 36 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div className="diagnostic-status-dot diagnostic-status-dot--thinking" />
                <span className="mono" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--accent)' }}>PROCESSING</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Building your eevolvv report
              </div>
              <p style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: 'JetBrains Mono, monospace' }}>
                ~30 seconds · sit tight
              </p>
            </div>

            {/* Progress ring */}
            <div style={{ position: 'relative', flexShrink: 0, width: 92, height: 92 }}>
              <ProgressRing pct={extractPct} />
              <div className="mono" style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600,
                color: extractPct >= 100 ? '#4ade80' : 'var(--accent)',
              }}>
                {extractPct}%
              </div>
            </div>
          </div>

          {/* Activity log */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.9 }}>
            {typedLines.map((line, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.28)' }}>
                <span>{line}</span>
                <span style={{ color: '#4ade80', fontSize: 10, letterSpacing: '0.1em', flexShrink: 0, marginLeft: 16 }}>✓ DONE</span>
              </div>
            ))}

            {currentLineText && (
              <div style={{ color: 'rgba(255,255,255,0.82)' }}>
                {currentLineText}
                <span className="anim-blink" style={{ color: 'var(--accent)', marginLeft: 2, fontWeight: 700 }}>▍</span>
              </div>
            )}

            {allLinesComplete && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.38)' }}>
                <span>→ Compiling</span>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%', animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  if (phase === 'report' && report) {
    const reportDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const reportId = `R-${String(Date.now()).slice(-5)}`
    const pdfFilename = `eevolvv-evolution-report-${(report.businessName || 'business').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`

    return (
      <div style={{ background: 'var(--paper)' }}>

        {/* T08 — Confetti burst */}
        {showConfetti && revealStage >= 1 && (
          <Confetti
            recycle={false}
            numberOfPieces={180}
            colors={['#8C2B1A', '#141413', '#faf7f0', '#d4a574']}
            gravity={0.25}
            onConfettiComplete={() => setShowConfetti(false)}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
          />
        )}

        {/* ── Document header ── */}
        <div
          ref={pdfTargetRef}
          style={{
            opacity: revealStage >= 1 ? 1 : 0,
            transform: revealStage >= 1 ? 'none' : 'translateY(-8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <div style={{
            background: 'var(--ink)', color: 'var(--paper)',
            padding: '28px 32px',
            borderBottom: '3px solid var(--accent)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
              backgroundSize: '24px 24px', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.32em', color: 'var(--accent)', fontWeight: 700 }}>
                  EEVOLVV DIAGNOSTIC REPORT
                </div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', opacity: 0.35 }}>
                  {reportId} · {reportDate}
                </div>
              </div>
              <div style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12 }}>
                {report.businessName || 'Your Business'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{ fontSize: 13, opacity: 0.45, letterSpacing: '0.04em' }}>
                  AI-generated automation roadmap
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', flexShrink: 0 }} />
                  <span className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#4ade80' }}>COMPLETE</span>
                </span>
              </div>
              {/* T07 — Email confirmation */}
              {report.email && (
                <div className="mono" style={{ fontSize: 11, opacity: 0.4, marginBottom: 10 }}>
                  → Report sent to {report.email}
                </div>
              )}
              {/* T09 + T12 — Bookmark + PDF links */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
                {report.submissionId && (
                  <a
                    href={`/report/${report.submissionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono"
                    style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(250,247,240,0.55)', textDecoration: 'none', borderBottom: '1px solid rgba(250,247,240,0.25)' }}
                  >
                    Bookmark this report →
                  </a>
                )}
                <button
                  onClick={() => { (toPDF as (opts?: { filename?: string }) => void)({ filename: pdfFilename }) }}
                  className="mono"
                  style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(250,247,240,0.55)', background: 'none', border: 'none', borderBottom: '1px solid rgba(250,247,240,0.25)', cursor: 'pointer', padding: 0 }}
                >
                  Download PDF →
                </button>
              </div>
            </div>
          </div>

          {/* ── Stat callouts ── */}
          <div className="report-stat-grid">
            {reportStats.map((s, i) => (
              <div key={i} style={{
                background: i === 0 ? 'var(--accent)' : 'var(--paper)',
                color: i === 0 ? 'var(--paper)' : 'var(--ink)',
                padding: '24px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>
                  {s.value}
                </div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', opacity: i === 0 ? 0.72 : 0.45, lineHeight: 1.5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Report content ── */}
        <div
          className="report-content"
          style={{
            padding: '40px 32px',
            opacity: revealStage >= 2 ? 1 : 0,
            transform: revealStage >= 2 ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
          dangerouslySetInnerHTML={{ __html: formatReport(report.text) }}
        />

        {/* ── Next-step banner ── */}
        <div
          style={{
            padding: '32px',
            borderTop: '3px solid var(--accent)',
            background: 'var(--ink)',
            color: 'var(--paper)',
            opacity: revealStage >= 3 ? 1 : 0,
            transform: revealStage >= 3 ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--accent)', marginBottom: 10, fontWeight: 700 }}>
            → NEXT STEP
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.2 }}>
            Your roadmap is ready. Time to build it.
          </div>
          <p style={{ fontSize: 14, opacity: 0.55, margin: 0, lineHeight: 1.6 }}>
            Every automation above can be live within days. Choose your tier and we start immediately.
          </p>
        </div>

        {/* ── Payment wall ── */}
        <div
          style={{
            padding: '32px',
            background: 'var(--paper)',
            opacity: revealStage >= 4 ? 1 : 0,
            transform: revealStage >= 4 ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <TierCards email={report?.email} visible={revealStage >= 4} recommendedTier={report?.tier} />
        </div>

      </div>
    )
  }

  // ── Chatting ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Chrome bar */}
      <div style={{
        background: 'var(--ink)', color: 'var(--paper)',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div className={`diagnostic-status-dot${isStreaming ? ' diagnostic-status-dot--thinking' : ''}`} />
        <span className="mono" style={{ fontSize: 9, letterSpacing: '0.22em', opacity: 0.6 }}>
          {isStreaming ? 'AI THINKING...' : 'AI READY'}
        </span>
        <div style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', opacity: 0.3 }}>
          SHEET D-01 · EEVOLVV DIAGNOSTIC
        </span>
        {userMsgCount > 0 && (
          <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--accent)', marginLeft: 10 }}>
            Q {userMsgCount} / ~{APPROX_QUESTIONS}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(20,20,19,0.07)', overflow: 'hidden' }}>
        {userMsgCount > 0 && (
          <div style={{
            height: '100%', background: 'var(--accent)',
            width: `${progressPct}%`,
            transition: 'width 0.7s cubic-bezier(0.65,0,0.35,1)',
          }} />
        )}
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="chat-messages-panel"
        style={{
          maxHeight: 440, overflowY: 'auto',
          padding: '28px 28px 16px',
          background: 'rgba(255,255,255,0.45)',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className="diagnostic-msg-in"
            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 20 }}
          >
            {msg.role === 'ai' && (
              <div style={{ display: 'flex', gap: 14, maxWidth: '82%', alignItems: 'flex-start' }}>
                <VolvvEAvatar state={ghostState} scale={4} />
                <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', whiteSpace: 'pre-line', paddingTop: 4 }}>
                  {msg.text}
                </div>
              </div>
            )}
            {msg.role === 'user' && (
              <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '10px 18px', fontSize: 15, lineHeight: 1.5, maxWidth: '72%' }}>
                {msg.text}
              </div>
            )}
          </div>
        ))}

        {isStreaming && (
          <div className="diagnostic-msg-in" style={{ display: 'flex', gap: 14, maxWidth: '82%', marginBottom: 20, alignItems: 'flex-start' }}>
            <VolvvEAvatar state="thinking" scale={4} />
            {streamText ? (
              <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', whiteSpace: 'pre-line', paddingTop: 4 }}>{streamText}</div>
            ) : (
              <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingTop: 14 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, background: 'var(--ink)', borderRadius: '50%', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--ink)', background: 'var(--paper)' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
          disabled={isStreaming}
          placeholder={isStreaming ? '' : 'Type your answer...'}
          style={{
            flex: 1, border: 'none', padding: '16px 20px', fontSize: 15,
            background: 'transparent', outline: 'none', color: 'var(--ink)',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isStreaming}
          className="mono"
          style={{
            background: input.trim() && !isStreaming ? 'var(--ink)' : 'transparent',
            color: input.trim() && !isStreaming ? 'var(--paper)' : 'var(--ink)',
            border: 'none', borderLeft: '1px solid var(--ink)',
            padding: '0 24px', fontSize: 11, letterSpacing: '0.18em',
            fontWeight: 600, cursor: input.trim() && !isStreaming ? 'pointer' : 'default',
            opacity: input.trim() && !isStreaming ? 1 : 0.4,
            transition: 'all 0.15s',
          }}
        >
          SEND →
        </button>
      </div>
    </div>
  )
}
