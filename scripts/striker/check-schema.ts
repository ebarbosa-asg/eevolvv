import { createClient } from '@supabase/supabase-js';

async function checkSchema() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Checking "clients" table columns...');
  const { data, error } = await supabase.from('clients').select('*').limit(1);

  if (error) {
    console.error('Error fetching data:', error);
  } else if (data && data.length > 0) {
    console.log('Columns found:', Object.keys(data[0]));
  } else {
    console.log('Table is empty, trying to fetch schema via RPC or just metadata...');
    // If table is empty, we can't easily see columns this way, but 
    // usually we can look at the error message for hints.
  }
}

checkSchema().catch(console.error);
