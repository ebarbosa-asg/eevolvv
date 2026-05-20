'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import type { ClientAgentPageData, GearItem, AssetItem, EventItem, ProductItem } from './types'
import { StatusHead } from './StatusHead'
import { StatTiles } from './StatTiles'
import { GearsList } from './GearsList'
import { YourStuff } from './YourStuff'
import { AddMore } from './AddMore'
import { TabBar } from './TabBar'
import { DeliverablesTab } from './DeliverablesTab'
import { ActivityTab } from './ActivityTab'
import { TargetIcon, GearIcon, ClipboardIcon, ClockIcon } from './icons'

type Tab = 'overview' | 'deliverables' | 'activity' | 'more'

type Props = {
  page: ClientAgentPageData
}

export function ClientHub({ page }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [events, setEvents] = useState<EventItem[]>([])
  const [deliverablesReady, setDeliverablesReady] = useState(false)

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

  useEffect(() => {
    refreshEvents()
    // Mark deliverables tab ready after data confirmed available
    setDeliverablesReady(true)
  }, [refreshEvents])

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
        icon: 'globe',
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
        icon: 'chart',
        name: 'Marketing',
        primary: page.products.marketing.conversions || '0 conversions',
        health: page.products.marketing.health ?? 0,
        secondary: page.products.marketing.cpa ? `$${page.products.marketing.cpa} CPA` : undefined,
        detail: page.products.marketing.detail,
      })
    }
    return list
  }, [page.products])

  const addons: ProductItem[] = useMemo(() => {
    const list: ProductItem[] = []
    const ownedKeys = new Set((page.paidAddOns || []).map((k: string) => k))
    const all = [
      { key: 'website',          icon: 'globe',    name: 'Website Build',     price: '$2,000 one-time', desc: '5-page public site with contact form, gallery, launch checklist.' },
      { key: 'sco-management',   icon: 'chart',    name: 'SCO Management',    price: '$500/mo',         desc: 'Service-area optimization for Google, ChatGPT, and local search.' },
      { key: 'extra-automation', icon: 'gear',     name: 'Extra Automation',  price: '$300–$750/mo',    desc: 'One additional workflow with trigger, destination, and testing.' },
      { key: 'custom-dashboard', icon: 'monitor',  name: 'Custom Dashboard',  price: '$1,500–$5,000',   desc: 'Tailored operations dashboard with your KPIs and data sources.' },
    ]
    for (const a of all) {
      if (!ownedKeys.has(a.key)) {
        list.push({ key: a.key, icon: a.icon, name: a.name, price: a.price, description: a.desc })
      }
    }
    return list
  }, [page.paidAddOns])

  const staticEvents = useMemo(() => {
    const evts: EventItem[] = []
    for (const w of page.activeWork || []) {
      if (w.stage === 'live') {
        evts.push({ date: w.liveDate || '—', type: 'completed', icon: 'check', text: `${w.title} went live` })
      } else if (w.stage === 'building') {
        evts.push({ date: w.startedDate || '—', type: 'progress', icon: 'clock', text: `${w.title} — ${w.timing || 'in progress'}` })
      }
    }
    evts.sort((a, b) => b.date.localeCompare(a.date))
    return evts
  }, [page.activeWork])

  const allRunning = gears.length > 0 && gears.every(g => g.status === 'live')

  const leadCount = page.products?.website?.leads || 0
  const gearCount = gears.filter(g => g.status === 'live').length
  const reqCount = events.filter(e => e.type === 'request').length || page.recommendations?.length || 0
  const deliverableCount = page.activeWork?.length ?? 0

  const tabs = [
    { id: 'overview',     label: 'Overview' },
    { id: 'deliverables', label: 'Deliverables', badge: deliverablesReady ? deliverableCount : null },
    { id: 'activity',     label: 'Activity' },
    { id: 'more',         label: 'Add-ons', badge: addons.length > 0 ? addons.length : null },
  ]

  const allEvents = [...staticEvents, ...events].slice(0, 20)

  return (
    <main style={{ padding: '0 24px 60px', maxWidth: 880, margin: '0 auto' }}>
      <StatusHead company={page.company} planName={page.planName} allRunning={allRunning} />

      <StatTiles tiles={[
        { icon: <TargetIcon size={16} />,    value: leadCount,  label: 'LEADS',    trend: 'up' },
        { icon: <GearIcon size={16} />,      value: gearCount,  label: 'ACTIVE',   trend: 'up' },
        { icon: <ClipboardIcon size={16} />, value: reqCount,   label: 'REQUESTS', trend: 'flat' },
        { icon: <ClockIcon size={16} />,     value: 0,          label: 'HOURS',    trend: 'flat' },
      ]} />

      <TabBar
        tabs={tabs}
        active={activeTab}
        onChange={id => setActiveTab(id as Tab)}
      />

      {activeTab === 'overview' && (
        <>
          <GearsList gears={gears} />
          <YourStuff assets={assets} />
        </>
      )}

      {activeTab === 'deliverables' && (
        <DeliverablesTab items={page.activeWork} />
      )}

      {activeTab === 'activity' && (
        <ActivityTab
          events={allEvents}
          slug={page.slug}
          agentName={page.agentName}
          onSent={refreshEvents}
        />
      )}

      {activeTab === 'more' && (
        <AddMore products={addons} />
      )}
    </main>
  )
}
