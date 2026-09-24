-- sha256 is unique per client. post_metrics have no zero default; NULL stays NULL.

DO $$
DECLARE
  s record;
  other_client uuid := gen_random_uuid();
  post_id uuid;
  views_default text;
  views_value integer;
BEGIN
  SELECT * INTO s FROM evv_test_seed();

  BEGIN
    INSERT INTO source_assets (client_id, sha256, storage_key)
    VALUES (s.client_id, repeat('ab', 32), 'sources/dup');
    RAISE EXCEPTION 'expected sha256 dedupe failure';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  INSERT INTO clients (id, name) VALUES (other_client, 'other');
  INSERT INTO source_assets (client_id, sha256, storage_key)
  VALUES (other_client, repeat('ab', 32), 'sources/other');

  INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'draft') RETURNING id INTO post_id;
  INSERT INTO post_metrics (post_id) VALUES (post_id) RETURNING views INTO views_value;
  PERFORM evv_assert(views_value IS NULL, 'missing views measurement is NULL');

  SELECT column_default INTO views_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'post_metrics'
    AND column_name = 'views';
  PERFORM evv_assert(views_default IS NULL, 'views has no default');

  SELECT column_default INTO views_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'post_metrics'
    AND column_name = 'likes';
  PERFORM evv_assert(views_default IS NULL, 'likes has no default');
END $$;
