-- ============================================================
-- Migration 20260611000001 — Pilot Products + Builds Schema Fixes
-- Fixes builds.stripe_session_id missing column
-- Expands builds.tier constraint to include pilot product tiers
-- Adds product_type tracking to builds and onboarding_tokens
-- ============================================================

-- ── Fix builds table ──────────────────────────────────────────
-- Add stripe_session_id for idempotency checks on one-time purchases
ALTER TABLE builds ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- Add product_type for richer product tracking
ALTER TABLE builds ADD COLUMN IF NOT EXISTS product_type text
  NOT NULL DEFAULT 'subscription'
  CHECK (product_type IN ('subscription', 'first-fix', 'intake-pilot', 'textback-pilot', 'report-roadmap'));

-- Expand tier constraint to include pilot product tiers
-- Drop old constraint (name from migration 006)
ALTER TABLE builds DROP CONSTRAINT IF EXISTS builds_tier_check;
ALTER TABLE builds ADD CONSTRAINT builds_tier_check
  CHECK (tier IN ('seed', 'core', 'evolve', 'first-fix', 'intake-pilot', 'textback-pilot'));

-- ── Fix onboarding_tokens table ───────────────────────────────
-- Add product_type so pilot onboarding asks the right intake questions
ALTER TABLE onboarding_tokens ADD COLUMN IF NOT EXISTS product_type text
  NOT NULL DEFAULT 'subscription'
  CHECK (product_type IN ('subscription', 'first-fix', 'intake-pilot', 'textback-pilot'));

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_builds_stripe_session_id
  ON builds (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_builds_product_type
  ON builds (product_type);

CREATE INDEX IF NOT EXISTS idx_onboarding_tokens_product_type
  ON onboarding_tokens (product_type);

-- ── pilot_subscriptions (for monthly recurring after pilot converts) ──
-- Tracks when a pilot has been converted to a monthly subscription
ALTER TABLE builds ADD COLUMN IF NOT EXISTS converted_at timestamptz;
ALTER TABLE builds ADD COLUMN IF NOT EXISTS converted_to_subscription_id text;
