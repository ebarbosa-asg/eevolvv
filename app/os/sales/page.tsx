'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, SectionMarker, Input, Button } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'

type SalesLead = {
  id: string
  company: string
  contact_name: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'interested' | 'closed' | 'dead'
  notes: string
  last_contacted_at: string
}

export default function MobileSalesHub() {
  const [leads, setLeads] = useState<SalesLead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchLeads = useCallback(() => {
    setLoading(true)
    // Using the same clients table but filtered/viewed for sales
    fetch('/api/os/clients')
      .then(r => r.json())
      .then((d: any[]) => {
        // Map clients to a simpler sales lead format
        const mapped = d.map(c => ({
          id: c.id,
          company: c.company,
          contact_name: c.name,
          email: c.email || '',
          phone: c.phone || '',
          status: c.stage === 'diagnose' ? 'new' : c.stage,
          notes: c.notes || '',
          last_contacted_at: c.updated_at
        }))
        setLeads(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const filtered = leads.filter(l => 
    l.company?.toLowerCase().includes(search.toLowerCase()) || 
    l.contact_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <OSTopbar title="SALES HUD" />
      
      <div className="px-4 py-6">
        {/* Mobile Search */}
        <div className="mb-6">
          <Input 
            placeholder="Search leads..." 
            className="bg-white/5 border-white/10 h-12 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <SectionMarker num="01" label="ACTIVE LEADS" />

        {loading ? (
          <div className="py-12 text-center mono text-[10px] opacity-40">SYNCING...</div>
        ) : (
          <div className="space-y-4 mt-4">
            {filtered.map(lead => (
              <Card key={lead.id} className="bg-[#0A0A09] border-white/5">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight leading-tight">{lead.company}</h3>
                      <p className="text-sm text-white/40">{lead.contact_name}</p>
                    </div>
                    <div className={`px-2 py-1 mono text-[9px] uppercase font-bold border ${
                      lead.status === 'closed' ? 'border-accent text-accent' : 'border-white/10 text-white/30'
                    }`}>
                      {lead.status}
                    </div>
                  </div>

                  {/* Big Mobile Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <a href={`tel:${lead.phone}`} className="flex items-center justify-center bg-white/5 border border-white/10 h-12 mono text-[10px] uppercase tracking-widest active:bg-accent active:text-black">
                      Call
                    </a>
                    <a href={`sms:${lead.phone}`} className="flex items-center justify-center bg-white/5 border border-white/10 h-12 mono text-[10px] uppercase tracking-widest active:bg-accent active:text-black">
                      SMS
                    </a>
                  </div>

                  <div className="text-[11px] text-white/60 mb-2 truncate">
                    {lead.email}
                  </div>

                  <div className="mono text-[8px] text-white/20 uppercase">
                    Last touched: {new Date(lead.last_contacted_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button for Mobile */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-black rounded-full shadow-2xl flex items-center justify-center text-3xl font-light"
        onClick={() => {}}
      >
        +
      </button>
    </div>
  )
}
