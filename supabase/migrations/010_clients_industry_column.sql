-- ============================================================
-- Migration 010 — Industry column on clients + email_queue
-- PRD: industry-vertical-workflows
-- Created: 2026-05-09
-- ============================================================

-- ── Add industry column to clients table ──────────────────────
-- The clients table exists in production (pre-migration-set).
-- Adds TEXT column for vertical tracking (e.g. "Fitness / Gym / Studio").
-- NULL is acceptable for existing rows — backfill below covers known links.
ALTER TABLE clients ADD COLUMN IF NOT EXISTS industry TEXT;

-- Index for vertical filtering in OS dashboard
CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients (industry);

-- ── Add industry column to email_queue table ──────────────────
-- email_queue (created in migration 009) needs industry so follow-up
-- email sends (cron route) can pass vertical context to email templates.
ALTER TABLE email_queue ADD COLUMN IF NOT EXISTS industry TEXT;

-- ── Backfill: copy industry from linked submission where known ─
-- Best-effort: only updates rows where submission_id FK resolves and
-- the linked submission has a non-null industry. Safe to re-run.
UPDATE clients c
SET industry = s.industry
FROM submissions s
WHERE c.submission_id = s.id::text
  AND s.industry IS NOT NULL
  AND c.industry IS NULL;
