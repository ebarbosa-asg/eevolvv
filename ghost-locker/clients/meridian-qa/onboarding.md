# ONBOARDING — meridian-qa
> Phase 1 · Post-payment scope contract · Completed 2026-04-12

---

## 1. Client Profile

| Field | Value |
|-------|-------|
| Company | Meridian Manufacturing Group |
| Industry | Specialty auto parts manufacturing |
| Size | 280 employees, 3 production facilities |
| Revenue | ~$8M ARR |
| Contact | Rachel Chen, VP of Quality |
| Email | r.chen@meridianmfg.com |
| Tier | Core SMB — $299/mo |
| Payment | Stripe — cleared 2026-04-11 |

---

## 2. Evolution Report Summary

Meridian completed the diagnostic on 2026-04-08. Score: 61/100.

Top-ranked automation opportunity (Node 4 — Operations):

> "QA defect logging is performed manually by 3 inspectors across 2 shifts. Each inspector spends approximately 5 hours per week transcribing defect codes from physical inspection sheets into a shared Excel workbook. The workbook is emailed to the shift supervisor each morning. No automated outlier detection. Defects that exceed threshold are not flagged in real time."

**Ghost work identified:** 15 hrs/week across 3 inspectors + 1 supervisor reviewing. Total loaded cost estimate: ~$28,000/year.

---

## 3. Scope Agreement

**Agent name:** QA Defect Reporter  
**Objective:** Eliminate manual defect log transcription. Auto-generate daily defect summary reports. Flag statistical outliers automatically.

**In scope:**
- Ingest defect data from Meridian's production database (PostgreSQL, read-only access)
- Generate nightly defect summary report per production line
- Flag any defect rate exceeding 3-sigma threshold
- Email report to shift supervisors by 6:00am daily
- Store run history in eevolvv agent_runs table

**Out of scope:**
- Writing back to production database
- Real-time alerting (Phase 2 consideration)
- Integration with Meridian's ERP (SAP) — deferred

**Pilot period:** 30 days. If agent runs 28/30 nights without failure, engagement continues.

---

## 4. Access & Integrations

| System | Access Type | Status |
|--------|-------------|--------|
| Meridian production DB (read) | PostgreSQL connection string | Provided |
| Resend (email delivery) | eevolvv shared account | Ready |
| eevolvv Supabase (run logs) | Service role key | Ready |

---

## 5. Delivery Timeline

| Milestone | Target | Actual |
|-----------|--------|--------|
| Onboarding complete | 2026-04-12 | 2026-04-12 ✓ |
| Blueprint approved | 2026-04-14 | 2026-04-13 ✓ |
| Build complete | 2026-04-18 | 2026-04-17 ✓ |
| Eval passed | 2026-04-21 | 2026-04-20 ✓ |
| Agent live | 2026-04-22 | 2026-04-22 ✓ |

---

## 6. Client Expectations

- Rachel wants a PDF summary report format, not plain text
- Supervisors check email at 5:45am — 6:00am delivery window is firm
- Must handle missing data gracefully (not all lines run every night)
- Rachel will forward to her CEO if pilot goes well → upsell opportunity

---

## 7. Risk Flags

- Production DB has no staging mirror — must test against a data snapshot
- Defect code taxonomy has 140 codes — agent must handle unknown codes gracefully
- Shift schedules vary (some facilities run 2 shifts, one runs 3) — report must adapt

---

## 8. Operator Sign-off

Scope confirmed with Rachel Chen via Zoom call, 2026-04-11.
Payment cleared. Ghost Locker activated.

**Operator:** E (eevolvv)  
**Gate status:** ONBOARD ✓ COMPLETE
