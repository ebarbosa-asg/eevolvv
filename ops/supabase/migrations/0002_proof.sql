-- Proof and margin views. Depends on 0001_core.sql.
-- Absent money is NULL. margin_usd is NULL when revenue was not recorded.
-- Cost columns stay NULL when that category has no rows; they are not
-- stored as zero. The margin expression only subtracts categories that
-- were actually recorded, and only when revenue_usd is known.

CREATE VIEW v_client_month_margin AS
WITH revenue AS (
  SELECT
    s.client_id,
    date_trunc('month', gs)::date AS month,
    SUM(s.monthly_amount_cents)::numeric / 100 AS revenue_usd
  FROM subscriptions s
  JOIN LATERAL generate_series(
    date_trunc('month', s.started_on::timestamp),
    date_trunc('month', COALESCE(s.ended_on, CURRENT_DATE)::timestamp),
    interval '1 month'
  ) AS gs ON TRUE
  WHERE s.monthly_amount_cents IS NOT NULL
  GROUP BY s.client_id, date_trunc('month', gs)::date
),
variable AS (
  SELECT
    client_id,
    date_trunc('month', occurred_at)::date AS month,
    SUM(amount_usd) AS variable_cost_usd
  FROM cost_events
  WHERE client_id IS NOT NULL
  GROUP BY 1, 2
),
fixed AS (
  SELECT
    client_id,
    date_trunc('month', period_month)::date AS month,
    SUM(amount_usd) AS fixed_cost_usd
  FROM fixed_costs
  WHERE client_id IS NOT NULL
  GROUP BY 1, 2
),
labor AS (
  SELECT
    client_id,
    date_trunc('month', occurred_on)::date AS month,
    SUM((minutes::numeric / 60) * hourly_rate_usd) AS labor_cost_usd
  FROM time_entries
  WHERE client_id IS NOT NULL
    AND hourly_rate_usd IS NOT NULL
  GROUP BY 1, 2
),
keys AS (
  SELECT client_id, month FROM revenue
  UNION
  SELECT client_id, month FROM variable
  UNION
  SELECT client_id, month FROM fixed
  UNION
  SELECT client_id, month FROM labor
)
SELECT
  k.client_id,
  k.month,
  r.revenue_usd,
  v.variable_cost_usd,
  f.fixed_cost_usd,
  l.labor_cost_usd,
  CASE
    WHEN r.revenue_usd IS NULL THEN NULL
    ELSE r.revenue_usd
      - COALESCE(v.variable_cost_usd, 0)
      - COALESCE(f.fixed_cost_usd, 0)
      - COALESCE(l.labor_cost_usd, 0)
  END AS margin_usd
FROM keys k
LEFT JOIN revenue r ON r.client_id = k.client_id AND r.month = k.month
LEFT JOIN variable v ON v.client_id = k.client_id AND v.month = k.month
LEFT JOIN fixed f ON f.client_id = k.client_id AND f.month = k.month
LEFT JOIN labor l ON l.client_id = k.client_id AND l.month = k.month;

COMMENT ON VIEW v_client_month_margin IS
  'Per client, per month. margin_usd is NULL when no subscription amount was recorded. Metric absence is not a zero.';

-- Latest post_metrics values are left NULL when no measurement exists.
CREATE VIEW v_proof_clipping AS
SELECT
  b.client_id,
  c.id AS clip_id,
  c.status AS clip_status,
  p.id AS post_id,
  p.status AS post_status,
  p.published_at,
  ps.id AS proof_snapshot_id,
  ps.created_at AS proof_captured_at,
  pm.views,
  pm.likes,
  pm.comments,
  pm.shares,
  pm.watch_time_ms
FROM clips c
JOIN batches b ON b.id = c.batch_id
LEFT JOIN posts p ON p.clip_id = c.id
LEFT JOIN proof_snapshots ps
  ON ps.clip_id = c.id
 AND (ps.post_id IS NULL OR p.id IS NULL OR ps.post_id = p.id)
LEFT JOIN LATERAL (
  SELECT m.views, m.likes, m.comments, m.shares, m.watch_time_ms
  FROM post_metrics m
  WHERE m.post_id = p.id
  ORDER BY m.captured_at DESC, m.id DESC
  LIMIT 1
) pm ON TRUE;

COMMENT ON VIEW v_proof_clipping IS
  'Client-facing clipping proof. views/likes/comments/shares/watch_time_ms stay NULL until a measurement is stored.';
