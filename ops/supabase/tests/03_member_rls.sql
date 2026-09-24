-- Members cannot forge auto-approvals and cannot read ops tables.

DO $$
DECLARE
  s record;
  n integer;
  ops_table text;
BEGIN
  SELECT * INTO s FROM evv_test_seed();

  PERFORM set_config('request.jwt.claim.sub', s.member_id::text, true);
  PERFORM set_config('evv.role', '', true);

  BEGIN
    INSERT INTO approvals (clip_id, decision, decided_by, is_auto)
    VALUES (s.clip_id, 'approve', s.member_id, true);
    RAISE EXCEPTION 'expected forged auto-approval failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%members cannot forge auto-approvals%' THEN
      RAISE;
    END IF;
  END;

  BEGIN
    INSERT INTO approvals (clip_id, decision, decided_by, is_auto)
    VALUES (s.clip_id, 'approve', s.operator_id, false);
    RAISE EXCEPTION 'expected forged decided_by failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%members cannot forge auto-approvals%' THEN
      RAISE;
    END IF;
  END;

  -- A real member decision is allowed at the trigger. RLS is checked below.
  INSERT INTO approvals (clip_id, decision, decided_by, is_auto)
  VALUES (s.clip_id, 'approve', s.member_id, false);

  -- Operator may record an auto approval.
  PERFORM set_config('request.jwt.claim.sub', s.operator_id::text, true);
  INSERT INTO approvals (clip_id, decision, decided_by, is_auto)
  VALUES (s.clip_id, 'approve', s.operator_id, true);

  -- Ops tables are not readable by a client member.
  INSERT INTO jobs (kind, idempotency_key) VALUES ('transcribe', 'idem-' || s.clip_id::text);
  INSERT INTO alerts (kind, message) VALUES ('job_dead', 'hidden');
  INSERT INTO cost_events (client_id, sku, units, unit, amount_usd)
  VALUES (s.client_id, 'test.sku', 1, 'unit', 1);
  INSERT INTO fixed_costs (client_id, label, amount_usd, period_month)
  VALUES (s.client_id, 'rent', 1, date_trunc('month', CURRENT_DATE)::date);
  INSERT INTO time_entries (client_id, operator_id, minutes, occurred_on)
  VALUES (s.client_id, s.operator_id, 15, CURRENT_DATE);
  INSERT INTO audit_log (actor_id, action, entity) VALUES (s.operator_id, 'test', 'jobs');

  PERFORM set_config('request.jwt.claim.sub', s.member_id::text, true);
  EXECUTE 'SET ROLE evv_member';

  FOREACH ops_table IN ARRAY ARRAY[
    'jobs', 'cost_events', 'fixed_costs', 'time_entries', 'alerts', 'audit_log', 'operators'
  ]
  LOOP
    EXECUTE format('SELECT count(*) FROM %I', ops_table) INTO n;
    IF n <> 0 THEN
      RAISE EXCEPTION 'member read ops table %, count=%', ops_table, n;
    END IF;
  END LOOP;

  -- Their own non-auto approval is visible; the forged ones were rejected.
  SELECT count(*) INTO n FROM approvals WHERE clip_id = s.clip_id AND is_auto = false AND decided_by = s.member_id;
  IF n < 1 THEN
    RAISE EXCEPTION 'member should see their own approval';
  END IF;

  BEGIN
    INSERT INTO approvals (clip_id, decision, decided_by, is_auto)
    VALUES (s.clip_id, 'approve', s.member_id, true);
    RAISE EXCEPTION 'expected member RLS/trigger rejection of auto approval';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%members cannot forge auto-approvals%'
       AND SQLERRM NOT LIKE '%row-level security%' THEN
      RAISE;
    END IF;
  END;

  EXECUTE 'RESET ROLE';
END $$;
