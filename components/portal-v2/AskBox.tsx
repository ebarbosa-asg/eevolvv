'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatIcon, ArrowRightIcon } from './icons'

type Props = {
  slug: string
  agentName: string
  onSent: () => void
}

export function AskBox({ slug, agentName, onSent }: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 3000)
      return () => clearTimeout(t)
    }
  }, [feedback])

  async function handleSubmit() {
    const val = text.trim()
    if (val.length < 8) {
      setFeedback('a bit more detail?')
      return
    }
    setSending(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/os/client-agent/${slug}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandLabel: 'Client request', request: val }),
      })
      if (!res.ok) {
        const data = await res.json()
        setFeedback(data.error || 'did not go through — try again')
      } else {
        setText('')
        setFeedback('sent ✓')
        onSent()
      }
    } catch {
      setFeedback('network error — try again')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="mono" style={{
        fontSize: 10,
        letterSpacing: '0.18em',
        color: 'rgba(20,20,19,0.42)',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <ChatIcon size={12} />
        ASK {agentName.toUpperCase()}
      </div>
      <div style={{ display: 'flex', gap: 0, border: '1px solid var(--ink)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 14,
          color: 'rgba(20,20,19,0.35)',
        }}>
          <ChatIcon size={16} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !sending) handleSubmit() }}
          placeholder="What do you need?"
          disabled={sending}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: '16px 10px',
            fontSize: 15,
            color: 'var(--ink)',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={sending}
          style={{
            border: 'none',
            borderLeft: '1px solid var(--ink)',
            background: 'var(--ink)',
            color: 'var(--paper)',
            padding: '0 20px',
            cursor: sending ? 'wait' : 'pointer',
            opacity: sending ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {sending ? <span style={{ fontSize: 16, letterSpacing: 2 }}>···</span> : <ArrowRightIcon size={16} />}
        </button>
      </div>
      {feedback && (
        <div className="mono" style={{
          fontSize: 11,
          marginTop: 6,
          color: feedback === 'sent ✓' ? '#22c55e' : 'var(--accent)',
          letterSpacing: '0.06em',
        }}>
          {feedback}
        </div>
      )}
    </div>
  )
}
