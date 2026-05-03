# Brief Review: os-tasks-agent-builder

## Summary

6 tasks reviewed across 4 waves.
**Critical: 3 | Warnings: 4 | Observations: 5**

---

## Critical Issues

### [CRIT-01] T04 and T05 Brief Headers Declare Wave 1 — tasks.yaml Puts Them in Waves 2 and 3

**Affected:** T04, T05

tasks.yaml: T04=wave 2 (deps: T02), T05=wave 3 (deps: T03).
Briefs say both are "Wave 1" with no dependencies.
T05 body also says "can run in parallel with T04 and T06" which is wrong — T06 depends on T05.

**Fix:** Update T04 brief header/body → Wave 2, deps [T02]. Update T05 → Wave 3, deps [T03]. Remove parallel-with-T06 claim from T05.

---

### [CRIT-02] T05 `AgentFull` Type Missing 3 of the 8 T01 Columns

**Affected:** T05

T01 adds 8 columns: `trigger_type`, `trigger_config`, `instructions`, `estimated_output`, `config`, `version`, `run_count`, `error_count`.
T05's `AgentFull` only includes 5 — missing `estimated_output`, `run_count`, `error_count`.

**Fix:** Add `estimated_output: string | null`, `run_count: number`, `error_count: number` to `AgentFull` in T05. Update success criteria to cover all 8 fields.

---

### [CRIT-03] T05 Step 6 Deploy Button Has Duplicate `color` Property

**Affected:** T05 (line 866 of brief)

Style object has `color: 'var(--paper)'` then `color: stage.borderColor` — second overwrites first, making button text the accent color instead of paper.

**Fix:** Remove `color: 'var(--paper)'` (the first occurrence). Keep `color: stage.borderColor` for outlined button style.

---

## Warnings

### [WARN-01] T04 Brief Says "No Dependencies" But tasks.yaml Requires T02

**Affected:** T04

Brief says "T04 can start immediately" and "DB columns may not exist yet." tasks.yaml says deps: [T02].

**Suggestion:** Update T04 Dependencies section to declare T02 as upstream. Add verification step: confirm the 5 new `service_tasks` columns exist before starting.

---

### [WARN-02] T05 Claims T06 "Can Run in Parallel" — Incorrect

**Affected:** T05

Fixed as part of CRIT-01. T06 is wave 4 with deps: [T05].

---

### [WARN-03] T04 `taskForm.estimated_hrs` Type Ambiguity

**Affected:** T04

`taskForm` uses `estimated_hrs: ''` (string) while `editTaskForm` uses `Partial<Task>` with `estimated_hrs: number | null`. The seed line `estimated_hrs: t.estimated_hrs` assigns a number to form state typed as string.

**Suggestion:** Add explicit note that `taskForm` (add form) keeps all fields as strings and `parseFloat` converts on submit; `editTaskForm` uses `Partial<Task>` (number). These are separate states. No type mismatch if kept separate.

---

### [WARN-04] T04 Brief Header Says `Model: opus` But tasks.yaml Says `sonnet`

**Affected:** T04

tasks.yaml: `model: sonnet`. Brief header: `**Model:** opus`. tasks.yaml is authoritative.

**Suggestion:** Correct T04 brief header to `**Model:** sonnet`.

---

## Observations

### [OBS-01] T01 Downstream Note Slightly Inaccurate

T01 says "T02 depends on these columns" — T02 runs in the same wave and only references `agents.id` (pre-existing PK). Not execution-critical.

### [OBS-02] T05 `notFound()` Without Return Is Correct for Next.js

`notFound()` throws internally in App Router. Executing agent should not add a `return` before it.

### [OBS-03] Done Tasks Have No Delete Button

T04 scopes delete to non-done tasks only. Done tasks in the collapsed `showDone` section will not have delete. Intentional scope decision.

### [OBS-04] T03 Complexity 3/10 in Brief vs 2 in tasks.yaml

Minor discrepancy. Model is `sonnet` in both — correct for scope.

### [OBS-05] Existing `deleteAgent` Has No `window.confirm` — T04 Adds One for Tasks

Inconsistency in the existing code, not introduced by these tasks.

---

## Task Order Validation

| Task | Wave (tasks.yaml) | Wave (brief) | Deps (tasks.yaml) | Deps (brief) | OK? |
|------|------|------|------|------|------|
| T01 | 1 | 1 | none | none | ✓ |
| T02 | 1 | 1 | none | none | ✓ |
| T03 | 2 | 2 | T01 | T01 | ✓ |
| T04 | 2 | **1 (WRONG)** | T02 | **none (WRONG)** | ✗ |
| T05 | 3 | **1 (WRONG)** | T03 | **none (WRONG)** | ✗ |
| T06 | 4 | 2 | T05 | T04+T05 | ✓ |

Logical dependency chain in `tasks.yaml` is correct: T01/T02 → T03/T04 → T05 → T06.

---

## Verdict

**APPROVE_WITH_FIXES**

Architecture and implementation detail are high quality. Apply 3 critical fixes + WARN-01 and WARN-04 before execution.
