-- Partner program intake + tracking.
-- Backed by the /partners landing page and /api/partners/intake endpoint.

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Public partner identifier used in referral links (?partner=xxx)
  partner_code TEXT UNIQUE,
  -- Intake fields
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  partner_type TEXT,          -- agency | web_designer | freelancer | consultant | coach | accountant | other
  audience TEXT,              -- text — who do they serve
  monthly_clients TEXT,       -- range — "1-5", "6-20", "20+"
  motivation TEXT,            -- text — why partner with eevolvv
  source TEXT,                -- where they found us (utm_source override or referrer)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  -- Lifecycle
  status TEXT NOT NULL DEFAULT 'applied',  -- applied | approved | active | paused | declined
  approved_at TIMESTAMPTZ,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_partners_email ON partners (email);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners (status);
CREATE INDEX IF NOT EXISTS idx_partners_partner_code ON partners (partner_code);

COMMENT ON TABLE partners IS 'Partner program applicants and active partners. Referral revenue: 10% subscription for 12 months + 10% one-time add-ons.';
