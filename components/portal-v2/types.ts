export type GearStatus = 'live' | 'building' | 'planned'

export type GearItem = {
  title: string
  status: GearStatus
  metric: string
  detail?: string
  eta?: string
}

export type AssetItem = {
  type: 'website' | 'marketing' | 'product'
  icon: string
  name: string
  primary: string
  health: number
  secondary?: string
  detail?: string
}

export type EventItem = {
  date: string
  type: 'completed' | 'progress' | 'request' | 'created'
  icon: string
  text: string
}

export type ProductItem = {
  key: string
  icon: string
  name: string
  price: string
  description: string
}

export type ClientAgentPageData = {
  slug: string
  company: string
  agentName: string
  planName: string
  activeWork: Array<{
    title: string
    stage: string
    deliverable?: string
    proof?: string
    owner?: string
    timing?: string
    metric?: string
    detail?: string
    liveDate?: string
    startedDate?: string
  }>
  recommendations?: Array<{
    title: string
    status: string
    price?: string
    description?: string
  }>
  proofItems?: Array<{ label: string; value: string; detail: string }>
  products?: {
    website?: { visits?: string; health?: number; url?: string; detail?: string; leads?: number }
    marketing?: { conversions?: string; health?: number; cpa?: string; detail?: string }
  }
  paidAddOns?: string[]
}