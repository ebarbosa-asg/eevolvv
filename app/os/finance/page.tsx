'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  KPIStat,
  SectionMarker,
  Badge,
  StatusPill,
  Button,
} from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'

type FinanceData = {
  stripe_connected: boolean
  mrr: string | null
  arr: string | null
  customer_count: number | null
  bank_balance: string
  recent_charges: Array<{
    id: string
    amount: string
    description: string
    date: string
    status: string
  }>
}

export default function FinancePage() {
  const [finance, setFinance] = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [bankBalanceEditing, setBankBalanceEditing] = useState(false)
  const [bankBalanceLocal, setBankBalanceLocal] = useState('')

  useEffect(() => {
    fetch('/api/os/finance')
      .then(r => r.json())
      .then((d: FinanceData) => {
        setFinance(d)
        setBankBalanceLocal(d.bank_balance)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const saveBankBalance = async () => {
    await fetch('/api/os/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'os_finance',
        value: { ...(finance ?? {}), bank_balance: bankBalanceLocal },
      }),
    })
    setFinance(prev => (prev ? { ...prev, bank_balance: bankBalanceLocal } : prev))
    setBankBalanceEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <OSTopbar title="FINANCE" />
        <div className="max-w-[1280px] mx-auto px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-ink/5 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="FINANCE" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <SectionMarker num="05" label="FINANCE" className="mb-6" />

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* MRR */}
          <Card>
            <CardContent>
              <KPIStat value={finance?.mrr ?? '—'} label="MRR" />
              {finance?.stripe_connected && (
                <StatusPill variant="success" className="mt-2 text-[9px]">
                  live stripe
                </StatusPill>
              )}
            </CardContent>
          </Card>

          {/* ARR */}
          <Card>
            <CardContent>
              <KPIStat value={finance?.arr ?? '—'} label="ARR" />
              {finance?.stripe_connected && (
                <StatusPill variant="success" className="mt-2 text-[9px]">
                  live stripe
                </StatusPill>
              )}
            </CardContent>
          </Card>

          {/* Customers */}
          <Card>
            <CardContent>
              <KPIStat value={finance?.customer_count ?? '—'} label="CUSTOMERS" />
            </CardContent>
          </Card>

          {/* Bank Balance (editable) or Connect Stripe */}
          {finance?.stripe_connected ? (
            <Card>
              <CardContent>
                {bankBalanceEditing ? (
                  <div>
                    <input
                      value={bankBalanceLocal}
                      onChange={e => setBankBalanceLocal(e.target.value)}
                      onBlur={saveBankBalance}
                      onKeyDown={e => e.key === 'Enter' && saveBankBalance()}
                      autoFocus
                      className="mono text-4xl font-semibold w-full bg-transparent border-none outline-none border-b border-accent text-ink"
                    />
                  </div>
                ) : (
                  <div
                    className="cursor-text"
                    onClick={() => setBankBalanceEditing(true)}
                    title="Click to edit"
                  >
                    <KPIStat value={finance?.bank_balance || '—'} label="BANK BALANCE" />
                  </div>
                )}
                <Badge variant="neutral" className="mt-2 text-[9px]">
                  manual · click to edit
                </Badge>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                {bankBalanceEditing ? (
                  <div>
                    <input
                      value={bankBalanceLocal}
                      onChange={e => setBankBalanceLocal(e.target.value)}
                      onBlur={saveBankBalance}
                      onKeyDown={e => e.key === 'Enter' && saveBankBalance()}
                      autoFocus
                      className="mono text-4xl font-semibold w-full bg-transparent border-none outline-none border-b border-accent text-ink"
                    />
                  </div>
                ) : (
                  <div
                    className="cursor-text"
                    onClick={() => setBankBalanceEditing(true)}
                    title="Click to edit"
                  >
                    <KPIStat value={finance?.bank_balance || '—'} label="BANK BALANCE" />
                  </div>
                )}
                <Badge variant="neutral" className="mt-2 text-[9px]">
                  manual · click to edit
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Connect Stripe card (only when not connected) */}
        {!finance?.stripe_connected && (
          <Card className="mb-4 border-amber-200">
            <CardContent>
              <div className="mono text-[11px] uppercase tracking-[0.1em] text-ink/40 mb-2">
                Connect Stripe
              </div>
              <div className="mono text-[11px] text-ink/50 leading-relaxed">
                Add <span className="text-accent">STRIPE_SECRET_KEY</span> to Vercel env vars to
                enable live MRR, ARR, and customer data.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent charges */}
        {finance?.stripe_connected &&
          finance.recent_charges &&
          finance.recent_charges.length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <span className="mono text-[11px] uppercase tracking-[0.1em] text-ink/40">
                  Recent charges
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {finance.recent_charges.slice(0, 5).map(ch => (
                  <div
                    key={ch.id}
                    className="flex items-center gap-4 px-5 py-2.5 border-b border-rule last:border-0 mono text-sm"
                  >
                    <span className="text-accent w-20 flex-shrink-0">{ch.amount}</span>
                    <span className="flex-1 text-ink/70">{ch.description}</span>
                    <span className="text-ink/35">{ch.date}</span>
                    <span
                      className={ch.status === 'failed' ? 'text-accent text-[10px]' : 'text-ink/40 text-[10px]'}
                    >
                      {ch.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        {/* Quick links */}
        <Card>
          <CardContent className="flex items-center justify-end gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://mercury.com', '_blank')}
            >
              → Mercury
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
            >
              → Stripe
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://www.waveapps.com/accounting', '_blank')}
            >
              → Wave
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
