/**
 * eevolvv → HubSpot CRM Sync
 * Pushes diagnostic leads and contact form submissions into HubSpot
 */

const HUBSPOT_API = 'https://api.hubapi.com'
const PAK = process.env.HUBSPOT_PAK || ''

const headers = {
  Authorization: `Bearer ${PAK}`,
  'Content-Type': 'application/json',
}

export async function createContact(contact: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  industry?: string
  message?: string
}) {
  const body = {
    properties: {
      email: contact.email,
      firstname: contact.firstName || '',
      lastname: contact.lastName || '',
      phone: contact.phone || '',
      company: contact.company || '',
      industry: contact.industry || '',
      hs_lead_status: 'NEW',
      notes: contact.message || '',
    },
  }
  const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    console.error('[HubSpot] createContact error:', data)
    return null
  }
  return data
}

export async function createDeal(deal: {
  dealName: string
  stage: string // 'appointmentscheduled' | 'qualifiedtobuy' | etc.
  amount?: number
  contactId?: string
  companyId?: string
}) {
  const body = {
    properties: {
      dealname: deal.dealName,
      dealstage: deal.stage,
      amount: String(deal.amount || 0),
      pipeline: 'default',
    },
  }
  const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/deals`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    console.error('[HubSpot] createDeal error:', data)
    return null
  }
  return data
}

export async function searchContact(email: string) {
  const res = await fetch(
    `${HUBSPOT_API}/crm/v3/objects/contacts/search`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
          },
        ],
      }),
    },
  )
  const data = await res.json()
  return data.results?.[0] || null
}
