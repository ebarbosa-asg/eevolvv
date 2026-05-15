-- Lead scoring fields for the diagnostic pipeline.
-- Score is computed server-side in `lib/leadScoring.ts` and persisted at
-- submission save time. Fields are nullable so legacy rows continue to work.

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS lead_score INTEGER,
  ADD COLUMN IF NOT EXISTS lead_segment TEXT,
  ADD COLUMN IF NOT EXISTS recommended_tier TEXT,
  ADD COLUMN IF NOT EXISTS urgency TEXT,
  ADD COLUMN IF NOT EXISTS estimated_monthly_revenue INTEGER,
  ADD COLUMN IF NOT EXISTS missed_revenue_estimate INTEGER,
  ADD COLUMN IF NOT EXISTS tool_count INTEGER,
  ADD COLUMN IF NOT EXISTS hours_wasted_per_week INTEGER,
  ADD COLUMN IF NOT EXISTS referral_source TEXT,
  ADD COLUMN IF NOT EXISTS partner_id TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS landing_page TEXT;

CREATE INDEX IF NOT EXISTS idx_submissions_lead_score ON submissions (lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_lead_segment ON submissions (lead_segment);
CREATE INDEX IF NOT EXISTS idx_submissions_partner_id ON submissions (partner_id);
CREATE INDEX IF NOT EXISTS idx_submissions_utm_source ON submissions (utm_source);

COMMENT ON COLUMN submissions.lead_score IS 'Computed score 0-100. >=70 = hot, 40-69 = warm, <40 = nurture.';
COMMENT ON COLUMN submissions.lead_segment IS 'Routing segment: local_service | appointment_based | ecommerce | agency | multi_location | partner | general_smb';
COMMENT ON COLUMN submissions.recommended_tier IS 'agent_one | agent_three | agent_five | enterprise';
COMMENT ON COLUMN submissions.urgency IS 'low | medium | high — derived from pain-point language.';
