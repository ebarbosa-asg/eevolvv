'use client'

import { useEffect, useMemo, useState } from 'react'
import type {
  AgentCommand,
  ClientAgentPage as ClientAgentPageData,
} from '@/lib/client-agent-pages'
import { ADD_ONS, WEBSITE_ADD_ON } from '@/lib/agent-products'
import { getPlanForClient } from '@/lib/client-agent-pages'
import type { ClientDeliverableRecord } from '@/lib/deliverables'

const MONO = { fontFamily: 'JetBrains Mono, ui-monospace, monospace' } as const

type SubmittedRequest = {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  created_at: string
}

function StatusBadge({ status }: { status: string }) {
  const isLive = ['included', 'active', 'paid', 'live'].includes(status)
  const isBuilding = ['queued', 'building', 'intake'].includes(status)
  return (
    <span
      style={{
        ...MONO,
        fontSize: 9,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        border: `1px solid ${
          isLive
            ? 'rgba(74,222,128,0.38)'
            : isBuilding
              ? 'rgba(140,43,26,0.32)'
              : 'rgba(20,20,19,0.14)'
        }`,
        color: isLive ? '#227a43' : isBuilding ? 'var(--accent)' : 'rgba(20,20,19,0.48)',
        padding: '4px 8px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div
      className="mono"
      style={{
        fontSize: 10,
        letterSpacing: '0.24em',
        color: 'var(--accent)',
        marginBottom: 18,
        fontWeight: 700,
      }}
    >
      § {number} · {label}
    </div>
  )
}

function CommandButton({
  command,
  active,
  onClick,
}: {
  command: AgentCommand
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        border: `1px solid ${active ? 'var(--accent)' : 'rgba(250,247,240,0.14)'}`,
        background: active ? 'rgba(140,43,26,0.22)' : 'rgba(250,247,240,0.035)',
        color: 'var(--paper)',
        padding: 16,
        cursor: 'pointer',
        minHeight: 120,
        transition: 'border-color 180ms ease, background 180ms ease, transform 180ms ease',
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.16em',
          color: active ? 'color-mix(in oklch, var(--accent) 45%, var(--paper))' : 'rgba(250,247,240,0.42)',
          marginBottom: 10,
        }}
      >
        COMMAND
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        {command.label}
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0, color: 'rgba(250,247,240,0.56)' }}>
        {command.outcome}
      </p>
    </button>
  )
}

