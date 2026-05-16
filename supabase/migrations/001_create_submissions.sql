-- eevolvv diagnostic submissions
-- Run this in your Supabase SQL Editor (or via supabase db push)

CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Contact
  name TEXT,
  email TEXT NOT NULL,

  -- Business
  business_name TEXT,
  business_type TEXT NOT NULL,
  industry TEXT,
  revenue TEXT,
  team_size TEXT,

  -- Diagnostic inputs
  top_pains TEXT NOT NULL,
  tools TEXT,
  customer_journey TEXT,
  error_points TEXT,
  hours_freed TEXT,

  -- Service
  tier TEXT,

  -- Output
  report TEXT,

  -- Meta
  ip_address TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  email_sent BOOLEAN DEFAULT FALSE,
  duration_ms INTEGER
);

-- Index for admin queries
CREATE INDEX idx_submissions_email ON submissions (email);
CREATE INDEX idx_submissions_created_at ON submissions (created_at DESC);
CREATE INDEX idx_submissions_tier ON submissions (tier);

-- Row-level security (service role bypasses this automatically)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (no public access)
CREATE POLICY "service_only" ON submissions
  FOR ALL
  TO service_role
  USING (true);
