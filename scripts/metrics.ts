#!/usr/bin/env node
// eevolvv daily metrics — NO hallucination. Real queries only.
const { createClient } = require('@supabase/supabase-js');
const { exit } = require('process');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log('⚠️  Missing Supabase env vars');
  exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const today = new Date().toISOString().slice(0, 10);

  // 1. Submissions
  const { count: totalSubs } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true });
  const { count: todaySubs } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);
  const { data: allSubs } = await supabase
    .from('submissions')
    .select('name, email, business_name, business_type, created_at')
    .order('created_at', { ascending: false });

  // 2. Clients
  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });
  const { count: todayClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);
  const { data: allClients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  const stageDist: Record<string, number> = {};
  (allClients || []).forEach((c: any) => {
    stageDist[c.stage] = (stageDist[c.stage] || 0) + 1;
  });

  // 3. Stripe MRR
  let mrr = 0;
  let activeSubs = 0;
  if (STRIPE_KEY) {
    try {
      const stripe = require('stripe')(STRIPE_KEY);
      const subs = await stripe.subscriptions.list({ status: 'active', limit: 100 });
      activeSubs = subs.data.length;
      mrr = subs.data.reduce((sum: number, sub: any) => sum + (sub.items.data[0]?.price?.unit_amount || 0) / 100, 0);
    } catch {
      // stripe key not available in this env
    }
  }

  // 4. Real leads (non-test)
  const testEmails = ['owl@eevolvv.com', 'status@eevolvv.com', 'test@example.com', 'test@test.com', 't@t.com',
    'explorer@example.com', 'eduardocbarbosa1998@gmail.com'];
  const realLeads = (allSubs || []).filter((s: any) => !testEmails.includes(s.email));

  // OUTPUT
  console.log(`📊 eevolvv Daily Metrics — ${new Date().toDateString()}`);
  console.log('');
  console.log(`💰 MRR: $${mrr.toLocaleString()}  |  ${activeSubs} active subscriptions`);
  console.log('');
  console.log(`👥 Pipeline (clients table): ${totalClients} total clients`);
  for (const [stg, cnt] of Object.entries(stageDist).sort()) {
    console.log(`   ${stg}: ${cnt}`);
  }
  console.log(`   ${todayClients} new scrapes today`);
  console.log('');
  console.log(`📩 Submissions: ${totalSubs} total, ${todaySubs} today`);
  if (realLeads.length > 0) {
    console.log('  Non-test submissions:');
    realLeads.forEach((l: any) => {
      const biz = l.business_name || l.business_type || '(no company)';
      console.log(`  • ${l.name} — ${biz} (${l.email}) — ${l.created_at.slice(0, 10)}`);
    });
  } else {
    console.log('  No non-test submissions');
  }
  console.log('');
  console.log(`📅 Stripe live mode: ${activeSubs > 0 ? `${activeSubs} subs, $${mrr} MRR` : 'pre-revenue ($0 MRR)'}`);
}

main().catch((e: any) => {
  console.error('Metrics error:', e.message);
  exit(1);
});