export function ClientAgentPage({ page }: { page: ClientAgentPageData }) {
  const plan = getPlanForClient(page)
  const [activeCommandIndex, setActiveCommandIndex] = useState(0)
  const activeCommand = page.commandPrompts[activeCommandIndex]
  const [commandText, setCommandText] = useState(activeCommand?.prompt ?? '')
  const [submittedRequests, setSubmittedRequests] = useState<SubmittedRequest[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(true)
  const [deliverables, setDeliverables] = useState<ClientDeliverableRecord[]>([])
  const [isLoadingDeliverables, setIsLoadingDeliverables] = useState(true)
  const [deliverablesPersisted, setDeliverablesPersisted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const ownedProducts = page.products.filter((product) =>
    ['included', 'active', 'paid', 'queued'].includes(product.status),
  )
  const availableProducts = page.products.filter((product) => product.status === 'available')

  const latestRequest = useMemo(() => submittedRequests[0], [submittedRequests])

  useEffect(() => {
    let cancelled = false

    async function loadPortalData() {
      setIsLoadingRequests(true)
      setIsLoadingDeliverables(true)
      try {
        const [requestsRes, deliverablesRes] = await Promise.all([
          fetch(`/api/os/client-agent/${page.slug}/requests`, { cache: 'no-store' }),
          fetch(`/api/os/client-agent/${page.slug}/deliverables`, { cache: 'no-store' }),
        ])

        if (requestsRes.ok) {
          const requestsData = await requestsRes.json()
          if (!cancelled) setSubmittedRequests(requestsData.requests ?? [])
        }

        if (deliverablesRes.ok) {
          const deliverablesData = await deliverablesRes.json()
          if (!cancelled) {
            setDeliverables(deliverablesData.deliverables ?? [])
            setDeliverablesPersisted(Boolean(deliverablesData.persisted))
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRequests(false)
          setIsLoadingDeliverables(false)
        }
      }
    }

    loadPortalData()
    return () => {
      cancelled = true
    }
  }, [page.slug])

  function selectCommand(index: number) {
    setActiveCommandIndex(index)
    setCommandText(page.commandPrompts[index]?.prompt ?? '')
    setSubmitMessage(null)
    setSubmitError(null)
  }

  async function submitAgentRequest() {
    const request = commandText.trim()
    if (request.length < 8) {
      setSubmitError('Add a little more detail so eevolvv can turn this into a deliverable.')
      setSubmitMessage(null)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitMessage(null)

    try {
      const res = await fetch(`/api/os/client-agent/${page.slug}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commandLabel: activeCommand?.label ?? 'Agent request',
          request,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request could not be submitted')
      setSubmittedRequests((current) => [data.request, ...current])
      if (data.deliverable) {
        setDeliverables((current) => [data.deliverable, ...current])
      }
      setSubmitMessage('Request sent. eevolvv now has this in the OS as a tracked deliverable.')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Request could not be submitted')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>
      <section
        style={{
          background:
            'linear-gradient(118deg, rgba(20,20,19,0.98), rgba(36,14,11,0.98) 44%, rgba(20,20,19,0.98))',
          color: 'var(--paper)',
          borderBottom: '1px solid var(--ink)',
        }}
      >
        <div className="site-rail mx-auto" style={{ paddingTop: 48, paddingBottom: 36 }}>
          <div className="client-agent-shell-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 28, alignItems: 'stretch' }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'color-mix(in oklch, var(--accent) 48%, var(--paper))', marginBottom: 14, fontWeight: 700 }}>
                EEVOLVV · CLIENT AGENT
              </div>
              <h1 style={{ fontSize: 'clamp(38px, 7vw, 82px)', lineHeight: 0.9, letterSpacing: '-0.055em', margin: '0 0 18px', maxWidth: 880 }}>
                {page.headline}
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.55, color: 'rgba(250,247,240,0.68)', maxWidth: 720, margin: '0 0 28px' }}>
                {page.summary}
              </p>
              <div className="client-agent-proof-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', border: '1px solid rgba(250,247,240,0.14)' }}>
                {page.proofItems.map((item, index) => (
                  <div
                    key={item.label}
                    style={{
                      padding: 18,
                      borderRight: index < page.proofItems.length - 1 ? '1px solid rgba(250,247,240,0.14)' : 'none',
                    }}
                  >
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'rgba(250,247,240,0.42)', marginBottom: 8 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
                      {item.value}
                    </div>
                    <p style={{ fontSize: 12, lineHeight: 1.45, color: 'rgba(250,247,240,0.54)', margin: 0 }}>
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside
              style={{
                border: '1px solid rgba(250,247,240,0.16)',
                background: 'rgba(250,247,240,0.045)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 24,
              }}
            >
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'color-mix(in oklch, var(--accent) 45%, var(--paper))', marginBottom: 12 }}>
                  CURRENT PLAN
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 8 }}>
                  {plan.publicName}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(250,247,240,0.58)', lineHeight: 1.55, margin: 0 }}>
                  {plan.automationAllowance}. {plan.includesSco ? 'Ads, SEO, and SCO included.' : 'SCO can be added any time.'}
                </p>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'color-mix(in oklch, var(--accent) 50%, var(--paper))', lineHeight: 1.9 }}>
                → AGENT {page.agentName}
                <br />
                → ROLE {page.agentRole}
                <br />
                → WEBSITE {WEBSITE_ADD_ON.price}
                <br />
                → SCO {plan.includesSco ? 'INCLUDED' : ADD_ONS['sco-management'].price}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="agent-actions" style={{ background: 'var(--ink)', color: 'var(--paper)', borderBottom: '1px solid var(--ink)' }}>
        <div className="site-rail mx-auto" style={{ paddingTop: 40, paddingBottom: 44 }}>
          <SectionLabel number="01" label="AGENT CONSOLE" />
          <div className="client-agent-console-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,0.95fr) minmax(360px,1.05fr)', gap: 24 }}>
            <div className="client-agent-command-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
              {page.commandPrompts.map((command, index) => (
                <CommandButton
                  key={command.label}
                  command={command}
                  active={index === activeCommandIndex}
                  onClick={() => selectCommand(index)}
                />
              ))}
            </div>

            <div style={{ border: '1px solid rgba(250,247,240,0.16)', background: 'rgba(250,247,240,0.04)' }}>
              <div style={{ padding: 22, borderBottom: '1px solid rgba(250,247,240,0.14)' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(250,247,240,0.42)', marginBottom: 10 }}>
                  ASK {page.agentName.toUpperCase()}
                </div>
                <textarea
                  value={commandText}
                  onChange={(event) => setCommandText(event.target.value)}
                  style={{
                    width: '100%',
                    minHeight: 190,
                    resize: 'vertical',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'var(--paper)',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 24,
                    lineHeight: 1.28,
                    letterSpacing: '-0.025em',
                  }}
                />
              </div>
              <div className="client-agent-console-footer" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
                <p style={{ fontSize: 13, color: 'rgba(250,247,240,0.5)', lineHeight: 1.5, margin: 0, padding: '0 22px' }}>
                  This turns the request into a visible Ghost Locker deliverable: scope, status, proof, and next action.
                </p>
                <button
                  type="button"
                  onClick={submitAgentRequest}
                  disabled={isSubmitting}
                  style={{
                    ...MONO,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 72,
                    padding: '0 24px',
                    borderLeft: '1px solid rgba(250,247,240,0.16)',
                    color: 'var(--paper)',
                    background: 'linear-gradient(115deg, var(--accent), var(--ink))',
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    opacity: isSubmitting ? 0.68 : 1,
                  }}
                >
                  {isSubmitting ? 'SENDING...' : 'SEND REQUEST →'}
                </button>
              </div>
              {(submitMessage || submitError) && (
                <div
                  className="mono"
                  style={{
                    padding: '12px 22px',
                    borderTop: '1px solid rgba(250,247,240,0.14)',
                    color: submitError ? '#ffb4a8' : '#8ee3a4',
                    fontSize: 11,
                    lineHeight: 1.5,
                  }}
                >
                  → {submitError ?? submitMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="site-rail mx-auto" style={{ paddingTop: 44, paddingBottom: 18 }}>
        <SectionLabel number="02" label="ACTIVE WORK" />
        {latestRequest && (
          <div
            style={{
              border: '1px solid var(--ink)',
              borderBottom: 'none',
              padding: 20,
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) auto',
              gap: 16,
              alignItems: 'center',
              background: 'rgba(140,43,26,0.07)',
            }}
          >
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: 8 }}>
                LATEST CLIENT REQUEST
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 4 }}>
                {latestRequest.title}
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, opacity: 0.62 }}>
                This is now tracked in eevolvv OS and should become a visible Ghost Locker deliverable.
              </p>
            </div>
            <StatusBadge status={latestRequest.status} />
          </div>
        )}
        <div className="client-agent-work-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', border: '1px solid var(--ink)' }}>
          {page.activeWork.map((item, index) => (
            <article
              key={item.title}
              style={{
                minHeight: 260,
                padding: 24,
                borderRight: index < page.activeWork.length - 1 ? '1px solid var(--ink)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 20,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(20,20,19,0.42)' }}>
                    W-{String(index + 1).padStart(2, '0')}
                  </span>
                  <StatusBadge status={item.stage} />
                </div>
                <h2 style={{ fontSize: 26, lineHeight: 1.04, letterSpacing: '-0.035em', margin: '0 0 12px' }}>
                  {item.title}
                </h2>
                <p style={{ fontSize: 14, lineHeight: 1.56, opacity: 0.68, margin: '0 0 12px' }}>
                  {item.deliverable}
                </p>
                <div className="mono" style={{ fontSize: 11, lineHeight: 1.7, opacity: 0.5 }}>
                  proof: {item.proof}
                </div>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', lineHeight: 1.8 }}>
                → OWNER {item.owner}
                <br />
                → TIMING {item.timing}
              </div>
            </article>
          ))}
        </div>
        <div style={{ border: '1px solid var(--ink)', borderTop: 'none', padding: 22 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>
            SUBMITTED REQUESTS
          </div>
          {isLoadingRequests ? (
            <div className="mono" style={{ fontSize: 12, opacity: 0.45 }}>loading requests...</div>
          ) : submittedRequests.length ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {submittedRequests.slice(0, 4).map((request) => (
                <div
                  key={request.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) auto',
                    gap: 12,
                    alignItems: 'center',
                    padding: '12px 0',
                    borderTop: '1px solid var(--rule)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>{request.title}</div>
                    <div className="mono" style={{ fontSize: 10, opacity: 0.42, marginTop: 4 }}>
                      {new Date(request.created_at).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mono" style={{ fontSize: 12, opacity: 0.45 }}>
              No submitted requests yet. Use the agent console above to create the first one.
            </div>
          )}
        </div>
      </section>

      <section className="site-rail mx-auto" style={{ paddingTop: 34, paddingBottom: 20 }}>
        <SectionLabel number="03" label="WEEKLY RECOMMENDATIONS" />
        <div className="client-agent-recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', border: '1px solid var(--ink)' }}>
          {page.recommendations.map((item, index) => (
            <article
              key={item.title}
              style={{
                padding: 24,
                minHeight: 190,
                borderRight: index % 2 === 0 ? '1px solid var(--ink)' : 'none',
                borderBottom: index < page.recommendations.length - 2 ? '1px solid var(--ink)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(20,20,19,0.42)' }}>
                  R-{String(index + 1).padStart(2, '0')}
                </span>
                <StatusBadge status={item.status} />
              </div>
              <h2 style={{ fontSize: 24, lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
                {item.title}
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.58, opacity: 0.68, margin: 0 }}>{item.description}</p>
              {item.price && (
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', marginTop: 16 }}>
                  {item.price}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="site-rail mx-auto" style={{ paddingTop: 36, paddingBottom: 24 }}>
        <SectionLabel number="04" label="DELIVERABLE FACTORY" />
        <div style={{ border: '1px solid var(--ink)' }}>
          <div style={{ padding: 22, borderBottom: '1px solid var(--ink)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 16, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>
                Every paid product must become visible proof.
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.62, margin: 0 }}>
                Scope, status, owner, delivery window, and proof stay attached to each item so nobody has to guess what eevolvv shipped.
              </p>
            </div>
            <StatusBadge status={deliverablesPersisted ? 'live' : 'template'} />
          </div>
          {isLoadingDeliverables ? (
            <div className="mono" style={{ padding: 22, fontSize: 12, opacity: 0.45 }}>loading deliverables...</div>
          ) : (
            <div className="client-agent-deliverables-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))' }}>
              {deliverables.map((item, index) => (
                <article
                  key={item.id}
                  style={{
                    padding: 22,
                    minHeight: 260,
                    borderRight: index % 2 === 0 ? '1px solid var(--ink)' : 'none',
                    borderBottom: index < deliverables.length - 2 ? '1px solid var(--ink)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 18,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--accent)' }}>
                        {item.type.toUpperCase()} · {item.source ?? 'PRODUCT'}
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <h3 style={{ fontSize: 24, lineHeight: 1.06, letterSpacing: '-0.03em', margin: '0 0 10px' }}>
                      {item.title}
                    </h3>
                    {item.price && (
                      <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 10 }}>
                        {item.price}
                      </div>
                    )}
                    <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.68, margin: '0 0 14px' }}>
                      {item.promise}
                    </p>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(20,20,19,0.42)', marginBottom: 8 }}>
                      SCOPE
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'grid', gap: 5 }}>
                      {item.scope.slice(0, 4).map((scopeItem) => (
                        <li key={scopeItem} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 8, fontSize: 12, lineHeight: 1.45, opacity: 0.68 }}>
                          <span style={{ color: 'var(--accent)' }}>→</span>
                          <span>{scopeItem}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mono" style={{ fontSize: 11, lineHeight: 1.65, opacity: 0.52 }}>
                      proof: {item.proof.join(' · ')}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: 12 }}>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', lineHeight: 1.5 }}>
                      → {item.delivery_window}
                    </div>
                    {item.checkout_url && (
                      <a
                        href={item.checkout_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mono"
                        style={{
                          background: 'var(--ink)',
                          color: 'var(--paper)',
                          padding: '11px 14px',
                          textDecoration: 'none',
                          fontSize: 10,
                          letterSpacing: '0.14em',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        BUY →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="site-rail mx-auto" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <SectionLabel number="05" label="GHOST LOCKER" />
        <div className="client-agent-locker-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,360px)', gap: 24, alignItems: 'start' }}>
          <div style={{ border: '1px solid var(--ink)' }}>
            {ownedProducts.map((product, index) => (
              <article
                key={product.key}
                style={{
                  padding: 22,
                  borderBottom: index < ownedProducts.length - 1 ? '1px solid var(--rule)' : 'none',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1fr) auto',
                  gap: 18,
                }}
              >
                <div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 8 }}>
                    {product.type.toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: 22, letterSpacing: '-0.025em', margin: '0 0 8px' }}>{product.name}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.58, opacity: 0.66, margin: '0 0 10px' }}>{product.description}</p>
                  <div className="mono" style={{ fontSize: 11, lineHeight: 1.7, opacity: 0.52 }}>
                    proof: {product.proof}
                  </div>
                </div>
                <StatusBadge status={product.status} />
              </article>
            ))}
          </div>

          <aside style={{ border: '1px solid var(--ink)', padding: 22, position: 'sticky', top: 24 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>
              AVAILABLE TO ADD
            </div>
            {availableProducts.map((product) => (
              <div key={product.key} style={{ paddingBottom: 18, marginBottom: 18, borderBottom: '1px solid var(--rule)' }}>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{product.name}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 8 }}>{product.price}</div>
                <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.62, margin: 0 }}>{product.description}</p>
              </div>
            ))}
            <div className="mono" style={{ fontSize: 11, lineHeight: 1.8, color: 'rgba(20,20,19,0.52)' }}>
              Every product needs a visible artifact: URL, file, scope, checklist, report, runbook, or status card.
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
