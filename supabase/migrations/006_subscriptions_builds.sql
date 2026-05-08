-- ============================================================
-- Migration 006 — Subscription Pipeline Tables
-- PRD: autonomous-sidegig-pivot
-- Created: 2026-05-07
-- ============================================================

-- ── Enable extensions (if not already enabled) ────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Add subscription columns to existing clients table ────────
-- The clients table exists in the production database (pre-migration-set).
-- Existing columns: name, company, email, phone, business_type, contract_value,
--   stage, health, notes, submission_id, created_at, updated_at.
-- These ALTER TABLE statements add subscription pipeline columns only.
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS email                  text,
  ADD COLUMN IF NOT EXISTS stripe_customer_id     text,
  ADD COLUMN IF NOT EXISTS tier                   text CHECK (tier IN ('seed', 'core', 'evolve')),
  ADD COLUMN IF NOT EXISTS churn_risk             boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_portal_visit_at   timestamptz;

-- Index for Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_clients_stripe_customer_id
  ON clients (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- ── subscriptions ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  stripe_subscription_id   text UNIQUE NOT NULL,
  stripe_price_id          text NOT NULL,
  status                   text NOT NULL DEFAULT 'active'
                             CHECK (status IN ('active', 'past_due', 'canceled', 'paused', 'trialing', 'incomplete')),
  billing_interval         text NOT NULL
                             CHECK (billing_interval IN ('monthly', 'annual')),
  current_period_end       timestamptz,
  cancel_at_period_end     boolean DEFAULT false,
  created_at               timestamptz DEFAULT now(),
  updated_at               timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id
  ON subscriptions (client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id
  ON subscriptions (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions (status);

-- ── builds ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS builds (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tier          text NOT NULL CHECK (tier IN ('seed', 'core', 'evolve')),
  status        text NOT NULL DEFAULT 'queued'
                  CHECK (status IN ('queued', 'in_progress', 'qa', 'deploying', 'live', 'failed', 'paused')),
  assigned_to   text,
  build_url     text,
  notes         text,
  started_at    timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_builds_client_id ON builds (client_id);
CREATE INDEX IF NOT EXISTS idx_builds_status    ON builds (status);

-- ── onboarding_tokens ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS onboarding_tokens (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token         text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
  responses     jsonb DEFAULT '{}',
  completed_at  timestamptz,
  expires_at    timestamptz DEFAULT now() + interval '30 days',
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_tokens_client_id ON onboarding_tokens (client_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tokens_token     ON onboarding_tokens (token);

-- ── updated_at triggers ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER builds_updated_at
  BEFORE UPDATE ON builds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ─────────────────────────────────────────
-- Service role bypasses RLS by default; anon has no access.

ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds             ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_tokens  ENABLE ROW LEVEL SECURITY;

-- Block anon access to all new tables
CREATE POLICY "no_anon_subscriptions"
  ON subscriptions FOR ALL TO anon USING (false);

CREATE POLICY "no_anon_builds"
  ON builds FOR ALL TO anon USING (false);

CREATE POLICY "no_anon_onboarding_tokens"
  ON onboarding_tokens FOR ALL TO anon USING (false);
