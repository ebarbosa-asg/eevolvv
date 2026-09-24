-- Post reaches queued/scheduled/publishing only when the clip is approved,
-- source rights are attested, the latest QA run has no failed blocking
-- check, and the latest approval decision is approve.

DO $$
DECLARE
  s record;
  other_clip uuid;
BEGIN
  SELECT * INTO s FROM evv_test_seed();

  INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'queued');
  INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'scheduled');
  INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'publishing');

  -- Break: clip not approved.
  UPDATE clips SET status = 'needs_review' WHERE id = s.clip_id;
  BEGIN
    INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'queued');
    RAISE EXCEPTION 'expected clip approval failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: clip is not approved%' THEN
      RAISE;
    END IF;
  END;
  UPDATE clips SET status = 'approved' WHERE id = s.clip_id;

  -- Break: rights cleared.
  UPDATE source_assets
  SET rights_confirmed_at = NULL, rights_confirmed_by = NULL
  WHERE id = s.asset_id;
  BEGIN
    INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'scheduled');
    RAISE EXCEPTION 'expected rights failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: source rights are not attested%' THEN
      RAISE;
    END IF;
  END;
  UPDATE source_assets
  SET rights_confirmed_at = now(), rights_confirmed_by = s.member_id
  WHERE id = s.asset_id;

  -- Break: latest QA run has a failed blocking check. Older pass stays.
  INSERT INTO qa_results (clip_id, qa_run, check_code, blocking, status)
  VALUES (s.clip_id, 2, 'B2', true, 'fail');
  BEGIN
    INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'publishing');
    RAISE EXCEPTION 'expected QA failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: latest QA run has a failed blocking check%' THEN
      RAISE;
    END IF;
  END;
  -- A non-blocking fail does not count, but a blocking pass on the latest run does.
  UPDATE qa_results SET status = 'pass' WHERE clip_id = s.clip_id AND qa_run = 2;

  -- Human status is not a failed blocking check.
  INSERT INTO qa_results (clip_id, qa_run, check_code, blocking, status)
  VALUES (s.clip_id, 2, 'B7', true, 'human');
  INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'queued');

  -- Break: latest approval is not approve.
  INSERT INTO approvals (clip_id, decision, decided_by, is_auto, created_at)
  VALUES (s.clip_id, 'reject', s.member_id, false, now() + interval '1 second');
  BEGIN
    INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'queued');
    RAISE EXCEPTION 'expected approval failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: latest approval decision is not approve%' THEN
      RAISE;
    END IF;
  END;

  -- No QA at all.
  INSERT INTO batches (id, client_id, source_asset_id)
  VALUES (gen_random_uuid(), s.client_id, s.asset_id)
  RETURNING id INTO other_clip;
  INSERT INTO clips (id, batch_id, status, qa_run)
  VALUES (gen_random_uuid(), other_clip, 'approved', 0)
  RETURNING id INTO other_clip;
  BEGIN
    INSERT INTO posts (clip_id, status) VALUES (other_clip, 'queued');
    RAISE EXCEPTION 'expected missing QA failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: no QA run%' THEN
      RAISE;
    END IF;
  END;
END $$;
