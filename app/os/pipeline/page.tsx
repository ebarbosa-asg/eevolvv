'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, SectionMarker, Badge, Input, Label, Button, KPIStat } from '@/components/ds'
import type { BadgeVariant } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'

type PipelineDeal = {
  id: string
  company: string
  contact_name: string | null
  contact_email: string | null
  stage: 'lead' | 'discovery' | 'proposal' | 'contract' | 'active' | 'lost'
  value: number | null
  notes: string | null
  last_contact_at: string | null
  created_at: string
  updated_at: string
}

const DEAL_STAGES = ['lead', 'discovery', 'proposal', 'contract', 'active', 'lost'] as const

function dealStageToBadge(stage: string): BadgeVariant {
  if (stage === 'active') return 'success'
  if (stage === 'discovery' || stage === 'proposal') return 'warning'
  if (stage === 'contract') return 'danger'
  return 'neutral'
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<PipelineDeal[]>([])
  const [loading, setLoading] = useState(true)
  const [newDealOpen, setNewDealOpen] = useState(false)
  const [newDealForm, setNewDealForm] = useState({
    company: '',
    contact_name: '',
    contact_email: '',
    stage: 'lead',
    value: '',
  })
  const [dealSubmitting, setDealSubmitting] = useState(false)

  const fetchDeals = useCallback(() => {
    setLoading(true)
    fetch('/api/os/pipeline')
      .then(r => r.json())
      .then((d: PipelineDeal[]) => setDeals(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  const cycleDealStage = useCallback(async (deal: PipelineDeal) => {
    const idx = DEAL_STAGES.indexOf(deal.stage)
    const next = DEAL_STAGES[idx + 1] ?? 'lead'
    const res = await fetch(`/api/os/pipeline/${deal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: next }),
    })
    if (res.ok) setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: next } : d))
  }, [])

  const submitDeal = async () => {
    if (!newDealForm.company.trim()) return
    setDealSubmitting(true)
    const res = await fetch('/api/os/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newDealForm,
        value: newDealForm.value ? parseFloat(newDealForm.value) : null,
      }),
    })
    if (res.ok) {
      const d = await res.json()
      setDeals(prev => [d, ...prev])
      setNewDealOpen(false)
      setNewDealForm({ company: '', contact_name: '', contact_email: '', stage: 'lead', value: '' })
    }
    setDealSubmitting(false)
  }

  const deleteDeal = async (id: string) => {
    await fetch(`/api/os/pipeline/${id}`, { method: 'DELETE' })
    setDeals(prev => prev.filter(d => d.id !== id))
  }

  const totalPipelineValue = deals
    .filter(d => d.stage !== 'lost')
    .reduce((s, d) => s + (d.value ?? 0), 0)

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="PIPELINE" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <SectionMarker num="04" label="PIPELINE" />
          <Button variant="ghost" size="sm" onClick={() => setNewDealOpen(v => !v)}>
            + new deal
          </Button>
        </div>

        {/* KPI */}
        <Card className="mb-6">
          <CardContent>
            <KPIStat
              value={'$' + totalPipelineValue.toLocaleString()}
              label="TOTAL PIPELINE"
            />
          </CardContent>
        </Card>

        {/* Add deal form */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            newDealOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <Card className="mb-4">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={newDealForm.company}
                    onChange={e => setNewDealForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <Label>Contact name</Label>
                  <Input
                    value={newDealForm.contact_name}
                    onChange={e => setNewDealForm(f => ({ ...f, contact_name: e.target.value }))}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <Label>Contact email</Label>
                  <Input
                    value={newDealForm.contact_email}
                    onChange={e => setNewDealForm(f => ({ ...f, contact_email: e.target.value }))}
                    placeholder="jane@acme.com"
                  />
                </div>
                <div>
                  <Label>Stage</Label>
                  <select
                    value={newDealForm.stage}
                    onChange={e => setNewDealForm(f => ({ ...f, stage: e.target.value }))}
                    className="w-full border border-rule rounded-lg px-3 py-2 text-sm bg-paper text-ink cursor-pointer"
                  >
                    {DEAL_STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Value ($)</Label>
                  <Input
                    value={newDealForm.value}
                    onChange={e => setNewDealForm(f => ({ ...f, value: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setNewDealOpen(false)}>
                    cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={submitDeal}
                    disabled={dealSubmitting}
                  >
                    {dealSubmitting ? 'saving…' : 'add deal'}
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

        {!loading && deals.length === 0 && (
          <Card>
            <CardContent>
              <p className="mono text-[11px] uppercase tracking-[0.1em] text-ink/25 text-center py-6">
                No pipeline deals yet
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && deals.length > 0 && (
          <Card className="overflow-hidden">
            {deals.map(deal => (
              <div
                key={deal.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-rule/50 last:border-0 hover:bg-ink/[0.02] transition-colors"
              >
                <span className="flex-1 font-semibold text-sm text-ink">{deal.company}</span>
                {deal.contact_name && (
                  <span className="text-sm text-ink/60 hidden md:inline">{deal.contact_name}</span>
                )}
                {deal.value && (
                  <span className="mono text-sm text-ink/70">
                    ${deal.value.toLocaleString()}
                  </span>
                )}
                <span className="mono text-[11px] text-ink/40">
                  {relativeTime(deal.updated_at)}
                </span>
                <button
                  type="button"
                  onClick={() => cycleDealStage(deal)}
                  className="cursor-pointer"
                >
                  <Badge variant={dealStageToBadge(deal.stage)}>
                    {deal.stage}
                  </Badge>
                </button>
                <button
                  type="button"
                  onClick={() => deleteDeal(deal.id)}
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
