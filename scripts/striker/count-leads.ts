import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.log('Error querying clients table:', error.message);
    return;
  }

  console.log(`Total leads in Supabase 'clients' table: ${count}`);

  // Also get breakdown by business_type
  const { data: byType } = await supabase
    .from('clients').select('business_type');
  if (byType) {
    const counts: Record<string, number> = {};
    byType.forEach(r => {
      const t = r.business_type || 'unknown';
      counts[t] = (counts[t] || 0) + 1;
    });
    console.log('\nBreakdown by business_type:');
    Object.entries(counts).forEach(([type, c]) => console.log(`  ${type}: ${c}`));
  }
}

main();
