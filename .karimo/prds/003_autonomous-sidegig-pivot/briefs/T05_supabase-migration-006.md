# Task Brief: Supabase Migration 006

**ID:** T05
**PRD:** autonomous-sidegig-pivot
**Complexity:** 4/5
**Priority:** must
**Model:** sonnet
**Depends on:** none

---

## Objective

Create `supabase/migrations/006_subscriptions_builds.sql` defining the 4 new tables required for the autonomous pipeline: `clients`, `subscriptions`, `builds`, and `onboarding_tokens`. Enable RLS on all tables with service-role-only access. This migration is a blocking dependency for T04, T06, T09, T12, T14, T15, T16, T22.

---

## Context

**Existing migration files (check these before naming yours):**
```
supabase/migrations/001_create_submissions.sql
supabase/migrations/002_create_agent_runs.sql
supabase/migrations/003_add_agent_share_token.sql
supabase/migrations/004_enable_pgvector.sql
supabase/migrations/005_os_pipeline_investors_tasks.sql
```

Your file must be named `006_subscriptions_builds.sql` — the next in sequence.

**Existing `clients` table:** The clients table exists in the production database (created before the tracked migration set — not in any migration file in the repo). It has columns: name, company, email, phone, business_type, contract_value, stage, health, notes, submission_id, created_at, updated_at. Migration 006 extends it with subscription pipeline columns using ALTER TABLE ... ADD COLUMN IF NOT EXISTS.

**IMPORTANT:** Do NOT attempt to CREATE the clients table — it already exists in the database. Only use ALTER TABLE ... ADD COLUMN IF NOT EXISTS to add the new subscription pipeline columns. Read `005_os_pipeline_investors_tasks.sql` to check if any target columns were already added there before writing SQL.

**RLS pattern:** Service role bypasses RLS by default. Apply `USING (false)` for anon role to block public access. Grant full access to `service_role`.

**Supabase extensions available:** `pgcrypto` (for `gen_random_bytes`), `uuid-ossp` (for `gen_random_uuid()`).

---

## Implementation

### Files to Create

- `supabase/migrations/006_subscriptions_builds.sql`

### Files to Modify

None.

### Step-by-Step

1. Read `supabase/migrations/005_os_pipeline_investors_tasks.sql` to check if any of the target subscription columns were already added there. The clients table itself exists in production (pre-migration-set) with columns: name, company, email, phone, business_type, contract_value, stage, health, notes, submission_id, created_at, updated_at. Do NOT create the table — only ALTER TABLE to add missing columns.

2. Create `supabase/migrations/006_subscriptions_builds.sql` with the following structure:

```sql
-- ============================================================
-- Migration 006 — Subscription Pipeline Tables
-- PRD: autonomous-sidegig-pivot
-- Created: 2026-05-06
-- ============================================================

-- ── Enable extensions (if not already enabled) ────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Add subscription columns to existing clients table ────────
-- The clients table exists in the production database (pre-migration-set).
-- Existing columns: name, company, email, phone, business_type, contract_value,
--   stage, health, notes, submission_id, created_at, updated_at.
-- These ALTER TABLE statements add subscription pipeline columns only.
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS email           text,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS tier            text CHECK (tier IN ('seed', 'core', 'evolve')),
  ADD COLUMN IF NOT EXISTS churn_risk      boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_portal_visit_at timestamptz;

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

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds        ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_tokens ENABLE ROW LEVEL SECURITY;

-- Block anon access to all new tables
CREATE POLICY "no_anon_subscriptions"
  ON subscriptions FOR ALL TO anon USING (false);

CREATE POLICY "no_anon_builds"
  ON builds FOR ALL TO anon USING (false);

CREATE POLICY "no_anon_onboarding_tokens"
  ON onboarding_tokens FOR ALL TO anon USING (false);
```

3. Apply migration to Supabase:
   ```bash
   supabase db push
   # or via Supabase dashboard SQL editor
   ```

4. Verify tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('subscriptions', 'builds', 'onboarding_tokens');
   ```

---

## Code Patterns to Follow

```sql
-- UUID primary key pattern (matches existing migrations)
id uuid PRIMARY KEY DEFAULT gen_random_uuid()

-- Soft enum via CHECK constraint
status text NOT NULL DEFAULT 'queued'
  CHECK (status IN ('queued', 'in_progress', ...))

-- Token generation pattern
token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex')

-- RLS block pattern
ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no_anon_tablename" ON tablename FOR ALL TO anon USING (false);
```

---

## Environment Variables

No new env vars needed — uses existing `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

---

## Acceptance Criteria

- [ ] `subscriptions` table created with: `id`, `client_id` (FK→clients), `stripe_subscription_id` (unique), `stripe_price_id`, `status`, `billing_interval`, `current_period_end`, `cancel_at_period_end`, `created_at`, `updated_at`
- [ ] `builds` table created with: `id`, `client_id` (FK→clients), `tier`, `status` (7 values), `assigned_to`, `build_url`, `notes`, `started_at`, `completed_at`, `created_at`, `updated_at`
- [ ] `onboarding_tokens` table created with: `id`, `client_id` (FK→clients), `token` (unique, auto-generated hex), `status`, `responses` (jsonb), `completed_at`, `expires_at`, `created_at`
- [ ] `clients` table has new columns: `email`, `stripe_customer_id`, `tier`, `churn_risk`, `last_portal_visit_at`
- [ ] RLS enabled on all 3 new tables; anon role has no access
- [ ] `updated_at` trigger fires on UPDATE for `subscriptions` and `builds`
- [ ] Migration runs without error on existing Supabase project
- [ ] All indexes created for FK columns and frequently-queried columns

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `subscriptions` table | T04, T06, T14, T15, T18, T19, T20, T21, T22 |
| `builds` table | T06, T09, T13, T15, T16, T17, T21, T22 |
| `onboarding_tokens` table | T06, T09, T15, T19, T20, T22 |
| `clients.stripe_customer_id` column | T06, T18 |
| `clients.churn_risk` column | T22 |
| `clients.last_portal_visit_at` column | T15, T22 |
| `clients.tier` column | T14, T15, T21 |

---

## Do Not

- Do not drop or modify existing tables from migrations 001–005
- Do not create a separate `clients` table if one already exists — extend it with `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- Do not add `authenticated` role policies — service role is used for all server-side operations
- Do not add `NEXT_PUBLIC_` env vars — this is a migration file only
- Do not hardcode any UUIDs or specific IDs
- Migration 007 (T12 followup tracking) and 008 (T22 churn tracking) are separate tasks — do not include their columns here
