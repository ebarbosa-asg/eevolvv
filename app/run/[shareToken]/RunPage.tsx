'use client'

import { useState } from 'react'

type Props = {
  agentId: string
  agentName: string
  agentDescription: string | null
  shareToken: string
  initialOutput: string | null
  initialCreatedAt: string | null
}

export default function RunPage({
  agentName,
  agentDescription,
  shareToken,
  initialOutput,
  initialCreatedAt,
}: Props) {
  const [output, setOutput] = useState<string | null>(initialOutput)
  const [createdAt, setCreatedAt] = useState<string | null>(initialCreatedAt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'brief' | 'raw'>('brief')

  async function runAgent() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/run/${shareToken}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Run failed')
      setOutput(data.output)
      setCreatedAt(new Date().toISOString())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function formatRelativeTime(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    return `${Math.floor(diff / 86400000)} days ago`
  }

  function renderBrief(text: string) {
    const paragraphs = text.split(/\n\n+/)
    return paragraphs.map((para, i) => {
      if (para.startsWith('# ')) {
        return <h1 key={i} style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, marginTop: i > 0 ? 32 : 0, fontFamily: 'Space Grotesk, sans-serif' }}>{para.slice(2)}</h1>
      }
      if (para.startsWith('## ')) {
        return <h2 key={i} style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, marginTop: i > 0 ? 24 : 0, fontFamily: 'Space Grotesk, sans-serif' }}>{para.slice(3)}</h2>
      }
      if (para.startsWith('### ')) {
        return <h3 key={i} style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, marginTop: i > 0 ? 20 : 0, fontFamily: 'Space Grotesk, sans-serif' }}>{para.slice(4)}</h3>
      }
      if (para.includes('\n- ') || para.startsWith('- ')) {
        const items = para.split('\n').filter(l => l.startsWith('- '))
        return (
          <ul key={i} style={{ paddingLeft: 20, marginBottom: 16 }}>
            {items.map((item, j) => (
              <li key={j} style={{ marginBottom: 6, lineHeight: 1.7, opacity: 0.85 }}>{item.slice(2)}</li>
            ))}
          </ul>
        )
      }
      return <p key={i} style={{ marginBottom: 16, lineHeight: 1.8, opacity: 0.85 }}>{para}</p>
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f5',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', opacity: 0.3, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            powered by eevolvv
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif' }}>{agentName}</h1>
          {agentDescription && (
            <p style={{ fontSize: 15, opacity: 0.55, margin: 0 }}>{agentDescription}</p>
          )}
        </div>

        <div style={{ marginBottom: 40 }}>
          <button
            onClick={runAgent}
            disabled={loading}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13,
              padding: '12px 24px',
              background: loading ? 'rgba(255,255,255,0.1)' : '#fff',
              color: loading ? 'rgba(255,255,255,0.5)' : '#0a0a0a',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {loading ? '◌ Running...' : '▷ Run now'}
          </button>
          {error && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>
              ✗ {error}
            </div>
          )}
        </div>

        {output && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['brief', 'raw'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      padding: '6px 14px',
                      background: view === v ? '#fff' : 'transparent',
                      color: view === v ? '#0a0a0a' : 'rgba(255,255,255,0.4)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {createdAt && (
                <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', opacity: 0.35 }}>
                  Updated {formatRelativeTime(createdAt)}
                </div>
              )}
            </div>

            {view === 'brief' ? (
              <div style={{ fontSize: 15, lineHeight: 1.8 }}>
                {renderBrief(output)}
              </div>
            ) : (
              <pre style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: 20,
                overflowX: 'auto',
              }}>
                {output}
              </pre>
            )}
          </div>
        )}

        {!output && !loading && (
          <div style={{ textAlign: 'center' as const, opacity: 0.3, fontSize: 14, paddingTop: 40 }}>
            No runs yet. Click &quot;Run now&quot; to generate your first brief.
          </div>
        )}
      </div>
    </div>
  )
}
