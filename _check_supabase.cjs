const { createClient } = require('@supabase/supabase-js')
const { readFileSync } = require('fs')
const envContent = readFileSync('./.env.local', 'utf-8')
const lines = envContent.split('\n')
let supabaseUrl = '', svcKey = ''
for (const l of lines) {
  if (l.startsWith('SUPABASE_URL=')) supabaseUrl = l.replace('SUPABASE_URL=', '').trim()
  if (l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) svcKey = l.replace('SUPABASE_SERVICE_ROLE_KEY=', '').trim()
}
if (svcKey.includes('...')) { process.exit(1) }
const supabase = createClient(supabaseUrl, svcKey)

async function main() {
  // All email_queue items
  const { data: eq } = await supabase.from('email_queue').select('*').order('created_at', { ascending: false })
  console.log('All email_queue items:')
  for (const e of eq || []) console.log(`  ${e.created_at} | ${e.email} | ${e.template} | ${e.status} | ${e.send_after || '-'}`)

  // All agent_runs for May 14
  const { data: ar } = await supabase.from('agent_runs').select('*').gte('created_at', '2026-05-14T00:00:00Z').lt('created_at', '2026-05-15T00:00:00Z').limit(10)
  console.log(`\nAgent runs May 14: ${ar ? ar.length : 0}`)
  for (const a of ar || []) console.log(`  ${a.created_at} | ${JSON.stringify(a)}`)

  // Check if bookings table actually exists by trying a raw SELECT count
  try {
    const { count, error } = await supabase.rpc('get_table_info', {})
    if (error) console.log('RPC error:', error.message)
  } catch(e) {}

  process.exit(0)
}
main().catch(() => { process.exit(1) })