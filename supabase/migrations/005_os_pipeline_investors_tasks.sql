-- § 005 · OS expansion — company_tasks, pipeline_deals, investors, os_state
-- Run this in Supabase SQL Editor or via: supabase db push

-- ─── company_tasks ───────────────────────────────────────────────────────────
-- Internal eevolvv tasks not tied to any specific client engagement.
-- Used by § 00 · COMPANY TASKS on the OS hub.

CREATE TABLE IF NOT EXISTS company_tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'todo'
              CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  priority    TEXT NOT NULL DEFAULT 'normal'
              CHECK (priority IN ('high', 'normal', 'low')),
  category    TEXT NOT NULL DEFAULT 'general'
              CHECK (category IN ('fundraise', 'product', 'sales', 'ops', 'marketing', 'general')),
  due_date    DATE,
  assignee    TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS company_tasks_status_idx   ON company_tasks(status);
CREATE INDEX IF NOT EXISTS company_tasks_category_idx ON company_tasks(category);
CREATE INDEX IF NOT EXISTS company_tasks_created_idx  ON company_tasks(created_at DESC);

-- ─── pipeline_deals ──────────────────────────────────────────────────────────
-- Sales and biz-dev pipeline — replaces the manual text fields in § 05 PIPELINE.
-- Stage progression: lead → discovery → proposal → contract → active | lost

CREATE TABLE IF NOT EXISTS pipeline_deals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company         TEXT NOT NULL,
  contact_name    TEXT,
  contact_email   TEXT,
  stage           TEXT NOT NULL DEFAULT 'lead'
                  CHECK (stage IN ('lead', 'discovery', 'proposal', 'contract', 'active', 'lost')),
  value           NUMERIC,
  notes           TEXT,
  last_contact_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pipeline_deals_stage_idx   ON pipeline_deals(stage);
CREATE INDEX IF NOT EXISTS pipeline_deals_created_idx ON pipeline_deals(created_at DESC);

-- ─── investors ───────────────────────────────────────────────────────────────
-- Investor relationship tracking — replaces the manual text fields in § 08 INVESTOR.
-- Stage progression: intro → meeting → dd → term_sheet → closed | passed

CREATE TABLE IF NOT EXISTS investors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  firm            TEXT,
  stage           TEXT NOT NULL DEFAULT 'intro'
                  CHECK (stage IN ('intro', 'meeting', 'dd', 'term_sheet', 'closed', 'passed')),
  check_size      TEXT,
  last_contact_at TIMESTAMPTZ,
  next_action     TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS investors_stage_idx   ON investors(stage);
CREATE INDEX IF NOT EXISTS investors_created_idx ON investors(created_at DESC);

-- ─── os_state ────────────────────────────────────────────────────────────────
-- Generic key-value store for persistent OS dashboard state (bank balance, etc.)
-- Already in use — CREATE IF NOT EXISTS is safe.

CREATE TABLE IF NOT EXISTS os_state (
  key        TEXT PRIMARY KEY,
  value      JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
-- Service role only — all reads/writes go through Next.js API routes with
-- session auth. No public access.

ALTER TABLE company_tasks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE os_state        ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'company_tasks' AND policyname = 'service_only'
  ) THEN
    CREATE POLICY "service_only" ON company_tasks  FOR ALL TO service_role USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pipeline_deals' AND policyname = 'service_only'
  ) THEN
    CREATE POLICY "service_only" ON pipeline_deals FOR ALL TO service_role USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'investors' AND policyname = 'service_only'
  ) THEN
    CREATE POLICY "service_only" ON investors       FOR ALL TO service_role USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'os_state' AND policyname = 'service_only'
  ) THEN
    CREATE POLICY "service_only" ON os_state        FOR ALL TO service_role USING (true);
  END IF;
END $$;
