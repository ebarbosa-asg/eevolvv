import { ADD_ONS, WEBSITE_ADD_ON, type AddOnKey, type ProductItem } from '@/lib/agent-products'
import type { ClientAgentPage } from '@/lib/client-agent-pages'

export type DeliverableStatus = 'recommended' | 'paid' | 'intake' | 'queued' | 'building' | 'review' | 'live'
export type DeliverableType = 'agent' | 'automation' | 'website' | 'sco' | 'ads' | 'dashboard' | 'report' | 'request'

export type DeliverableTemplate = {
  key: string
  type: DeliverableType
  title: string
  price?: string
  status: DeliverableStatus
  promise: string
  scope: string[]
  proof: string[]
  deliveryWindow: string
  checkoutUrl?: string
  source?: 'plan' | 'addon' | 'request' | 'manual'
}

export type ClientDeliverableRecord = {
  id: string
  client_id?: string | null
  client_slug: string
  key: string
  type: DeliverableType
  title: string
  price?: string | null
  status: DeliverableStatus
  promise: string
  scope: string[]
  proof: string[]
  delivery_window: string
  checkout_url?: string | null
  source?: string | null
  created_at?: string
  updated_at?: string
}

export const ADD_ON_CHECKOUT_URLS: Partial<Record<AddOnKey, string>> = {
  website: 'https://buy.stripe.com/fZu4gtcX79sX1zma7f48000',
  'sco-management': 'https://buy.stripe.com/00w7sF2it5cHem87Z748001',
  'extra-automation': 'https://buy.stripe.com/aFaeV73mxdJda5Scfn48002',
  'ads-setup': 'https://buy.stripe.com/8x2aER8GRbB591O0wF48004',
  'custom-dashboard': 'https://buy.stripe.com/8x26oB5uF34z2Dqbbj48005',
}

export const PRODUCT_DELIVERABLE_TEMPLATES: Record<string, DeliverableTemplate> = {
  'agent-page': {
    key: 'agent-page',
    type: 'agent',
    title: 'Client Agent Page',
    status: 'live',
    source: 'plan',
    promise: 'A private client command center for requests, recommendations, products, and proof.',
    scope: ['Google-gated private URL', 'Agent console', 'Weekly recommendations', 'Ghost Locker product view'],
    proof: ['Private route is live', 'Authorized emails are configured', 'Client can submit agent requests'],
    deliveryWindow: 'Live at onboarding',
  },
  'weekly-recommendations': {
    key: 'weekly-recommendations',
    type: 'report',
    title: 'Weekly Recommendations',
    status: 'queued',
    source: 'plan',
    promise: 'Weekly recommendations that tell the owner what to fix, automate, publish, or buy next.',
    scope: ['3-5 specific recommendations', 'Impact note', 'Suggested next action', 'Status tracking'],
    proof: ['Recommendation cards visible in client portal', 'Next action selected or dismissed'],
    deliveryWindow: 'Weekly',
  },
  'automation-allowance': {
    key: 'automation-allowance',
    type: 'automation',
    title: 'Automation / Integration Allowance',
    status: 'intake',
    source: 'plan',
    promise: 'Turn approved workflows into visible, tested, owner-readable automations.',
    scope: ['Workflow card', 'Trigger', 'Destination', 'Test result', 'Owner runbook'],
    proof: ['Live workflow or scoped implementation note', 'Test result', 'Runbook/status card'],
    deliveryWindow: 'Monthly allowance',
  },
  website: {
    key: 'website',
    type: 'website',
    title: WEBSITE_ADD_ON.name,
    price: WEBSITE_ADD_ON.price,
    status: 'recommended',
    source: 'addon',
    promise: WEBSITE_ADD_ON.description,
    scope: ['Site/page structure', 'Responsive build', 'Contact CTA', 'Basic metadata', 'Launch checklist'],
    proof: ['Website URL', 'Page inventory', 'Launch checklist', 'Edit notes'],
    deliveryWindow: 'Fast scope after payment',
    checkoutUrl: ADD_ON_CHECKOUT_URLS.website,
  },
  'sco-management': {
    key: 'sco-management',
    type: 'sco',
    title: ADD_ONS['sco-management'].name,
    price: ADD_ONS['sco-management'].price,
    status: 'recommended',
    source: 'addon',
    promise: ADD_ONS['sco-management'].description,
    scope: ['Search/AI discovery targets', 'Service proof', 'FAQ/content updates', 'Monthly action log'],
    proof: ['Monthly SCO action log', 'Updated pages/content list', 'Next recommendations'],
    deliveryWindow: 'Monthly',
    checkoutUrl: ADD_ON_CHECKOUT_URLS['sco-management'],
  },
  'extra-automation': {
    key: 'extra-automation',
    type: 'automation',
    title: ADD_ONS['extra-automation'].name,
    price: ADD_ONS['extra-automation'].price,
    status: 'recommended',
    source: 'addon',
    promise: ADD_ONS['extra-automation'].description,
    scope: ['One job', 'One trigger', 'One destination', 'One test', 'Owner-facing runbook'],
    proof: ['Scope card', 'Integration list', 'Test result', 'Live status'],
    deliveryWindow: 'Monthly add-on',
    checkoutUrl: ADD_ON_CHECKOUT_URLS['extra-automation'],
  },
  'ads-setup': {
    key: 'ads-setup',
    type: 'ads',
    title: ADD_ONS['ads-setup'].name,
    price: ADD_ONS['ads-setup'].price,
    status: 'recommended',
    source: 'addon',
    promise: ADD_ONS['ads-setup'].description,
    scope: ['Campaign map', 'Landing recommendation', 'Tracking checklist', 'Launch notes'],
    proof: ['Campaign map', 'Audience/keyword notes', 'Spend approval', 'Tracking checklist'],
    deliveryWindow: 'One-time setup',
    checkoutUrl: ADD_ON_CHECKOUT_URLS['ads-setup'],
  },
  'custom-dashboard': {
    key: 'custom-dashboard',
    type: 'dashboard',
    title: ADD_ONS['custom-dashboard'].name,
    price: ADD_ONS['custom-dashboard'].price,
    status: 'recommended',
    source: 'addon',
    promise: ADD_ONS['custom-dashboard'].description,
    scope: ['Metric definition', 'Source list', 'Dashboard build', 'Refresh cadence', 'Owner notes'],
    proof: ['Dashboard URL or screenshot', 'Source list', 'Update cadence'],
    deliveryWindow: 'One-time scope',
    checkoutUrl: ADD_ON_CHECKOUT_URLS['custom-dashboard'],
  },
}

