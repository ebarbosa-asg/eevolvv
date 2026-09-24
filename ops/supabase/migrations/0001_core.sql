-- eevolvv ops schema v1.
-- A reviewed schema may replace this file. Keep the name 0001_core.sql.
-- Invariants enforced here are covered by supabase/tests/*.sql.
--
-- Roles are cluster-wide. Creation is idempotent so a second database
-- on the same Postgres can apply this migration.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evv_member') THEN
    CREATE ROLE evv_member NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evv_operator') THEN
    CREATE ROLE evv_operator NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evv_service') THEN
    CREATE ROLE evv_service NOLOGIN BYPASSRLS;
  END IF;
END $$;

GRANT evv_member TO CURRENT_USER;
GRANT evv_operator TO CURRENT_USER;
GRANT evv_service TO CURRENT_USER;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS evv;

CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  is_internal boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE operators (
  user_id uuid PRIMARY KEY,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE client_members (
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (client_id, user_id),
  CHECK (role IN ('member', 'admin'))
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  plan_code text NOT NULL,
  monthly_amount_cents integer,
  currency text NOT NULL DEFAULT 'usd',
  started_on date NOT NULL,
  ended_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (monthly_amount_cents IS NULL OR monthly_amount_cents >= 0),
  CHECK (ended_on IS NULL OR ended_on >= started_on)
);

CREATE TABLE brand_kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL UNIQUE REFERENCES clients (id) ON DELETE CASCADE,
  accent_hex text NOT NULL DEFAULT '#3DFF8A',
  caption_font text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (accent_hex ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  platform text NOT NULL,
  handle text,
  external_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (platform IN ('youtube', 'instagram', 'tiktok', 'linkedin', 'x', 'facebook'))
);

CREATE TABLE source_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  sha256 text NOT NULL,
  storage_key text NOT NULL,
  filename text,
  duration_ms integer,
  width integer,
  height integer,
  has_video boolean,
  rights_confirmed_at timestamptz,
  rights_confirmed_by uuid,
  purge_after timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, sha256),
  CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  CHECK (
    (rights_confirmed_at IS NULL AND rights_confirmed_by IS NULL)
    OR (rights_confirmed_at IS NOT NULL AND rights_confirmed_by IS NOT NULL)
  ),
  CHECK (duration_ms IS NULL OR duration_ms >= 0)
);

CREATE TABLE transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_asset_id uuid NOT NULL UNIQUE REFERENCES source_assets (id) ON DELETE CASCADE,
  provider text NOT NULL,
  words jsonb NOT NULL,
  sentences jsonb NOT NULL,
  speakers jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  source_asset_id uuid NOT NULL REFERENCES source_assets (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status IN ('open', 'processing', 'ready', 'failed'))
);

CREATE TABLE moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES batches (id) ON DELETE CASCADE,
  start_sentence_id text NOT NULL,
  end_sentence_id text NOT NULL,
  start_ms integer NOT NULL,
  end_ms integer NOT NULL,
  hook_line text NOT NULL,
  hook_archetype text NOT NULL,
  topic text NOT NULL,
  standalone_score numeric NOT NULL,
  rationale text NOT NULL,
  rank_score numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (hook_archetype IN (
    'contrarian', 'number', 'story', 'how_to', 'mistake', 'prediction', 'confession', 'question'
  )),
  CHECK (standalone_score >= 0 AND standalone_score <= 10),
  CHECK (end_ms > start_ms)
);

CREATE TABLE clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES batches (id) ON DELETE CASCADE,
  moment_id uuid REFERENCES moments (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  qa_run integer NOT NULL DEFAULT 0,
  storage_key text,
  thumb_key text,
  phash text,
  duration_ms integer,
  crop_plan jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status IN (
    'draft', 'rendering', 'qa_pending', 'needs_review', 'qa_failed', 'approved', 'rejected'
  )),
  CHECK (qa_run >= 0),
  CHECK (duration_ms IS NULL OR duration_ms >= 0)
);

CREATE TABLE qa_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clip_id uuid NOT NULL REFERENCES clips (id) ON DELETE CASCADE,
  qa_run integer NOT NULL,
  check_code text NOT NULL,
  blocking boolean NOT NULL DEFAULT true,
  status text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (qa_run >= 1),
  CHECK (status IN ('pass', 'fail', 'human', 'skip')),
  UNIQUE (clip_id, qa_run, check_code)
);

CREATE TABLE approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clip_id uuid NOT NULL REFERENCES clips (id) ON DELETE CASCADE,
  decision text NOT NULL,
  decided_by uuid,
  is_auto boolean NOT NULL DEFAULT false,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (decision IN ('approve', 'reject', 'changes_requested'))
);

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clip_id uuid NOT NULL REFERENCES clips (id) ON DELETE CASCADE,
  social_account_id uuid REFERENCES social_accounts (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  platform_post_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status IN (
    'draft', 'queued', 'scheduled', 'publishing', 'published', 'failed', 'canceled'
  ))
);

-- NULL is unknown. Do not default metrics to 0.
CREATE TABLE post_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
  captured_at timestamptz NOT NULL DEFAULT now(),
  views integer,
  likes integer,
  comments integer,
  shares integer,
  watch_time_ms integer,
  CHECK (views IS NULL OR views >= 0),
  CHECK (likes IS NULL OR likes >= 0),
  CHECK (comments IS NULL OR comments >= 0),
  CHECK (shares IS NULL OR shares >= 0),
  CHECK (watch_time_ms IS NULL OR watch_time_ms >= 0)
);

COMMENT ON COLUMN post_metrics.views IS
  'NULL means the measurement is absent. Never coerce a missing metric to 0.';
COMMENT ON COLUMN post_metrics.likes IS
  'NULL means the measurement is absent. Never coerce a missing metric to 0.';
COMMENT ON COLUMN post_metrics.comments IS
  'NULL means the measurement is absent. Never coerce a missing metric to 0.';
COMMENT ON COLUMN post_metrics.shares IS
  'NULL means the measurement is absent. Never coerce a missing metric to 0.';
COMMENT ON COLUMN post_metrics.watch_time_ms IS
  'NULL means the measurement is absent. Never coerce a missing metric to 0.';

CREATE TABLE capture_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE capture_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_link_id uuid NOT NULL REFERENCES capture_links (id) ON DELETE CASCADE,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  brand_safe boolean NOT NULL DEFAULT false,
  brand_safe_set_by uuid REFERENCES operators (user_id),
  brand_safe_set_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status IN ('draft', 'active', 'paused', 'ended')),
  CONSTRAINT campaigns_active_requires_brand_safe CHECK (status <> 'active' OR brand_safe),
  CONSTRAINT campaigns_brand_safe_attribution CHECK (
    (brand_safe = false AND brand_safe_set_by IS NULL AND brand_safe_set_at IS NULL)
    OR (brand_safe = true AND brand_safe_set_by IS NOT NULL AND brand_safe_set_at IS NOT NULL)
  )
);

CREATE TABLE campaign_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns (id) ON DELETE CASCADE,
  clip_id uuid NOT NULL REFERENCES clips (id) ON DELETE CASCADE,
  submitted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, clip_id)
);

CREATE TABLE proof_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  clip_id uuid REFERENCES clips (id) ON DELETE SET NULL,
  post_id uuid REFERENCES posts (id) ON DELETE SET NULL,
  body jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  idempotency_key text NOT NULL UNIQUE,
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  run_after timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  locked_by text,
  heartbeat_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  CHECK (status IN ('pending', 'running', 'succeeded', 'failed', 'dead')),
  CHECK (attempts >= 0),
  CHECK (max_attempts >= 1),
  CHECK (attempts <= max_attempts)
);

CREATE INDEX jobs_claim_idx ON jobs (run_after, created_at, id) WHERE status = 'pending';

CREATE TABLE cost_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients (id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs (id) ON DELETE SET NULL,
  sku text NOT NULL,
  units numeric NOT NULL,
  unit text NOT NULL,
  amount_usd numeric NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  CHECK (units >= 0),
  CHECK (amount_usd >= 0)
);

CREATE TABLE fixed_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients (id) ON DELETE CASCADE,
  label text NOT NULL,
  amount_usd numeric NOT NULL,
  period_month date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (amount_usd >= 0),
  CHECK (period_month = date_trunc('month', period_month)::date)
);

CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  operator_id uuid REFERENCES operators (user_id),
  minutes integer NOT NULL,
  hourly_rate_usd numeric,
  occurred_on date NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (minutes > 0),
  CHECK (hourly_rate_usd IS NULL OR hourly_rate_usd >= 0)
);

CREATE TABLE alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  job_id uuid REFERENCES jobs (id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Helpers (security definer so RLS policies can read membership without
-- recursing through the same policies).
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION evv.is_operator() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM operators WHERE user_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION evv.is_member() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM client_members WHERE user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Post gate
-- queued / scheduled / publishing require:
--   clip approved, source rights attested, latest QA run has no failed
--   blocking check, latest approval decision is approve.
-- published is reachable only from publishing.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_post_status_gate() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clip_status text;
  rights_ok boolean;
  latest_run integer;
  failed_blocking integer;
  latest_decision text;
BEGIN
  IF NEW.status IN ('queued', 'scheduled', 'publishing')
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
    SELECT c.status INTO clip_status FROM clips c WHERE c.id = NEW.clip_id;
    IF clip_status IS DISTINCT FROM 'approved' THEN
      RAISE EXCEPTION 'post gate: clip is not approved';
    END IF;

    SELECT (sa.rights_confirmed_at IS NOT NULL AND sa.rights_confirmed_by IS NOT NULL)
      INTO rights_ok
    FROM clips c
    JOIN batches b ON b.id = c.batch_id
    JOIN source_assets sa ON sa.id = b.source_asset_id
    WHERE c.id = NEW.clip_id;

    IF NOT COALESCE(rights_ok, false) THEN
      RAISE EXCEPTION 'post gate: source rights are not attested';
    END IF;

    SELECT MAX(qr.qa_run) INTO latest_run FROM qa_results qr WHERE qr.clip_id = NEW.clip_id;
    IF latest_run IS NULL THEN
      RAISE EXCEPTION 'post gate: no QA run';
    END IF;

    SELECT COUNT(*) INTO failed_blocking
    FROM qa_results qr
    WHERE qr.clip_id = NEW.clip_id
      AND qr.qa_run = latest_run
      AND qr.blocking
      AND qr.status = 'fail';

    IF failed_blocking > 0 THEN
      RAISE EXCEPTION 'post gate: latest QA run has a failed blocking check';
    END IF;

    SELECT a.decision INTO latest_decision
    FROM approvals a
    WHERE a.clip_id = NEW.clip_id
    ORDER BY a.created_at DESC, a.id DESC
    LIMIT 1;

    IF latest_decision IS DISTINCT FROM 'approve' THEN
      RAISE EXCEPTION 'post gate: latest approval decision is not approve';
    END IF;
  END IF;

  IF NEW.status = 'published'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
    IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'publishing' THEN
      RAISE EXCEPTION 'post gate: published only from publishing';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER posts_status_gate
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_post_status_gate();

-- Members cannot insert is_auto approvals or impersonate decided_by.
-- Operators (auth.uid in operators) and sessions with evv.role=service may.
CREATE OR REPLACE FUNCTION public.prevent_forged_auto_approval() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := auth.uid();
  service boolean := current_setting('evv.role', true) = 'service';
BEGIN
  IF NEW.is_auto THEN
    IF service THEN
      RETURN NEW;
    END IF;
    IF actor IS NULL OR NOT EXISTS (SELECT 1 FROM operators WHERE user_id = actor) THEN
      RAISE EXCEPTION 'members cannot forge auto-approvals';
    END IF;
    RETURN NEW;
  END IF;

  IF NOT service
     AND actor IS NOT NULL
     AND EXISTS (SELECT 1 FROM client_members WHERE user_id = actor)
     AND NOT EXISTS (SELECT 1 FROM operators WHERE user_id = actor)
     AND NEW.decided_by IS DISTINCT FROM actor THEN
    RAISE EXCEPTION 'members cannot forge auto-approvals';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER approvals_no_forge
  BEFORE INSERT OR UPDATE ON approvals
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_forged_auto_approval();

-- brand_safe can be turned on only with an operator attribution, and only
-- while the acting user is that operator (or the service role).
CREATE OR REPLACE FUNCTION public.enforce_brand_safe_human() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := auth.uid();
  service boolean := current_setting('evv.role', true) = 'service';
BEGIN
  IF NEW.brand_safe IS TRUE AND (TG_OP = 'INSERT' OR OLD.brand_safe IS NOT TRUE) THEN
    IF NEW.brand_safe_set_by IS NULL
       OR NOT EXISTS (SELECT 1 FROM operators WHERE user_id = NEW.brand_safe_set_by) THEN
      RAISE EXCEPTION 'brand_safe must be set by a human operator';
    END IF;
    IF NOT service AND (actor IS NULL OR actor IS DISTINCT FROM NEW.brand_safe_set_by
        OR NOT EXISTS (SELECT 1 FROM operators WHERE user_id = actor)) THEN
      RAISE EXCEPTION 'brand_safe must be set by a human operator';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER campaigns_brand_safe_human
  BEFORE INSERT OR UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_brand_safe_human();

CREATE OR REPLACE FUNCTION public.enforce_active_campaign_submission() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  campaign_status text;
BEGIN
  SELECT status INTO campaign_status FROM campaigns WHERE id = NEW.campaign_id;
  IF campaign_status IS DISTINCT FROM 'active' THEN
    RAISE EXCEPTION 'submissions only against active campaigns';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER campaign_submissions_active_only
  BEFORE INSERT OR UPDATE ON campaign_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_active_campaign_submission();

-- ---------------------------------------------------------------------------
-- RLS
-- Ops tables have no member policy: client members cannot read them.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION evv.enable_rls(target regclass) RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', target);
  EXECUTE format('ALTER TABLE %s FORCE ROW LEVEL SECURITY', target);
  EXECUTE format(
    'CREATE POLICY %I ON %s FOR ALL TO evv_operator USING (evv.is_operator()) WITH CHECK (evv.is_operator())',
    target::text || '_operator_all',
    target
  );
END;
$$;

SELECT evv.enable_rls('clients');
SELECT evv.enable_rls('operators');
SELECT evv.enable_rls('client_members');
SELECT evv.enable_rls('subscriptions');
SELECT evv.enable_rls('brand_kits');
SELECT evv.enable_rls('social_accounts');
SELECT evv.enable_rls('source_assets');
SELECT evv.enable_rls('transcripts');
SELECT evv.enable_rls('batches');
SELECT evv.enable_rls('moments');
SELECT evv.enable_rls('clips');
SELECT evv.enable_rls('qa_results');
SELECT evv.enable_rls('approvals');
SELECT evv.enable_rls('posts');
SELECT evv.enable_rls('post_metrics');
SELECT evv.enable_rls('capture_links');
SELECT evv.enable_rls('capture_events');
SELECT evv.enable_rls('campaigns');
SELECT evv.enable_rls('campaign_submissions');
SELECT evv.enable_rls('proof_snapshots');
SELECT evv.enable_rls('jobs');
SELECT evv.enable_rls('cost_events');
SELECT evv.enable_rls('fixed_costs');
SELECT evv.enable_rls('time_entries');
SELECT evv.enable_rls('alerts');
SELECT evv.enable_rls('audit_log');

CREATE POLICY clients_member_select ON clients
  FOR SELECT TO evv_member
  USING (id IN (SELECT client_id FROM client_members WHERE user_id = auth.uid()));

CREATE POLICY client_members_member_select ON client_members
  FOR SELECT TO evv_member
  USING (user_id = auth.uid());

CREATE POLICY batches_member_select ON batches
  FOR SELECT TO evv_member
  USING (client_id IN (SELECT client_id FROM client_members WHERE user_id = auth.uid()));

CREATE POLICY clips_member_select ON clips
  FOR SELECT TO evv_member
  USING (
    EXISTS (
      SELECT 1
      FROM batches b
      JOIN client_members m ON m.client_id = b.client_id AND m.user_id = auth.uid()
      WHERE b.id = clips.batch_id
    )
  );

CREATE POLICY approvals_member_select ON approvals
  FOR SELECT TO evv_member
  USING (
    EXISTS (
      SELECT 1
      FROM clips c
      JOIN batches b ON b.id = c.batch_id
      JOIN client_members m ON m.client_id = b.client_id AND m.user_id = auth.uid()
      WHERE c.id = approvals.clip_id
    )
  );

CREATE POLICY approvals_member_insert ON approvals
  FOR INSERT TO evv_member
  WITH CHECK (
    is_auto = false
    AND decided_by = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM clips c
      JOIN batches b ON b.id = c.batch_id
      JOIN client_members m ON m.client_id = b.client_id AND m.user_id = auth.uid()
      WHERE c.id = approvals.clip_id
    )
  );

GRANT USAGE ON SCHEMA public, auth, evv TO evv_member, evv_operator, evv_service;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public
  TO evv_member, evv_operator, evv_service;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public
  TO evv_member, evv_operator, evv_service;
GRANT EXECUTE ON FUNCTION auth.uid() TO evv_member, evv_operator, evv_service;
