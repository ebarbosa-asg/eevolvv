'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

type Phase = 'chatting' | 'extracting' | 'report' | 'error'
type Msg = { role: 'user' | 'ai'; text: string }
type ApiMsg = { role: 'user' | 'assistant'; content: string }

const OPENING = "Hi! I'm eevolvv's AI diagnostic assistant.\n\nWhat kind of business do you run — and what's your name?"

const EXTRACTING_STEPS = [
  'Analyzing your business profile...',
  'Mapping automation opportunities...',
  'Calculating ROI projections...',
  'Building your roadmap...',
  'Finalizing your eevolvv Report...',
]

function ChatMark() {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        minWidth: 28,
        flexShrink: 0,
        marginTop: 2,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--ink)',
        background: 'var(--paper)',
      }}
    >
      <Image
        src="/mascot.png"
        alt="eevolvv diagnostic assistant"
        width={248}
        height={250}
        sizes="28px"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
        }}
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

export default function ChatEngine({ defaultTier }: { defaultTier: string }) {
  const [phase, setPhase] = useState<Phase>('chatting')
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: OPENING }])
  const [apiMsgs, setApiMsgs] = useState<ApiMsg[]>([])
  const [streamText, setStreamText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [input, setInput] = useState('')
  const [extractStep, setExtractStep] = useState(0)
  const [report, setReport] = useState<{ text: string; businessName?: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInteracted = useRef(false)

  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streamText])

  useEffect(() => {
    // Only auto-focus after the user has started the conversation — never on mount
    if (phase === 'chatting' && !isStreaming && hasInteracted.current) {
      inputRef.current?.focus()
    }
  }, [phase, isStreaming])

  useEffect(() => {
    if (phase !== 'extracting') return
    const interval = setInterval(() => {
      setExtractStep(s => Math.min(s + 1, EXTRACTING_STEPS.length - 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [phase])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    hasInteracted.current = true
    const nextApiMsgs: ApiMsg[] = [...apiMsgs, { role: 'user', content: trimmed }]
    setApiMsgs(nextApiMsgs)
    setMessages(m => [...m, { role: 'user', text: trimmed }])
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
          } catch {
            // skip malformed lines
          }
        }
      }

      const visibleText = full.replace(/\[READY\]\s*$/m, '').trim()
      const isReady = /\[READY\]/.test(full)

      setStreamText('')
      setIsStreaming(false)
      setMessages(m => [...m, { role: 'ai', text: visibleText }])
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
        setPhase('report')
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
    setMessages([{ role: 'ai', text: OPENING }])
    setApiMsgs([])
    setStreamText('')
    setInput('')
    setExtractStep(0)
    setReport(null)
    setErrorMsg(null)
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  if (phase === 'report' && report) {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'mailto:hello@eevolvv.com?subject=eevolvv%20Strategy%20Call%20Request'
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, border: '2px solid var(--ink)', background: 'var(--accent)', color: 'var(--paper)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>✓</div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 10 }}>SHEET R-01 · EEVOLVV REPORT</div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em' }}>Your eevolvv Report</div>
          <p style={{ fontSize: 14, opacity: 0.65, marginTop: 8 }}>AI-generated diagnostic for {report.businessName || 'your business'}</p>
        </div>
        <div className="report-content" style={{ border: '1px solid var(--ink)', background: 'rgba(255,255,255,0.5)', padding: 32 }} dangerouslySetInnerHTML={{ __html: formatReport(report.text) }} />
        <div className="diagnostic-report-cta" style={{ marginTop: 24, border: '1px solid var(--ink)', padding: 24, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Ready to make this real?</div>
            <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Book your 30-min strategy call and let&apos;s build the roadmap together.</p>
          </div>
          <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 22px', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, whiteSpace: 'nowrap' }}>BOOK STRATEGY CALL →</a>
        </div>
      </div>
    )
  }

  // ── Extracting / generating ────────────────────────────────────────────────
  if (phase === 'extracting') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 0', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 24 }}>GENERATING YOUR REPORT</div>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 16 }}>
          {EXTRACTING_STEPS[extractStep]}
        </div>
        <p style={{ fontSize: 14, opacity: 0.6 }}>Our AI is building your custom automation roadmap. This takes ~30 seconds.</p>
        <div style={{ marginTop: 32, display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 0', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>ERROR</div>
        <p style={{ fontSize: 15, opacity: 0.7, marginBottom: 24 }}>{errorMsg || 'Something went wrong. Please try again.'}</p>
        <button onClick={reset} className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 22px', border: 0, cursor: 'pointer', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600 }}>
          TRY AGAIN →
        </button>
      </div>
    )
  }

  // ── Chatting ───────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Message thread */}
      <div ref={messagesRef} style={{ maxHeight: 440, overflowY: 'auto', padding: '32px 32px 16px', border: '1px solid var(--ink)', borderBottom: 'none', background: 'rgba(255,255,255,0.45)' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 20 }}>
            {msg.role === 'ai' && (
              <div style={{ display: 'flex', gap: 14, maxWidth: '82%' }}>
                <ChatMark />
                <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', whiteSpace: 'pre-line', paddingTop: 4 }}>{msg.text}</div>
              </div>
            )}
            {msg.role === 'user' && (
              <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '10px 18px', fontSize: 15, lineHeight: 1.5, maxWidth: '72%' }}>
                {msg.text}
              </div>
            )}
          </div>
        ))}

        {/* Streaming response */}
        {isStreaming && (
          <div style={{ display: 'flex', gap: 14, maxWidth: '82%', marginBottom: 20 }}>
            <ChatMark />
            {streamText ? (
              <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', whiteSpace: 'pre-line', paddingTop: 4 }}>{streamText}</div>
            ) : (
              <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingTop: 10 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, background: 'var(--ink)', borderRadius: '50%', opacity: 0.4 }} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', border: '1px solid var(--ink)', background: 'var(--paper)' }}>
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
