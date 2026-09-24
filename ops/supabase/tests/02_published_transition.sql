-- published is reachable only from publishing.

DO $$
DECLARE
  s record;
  post_id uuid;
BEGIN
  SELECT * INTO s FROM evv_test_seed();

  BEGIN
    INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'published');
    RAISE EXCEPTION 'expected published-from-insert failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: published only from publishing%' THEN
      RAISE;
    END IF;
  END;

  INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'queued') RETURNING id INTO post_id;
  BEGIN
    UPDATE posts SET status = 'published' WHERE id = post_id;
    RAISE EXCEPTION 'expected published-from-queued failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%post gate: published only from publishing%' THEN
      RAISE;
    END IF;
  END;

  UPDATE posts SET status = 'publishing' WHERE id = post_id;
  UPDATE posts SET status = 'published', published_at = now() WHERE id = post_id;
  PERFORM evv_assert(
    (SELECT status = 'published' FROM posts WHERE id = post_id),
    'publishing can become published'
  );
END $$;
