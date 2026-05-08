-- Migration 008 — Churn tracking safety net
-- These columns were added in 006, but this ensures they exist.
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS churn_risk boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_portal_visit_at timestamptz;

-- Indexes for churn detection queries
CREATE INDEX IF NOT EXISTS idx_clients_churn_risk ON clients (churn_risk) WHERE churn_risk = true;
CREATE INDEX IF NOT EXISTS idx_clients_last_portal ON clients (last_portal_visit_at);
