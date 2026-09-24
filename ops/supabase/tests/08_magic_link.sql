-- Magic links expire, cannot be reused, and cannot approve another client's clip.
-- A member cannot read another client's clips or links.

DO $$
DECLARE
  s record;
  other_client uuid := gen_random_uuid();
  other_member uuid := gen_random_uuid();
  other_batch uuid := gen_random_uuid();
  other_clip uuid := gen_random_uuid();
  expired uuid := gen_random_uuid();
  reusable uuid := gen_random_uuid();
  n integer;
BEGIN
  SELECT * INTO s FROM evv_test_seed();

  INSERT INTO clients (id, name) VALUES (other_client, 'other client');
  INSERT INTO client_members (client_id, user_id) VALUES (other_client, other_member);
  INSERT INTO source_assets (client_id, sha256, storage_key, has_video, rights_confirmed_at, rights_confirmed_by)
  VALUES (other_client, repeat('cd', 32), 'sources/other', true, now(), other_member);
  INSERT INTO batches (id, client_id, source_asset_id)
  SELECT other_batch, other_client, id FROM source_assets WHERE client_id = other_client;
  INSERT INTO clips (id, batch_id, status) VALUES (other_clip, other_batch, 'needs_review');

  INSERT INTO approval_links (id, client_id, batch_id, token_hash, expires_at)
  VALUES (expired, s.client_id, s.batch_id, 'expired-token', now() - interval '1 minute');
  BEGIN
    INSERT INTO approvals (clip_id, decision, decided_by, actor_role, link_id)
    VALUES (s.clip_id, 'approve', s.member_id, 'client', expired);
    RAISE EXCEPTION 'expected expired link failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%magic link is expired, used, or does not match this clip%' THEN
      RAISE;
    END IF;
  END;

  INSERT INTO approval_links (id, client_id, batch_id, token_hash, expires_at)
  VALUES (reusable, s.client_id, s.batch_id, 'reuse-token', now() + interval '1 day');
  INSERT INTO approvals (clip_id, decision, decided_by, actor_role, link_id)
  VALUES (s.clip_id, 'approve', s.member_id, 'client', reusable);
  PERFORM evv.consume_approval_link(reusable);
  BEGIN
    INSERT INTO approvals (clip_id, decision, decided_by, actor_role, link_id)
    VALUES (s.clip_id, 'approve', s.member_id, 'client', reusable);
    RAISE EXCEPTION 'expected reused link failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%magic link is expired, used, or does not match this clip%' THEN
      RAISE;
    END IF;
  END;

  INSERT INTO approval_links (id, client_id, batch_id, token_hash, expires_at)
  VALUES (gen_random_uuid(), s.client_id, s.batch_id, 'cross-token', now() + interval '1 day')
  RETURNING id INTO reusable;
  BEGIN
    INSERT INTO approvals (clip_id, decision, decided_by, actor_role, link_id)
    VALUES (other_clip, 'approve', s.member_id, 'client', reusable);
    RAISE EXCEPTION 'expected cross-client link failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%magic link is expired, used, or does not match this clip%' THEN
      RAISE;
    END IF;
  END;

  PERFORM set_config('request.jwt.claim.sub', other_member::text, true);
  EXECUTE 'SET ROLE evv_member';
  SELECT count(*) INTO n FROM clips WHERE id = s.clip_id;
  IF n <> 0 THEN
    RAISE EXCEPTION 'member cannot read another client clip';
  END IF;
  SELECT count(*) INTO n FROM approval_links WHERE client_id = s.client_id;
  IF n <> 0 THEN
    RAISE EXCEPTION 'member cannot read another client magic link';
  END IF;
  BEGIN
    INSERT INTO approval_links (client_id, batch_id, token_hash, expires_at)
    VALUES (other_client, other_batch, 'member-insert', now() + interval '1 day');
    RAISE EXCEPTION 'expected member link insert denial';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%row-level security%' THEN
      RAISE;
    END IF;
  END;
  EXECUTE 'RESET ROLE';
END $$;
