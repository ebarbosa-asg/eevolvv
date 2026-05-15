import { supabase } from '@/lib/supabase'
import { getClientAgentPage, normalizeEmail } from '@/lib/client-agent-pages'

export type ClientRow = {
  id: string
  name?: string | null
  company?: string | null
  email?: string | null
}

export async function findOrCreateClientForAgentPage(
  page: NonNullable<ReturnType<typeof getClientAgentPage>>,
) {
  if (!supabase) return { client: null, error: 'DB unavailable' }

  const primaryEmail = normalizeEmail(page.allowedEmails[0])

  if (primaryEmail) {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, company, email')
      .eq('email', primaryEmail)
      .maybeSingle()

    if (error) return { client: null, error: error.message }
    if (data) return { client: data as ClientRow, error: null }
  }

  const { data: companyMatch, error: companyError } = await supabase
    .from('clients')
    .select('id, name, company, email')
    .eq('company', page.company)
    .maybeSingle()

  if (companyError) return { client: null, error: companyError.message }
  if (companyMatch) return { client: companyMatch as ClientRow, error: null }

  const { data: createdClient, error: createError } = await supabase
    .from('clients')
    .insert({
      name: page.contactName,
      company: page.company,
      email: primaryEmail || null,
      business_type: page.industry,
      contract_value: null,
      stage: 'onboard',
      health: 'green',
      notes: `Created from client agent portal: /os/${page.slug}`,
    })
    .select('id, name, company, email')
    .single()

  if (createError) return { client: null, error: createError.message }
  return { client: createdClient as ClientRow, error: null }
}

export function normalizeRequestText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}