function productStatusToDeliverableStatus(status: ProductItem['status']): DeliverableStatus {
  if (status === 'available') return 'recommended'
  if (status === 'included' || status === 'paid') return 'paid'
  if (status === 'active') return 'building'
  if (status === 'queued') return 'queued'
  return 'recommended'
}

function productTypeToDeliverableType(type: ProductItem['type']): DeliverableType {
  if (type === 'growth') return 'sco'
  if (type === 'integration') return 'automation'
  if (type === 'file') return 'report'
  return type
}

export function productToDeliverable(product: ProductItem): DeliverableTemplate {
  const template = PRODUCT_DELIVERABLE_TEMPLATES[product.key]
  if (template) {
    return {
      ...template,
      title: product.name || template.title,
      price: product.price ?? template.price,
      status: product.status === 'available' ? template.status : productStatusToDeliverableStatus(product.status),
      promise: product.description || template.promise,
    }
  }

  return {
    key: product.key,
    type: productTypeToDeliverableType(product.type),
    title: product.name,
    price: product.price,
    status: productStatusToDeliverableStatus(product.status),
    source: product.status === 'available' ? 'addon' : 'plan',
    promise: product.description,
    scope: ['Define scope', 'Attach owner', 'Ship artifact', 'Record proof'],
    proof: [product.proof],
    deliveryWindow: product.cadence ?? 'Scoped after approval',
  }
}

export function getSeedDeliverablesForClient(page: ClientAgentPage): ClientDeliverableRecord[] {
  return page.products.map((product, index) => {
    const template = productToDeliverable(product)
    return {
      id: `template-${page.slug}-${template.key}`,
      client_slug: page.slug,
      key: template.key,
      type: template.type,
      title: template.title,
      price: template.price ?? null,
      status: template.status,
      promise: template.promise,
      scope: template.scope,
      proof: template.proof,
      delivery_window: template.deliveryWindow,
      checkout_url: template.checkoutUrl ?? null,
      source: template.source ?? (index < 3 ? 'plan' : 'addon'),
    }
  })
}

export function requestToDeliverableTemplate({
  commandLabel,
  request,
}: {
  commandLabel: string
  request: string
}): DeliverableTemplate {
  return {
    key: `request-${Date.now()}`,
    type: 'request',
    title: commandLabel,
    status: 'queued',
    source: 'request',
    promise: request,
    scope: ['Clarify request', 'Turn into scope card', 'Assign owner', 'Ship visible proof'],
    proof: ['Ghost Locker deliverable card', 'Status update', 'Client-visible next action'],
    deliveryWindow: 'Queued for eevolvv review',
  }
}
