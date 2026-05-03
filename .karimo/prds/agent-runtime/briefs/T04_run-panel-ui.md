# Brief: T04 — UI: Run Panel in AgentBuilder Step 6

**Task ID:** T04  
**Wave:** 2  
**Complexity:** 3  
**Model:** sonnet  
**Dependencies:** T01, T03  

---

## Context

`app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` is a 700+ line client component. Step 6 currently renders DEV/STAGING/LIVE promotion cards with promote buttons. The run panel goes ABOVE these cards.

The file has constants including `CARD`, `MONO`, `MONO_LABEL`, `INPUT` for inline styles, and a `client` prop with `{ id, name, company }`. The `agent` prop has the full agent type including `id`.

Design system: JetBrains Mono for labels/code, Space Grotesk for body, `var(--ink)` text, `var(--paper)` bg, `var(--accent)` for CTAs (brick red). Status: success `#4ade80`, error `#ef4444`, running/pending `#f59e0b`.

---

## What To Build

Add the following to the step 6 render section of `AgentBuilder.tsx`.

### New state to add (at the top of the component with other state):

```typescript
const [runOutput, setRunOutput] = useState<string | null>(null)
const [runError, setRunError] = useState<string | null>(null)
const [runLoading, setRunLoading] = useState(false)
const [runs, setRuns] = useState<RunRecord[] | null>(null)
const [expandedRunId, setExpandedRunId] = useState<string | null>(null)
```

### New type (near other types in the file or at top):

```typescript
type RunRecord = {
  id: string
  status: 'pending' | 'running' | 'success' | 'error'
  triggered_by: string
  input_tokens: number | null
  output_tokens: number | null
  latency_ms: number | null
  output_summary: string | null
  created_at: string
}
```

### New functions to add:

```typescript
async function runAgent() {
  setRunLoading(true)
  setRunError(null)
  setRunOutput(null)
  try {
    const res = await fetch(`/api/os/clients/${client.id}/agents/${agent.id}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ triggeredBy: 'manual' }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Run failed')
    setRunOutput(data.output)
    loadRuns()
  } catch (e: unknown) {
    setRunError(e instanceof Error ? e.message : 'Run failed')
  } finally {
    setRunLoading(false)
  }
}

async function loadRuns() {
  const res = await fetch(`/api/os/clients/${client.id}/agents/${agent.id}/runs`)
  if (res.ok) setRuns(await res.json())
}
```

### useEffect to load runs on step 6 mount:

```typescript
useEffect(() => {
  if (step === 6) loadRuns()
}, [step])
```

### JSX to add in step 6 render, ABOVE existing DEV/STAGING/LIVE cards:

```tsx
{/* Run Now */}
<div style={{ marginBottom: 32 }}>
  <div style={{ ...MONO_LABEL, marginBottom: 12 }}>§ RUN AGENT</div>
  <button
    onClick={runAgent}
    disabled={runLoading}
    style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 13,
      padding: '10px 20px',
      background: runLoading ? 'rgba(20,20,19,0.3)' : 'var(--accent)',
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      cursor: runLoading ? 'not-allowed' : 'pointer',
      opacity: runLoading ? 0.7 : 1,
      marginBottom: 16,
    }}
  >
    {runLoading ? 'Running...' : '▷ Run agent now'}
  </button>
  {runError && (
    <div style={{ color: '#ef4444', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, marginBottom: 12 }}>
      ✗ {runError}
    </div>
  )}
  {runOutput && (
    <pre style={{
      background: 'rgba(20,20,19,0.05)',
      border: '1px solid rgba(20,20,19,0.12)',
      borderLeft: '3px solid var(--accent)',
      borderRadius: 6,
      padding: 16,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 12,
      lineHeight: 1.7,
      overflowX: 'auto',
      maxHeight: 400,
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }}>
      {runOutput}
    </pre>
  )}
</div>

{/* Run History */}
<div style={{ marginBottom: 32 }}>
  <div style={{ ...MONO_LABEL, marginBottom: 12 }}>§ RUN HISTORY</div>
  {runs === null ? (
    <div style={{ ...MONO, fontSize: 11, opacity: 0.5 }}>Loading...</div>
  ) : runs.length === 0 ? (
    <div style={{ ...MONO, fontSize: 11, opacity: 0.5 }}>No runs yet.</div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {runs.map(run => (
        <div key={run.id} style={{ ...CARD, padding: '12px 16px', cursor: 'pointer' }}
          onClick={() => setExpandedRunId(expandedRunId === run.id ? null : run.id)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: run.status === 'success' ? '#4ade80' : run.status === 'error' ? '#ef4444' : '#f59e0b',
            }}>
              ● {run.status}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.5 }}>
              {run.triggered_by}
            </span>
            {run.latency_ms != null && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.6 }}>
                {(run.latency_ms / 1000).toFixed(1)}s
              </span>
            )}
            {run.input_tokens != null && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.6 }}>
                {run.input_tokens} / {run.output_tokens} tok
              </span>
            )}
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.4, marginLeft: 'auto' }}>
              {formatRelativeTime(run.created_at)}
            </span>
          </div>
          {run.output_summary && (
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, opacity: 0.6, marginTop: 6 }}>
              {expandedRunId === run.id ? run.output_summary : run.output_summary.slice(0, 80) + (run.output_summary.length > 80 ? '...' : '')}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
```

### Helper function to add:

```typescript
function formatRelativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}
```

---

## Acceptance Criteria

- "Run agent now" button appears in step 6 above DEV/STAGING/LIVE cards
- Clicking it POSTs to the execution engine and shows output
- Loading state disables button and shows "Running..."
- Run history loads on step 6 mount and refreshes after a new run
- History shows status, trigger, latency, token counts, relative time
- Expanding a row shows the full output_summary
- No TypeScript errors
- Existing step 6 content (promotion cards) unchanged

---

## Notes

- `MONO_LABEL` and `CARD` constants are already defined in the file — use them
- If `MONO` constant doesn't exist, use `{ fontFamily: 'JetBrains Mono, monospace' }` inline
- Keep the `loadRuns` function outside of `useEffect` so it can be called after runs
