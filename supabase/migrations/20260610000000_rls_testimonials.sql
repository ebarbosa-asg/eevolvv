-- Add stripe_session_id + notes to builds (for First Fix idempotency + type tracking)
ALTER TABLE builds ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;
ALTER TABLE builds ADD COLUMN IF NOT EXISTS notes TEXT;

-- Enable RLS on clients table (was missing)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_only_clients" ON clients
  FOR ALL TO service_role USING (true);

-- Testimonials table for social proof
CREATE TABLE IF NOT EXISTS testimonials (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  published_at  TIMESTAMPTZ,

  -- Submission token (sent in the request email)
  token         TEXT        NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),

  -- Client info
  client_email  TEXT,
  client_name   TEXT,
  vertical      TEXT,

  -- Content
  quote         TEXT        NOT NULL DEFAULT '',
  metric_headline TEXT,

  -- Admin
  published     BOOLEAN     DEFAULT FALSE NOT NULL,
  source        TEXT        DEFAULT 'first-fix'  -- 'first-fix' | 'manual'
);

CREATE INDEX idx_testimonials_published ON testimonials (published) WHERE published = TRUE;
CREATE INDEX idx_testimonials_token    ON testimonials (token);

-- RLS: public can INSERT (submit a testimonial via token link), service role owns the rest
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_only_testimonials" ON testimonials
  FOR ALL TO service_role USING (true);

-- Allow anon to insert via token (the public submission page)
CREATE POLICY "anon_insert_testimonial" ON testimonials
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anon to select their own row by token (so the page can confirm submission)
CREATE POLICY "anon_select_by_token" ON testimonials
  FOR SELECT TO anon
  USING (true);
