-- A clip reaches approved, and a post reaches a posting status, only when
-- the latest operator decision and the latest client decision are both approve.

DO $$
DECLARE
  s record;
  lone uuid := gen_random_uuid();
  batch_id uuid;
  link_id uuid;
  n integer;
BEGIN
  SELECT * INTO s FROM evv_test_seed();

  INSERT INTO batches (id, client_id, source_asset_id)
  VALUES (gen_random_uuid(), s.client_id, s.asset_id)
  RETURNING id INTO batch_id;
  INSERT INTO clips (id, batch_id, status, qa_run)
  VALUES (lone, batch_id, 'needs_review', 1);
  INSERT INTO qa_results (clip_id, qa_run, check_code, blocking, status)
  VALUES (lone, 1, 'B1', true, 'pass');

  INSERT INTO approvals (clip_id, decision, decided_by, actor_role)
  VALUES (lone, 'approve', s.operator_id, 'operator');

  BEGIN
    UPDATE clips SET status = 'approved' WHERE id = lone;
    RAISE EXCEPTION 'expected approved-without-client failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%clip cannot reach approved without operator and client approval%' THEN
      RAISE;
    END IF;
  END;

  BEGIN
    INSERT INTO posts (clip_id, status) VALUES (lone, 'queued');
    RAISE EXCEPTION 'expected posting without client approval';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: clip is not approved%'
       AND SQLERRM NOT LIKE '%post gate: client approval is required%' THEN
      RAISE;
    END IF;
  END;

  -- Client approval alone cannot open the posting state either.
  UPDATE approvals SET decision = 'reject', reason = 'withdrawn', actor_role = 'operator'
  WHERE clip_id = lone AND actor_role = 'operator';
  INSERT INTO approval_links (id, client_id, batch_id, token_hash, expires_at)
  VALUES (gen_random_uuid(), s.client_id, batch_id, 'lone-' || lone::text, now() + interval '1 day')
  RETURNING id INTO link_id;
  INSERT INTO approvals (clip_id, decision, decided_by, actor_role, link_id)
  VALUES (lone, 'approve', s.member_id, 'client', link_id);
  BEGIN
    UPDATE clips SET status = 'approved' WHERE id = lone;
    RAISE EXCEPTION 'expected approved-without-operator failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%clip cannot reach approved without operator and client approval%' THEN
      RAISE;
    END IF;
  END;

  INSERT INTO approvals (clip_id, decision, decided_by, actor_role, created_at)
  VALUES (lone, 'approve', s.operator_id, 'operator', now() + interval '1 second');
  UPDATE clips SET status = 'approved' WHERE id = lone;
  INSERT INTO posts (clip_id, status) VALUES (lone, 'queued');

  SELECT count(*) INTO n FROM audit_log
  WHERE entity = 'clips' AND entity_id = lone AND action LIKE 'approval.%';
  PERFORM evv_assert(n >= 3, 'each approval writes an audit row');

  INSERT INTO approvals (clip_id, decision, decided_by, actor_role, reason, created_at)
  VALUES (lone, 'reject', s.operator_id, 'operator', 'pull it', now() + interval '2 seconds');
  BEGIN
    INSERT INTO posts (clip_id, status) VALUES (lone, 'scheduled');
    RAISE EXCEPTION 'expected posting without operator approval';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: operator approval is required%' THEN
      RAISE;
    END IF;
  END;

  -- Request-edit without a reason is rejected by the database.
  BEGIN
    INSERT INTO approvals (clip_id, decision, decided_by, actor_role)
    VALUES (lone, 'changes_requested', s.operator_id, 'operator');
    RAISE EXCEPTION 'expected missing reason failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%reject and request-edit require a reason%'
       AND SQLERRM NOT LIKE '%approvals_reason_required%' THEN
      RAISE;
    END IF;
  END;
END $$;
