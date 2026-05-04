'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, SectionMarker, Input, Label, Button } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'
import { HealthDot, StagePipeline, EmptyState } from '../components/shared'

export type Client = {
  id: string
  name: string
  company: string
  email: string | null
  phone: string | null
  business_type: string | null
  contract_value: number | null
  stage: 'diagnose' | 'onboard' | 'build' | 'maintain'
  health: 'green' | 'yellow' | 'red'
  notes: string | null
  submission_id: string | null
  created_at: string
  updated_at: string
  agent_count: number
  latest_task: { id: string; status: string; updated_at: string } | null
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    company: '',
    email: '',
    business_type: '',
    contract_value: '',
    stage: 'diagnose',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchClients = useCallback(() => {
    setLoading(true)
    fetch('/api/os/clients')
      .then(r => r.json())
      .then((d: Client[]) => setClients(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const submitNewClient = async () => {
    if (!newClientForm.name || !newClientForm.company) return
    setSubmitting(true)
    await fetch('/api/os/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newClientForm,
        contract_value: newClientForm.contract_value
          ? parseFloat(newClientForm.contract_value)
          : null,
      }),
    })
    setSubmitting(false)
    setNewClientOpen(false)
    setNewClientForm({ name: '', company: '', email: '', business_type: '', contract_value: '', stage: 'diagnose' })
    fetchClients()
  }

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="CLIENTS" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <SectionMarker num="02" label="ACTIVE CLIENTS" />
          <Button variant="ghost" size="sm" onClick={() => setNewClientOpen(v => !v)}>
            + new client
          </Button>
        </div>

        {/* Add client form */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            newClientOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <Card className="mb-4">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Contact name</Label>
                  <Input
                    value={newClientForm.name}
                    onChange={e => setNewClientForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={newClientForm.company}
                    onChange={e => setNewClientForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={newClientForm.email}
                    onChange={e => setNewClientForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="jane@acme.com"
                  />
                </div>
                <div>
                  <Label>Business type</Label>
                  <Input
                    value={newClientForm.business_type}
                    onChange={e => setNewClientForm(f => ({ ...f, business_type: e.target.value }))}
                    placeholder="SaaS / Retail / ..."
                  />
                </div>
                <div>
                  <Label>Contract value ($)</Label>
                  <Input
                    value={newClientForm.contract_value}
                    onChange={e => setNewClientForm(f => ({ ...f, contract_value: e.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label>Stage</Label>
                  <select
                    value={newClientForm.stage}
                    onChange={e => setNewClientForm(f => ({ ...f, stage: e.target.value }))}
                    className="w-full border border-rule rounded-lg px-3 py-2 text-sm bg-paper text-ink"
                  >
                    {['diagnose', 'onboard', 'build', 'maintain'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3 flex gap-2 justify-end pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setNewClientOpen(false)}>
                    cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={submitNewClient}
                    disabled={submitting}
                  >
                    {submitting ? 'saving…' : 'create client'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-12 bg-ink/5 rounded animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && clients.length === 0 && (
          <EmptyState message="No active clients — add your first engagement" />
        )}

        {/* Clients table */}
        {!loading && clients.length > 0 && (
          <Card className="overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-rule">
                  {['Company', 'Contact', 'Stage', 'Agents', 'Health', 'Contract', 'Updated', ''].map(h => (
                    <th
                      key={h}
                      className="mono text-[11px] uppercase tracking-[0.1em] text-ink/40 font-normal text-left px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr
                    key={c.id}
                    className="border-b border-rule/50 last:border-0 cursor-pointer hover:bg-ink/[0.02] transition-colors"
                    onClick={() => router.push(`/os/clients/${c.id}`)}
                  >
                    <td className="px-4 py-3 font-semibold text-sm">{c.company}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{c.name}</td>
                    <td className="px-4 py-3">
                      <StagePipeline stage={c.stage} />
                    </td>
                    <td className="px-4 py-3 mono text-sm text-accent">{c.agent_count}</td>
                    <td className="px-4 py-3">
                      <HealthDot health={c.health} />
                    </td>
                    <td className="px-4 py-3 mono text-sm text-ink/70">
                      {c.contract_value ? `$${c.contract_value.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 mono text-[11px] text-ink/40">
                      {relativeTime(c.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/os/clients/${c.id}`}
                        onClick={e => e.stopPropagation()}
                        className="mono text-sm text-accent no-underline"
                      >
                        →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
