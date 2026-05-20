#!/bin/bash
cd /Users/loko/eevolvv || exit 1
SUPABASE_URL=$(grep '^SUPABASE_URL=' .env.local | head -1 | sed 's/^SUPABASE_URL=//')
SUPABASE_SERVICE_ROLE_KEY=$(grep '^SUPABASE_SERVICE_ROLE_KEY=' .env.local | head -1 | sed 's/^SUPABASE_SERVICE_ROLE_KEY=//')
export SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY
npx tsx scripts/striker/strike.ts
