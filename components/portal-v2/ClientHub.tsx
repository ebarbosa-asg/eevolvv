'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import type { ClientAgentPageData, GearItem, AssetItem, EventItem, ProductItem } from './types'
import type { ClientDeliverableRecord } from '@/lib/deliverables'
import { StatusHead } from './StatusHead'
import { StatTiles } from './StatTiles'
import { GearsList } from './GearsList'
import { YourStuff } from './YourStuff'
import { AddMore } from './AddMore'
import { TabBar } from './TabBar'
import { DeliverablesTab } from './DeliverablesTab'
import { ActivityTab } from './ActivityTab'
import { NotifyButton } from './NotifyButton'
import { TargetIcon, GearIcon, ClipboardIcon, ClockIcon } from './icons'

type Tab = 'overview' | 'deliverables' | 'activity' | 'more'

type Props = {
  page: ClientAgentPageData
  initialTab?: string
}

const POLL_INTERVAL_MS = 30_000

export function ClientHub({ page, initialTab }: Props) {
  const resolvedInitial: Tab =
    initialTab === 'deliverables' || initialTab === 'activity' || initialTab === 'more'
      ? (initialTab as Tab)
      : 'overview'

  const [activeTab, setActiveTab] = useState<Tab>(resolvedInitial)
  const [events, setEvents] = useState<EventItem[]>([])
  const [deliverables, setDeliverables] = useState<ClientDeliverableRecord[] | null>(null)
  const [deliverablesLoading, setDeliverablesLoading] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── activity fetch (on mount + manual refresh)
  const refreshEvents = useCallback(async () => {
    try {
      const res = await fetch(`/api/os/client-agent/${page.slug}/activity`)
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events ?? [])
      }
    } catch { /* silent */ }
  }, [page.slug])

  // ── deliverables fetch
  const fetchDeliverables = useCallback(async () => {
    setDeliverablesLoading(true)
    try {
      const res = await fetch(`/api/os/client-agent/${page.slug}/deliverables`)
      if (res.ok) {
        const data = await res.json()
        setDeliverables(data.deliverables ?? [])
      }
    } catch { /* show empty state */ } finally {
      setDeliverablesLoading(false)
    }
  }, [page.slug])

  useEffect(() => {
    refreshEvents()
    fetchDeliverables()
  }, [refreshEvents, fetchDeliverables])

  // ── 30s polling on Activity tab, paused when document hidden
  useEffect(() => {
    if (activeTab !== 'activity') {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
      return
    }

    pollRef.current = setInterval(() => {
      if (!document.hidden) refreshEvents()
    }, POLL_INTERVAL_MS)

    const onVisibility = () => {
      if (!document.hidden && activeTab === 'activity') refreshEvents()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [activeTab, refreshEvents])

  // ── derived data
  const gears: GearItem[] = useMemo(() => page.activeWork.map(w => ({
    title: w.title,
    status: w.stage as GearItem['status'],
    metric: w.metric || '—',
    detail: w.detail || w.deliverable?.slice(0, 100),
    eta: w.timing,
  })), [page.activeWork])

  const assets: AssetItem[] = useMemo(() => {
    const list: AssetItem[] = []
    if (page.products?.website) {
      list.push({
        type: 'website', icon: 'globe', name: 'Website',
        primary: page.products.website.visits || '0 visits',
        health: page.products.website.health ?? 0,
        secondary: page.products.website.url,
        detail: page.products.website.detail,
      })
    }
    if (page.products?.marketing) {
      list.push({
        type: 'marketing', icon: 'chart', name: 'Marketing',
        primary: page.products.marketing.conversions || '0 conversions',
        health: page.products.marketing.health ?? 0,
        secondary: page.products.marketing.cpa ? `$${page.products.marketing.cpa} CPA` : undefined,
        detail: page.products.marketing.detail,
      })
    }
    return list
  }, [page.products])

  const addons: ProductItem[] = useMemo(() => {
    const ownedKeys = new Set((page.paidAddOns || []).map((k: string) => k))
    return [
      { key: 'website',          icon: 'globe',   name: 'Website Build',    price: '$2,000 one-time', description: '5-page public site with contact form, gallery, launch checklist.' },
      { key: 'sco-management',   icon: 'chart',   name: 'SCO Management',   price: '$500/mo',         description: 'Service-area optimization for Google, ChatGPT, and local search.' },
      { key: 'extra-automation', icon: 'gear',    name: 'Extra Automation', price: '$300–$750/mo',    description: 'One additional workflow with trigger, destination, and testing.' },
      { key: 'custom-dashboard', icon: 'monitor', name: 'Custom Dashboard', price: '$1,500–$5,000',   description: 'Tailored operations dashboard with your KPIs and data sources.' },
    ].filter(a => !ownedKeys.has(a.key))
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
    return evts.sort((a, b) => b.date.localeCompare(a.date))
  }, [page.activeWork])

  const allEvents = useMemo(
    () => [...staticEvents, ...events].slice(0, 20),
    [staticEvents, events],
  )

  const allRunning = gears.length > 0 && gears.every(g => g.status === 'live')
  const gearCount  = gears.filter(g => g.status === 'live').length
  const reqCount   = events.filter(e => e.type === 'request').length || page.recommendations?.length || 0
  const deliverableCount = deliverables?.length ?? page.activeWork.length

  const tabs = [
    { id: 'overview',     label: 'Overview' },
    { id: 'deliverables', label: 'Deliverables', badge: deliverables !== null ? deliverableCount : null },
    { id: 'activity',     label: 'Activity' },
    { id: 'more',         label: 'Add-ons', badge: addons.length > 0 ? addons.length : null },
  ]

  return (
    <main style={{ padding: '0 24px 60px', maxWidth: 880, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <StatusHead company={page.company} planName={page.planName} allRunning={allRunning} />
        </div>
        <div style={{ paddingBottom: 0, paddingTop: 20 }}>
          <NotifyButton slug={page.slug} />
        </div>
      </div>

      <StatTiles tiles={[
        { icon: <TargetIcon size={16} />,    value: page.products?.website?.leads ?? 0, label: 'LEADS',    trend: 'up' },
        { icon: <GearIcon size={16} />,      value: gearCount,                          label: 'ACTIVE',   trend: 'up' },
        { icon: <ClipboardIcon size={16} />, value: reqCount,                           label: 'REQUESTS', trend: 'flat' },
        { icon: <ClockIcon size={16} />,     value: deliverableCount,                   label: 'ITEMS',    trend: 'flat' },
      ]} />

      <TabBar tabs={tabs} active={activeTab} onChange={id => setActiveTab(id as Tab)} />

      {activeTab === 'overview' && (
        <>
          <GearsList gears={gears} />
          <YourStuff assets={assets} />
        </>
      )}

      {activeTab === 'deliverables' && (
        <DeliverablesTab
          deliverables={deliverables}
          fallbackItems={page.activeWork}
          loading={deliverablesLoading}
        />
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
