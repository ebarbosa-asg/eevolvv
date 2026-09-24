-- Operator and client approval, magic links, and proof view fields.
-- Posting still cannot skip the gate in 0001. This migration adds the
-- second human gate: operator approval and client approval are both required.

CREATE TABLE approval_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  batch_id uuid NOT NULL REFERENCES batches (id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE approvals
  ADD COLUMN actor_role text,
  ADD COLUMN link_id uuid REFERENCES approval_links (id);

UPDATE approvals AS a
SET actor_role = CASE
  WHEN EXISTS (SELECT 1 FROM operators o WHERE o.user_id = a.decided_by) THEN 'operator'
  ELSE 'client'
END
WHERE a.actor_role IS NULL;

ALTER TABLE approvals
  ALTER COLUMN actor_role SET NOT NULL;

ALTER TABLE approvals
  ADD CONSTRAINT approvals_actor_role_check CHECK (actor_role IN ('operator', 'client'));

ALTER TABLE clips
  ADD COLUMN metadata jsonb;

ALTER TABLE approvals
  ADD CONSTRAINT approvals_reason_required CHECK (
    decision = 'approve' OR (reason IS NOT NULL AND length(btrim(reason)) > 0)
  );

-- Latest decision for one actor role. NULL when that role has not decided.
CREATE OR REPLACE FUNCTION evv.latest_decision(target uuid, role text) RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT decision
  FROM approvals
  WHERE clip_id = target AND actor_role = role
  ORDER BY created_at DESC, id DESC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.enforce_post_status_gate() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clip_status text;
  rights_ok boolean;
  latest_run integer;
  failed_blocking integer;
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

    IF evv.latest_decision(NEW.clip_id, 'operator') IS DISTINCT FROM 'approve' THEN
      RAISE EXCEPTION 'post gate: operator approval is required';
    END IF;

    IF evv.latest_decision(NEW.clip_id, 'client') IS DISTINCT FROM 'approve' THEN
      RAISE EXCEPTION 'post gate: client approval is required';
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

CREATE OR REPLACE FUNCTION public.enforce_clip_approved_gate() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    IF evv.latest_decision(NEW.id, 'operator') IS DISTINCT FROM 'approve'
       OR evv.latest_decision(NEW.id, 'client') IS DISTINCT FROM 'approve' THEN
      RAISE EXCEPTION 'clip cannot reach approved without operator and client approval';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER clips_approved_gate
  BEFORE INSERT OR UPDATE ON clips
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_clip_approved_gate();

CREATE OR REPLACE FUNCTION public.enforce_approval_link() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  link approval_links%ROWTYPE;
  clip_batch uuid;
  batch_client uuid;
BEGIN
  IF NEW.decision IN ('reject', 'changes_requested')
     AND (NEW.reason IS NULL OR length(btrim(NEW.reason)) = 0) THEN
    RAISE EXCEPTION 'reject and request-edit require a reason';
  END IF;

  IF NEW.actor_role = 'operator' THEN
    IF NEW.decided_by IS NULL
       OR NOT EXISTS (SELECT 1 FROM operators WHERE user_id = NEW.decided_by) THEN
      RAISE EXCEPTION 'operator approval requires an operator';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.link_id IS NULL THEN
    RAISE EXCEPTION 'client approval requires a magic link';
  END IF;

  SELECT * INTO link FROM approval_links WHERE id = NEW.link_id FOR UPDATE;
  IF NOT FOUND OR link.used_at IS NOT NULL OR link.expires_at <= now() THEN
    RAISE EXCEPTION 'magic link is expired, used, or does not match this clip';
  END IF;

  SELECT batch_id INTO clip_batch FROM clips WHERE id = NEW.clip_id;
  SELECT client_id INTO batch_client FROM batches WHERE id = clip_batch;
  IF link.batch_id IS DISTINCT FROM clip_batch OR link.client_id IS DISTINCT FROM batch_client THEN
    RAISE EXCEPTION 'magic link is expired, used, or does not match this clip';
  END IF;

  RETURN NEW;
END;
$$;

-- Marks a link used after the batch decision is stored. A later approval
-- with the same link fails. Call this in the same transaction as the inserts.
CREATE OR REPLACE FUNCTION evv.consume_approval_link(link_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated uuid;
BEGIN
  UPDATE approval_links
  SET used_at = now()
  WHERE id = link_id AND used_at IS NULL AND expires_at > now()
  RETURNING id INTO updated;
  IF updated IS NULL THEN
    RAISE EXCEPTION 'magic link is expired, used, or does not match this clip';
  END IF;
END;
$$;

CREATE TRIGGER approvals_require_link
  BEFORE INSERT OR UPDATE ON approvals
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_approval_link();

CREATE OR REPLACE FUNCTION public.audit_approval() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO audit_log (actor_id, action, entity, entity_id, payload)
  VALUES (
    NEW.decided_by,
    'approval.' || NEW.decision,
    'clips',
    NEW.clip_id,
    jsonb_build_object(
      'actor_role', NEW.actor_role,
      'reason', NEW.reason,
      'link_id', NEW.link_id
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER approvals_audit
  AFTER INSERT ON approvals
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_approval();

SELECT evv.enable_rls('approval_links');

GRANT SELECT, INSERT, UPDATE, DELETE ON approval_links TO evv_member, evv_operator, evv_service;
GRANT EXECUTE ON FUNCTION evv.latest_decision(uuid, text) TO evv_member, evv_operator, evv_service;
GRANT EXECUTE ON FUNCTION evv.consume_approval_link(uuid) TO evv_member, evv_operator, evv_service;

DROP VIEW v_proof_clipping;
CREATE VIEW v_proof_clipping AS
SELECT
  b.client_id,
  c.id AS clip_id,
  c.status AS clip_status,
  p.id AS post_id,
  p.status AS post_status,
  p.published_at,
  p.platform_post_id,
  ps.id AS proof_snapshot_id,
  ps.created_at AS proof_captured_at,
  pm.views,
  pm.likes,
  pm.comments,
  pm.shares,
  pm.watch_time_ms,
  pm.captured_at AS metrics_captured_at
FROM clips c
JOIN batches b ON b.id = c.batch_id
LEFT JOIN posts p ON p.clip_id = c.id
LEFT JOIN proof_snapshots ps
  ON ps.clip_id = c.id
 AND (ps.post_id IS NULL OR p.id IS NULL OR ps.post_id = p.id)
LEFT JOIN LATERAL (
  SELECT m.views, m.likes, m.comments, m.shares, m.watch_time_ms, m.captured_at
  FROM post_metrics m
  WHERE m.post_id = p.id
  ORDER BY m.captured_at DESC, m.id DESC
  LIMIT 1
) pm ON TRUE;

COMMENT ON VIEW v_proof_clipping IS
  'Client-facing clipping proof. Metric columns stay NULL until a measurement is stored. platform_post_id is the provider id recorded at publish time.';
