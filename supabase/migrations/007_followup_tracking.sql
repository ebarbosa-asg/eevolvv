-- Migration 007 — Follow-up email tracking
-- PRD: autonomous-sidegig-pivot
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS followup_sent_at jsonb DEFAULT '[]';
-- Array of ISO timestamps: ["2026-05-07T09:00:00Z", "2026-05-09T09:00:00Z", ...]
-- Index on email_sent for cron query performance
CREATE INDEX IF NOT EXISTS idx_submissions_email_sent ON submissions (email_sent) WHERE email_sent = true;
