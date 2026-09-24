-- Campaigns cannot go active unless brand_safe is true, and brand_safe is
-- set by a human operator. Submissions only against active campaigns.

DO $$
DECLARE
  s record;
  camp uuid;
  paused uuid;
BEGIN
  SELECT * INTO s FROM evv_test_seed();
  PERFORM set_config('evv.role', '', true);
  PERFORM set_config('request.jwt.claim.sub', s.operator_id::text, true);

  INSERT INTO campaigns (client_id, name, status)
  VALUES (s.client_id, 'launch', 'draft')
  RETURNING id INTO camp;

  BEGIN
    UPDATE campaigns SET status = 'active' WHERE id = camp;
    RAISE EXCEPTION 'expected active-without-brand-safe failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%campaigns_active_requires_brand_safe%' THEN
      RAISE;
    END IF;
  END;

  BEGIN
    INSERT INTO campaigns (client_id, name, status, brand_safe)
    VALUES (s.client_id, 'bad', 'active', false);
    RAISE EXCEPTION 'expected insert active without brand_safe failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%campaigns_active_requires_brand_safe%' THEN
      RAISE;
    END IF;
  END;

  -- A member cannot flip brand_safe, even if they name a real operator.
  PERFORM set_config('request.jwt.claim.sub', s.member_id::text, true);
  BEGIN
    UPDATE campaigns
    SET brand_safe = true,
        brand_safe_set_by = s.operator_id,
        brand_safe_set_at = now()
    WHERE id = camp;
    RAISE EXCEPTION 'expected member brand_safe failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%brand_safe must be set by a human operator%' THEN
      RAISE;
    END IF;
  END;

  PERFORM set_config('request.jwt.claim.sub', s.operator_id::text, true);
  UPDATE campaigns
  SET brand_safe = true,
      brand_safe_set_by = s.operator_id,
      brand_safe_set_at = now(),
      status = 'active'
  WHERE id = camp;

  INSERT INTO campaign_submissions (campaign_id, clip_id, submitted_by)
  VALUES (camp, s.clip_id, s.member_id);

  INSERT INTO campaigns (client_id, name, status)
  VALUES (s.client_id, 'paused one', 'paused')
  RETURNING id INTO paused;

  BEGIN
    INSERT INTO campaign_submissions (campaign_id, clip_id, submitted_by)
    VALUES (paused, s.clip_id, s.member_id);
    RAISE EXCEPTION 'expected submission against inactive campaign failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%submissions only against active campaigns%' THEN
      RAISE;
    END IF;
  END;

  UPDATE campaigns SET status = 'paused' WHERE id = camp;
  BEGIN
    INSERT INTO campaign_submissions (campaign_id, clip_id, submitted_by)
    VALUES (camp, s.clip_id, s.operator_id);
    RAISE EXCEPTION 'expected second submission on paused campaign failure';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM NOT LIKE '%submissions only against active campaigns%' THEN
      RAISE;
    END IF;
  END;
END $$;
