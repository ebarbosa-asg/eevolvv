# EVAL TEST CASES — QA Defect Reporter
> meridian-qa · 12 test cases

---

## Test Data

Snapshot of production_db taken 2026-04-15. 7 days of data across 6 production lines.

---

## Test Cases

### TC-01 · Normal night, all lines active
**Input:** Date with 450 defect rows, all 6 lines active, no outliers  
**Expected:** Report sent, 6 lines in summary, 0 outlier flags, status=success  
**Pass criteria:** Email delivered, log_run called with status=success

### TC-02 · Outlier detection — single line above 3σ
**Input:** Date where Line 3 has 89 defects (7-day avg: 41, stddev: 14)  
**Expected:** Line 3 flagged in outlier section, subject includes no special marker (outliers in body only)  
**Pass criteria:** outlier_flags contains Line 3, report includes outlier section

### TC-03 · Multiple outliers
**Input:** Date where Lines 2 and 5 both exceed 3σ threshold  
**Expected:** Both lines flagged, outlier section lists both  
**Pass criteria:** outlier_flags.length === 2

### TC-04 · Zero defects on a line
**Input:** Line 4 has zero defects for the target date  
**Expected:** Line 4 appears in summary with count=0, no error, no skip  
**Pass criteria:** Line 4 row present in report with "0" total

### TC-05 · No defects on any line
**Input:** Date with zero rows in defect_logs  
**Expected:** Report sent with "No defects logged" message, status=success  
**Pass criteria:** Email sent, report body contains zero-defect language, no error thrown

### TC-06 · Unknown defect code
**Input:** Row with defect_code="XR-999" (not in taxonomy)  
**Expected:** Code included as "UNKNOWN-XR-999" in counts, no error  
**Pass criteria:** Report includes unknown code, run completes successfully

### TC-07 · DB connection failure
**Input:** Invalid connection string in env  
**Expected:** fetch_defect_data fails → failure alert sent to hello@eevolvv.com → log_run called with status=failure  
**Pass criteria:** Failure email sent, run logged, no unhandled exception

### TC-08 · Email delivery failure (Resend error)
**Input:** Invalid Resend API key  
**Expected:** Retry once → log failure → run logged with status=failure  
**Pass criteria:** One retry attempted, failure logged, no crash

### TC-09 · Partial data (3 of 6 lines missing)
**Input:** Only Lines 1, 2, 3 have data for target date  
**Expected:** Report covers Lines 1–3, Lines 4–6 show as "No data", status=success  
**Pass criteria:** All 6 lines in report, missing lines noted, no error

### TC-10 · Report format validation
**Input:** Normal night data  
**Expected:** Report HTML contains all required sections (Summary table, Top Defects, footer)  
**Pass criteria:** All 4 required sections present in HTML output

### TC-11 · log_run always called
**Input:** Simulate failure at generate_report step  
**Expected:** log_run still called with status=failure  
**Pass criteria:** agent_runs table has a row for the run even on mid-pipeline failure

### TC-12 · Approved recipients only
**Input:** Attempt to send to an address not in MERIDIAN_SUPERVISOR_EMAILS  
**Expected:** send_email rejects the request, logs error  
**Pass criteria:** Email not sent to unapproved address, error logged
