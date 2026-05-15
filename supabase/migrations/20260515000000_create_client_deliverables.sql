-- § client deliverables
-- Product fulfillment layer for client agent pages and Ghost Locker.
-- Every paid item, request, and recommendation can become a visible deliverable.

CREATE TABLE IF NOT EXISTS client_deliverables (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        UUID REFERENCES clients(id) ON DELETE CASCADE,
  client_slug      TEXT NOT NULL,
  key              TEXT NOT NULL,
  type             TEXT NOT NULL DEFAULT 'request'
                   CHECK (type IN ('agent', 'automation', 'website', 'sco', 'ads', 'dashboard', 'report', 'request')),
  title            TEXT NOT NULL,
  price            TEXT,
  status           TEXT NOT NULL DEFAULT 'queued'
                   CHECK (status IN ('recommended', 'paid', 'intake', 'queued', 'building', 'review', 'live')),
  promise          TEXT NOT NULL,
  scope            TEXT[] NOT NULL DEFAULT '{}',
  proof            TEXT[] NOT NULL DEFAULT '{}',
  delivery_window  TEXT NOT NULL DEFAULT 'Queued for eevolvv review',
  checkout_url     TEXT,
  source           TEXT DEFAULT 'manual'
                   CHECK (source IN ('plan', 'addon', 'request', 'manual')),
  owner            TEXT DEFAULT 'eevolvv',
  visible_to_client BOOLEAN NOT NULL DEFAULT TRUE,
  linked_task_id   UUID REFERENCES service_tasks(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS client_deliverables_client_idx ON client_deliverables(client_id);
CREATE INDEX IF NOT EXISTS client_deliverables_slug_idx ON client_deliverables(client_slug);
CREATE INDEX IF NOT EXISTS client_deliverables_status_idx ON client_deliverables(status);
CREATE INDEX IF NOT EXISTS client_deliverables_created_idx ON client_deliverables(created_at DESC);

ALTER TABLE client_deliverables ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'client_deliverables' AND policyname = 'service_only'
  ) THEN
    CREATE POLICY "service_only" ON client_deliverables FOR ALL TO service_role USING (true);
  END IF;
END $$;
