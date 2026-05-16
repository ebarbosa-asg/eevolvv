'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardMetrics {
  mrr: number
  clientCount: number
  leadFunnel: {
    cold: number
    contacted: number
    nurtured: number
    qualified: number
    closed: number
  }
  topClients: Array<{
    id: string
    business_name: string
    email: string
    mrr: number
  }>
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch('/api/os/metrics')
        if (!res.ok) throw new Error('Failed to load metrics')
        const data = await res.json()
        setMetrics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-paper text-ink p-8">
        <div className="mono text-xs tracking-widest opacity-40">LOADING DASHBOARD...</div>
      </main>
    )
  }

  if (error || !metrics) {
    return (
      <main className="min-h-screen bg-paper text-ink p-8">
        <div className="mono text-xs tracking-widest text-red-600">ERROR: {error || 'No data'}</div>
      </main>
    )
  }

  const { mrr, clientCount, leadFunnel, topClients } = metrics
  const arr = mrr * 12
  const avgClientValue = clientCount > 0 ? mrr / clientCount : 0

  return (
    <main className="min-h-screen bg-paper text-ink p-8">
      
      {/* Header */}
      <header className="mb-12">
        <div className="mono text-[10px] tracking-[0.3em] text-accent mb-4 font-bold">
          EEVOLVV OPERATIONS DASHBOARD
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Revenue & Pipeline Health</h1>
        <p className="text-sm opacity-60">Real-time metrics from Stripe, Supabase, and PostHog</p>
      </header>

      {/* Revenue KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="border-2 border-ink/10 p-6">
          <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-2">MRR</div>
          <div className="text-3xl font-bold tracking-tight">
            ${mrr.toLocaleString()}
          </div>
          <div className="text-xs opacity-50 mt-1">${arr.toLocaleString()} ARR</div>
        </div>
        
        <div className="border-2 border-ink/10 p-6">
          <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-2">CLIENTS</div>
          <div className="text-3xl font-bold tracking-tight">{clientCount}</div>
          <div className="text-xs opacity-50 mt-1">Active subscriptions</div>
        </div>
        
        <div className="border-2 border-ink/10 p-6">
          <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-2">AVG CLIENT VALUE</div>
          <div className="text-3xl font-bold tracking-tight">
            ${Math.round(avgClientValue)}
          </div>
          <div className="text-xs opacity-50 mt-1">per month</div>
        </div>
        
        <div className="border-2 border-ink/10 p-6">
          <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-2">RUNWAY</div>
          <div className="text-3xl font-bold tracking-tight">∞</div>
          <div className="text-xs opacity-50 mt-1">Bootstrapped</div>
        </div>
      </section>

      {/* Lead Funnel */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">Lead Funnel</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(leadFunnel).map(([stage, count]) => (
            <div key={stage} className="border border-ink/10 p-4">
              <div className="mono text-[8px] tracking-[0.3em] uppercase opacity-40 mb-1">
                {stage}
              </div>
              <div className="text-2xl font-bold">{count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Clients */}
      <section>
        <h2 className="text-xl font-bold mb-6">Top Clients by Revenue</h2>
        <div className="border-2 border-ink/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink/10">
                <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-40">BUSINESS</th>
                <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-40">EMAIL</th>
                <th className="text-right p-4 mono text-[9px] tracking-[0.26em] opacity-40">MRR</th>
              </tr>
            </thead>
            <tbody>
              {topClients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center opacity-40">No paying clients yet</td>
                </tr>
              ) : (
                topClients.map((client) => (
                  <tr key={client.id} className="border-b border-ink/5 hover:bg-ink/5">
                    <td className="p-4 font-medium">{client.business_name || 'Untitled'}</td>
                    <td className="p-4 text-sm opacity-60">{client.email}</td>
                    <td className="p-4 text-right font-bold">${client.mrr}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Action Links */}
      <footer className="mt-12 flex gap-4">
        <Link 
          href="/os/clients" 
          className="mono text-xs tracking-[0.2em] bg-ink text-paper px-6 py-3 font-bold hover:bg-accent transition-colors"
        >
          VIEW ALL CLIENTS →
        </Link>
        <Link 
          href="/os/pipeline" 
          className="mono text-xs tracking-[0.2em] border-2 border-ink px-6 py-3 font-bold hover:bg-ink hover:text-paper transition-colors"
        >
          MANAGE PIPELINE →
        </Link>
      </footer>

    </main>
  )
}
