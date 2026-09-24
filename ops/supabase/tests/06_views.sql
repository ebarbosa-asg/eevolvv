-- v_client_month_margin and v_proof_clipping.

DO $$
DECLARE
  s record;
  v_post uuid;
  margin numeric;
  proof_views integer;
  labor_cost numeric;
BEGIN
  SELECT * INTO s FROM evv_test_seed();

  INSERT INTO subscriptions (client_id, plan_code, monthly_amount_cents, started_on)
  VALUES (
    s.client_id,
    'core',
    10000,
    date_trunc('month', CURRENT_DATE)::date
  );

  INSERT INTO cost_events (client_id, sku, units, unit, amount_usd, occurred_at)
  VALUES (s.client_id, 'assemblyai.universal-2.audio_hour', 1, 'audio_hour', 12.50, now());

  SELECT m.margin_usd INTO margin
  FROM v_client_month_margin m
  WHERE m.client_id = s.client_id
    AND m.month = date_trunc('month', CURRENT_DATE)::date;

  PERFORM evv_assert(margin = 87.50, 'margin is revenue minus recorded variable cost');

  -- A time entry with no rate does not invent a labor cost.
  INSERT INTO time_entries (client_id, operator_id, minutes, hourly_rate_usd, occurred_on)
  VALUES (s.client_id, s.operator_id, 30, NULL, CURRENT_DATE);

  SELECT m.labor_cost_usd INTO labor_cost
  FROM v_client_month_margin m
  WHERE m.client_id = s.client_id
    AND m.month = date_trunc('month', CURRENT_DATE)::date;
  PERFORM evv_assert(labor_cost IS NULL, 'unrated time is not a zero labor cost');

  INSERT INTO posts (clip_id, status) VALUES (s.clip_id, 'draft') RETURNING id INTO v_post;
  INSERT INTO post_metrics (post_id) VALUES (v_post);
  INSERT INTO proof_snapshots (client_id, clip_id, post_id, body)
  VALUES (s.client_id, s.clip_id, v_post, '{"kind":"clip"}'::jsonb);

  SELECT v.views INTO proof_views
  FROM v_proof_clipping v
  WHERE v.clip_id = s.clip_id AND v.post_id = v_post;

  PERFORM evv_assert(proof_views IS NULL, 'proof view keeps an unmeasured view count NULL');
END $$;
