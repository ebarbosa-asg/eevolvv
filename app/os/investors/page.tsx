'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, SectionMarker, Badge, Input, Label, Button, KPIStat } from '@/components/ds'
import type { BadgeVariant } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'

type Investor = {
  id: string
  name: string
  firm: string | null
  stage: 'intro' | 'meeting' | 'dd' | 'term_sheet' | 'closed' | 'passed'
  check_size: string | null
  last_contact_at: string | null
  next_action: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

const INV_STAGES = ['intro', 'meeting', 'dd', 'term_sheet', 'closed', 'passed'] as const

function invStageToBadge(stage: string): BadgeVariant {
  if (stage === 'closed') return 'success'
  if (stage === 'meeting' || stage === 'dd') return 'warning'
  if (stage === 'term_sheet') return 'danger'
  return 'neutral'
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [newInvestorOpen, setNewInvestorOpen] = useState(false)
  const [newInvestorForm, setNewInvestorForm] = useState({
    name: '',
    firm: '',
    stage: 'intro',
    check_size: '',
    next_action: '',
  })
  const [investorSubmitting, setInvestorSubmitting] = useState(false)

  const fetchInvestors = useCallback(() => {
    setLoading(true)
    fetch('/api/os/investors')
      .then(r => r.json())
      .then((d: Investor[]) => setInvestors(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchInvestors()
  }, [fetchInvestors])

  const cycleInvestorStage = useCallback(async (investor: Investor) => {
    const idx = INV_STAGES.indexOf(investor.stage)
    const next = INV_STAGES[Math.min(idx + 1, INV_STAGES.length - 1)]
    if (next === investor.stage) return
    const res = await fetch(`/api/os/investors/${investor.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: next }),
    })
    if (res.ok) setInvestors(prev => prev.map(i => i.id === investor.id ? { ...i, stage: next } : i))
  }, [])

  const submitInvestor = async () => {
    if (!newInvestorForm.name.trim()) return
    setInvestorSubmitting(true)
    const res = await fetch('/api/os/investors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvestorForm),
    })
    if (res.ok) {
      const i = await res.json()
      setInvestors(prev => [i, ...prev])
      setNewInvestorOpen(false)
      setNewInvestorForm({ name: '', firm: '', stage: 'intro', check_size: '', next_action: '' })
    }
    setInvestorSubmitting(false)
  }

  const deleteInvestor = async (id: string) => {
    await fetch(`/api/os/investors/${id}`, { method: 'DELETE' })
    setInvestors(prev => prev.filter(i => i.id !== id))
  }

  const totalCommitments = investors
    .filter(i => i.stage === 'closed')
    .reduce((s, i) => {
      const n = parseFloat((i.check_size ?? '0').replace(/[^0-9.]/g, ''))
      return s + (isNaN(n) ? 0 : n)
    }, 0)

  const pct = (totalCommitments / 1000000) * 100

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="INVESTORS" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <SectionMarker num="06" label="INVESTOR" />
          <Button variant="ghost" size="sm" onClick={() => setNewInvestorOpen(v => !v)}>
            + add investor
          </Button>
        </div>

        {/* Raise progress + KPI */}
        <Card className="mb-6">
          <CardContent>
            <KPIStat
              value={'$' + totalCommitments.toLocaleString()}
              label="COMMITTED"
            />
            <div className="h-0.5 bg-ink/8 rounded-sm mt-4 mb-2">
              {/* Acceptable inline style: dynamic percentage width */}
              <div
                className="h-full bg-accent rounded-sm transition-all"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <span className="mono text-[11px] opacity-25">
              Pre-seed · $1M target · Q2 2026
            </span>
          </CardContent>
        </Card>

        {/* Add investor form */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            newInvestorOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <Card className="mb-4">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={newInvestorForm.name}
                    onChange={e => setNewInvestorForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Sarah Chen"
                  />
                </div>
                <div>
                  <Label>Firm</Label>
                  <Input
                    value={newInvestorForm.firm}
                    onChange={e => setNewInvestorForm(f => ({ ...f, firm: e.target.value }))}
                    placeholder="Sequoia Capital"
                  />
                </div>
                <div>
                  <Label>Stage</Label>
                  <select
                    value={newInvestorForm.stage}
                    onChange={e => setNewInvestorForm(f => ({ ...f, stage: e.target.value }))}
                    className="w-full border border-rule rounded-lg px-3 py-2 text-sm bg-paper text-ink cursor-pointer"
                  >
                    {INV_STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Check size</Label>
                  <Input
                    value={newInvestorForm.check_size}
                    onChange={e => setNewInvestorForm(f => ({ ...f, check_size: e.target.value }))}
                    placeholder="$250k"
                  />
                </div>
                <div>
                  <Label>Next action</Label>
                  <Input
                    value={newInvestorForm.next_action}
                    onChange={e => setNewInvestorForm(f => ({ ...f, next_action: e.target.value }))}
                    placeholder="Send deck"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setNewInvestorOpen(false)}>
                    cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={submitInvestor}
                    disabled={investorSubmitting}
                  >
                    {investorSubmitting ? 'saving…' : 'add investor'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-12 bg-ink/5 rounded animate-pulse" />
            ))}
          </div>
        )}

        {!loading && investors.length === 0 && (
          <Card>
            <CardContent>
              <p className="mono text-[11px] uppercase tracking-[0.1em] text-ink/25 text-center py-6">
                No investors tracked yet
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && investors.length > 0 && (
          <Card className="overflow-hidden">
            {investors.map(inv => (
              <div
                key={inv.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-rule/50 last:border-0 hover:bg-ink/[0.02] transition-colors"
              >
                <div className="flex-1">
                  <span className="font-semibold text-sm text-ink">{inv.name}</span>
                  {inv.firm && (
                    <span className="mono text-[11px] text-ink/40 ml-2">{inv.firm}</span>
                  )}
                </div>
                {inv.check_size && (
                  <span className="mono text-sm text-ink/70">{inv.check_size}</span>
                )}
                {inv.next_action && (
                  <span className="text-sm text-ink/50 hidden md:inline truncate max-w-[160px]">
                    {inv.next_action}
                  </span>
                )}
                <span className="mono text-[11px] text-ink/40">
                  {relativeTime(inv.updated_at)}
                </span>
                <button
                  type="button"
                  onClick={() => cycleInvestorStage(inv)}
                  className="cursor-pointer"
                >
                  <Badge variant={invStageToBadge(inv.stage)}>
                    {inv.stage.replace('_', ' ')}
                  </Badge>
                </button>
                <button
                  type="button"
                  onClick={() => deleteInvestor(inv.id)}
                  className="mono text-sm text-ink/20 hover:text-ink/50 transition-colors flex-shrink-0 px-1"
                  title="delete"
                >
                  ×
                </button>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
