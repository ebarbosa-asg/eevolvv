'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import type { ClientAgentPageData, GearItem, AssetItem, EventItem, ProductItem } from './types'
import { StatusHead } from './StatusHead'
import { StatTiles } from './StatTiles'
import { GearsList } from './GearsList'
import { YourStuff } from './YourStuff'
import { Timeline } from './Timeline'
import { AskBox } from './AskBox'
import { AddMore } from './AddMore'

type Props = {
  page: ClientAgentPageData
}

export function ClientHub({ page }: Props) {
  const [events, setEvents] = useState<EventItem[]>([])

  const refreshEvents = useCallback(async () => {
    try {
      const res = await fetch(`/api/os/client-agent/${page.slug}/activity`)
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events ?? [])
      }
    } catch {
      // silent — timeline shows empty state
    }
  }, [page.slug])

  useEffect(() => { refreshEvents() }, [refreshEvents])

  // Build data for each zone from the page config
  const gears: GearItem[] = useMemo(() => {
    return page.activeWork.map(w => ({
      title: w.title,
      status: w.stage as GearItem['status'],
      metric: w.metric || '—',
      detail: w.detail || w.deliverable?.slice(0, 100),
      eta: w.timing,
    }))
  }, [page.activeWork])

  const assets: AssetItem[] = useMemo(() => {
    const list: AssetItem[] = []
    if (page.products?.website) {
      list.push({
        type: 'website',
        icon: '🌐',
        name: 'Website',
        primary: page.products.website.visits || '0 visits',
        health: page.products.website.health ?? 0,
        secondary: page.products.website.url,
        detail: page.products.website.detail,
      })
    }
    if (page.products?.marketing) {
      list.push({
        type: 'marketing',
        icon: '📊',
        name: 'Marketing',
        primary: page.products.marketing.conversions || '0 conversions',
        health: page.products.marketing.health ?? 0,
        secondary: page.products.marketing.cpa ? `$${page.products.marketing.cpa} CPA` : undefined,
        detail: page.products.marketing.detail,
      })
    }
    return list
  }, [page.products])

  // Add-ons available for purchase
  const addons: ProductItem[] = useMemo(() => {
    const list: ProductItem[] = []
    const ownedKeys = new Set((page.paidAddOns || []).map((k: string) => k))
    const all = [
      { key: 'website', icon: '🌐', name: 'Website Build', price: '$2,000 one-time', desc: '5-page public site with contact form, gallery, launch checklist.' },
      { key: 'sco-management', icon: '📊', name: 'SCO Management', price: '$500/mo', desc: 'Service-area optimization for Google, ChatGPT, and local search.' },
      { key: 'extra-automation', icon: '⚙️', name: 'Extra Automation', price: '$300–$750/mo', desc: 'One additional workflow with trigger, destination, and testing.' },
      { key: 'custom-dashboard', icon: '🖥️', name: 'Custom Dashboard', price: '$1,500–$5,000', desc: 'Tailored operations dashboard with your KPIs and data sources.' },
    ]
    for (const a of all) {
      if (!ownedKeys.has(a.key)) {
        list.push({ key: a.key, icon: a.icon, name: a.name, price: a.price, description: a.desc })
      }
    }
    return list
  }, [page.paidAddOns])

  // Build events from work items + requests
  const staticEvents = useMemo(() => {
    const evts: EventItem[] = []
    for (const w of page.activeWork || []) {
      if (w.stage === 'live') {
        evts.push({ date: w.liveDate || '—', type: 'completed', icon: '🟢', text: `${w.title} went live` })
      } else if (w.stage === 'building') {
        evts.push({ date: w.startedDate || '—', type: 'progress', icon: '🟡', text: `${w.title} — ${w.timing || 'in progress'}` })
      }
    }
    evts.sort((a, b) => b.date.localeCompare(a.date))
    return evts
  }, [page.activeWork])

  const allRunning = gears.every(g => g.status === 'live')

  // Stats: compute from data
  const leadCount = page.products?.website?.leads || page.activeWork.filter(w => w.title.toLowerCase().includes('lead')).length * 14 || 0
  const gearCount = gears.filter(g => g.status === 'live').length
  const reqCount = events.filter(e => e.type === 'request').length || page.recommendations?.length || 0
  const hrsSaved = 0 // computed from automation data

  return (
    <main style={{ padding: '0 24px 60px', maxWidth: 880, margin: '0 auto' }}>
      <StatusHead company={page.company} planName={page.planName} allRunning={allRunning} />
      <StatTiles tiles={[
        { icon: '🎯', value: leadCount, label: 'LEADS', trend: 'up' },
        { icon: '⚙️', value: gearCount, label: 'ACTIVE', trend: 'up' },
        { icon: '📋', value: reqCount, label: 'REQUESTS', trend: 'flat' },
        { icon: '⏱️', value: hrsSaved, label: 'HOURS', trend: 'flat' },
      ]} />
      <GearsList gears={gears} />
      <YourStuff assets={assets} />
      <Timeline events={[...staticEvents, ...events].slice(0, 20)} />
      <AskBox slug={page.slug} agentName={page.agentName} onSent={refreshEvents} />
      <AddMore products={addons} />
    </main>
  )
}