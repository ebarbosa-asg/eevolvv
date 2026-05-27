# Growth Experiment 001: Google Ads → Free Diagnostic Funnel

**Date:** 2026-05-21
**Status:** Proposed

---

## Hypothesis

Small business owners actively searching for operational tools will complete eevolvv's free diagnostic report when the ad copy speaks directly to their pain point (scattered operations, manual workflows, lost leads) and the landing page removes all friction.

**Null hypothesis:** No statistically significant difference in diagnostic starts between organic traffic and paid-search traffic within a 2-week test window at $20/day spend.

---

## Target Audience

- **Primary:** Small business owners / operators within a 50-mile radius of a test metro (recommended: Austin, TX or Denver, CO — high density of service-based SMBs)
- **Business types with highest fit:** Law firms, dental practices, med spas, contractors, real estate teams, gyms, agencies
- **Search intent:** Active problem-solving ("small business CRM," "automation tools for contractors," "workflow software for dental practice," "business website builder")
- **Estimated search volume:** ~2,500–5,000 combined monthly impressions in test metro at top-3 bid

**Why this audience:** The homepage already targets these exact verticals (flap display cycles through "LAW FIRM," "GYM," "RESTAURANT," "DENTAL PRACTICE," "CONTRACTOR," etc.). Running ads against the same verticals validates whether this messaging actually converts or only resonates as a landing page talking point.

---

## Offer

**Free AI Business Diagnostic Report** (no signup, instant delivery, 10-minute completion)

- Maps to existing `/diagnostic` route — no new engineering required
- Delivers: workflow score, top automation opportunity, rough ROI estimate, and recommended next step
- Post-report upsell: $97 Roadmap upgrade (build-order doc with workflow, tools, ROI, ship sequence)
- No credit card, no email gating at the diagnostic step itself (the form on /diagnostic collects name + phone for report delivery)

---

## Channel

**Google Ads (Search Campaign)** — Single ad group, exact-match keywords, small daily budget.

**Recommended setup:**

| Parameter | Value |
|-----------|-------|
| Daily budget | $20 (test-phase) |
| Bidding | Maximize Clicks (conversion tracking will optimize after ~30 events) |
| Ad type | Responsive Search Ads (RSAs) |
| Landing page | `eevolvv.com/diagnostic?utm_source=google&utm_medium=cpc&utm_campaign=growth-001` |
| Conversion tracking | PostHog CTA event `diagnostic_form_initiated` (already instrumented per prior work) |
| Tracking mode | UTM params + PostHog event property `source=google-ads` |
| Location | 50-mile radius around test metro (exclude surrounding cities that dilute signal) |
| Schedule | 8am–8pm M–F (aligns with SMB decision-maker hours) |
| Negative keywords | "free," "template," "download," "excel" (avoid cost on non-purchase intent) |

**Keyword clusters (exact match, 10–15 total):**

```
[business automation software]
[small business workflow tool]
[ai for contractors business]
[automation for law firms]
[dental practice crm]
[med spa management software]
[real estate team crm]
[gym management software]
[small business website builder]
[local business automation]
```

---

## Copy Angle

**Theme:** "Your business can run itself — start with a free diagnostic."

| Headline (max 30) | Description (max 90) |
|---|---|
| Your [Business Type] Could Run Itself | Stop juggling spreadsheets, email chains, and sticky notes. Free AI diagnostic shows exactly what's leaking time and money. |
| Stop Losing Leads to Chaos | Missed emails? Double-booked calls? A free scan finds your operational weak spots in 10 minutes. |
| Free AI Business Diagnostic | Built for [Business Type]. No signup required. Instant report on where you can automate. |
| Your Operations Score Is Ready | A free 10-minute scan reveals what's making your [Business Type] inefficient — and how to fix it. |

**Tone:** Direct, benefit-first, slightly technical (AI/diagnostic/automation) while staying grounded in daily SMB reality (sticky notes, spreadsheets, missed calls).

---

## Success Metric

**Primary:** Cost per diagnostic started (ad spend ÷ diagnostic_form_initiated events with `source=google-ads`)

**Target:** < $15 per diagnostic start

| Tier | Interpretation | Action |
|------|---------------|--------|
| < $10 | Strong | Increase budget to $50/day, expand geo |
| $10–$20 | Acceptable | Run full 2-week test, optimize underperforming keywords |
| $20–$30 | Weak | Revise copy angles, tighten keyword list, check landing page friction |
| > $30 | Failing | Pause; hypothesis disproven for paid search channel |

**Secondary metrics:**
- Diagnostic completion rate (starts → completed report delivered)
- Roadmap upsell clicks among paid-search cohort (post-diagnostic /api/stripe/checkout link)
- Average time-on-page for ad-attributed sessions on /diagnostic

---

## Budget

| Item | Cost |
|------|------|
| Google Ads (14 days × $20/day) | $280 |
| Total experiment cost | $280 |

This is a low-cost, high-signal test. $280 buys sufficient data to confirm or reject the paid search hypothesis for this audience.

---

## Timeline

| Day | Action |
|-----|--------|
| 0 | Set up Google Ads campaign, create RSAs, configure PostHog conversion tracking |
| 1–7 | Run ad group at $20/day, collect data |
| 7 | Mid-point check: if CPC > $8 or no conversions by day 7, pause and revise |
| 14 | End of test — analyze results against thresholds above |

---

## Risks / Failure Modes

1. **Search volume too low in test metro.** Mitigation: test a second metro (Denver, CO) before calling the experiment dead.
2. **Diagnostic form friction kills conversions.** Mitigation: verify phone-only required field isn't a blocker (add email-only fallback if needed).
3. **Attribution noise from organic diagnostic traffic.** Mitigation: PostHog UTM-scoped event property — filter by `source=google-ads` for primary metric; compare to baseline organic rate.
4. **Competitor bidding drives CPC too high.** Mitigation: if avg CPC > $8 after 3 days, switch to more niche keywords (e.g., "dental office crm" instead of "small business crm").
5. **Ad disapproval due to "Free" in headlines.** Google sometimes disapproves "free" in ad copy. Mitigation: use "diagnostic" or "scan" instead of "free diagnostic" in headlines and save price messaging for descriptions.