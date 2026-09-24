-- Test helpers. Not part of the schema migrations.

CREATE OR REPLACE FUNCTION evv_assert(cond boolean, msg text) RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT COALESCE(cond, false) THEN
    RAISE EXCEPTION 'assertion failed: %', msg;
  END IF;
END;
$$;

-- Builds a clip that satisfies the post gate. Tests then break one condition.
CREATE OR REPLACE FUNCTION evv_test_seed()
RETURNS TABLE (
  client_id uuid,
  asset_id uuid,
  batch_id uuid,
  clip_id uuid,
  operator_id uuid,
  member_id uuid
)
LANGUAGE plpgsql AS $$
DECLARE
  v_client uuid := gen_random_uuid();
  v_asset uuid := gen_random_uuid();
  v_batch uuid := gen_random_uuid();
  v_moment uuid := gen_random_uuid();
  v_clip uuid := gen_random_uuid();
  v_operator uuid := gen_random_uuid();
  v_member uuid := gen_random_uuid();
BEGIN
  INSERT INTO operators (user_id, email) VALUES (v_operator, 'op@example.com');
  INSERT INTO clients (id, name, slug, is_internal)
  VALUES (v_client, 'seed client', 'seed-' || left(v_client::text, 8), false);
  INSERT INTO client_members (client_id, user_id, role) VALUES (v_client, v_member, 'member');
  INSERT INTO source_assets (
    id, client_id, sha256, storage_key, filename, duration_ms, width, height, has_video,
    rights_confirmed_at, rights_confirmed_by
  ) VALUES (
    v_asset, v_client, repeat('ab', 32), 'sources/seed', 'seed.mp4', 60000, 1920, 1080, true,
    now(), v_member
  );
  INSERT INTO batches (id, client_id, source_asset_id, status)
  VALUES (v_batch, v_client, v_asset, 'ready');
  INSERT INTO moments (
    id, batch_id, start_sentence_id, end_sentence_id, start_ms, end_ms,
    hook_line, hook_archetype, topic, standalone_score, rationale, rank_score
  ) VALUES (
    v_moment, v_batch, 's0001', 's0004', 1000, 25000,
    'Start here', 'how_to', 'process', 8, 'fixture', 0.8
  );
  INSERT INTO clips (id, batch_id, moment_id, status, qa_run, duration_ms)
  VALUES (v_clip, v_batch, v_moment, 'approved', 1, 24000);
  INSERT INTO qa_results (clip_id, qa_run, check_code, blocking, status)
  VALUES (v_clip, 1, 'B1', true, 'pass');
  INSERT INTO approvals (clip_id, decision, decided_by, is_auto, created_at)
  VALUES (v_clip, 'approve', v_member, false, now());

  client_id := v_client;
  asset_id := v_asset;
  batch_id := v_batch;
  clip_id := v_clip;
  operator_id := v_operator;
  member_id := v_member;
  RETURN NEXT;
END;
$$;
