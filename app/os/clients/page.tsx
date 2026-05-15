'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, SectionMarker, Input, Label, Button, Badge } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'
import { HealthDot } from '../components/shared'
import { StatusPill } from '@/components/ds'

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
  agent_count: number
  latest_task: { id: string; status: string; updated_at: string } | null
  created_at: string
}

function MetricCard({ label, value, subtext }: { label: string, value: string | number, subtext?: string }) {
  return (
    <div className="border border-white/5 bg-white/[0.02] p-4">
      <div className="mono text-[9px] tracking-[0.2em] text-accent mb-1 uppercase">{label}</div>
      <div className="text-2xl font-medium tracking-tight text-paper">{value}</div>
      {subtext && <div className="mono text-[10px] text-paper/30 mt-1">{subtext}</div>}
    </div>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fetchClients = useCallback(() => {
    setLoading(true)
    fetch('/api/os/clients')
      .then(r => r.json())
      .then((d: Client[]) => setClients(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  const filtered = clients.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.company?.toLowerCase().includes(search.toLowerCase())
  )

  const activeMRR = clients.reduce((acc, curr) => acc + (curr.contract_value || 0), 0)

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-paper">
      <OSTopbar title="CLIENT COMMAND" />
      
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        
        {/* Global Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <MetricCard label="Total Portfolio" value={clients.length} subtext="active entities" />
          <MetricCard label="Pipeline MRR" value={`$${activeMRR.toLocaleString()}`} subtext="recurring revenue" />
          <MetricCard label="Agent Velocity" value={clients.reduce((a,c) => a + c.agent_count, 0)} subtext="deployed instances" />
          <MetricCard label="System Health" value="100%" subtext="zero critical errors" />
        </div>

        <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-6">
          <div className="flex gap-8 items-end">
            <SectionMarker num="02" label="PORTFOLIO" />
            <div className="w-64">
              <Input 
                placeholder="search by company..." 
                className="bg-transparent border-white/10 text-xs mono h-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mono text-[10px] tracking-widest uppercase border border-white/10 px-6" onClick={() => setNewClientOpen(true)}>
            + Provision New Instance
          </Button>
        </div>

        {loading ? (
          <div className="mono text-[10px] animate-pulse py-20 text-center opacity-30 tracking-[0.3em]">SYNCHRONIZING REPOSITORY...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(client => (
              <Link key={client.id} href={`/os/clients/${client.id}`} className="group">
                <Card className="bg-[#0A0A09] border-[#1C1C1A] hover:border-accent/40 transition-all duration-300 relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 p-4">
                    <HealthDot health={client.health} />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="mono text-[10px] text-accent tracking-widest uppercase mb-1">{client.stage}</div>
                      <h3 className="text-xl font-semibold text-white tracking-tight group-hover:text-accent transition-colors">
                        {client.company}
                      </h3>
                      <div className="mono text-[11px] text-white/40 mt-1">{client.name}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="border-l border-white/5 pl-3 py-1">
                        <div className="mono text-[9px] text-white/30 uppercase tracking-tighter">Capacity</div>
                        <div className="text-sm text-white/80 font-medium">{client.agent_count} Agents</div>
                      </div>
                      <div className="border-l border-white/5 pl-3 py-1">
                        <div className="mono text-[9px] text-white/30 uppercase tracking-tighter">Value</div>
                        <div className="text-sm text-white/80 font-medium">${(client.contract_value || 0).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="mono text-[9px] text-white/40 uppercase">Last Activity</span>
                        <span className="mono text-[9px] text-white/70 tracking-tight text-right">
                          {client.latest_task ? 'task_processed' : 'idle'}
                        </span>
                      </div>
                      <div className="h-[1px] bg-white/5 w-full" />
                      <div className="flex items-center justify-between">
                        <span className="mono text-[9px] text-white/40 uppercase">Integration Progress</span>
                        <span className="mono text-[9px] text-white/70">65%</span>
                      </div>
                      <div className="w-full bg-white/5 h-[2px]">
                         <div className="bg-accent h-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
