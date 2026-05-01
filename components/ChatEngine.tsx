'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

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

function ChatMark() {
  return (
    <div style={{
      width: 28, height: 28, minWidth: 28, flexShrink: 0,
      marginTop: 2, position: 'relative', overflow: 'hidden',
      border: '1px solid var(--ink)', background: 'var(--paper)',
    }}>
      <Image
        src="/mascot.png"
        alt="eevolvv"
        width={338} height={338} sizes="28px"
        style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
      />
    </div>
  )
}

function formatReport(text: string): string {
  const sections = text.split(/(?=###\s)/).map(chunk => {
    const m = chunk.match(/^###\s+(.+?)\n([\s\S]*)$/)
    if (!m) {
      return `<p>${chunk.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`
    }
    const [, heading, body] = m
    const formatted = body.trim()
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .split('\n\n')
      .map(para => {
        const lines = para.trim().split('\n')
        if (lines.length > 1 && lines.every(l => l.trim().startsWith('- '))) {
          return `<ul>${lines.map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')}</ul>`
        }
        return `<p>${lines.join('<br />')}</p>`
      })
      .join('')
    return `<h3>${heading}</h3>${formatted}`
  })
  return sections.join('')
}

function extractStats(text: string): { label: string; value: string }[] {
  const stats: { label: string; value: string }[] = []

  const hoursMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:per\s*week|\/\s*week|weekly|a\s*week|saved|freed)/i)
  if (hoursMatch) stats.push({ label: 'HRS / WEEK FREED', value: hoursMatch[1] })

  const autoMatch = text.match(/(\d+)\s+(?:key\s+)?(?:automations?|workflows?|processes?|opportunities)\s*(?:identified|found|recommended|to\s*automate)?/i)
  if (autoMatch) stats.push({ label: 'AUTOMATIONS FOUND', value: autoMatch[1] })

  const savingsMatch = text.match(/\$\s*(\d[\d,]*(?:K|k|M|m)?)\s*(?:per\s*year|annually|\/\s*year|in\s*(?:annual\s*)?savings?)?/i)
  if (savingsMatch) stats.push({ label: 'EST. ANNUAL SAVINGS', value: '$' + savingsMatch[1] })

  const defaults = [
    { label: 'WORKFLOWS MAPPED', value: '3+' },
    { label: 'AUTOMATIONS FOUND', value: '5+' },
    { label: 'ROI SECTIONS', value: '6' },
  ]
  while (stats.length < 3) stats.push(defaults[stats.length])
  return stats.slice(0, 3)
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
  const [report, setReport] = useState<{ text: string; businessName?: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [userMsgCount, setUserMsgCount] = useState(0)

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
        }
      }
    }

    setTimeout(tick, 500)
    return () => {
      cancelled = true
      extractionStarted.current = false
    }
  }, [phase])

  // Report stagger reveal
  useEffect(() => {
    if (phase !== 'report' || !report) return
    setReportStats(extractStats(report.text))
    const timings = [120, 380, 680, 1060]
    timings.forEach((ms, i) => setTimeout(() => setRevealStage(i + 1), ms))
  }, [phase, report])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    hasInteracted.current = true
    const userId = msgIdRef.current++
    const nextApiMsgs: ApiMsg[] = [...apiMsgs, { role: 'user', content: trimmed }]
    setApiMsgs(nextApiMsgs)
    setMessages(m => [...m, { role: 'user', text: trimmed, id: userId }])
    setUserMsgCount(c => c + 1)
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
        setPhase('extracting')
        await generateReport(nextWithAssistant)
      }
    } catch (err) {
      setIsStreaming(false)
      setStreamText('')
      setErrorMsg(err instanceof Error ? err.message : 'Connection failed. Please try again.')
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
        setReport({ text: data.report, businessName: data.businessName })
        setExtractPct(100)
        setTimeout(() => setPhase('report'), 700)
      } else {
        throw new Error(data.error || 'Report generation failed')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Report generation failed. Please try again.')
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
    msgIdRef.current = 1
    extractionStarted.current = false
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
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'mailto:hello@eevolvv.com?subject=eevolvv%20Strategy%20Call%20Request'

    return (
      <div style={{ padding: '40px 32px', background: 'var(--paper)' }}>
        {/* Stat callouts */}
        <div
          className="diagnostic-stat-callouts"
          style={{
            opacity: revealStage >= 1 ? 1 : 0,
            transform: revealStage >= 1 ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {reportStats.map((s, i) => (
            <div key={i} style={{
              border: '1px solid var(--ink)',
              padding: '20px 24px', textAlign: 'center',
              background: i === 0 ? 'var(--ink)' : 'var(--paper)',
              color: i === 0 ? 'var(--paper)' : 'var(--ink)',
            }}>
              <div style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>
                {s.value}
              </div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', opacity: i === 0 ? 0.6 : 0.45 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Report header */}
        <div style={{
          textAlign: 'center', marginBottom: 28,
          opacity: revealStage >= 2 ? 1 : 0,
          transform: revealStage >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          <div style={{
            width: 44, height: 44, border: '2px solid var(--ink)',
            background: 'var(--accent)', color: 'var(--paper)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, marginBottom: 14,
          }}>✓</div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8 }}>
            SHEET R-01 · EEVOLVV REPORT
          </div>
          <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>Your eevolvv report</div>
          <p style={{ fontSize: 13, opacity: 0.6, marginTop: 6 }}>
            AI-generated diagnostic for {report.businessName || 'your business'}
          </p>
        </div>

        {/* Report content */}
        <div
          className="report-content"
          style={{
            border: '1px solid var(--ink)',
            background: 'rgba(255,255,255,0.5)',
            padding: 32,
            opacity: revealStage >= 3 ? 1 : 0,
            transform: revealStage >= 3 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
          dangerouslySetInnerHTML={{ __html: formatReport(report.text) }}
        />

        {/* CTA */}
        <div
          className="diagnostic-report-cta"
          style={{
            marginTop: 24, border: '1px solid var(--ink)',
            padding: '28px 32px',
            display: 'grid', gridTemplateColumns: '1fr auto',
            gap: 24, alignItems: 'center',
            opacity: revealStage >= 4 ? 1 : 0,
            transform: revealStage >= 4 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Ready to make this real?</div>
            <p style={{ fontSize: 13, opacity: 0.65, marginTop: 4 }}>
              Book your 30-min strategy call and let&apos;s build the roadmap together.
            </p>
          </div>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mono btn-gradient"
            style={{ padding: '16px 28px', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, whiteSpace: 'nowrap', display: 'inline-block' }}
          >
            BOOK STRATEGY CALL →
          </a>
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
              <div style={{ display: 'flex', gap: 14, maxWidth: '82%' }}>
                <ChatMark />
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
          <div className="diagnostic-msg-in" style={{ display: 'flex', gap: 14, maxWidth: '82%', marginBottom: 20 }}>
            <ChatMark />
            {streamText ? (
              <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', whiteSpace: 'pre-line', paddingTop: 4 }}>{streamText}</div>
            ) : (
              <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingTop: 10 }}>
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
