'use client'

import { useState } from 'react'
import { TIER_CONFIGS } from '@/lib/stripe-prices'

interface Build {
  id: string
  tier: string
  status: string
  assigned_to: string | null
  build_url: string | null
  notes: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
}

interface Subscription {
  id: string
  status: string
  billing_interval: string
  current_period_end: string | null
  cancel_at_period_end: boolean
  stripe_price_id: string
}

interface Client {
  id: string
  name: string | null
  email: string | null
  tier: string | null
}

interface Props {
  token: string
  client: Client | null
  subscription: Subscription | null
  latestBuild: Build | null
  builds: Build[]
}

const STATUS_ORDER = ['queued', 'in_progress', 'qa', 'deploying', 'live']
const STATUS_LABELS: Record<string, string> = {
  queued: 'In Queue',
  in_progress: 'Building',
  qa: 'QA Review',
  deploying: 'Deploying',
  live: 'Live',
  failed: 'Failed',
  paused: 'Paused',
}

export function ClientDashboard({ token, client, subscription, latestBuild, builds }: Props) {
  const [showChangePlan, setShowChangePlan] = useState(false)
  const [changePlanLoading, setChangePlanLoading] = useState<string | null>(null)
  const [changePlanError, setChangePlanError] = useState<string | null>(null)
  const [changePlanSuccess, setChangePlanSuccess] = useState<string | null>(null)

  const buildStatusIndex = latestBuild ? STATUS_ORDER.indexOf(latestBuild.status) : -1
  const totalSteps = STATUS_ORDER.length
  const filledBlocks = Math.max(0, buildStatusIndex + 1)
  const progressBar = '▓'.repeat(filledBlocks) + '░'.repeat(totalSteps - filledBlocks)

  const nextBillingDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not available'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Build Status */}
      <section style={{ border: '1px solid var(--rule)', padding: 28 }}>
        <div
          className="mono"
          style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}
        >
          § 01 · BUILD STATUS
        </div>
        {latestBuild ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: 500 }}>
                {STATUS_LABELS[latestBuild.status] ?? latestBuild.status}
              </div>
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  padding: '4px 10px',
                  background: latestBuild.status === 'live' ? '#4ade80' : 'var(--ink)',
                  color: latestBuild.status === 'live' ? '#141413' : 'var(--paper)',
                }}
              >
                {latestBuild.status.toUpperCase()}
              </span>
            </div>
            <div
              className="mono"
              style={{ fontSize: 14, letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: 12 }}
            >
              {progressBar}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
              {STATUS_ORDER.map((s, i) => (
                <div
                  key={s}
                  style={{ fontSize: 9, textAlign: 'center', opacity: i <= buildStatusIndex ? 1 : 0.3 }}
                  className="mono"
                >
                  {STATUS_LABELS[s].toUpperCase()}
                </div>
              ))}
            </div>
            {latestBuild.assigned_to && (
              <div style={{ marginTop: 16, fontSize: 12, opacity: 0.55 }}>
                Technician: <strong>{latestBuild.assigned_to}</strong>
              </div>
            )}
            {latestBuild.status === 'live' && latestBuild.build_url && (
              <div style={{ marginTop: 20 }}>
                <a
                  href={latestBuild.build_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono"
                  style={{
                    display: 'inline-block',
                    padding: '14px 24px',
                    background: 'var(--ink)',
                    color: 'var(--paper)',
                    textDecoration: 'none',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    fontWeight: 700,
                  }}
                >
                  VISIT YOUR SITE →
                </a>
              </div>
            )}
          </>
        ) : (
          <p style={{ opacity: 0.55, fontSize: 14 }}>
            No build in progress yet. Complete your onboarding to start.
          </p>
        )}
      </section>

      {/* Subscription Info */}
      <section style={{ border: '1px solid var(--rule)', padding: 28 }}>
        <div
          className="mono"
          style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}
        >
          § 02 · SUBSCRIPTION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            {
              label: 'PLAN',
              value: `${(client?.tier ?? 'seed').toUpperCase()} · ${(subscription?.billing_interval ?? 'monthly').toUpperCase()}`,
            },
            { label: 'STATUS', value: subscription?.status?.toUpperCase() ?? 'UNKNOWN' },
            { label: 'NEXT BILLING', value: nextBillingDate },
            {
              label: 'AUTO-RENEW',
              value: subscription?.cancel_at_period_end ? 'OFF — Cancels at period end' : 'ON',
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                className="mono"
                style={{ fontSize: 9, letterSpacing: '0.18em', opacity: 0.5, marginBottom: 4 }}
              >
                {label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>

        {subscription?.cancel_at_period_end && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(140,43,26,0.06)',
              border: '1px solid var(--accent)',
              fontSize: 13,
              color: 'var(--accent)',
              marginBottom: 16,
            }}
          >
            Cancellation scheduled — active until {nextBillingDate}
          </div>
        )}

        {/* Plan management */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => { setShowChangePlan(true); setChangePlanError(null); setChangePlanSuccess(null) }}
            className="mono"
            style={{
              padding: '10px 20px',
              border: '1px solid var(--ink)',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'var(--ink)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            CHANGE PLAN
          </button>
          {!subscription?.cancel_at_period_end && (
            <a
              href="/pricing"
              className="mono"
              style={{
                padding: '10px 20px',
                border: '1px solid rgba(20,20,19,0.3)',
                fontSize: 10,
                letterSpacing: '0.14em',
                textDecoration: 'none',
                color: 'var(--ink)',
                opacity: 0.55,
              }}
            >
              CANCEL MEMBERSHIP
            </a>
          )}
        </div>
      </section>

      {/* Build history */}
      {builds.length > 1 && (
        <section style={{ border: '1px solid var(--rule)', padding: 28 }}>
          <div
            className="mono"
            style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}
          >
            § 03 · BUILD HISTORY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {builds.map(b => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 12,
                  borderBottom: '1px solid var(--rule)',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{b.tier.toUpperCase()} BUILD</div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>
                    {new Date(b.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', opacity: 0.6 }}>
                    {STATUS_LABELS[b.status]?.toUpperCase() ?? b.status.toUpperCase()}
                  </span>
                  {b.build_url && (
                    <a
                      href={b.build_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 11, color: 'var(--accent)' }}
                    >
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Support */}
      <div style={{ fontSize: 13, opacity: 0.5, textAlign: 'center', paddingTop: 8 }}>
        Questions?{' '}
        <a href="mailto:hello@eevolvv.com" style={{ color: 'var(--accent)' }}>
          hello@eevolvv.com
        </a>
      </div>

      {/* Change Plan Modal */}
      {showChangePlan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20,20,19,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: 'var(--paper)',
              maxWidth: 560,
              width: '100%',
              margin: 24,
              padding: 32,
              border: '1px solid var(--ink)',
            }}
          >
            <div
              className="mono"
              style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}
            >
              CHANGE PLAN
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 20px' }}>Select your new plan</h2>
            {TIER_CONFIGS.map(config => {
              const price = config.prices.annual
              const isCurrent = client?.tier === config.tier
              return (
                <div
                  key={config.tier}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    border: '1px solid var(--rule)',
                    marginBottom: 8,
                    opacity: isCurrent ? 0.5 : 1,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{config.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                      {price.amountDisplay}/yr · {config.buildSla}
                    </div>
                  </div>
                  {isCurrent ? (
                    <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', opacity: 0.5 }}>
                      CURRENT PLAN
                    </span>
                  ) : (
                    <button
                      onClick={async () => {
                        setChangePlanLoading(config.tier)
                        setChangePlanError(null)
                        try {
                          const res = await fetch('/api/stripe/update-subscription', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token, newPriceId: price.priceId }),
                          })
                          const data = await res.json()
                          if (res.ok) {
                            setChangePlanSuccess(`Plan updated to ${data.newPlan}`)
                            setTimeout(() => setShowChangePlan(false), 2000)
                          } else {
                            setChangePlanError(data.error ?? 'Update failed')
                          }
                        } catch {
                          setChangePlanError('Network error')
                        } finally {
                          setChangePlanLoading(null)
                        }
                      }}
                      disabled={changePlanLoading !== null}
                      className="mono"
                      style={{
                        padding: '8px 16px',
                        background: 'var(--ink)',
                        color: 'var(--paper)',
                        border: 'none',
                        fontSize: 10,
                        letterSpacing: '0.14em',
                        cursor: 'pointer',
                      }}
                    >
                      {changePlanLoading === config.tier ? '...' : 'SELECT →'}
                    </button>
                  )}
                </div>
              )
            })}
            {changePlanError && (
              <div style={{ color: 'var(--accent)', fontSize: 13, marginTop: 12 }}>{changePlanError}</div>
            )}
            {changePlanSuccess && (
              <div style={{ color: '#4ade80', fontSize: 13, marginTop: 12 }}>{changePlanSuccess}</div>
            )}
            <button
              onClick={() => setShowChangePlan(false)}
              style={{ marginTop: 16, background: 'none', border: 'none', fontSize: 12, opacity: 0.5, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
