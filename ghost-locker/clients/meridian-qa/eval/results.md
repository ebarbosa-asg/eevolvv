# EVAL RESULTS — QA Defect Reporter
> meridian-qa · Run 2026-04-20 · Operator: E

---

## Summary

| Metric | Result |
|--------|--------|
| Test cases run | 12 |
| Passed | 11 |
| Failed | 1 |
| Pass rate | **91.7%** ✓ (threshold: ≥80%) |
| Hallucination rate | **0%** ✓ |
| Escalation accuracy | **100%** ✓ (TC-07, TC-08 both escalated correctly) |
| P95 latency | **9.1s** ✓ (client tolerance: 30s) |
| Cost per run | **$0.0006** ✓ (within budget) |
| Failure paths graceful | **Yes** ✓ |

**EVAL STATUS: PASSED ✓**

---

## Per-Test Results

| TC | Name | Result | Notes |
|----|------|--------|-------|
| TC-01 | Normal night | ✓ PASS | |
| TC-02 | Single outlier | ✓ PASS | |
| TC-03 | Multiple outliers | ✓ PASS | |
| TC-04 | Zero defects on line | ✓ PASS | |
| TC-05 | No defects any line | ✓ PASS | "No defects logged tonight" section renders correctly |
| TC-06 | Unknown defect code | ✓ PASS | UNKNOWN-XR-999 appears in top defects |
| TC-07 | DB failure | ✓ PASS | Failure alert sent, run logged |
| TC-08 | Email failure | ✓ PASS | Retry + failure log confirmed |
| TC-09 | Partial data | ✓ PASS | Missing lines shown as "No data" |
| TC-10 | Report format | ✗ FAIL | See note below |
| TC-11 | log_run always | ✓ PASS | |
| TC-12 | Approved recipients | ✓ PASS | |

---

## Failure Analysis

### TC-10 — Report format validation

**Failure:** The "Top Defects by Line" section was missing when a line had zero defects for that night. The section header rendered but the content was blank.

**Root cause:** Defect breakdown loop skipped lines with empty defect arrays instead of rendering a "No defects" row.

**Fix applied:** Updated `generate_report` tool implementation to render "No defects recorded" for lines with zero entries instead of omitting the section.

**Re-test:** TC-10 re-run post-fix → PASS ✓

---

## Sign-off

All 12 test cases pass (post-fix). Eval gate criteria met.

**Operator:** E  
**Date:** 2026-04-20  
**Gate status:** EVAL ✓ COMPLETE — approved for LOCK
