'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, SectionMarker, Badge } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'

type GlobalAgent = {
  id: string
  name: string
  client_name: string
  client_id: string
  status: 'live' | 'building' | 'error' | 'paused'
  type: string
  last_run: string
  health: 'green' | 'yellow' | 'red'
}

function StatusDot({ status }: { status: string }) {
  const colors: any = {
    live: 'bg-accent shadow-[0_0_8px_rgba(251,146,60,0.5)]',
    building: 'bg-white/20 animate-pulse',
    error: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    paused: 'bg-white/10'
  }
  return <div className={`w-2 h-2 rounded-full ${colors[status] || colors.paused}`} />
}

export default function AgentMonitorPage() {
  const [agents, setAgents] = useState<GlobalAgent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAgents = useCallback(() => {
    setLoading(true)
    // Fetching from a new global agents view (or derived from workspace agents)
    fetch('/api/os/agents')
      .then(r => r.json())
      .then((d: GlobalAgent[]) => setAgents(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAgents() }, [fetchAgents])

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <OSTopbar title="AGENT MONITOR" />
      
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        
        {/* Fleet HUD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 px-px">
          <div className="bg-[#0A0A09] border border-white/5 p-6">
            <div className="mono text-[9px] text-accent tracking-widest uppercase mb-1">Fleet Capacity</div>
            <div className="text-3xl font-bold tracking-tighter text-white">{agents.length} / 100</div>
            <div className="mono text-[10px] text-white/20 mt-1 uppercase tracking-tighter">active instances</div>
          </div>
          <div className="bg-[#0A0A09] border border-white/5 p-6">
            <div className="mono text-[9px] text-accent tracking-widest uppercase mb-1">System Health</div>
            <div className="text-3xl font-bold tracking-tighter text-white">
              {agents.filter(a => a.health === 'green').length === agents.length ? '100%' : '94%'}
            </div>
            <div className="mono text-[10px] text-white/20 mt-1 uppercase tracking-tighter">operational status</div>
          </div>
          <div className="bg-[#0A0A09] border border-white/5 p-6">
             <div className="mono text-[9px] text-accent tracking-widest uppercase mb-1">Fleet Velocity</div>
             <div className="text-3xl font-bold tracking-tighter text-white">0.42s</div>
             <div className="mono text-[10px] text-white/20 mt-1 uppercase tracking-tighter">Avg Response Latency</div>
          </div>
        </div>

        <SectionMarker num="01" label="THE DIGITAL WORKFORCE" />

        {loading ? (
          <div className="py-20 text-center mono text-[10px] opacity-20 tracking-[0.3em] font-bold">SYNCHRONIZING FLEET...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {agents.map(agent => (
              <Card key={agent.id} className="bg-[#0D0D0C] border-white/[0.03] hover:border-accent/30 transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-3">
                   <StatusDot status={agent.status} />
                 </div>
                 
                 <CardContent className="p-6">
                    <div className="mono text-[8px] text-white/30 uppercase tracking-widest mb-1">{agent.type}</div>
                    <div className="text-lg font-bold tracking-tighter text-white mb-4 group-hover:text-accent transition-colors">
                      {agent.name}
                    </div>
                    
                    <div className="h-[1px] bg-white/5 w-full mb-4" />
                    
                    <div className="space-y-4">
                       <div>
                         <div className="mono text-[8px] text-white/20 uppercase tracking-tighter">Deployed To</div>
                         <Link href={`/os/clients/${agent.client_id}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors underline decoration-white/10 underline-offset-4">
                           {agent.client_name}
                         </Link>
                       </div>
                       
                       <div className="flex justify-between items-end">
                         <div>
                            <div className="mono text-[8px] text-white/20 uppercase tracking-tighter mb-1">Status</div>
                            <div className="mono text-[10px] text-accent uppercase tracking-widest font-bold">{agent.status}</div>
                         </div>
                         <div className="mono text-[9px] text-white/20 uppercase tracking-tighter">
                            {agent.last_run ? 'Run ' + agent.last_run : 'Idle'}
                         </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            ))}

            {/* Empty Provision Slot */}
            <div className="border border-dashed border-white/10 p-6 flex flex-col items-center justify-center grayscale hover:grayscale-0 cursor-pointer transition-all min-h-[180px]">
               <div className="w-8 h-8 border border-white/20 rounded-sm flex items-center justify-center text-white/20 text-xl font-light mb-3">+</div>
               <div className="mono text-[9px] text-white/20 uppercase tracking-widest">Provision Slot Available</div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
