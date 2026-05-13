# Brief Review — industry-vertical-workflows

## Summary
Critical: 4 | Warnings: 5 | Observations: 4

---

## Critical Issues

### C1 — [RESOLVED] Follow-up emails NOT sent from email_queue — sent from submissions table via email-helpers

**Affects:** IVW-007 (and the task description's assumptions)

**Actual state:** The follow-up cron job at `app/api/cron/followup/route.ts` does NOT read from the `email_queue` table at all. It queries the `submissions` table directly (`email_sent = true`, tracks via `followup_sent_at` column). It calls `sendFollowUpEmail()` from `lib/email-helpers.ts`, which renders the email templates using `React.createElement(FollowUp1Email, { name, businessName })` — no `industry` prop.

The `email_queue` table (migration 009) is populated by `diagnostic/route.ts` (lines 267–274), but nothing in the codebase reads from it to send emails. The queue rows are dead — the live send path is entirely through the cron job + submissions table.

**Why this breaks IVW-007:** IVW-007 tells the agent to:
1. Add `industry` to the `email_queue` insert rows in `diagnostic/route.ts` — this is correct but has no effect on what the user actually receives
2. "Find and modify the follow-up send site" — the brief points to `email_queue` as the send site, but the real send site is `app/api/cron/followup/route.ts` + `lib/email-helpers.ts`
3. The brief says "read `industry` from the queue row" — but no code reads from the queue

**Correction needed for IVW-007:**
- Remove the "find and modify the follow-up send site" instruction that assumes `email_queue` is the send mechanism
- Instead, instruct: (1) Add `industry` to `submissions` table SELECT in `app/api/cron/followup/route.ts` line 20-22; (2) Pass `industry` to `sendFollowUpEmail()` in `lib/email-helpers.ts`; (3) Update `sendFollowUpEmail()` signature to accept `industry?: string`; (4) Update `React.createElement` calls in `email-helpers.ts` to pass `industry`
- The `email_queue` insert change in `diagnostic/route.ts` may still be done for forward-compatibility, but it does not drive the live send path

---

### C2 — [RESOLVED] Migration file number conflict: IVW-003 brief says 010, tasks.yaml says 003

**Affects:** IVW-003

**Actual state:** `supabase/migrations/` contains migrations 001 through 009. The next available number is `010`. The `IVW-003.md` brief correctly identifies this and specifies the filename as `010_clients_industry_column.sql`. However, the `tasks.yaml` description says:
> "Migration file: supabase/migrations/003_clients_industry_column.sql"

And the task description says "Check existing migration numbering first and use the next available number."

The brief file itself is correct (uses 010). The tasks.yaml is wrong (says 003 which already exists as `003_add_agent_share_token.sql`).

**Why this matters:** An agent reading only the tasks.yaml would create a file that conflicts with an existing migration. The brief overrides this correctly, but the discrepancy is a trap.

**Correction needed:** Update tasks.yaml line 108 to reference `supabase/migrations/010_clients_industry_column.sql` to match the brief.

---

### C3 — [RESOLVED] IVW-006 brief still warns "glob found no files at components/ds/" — ds/ does exist

**Affects:** IVW-006, IVW-011

**Actual state:** `components/ds/` exists and contains: `KPIStat.tsx`, `DataRow.tsx`, `Card.tsx`, `CardHeader.tsx`, `CardContent.tsx`, `Badge.tsx`, `Button.tsx`, `Input.tsx`, `Label.tsx`, `SectionMarker.tsx`, `Sidebar.tsx`, `StatusPill.tsx`, `TerminalBlock.tsx`, `Textarea.tsx`, `index.ts`, `README.md`.

**The IVW-006 brief (lines 35 and 164) contains this incorrect warning:**
> "the glob found no files at components/ds/. Before assuming these components exist, check components/ds/README.md or any file under components/. If they do not exist, use inline styles..."

And:
> "Check whether components/ds/ files actually exist at runtime before using them. The CLAUDE.md references them but the glob found no files. Use inline styles as fallback..."

This will lead the execution agent to use inline styles instead of the ds/ components, violating the rule in CLAUDE.md: "Always use components/ds/ — never build UI from raw Tailwind classes."

The acceptance criteria for IVW-006 say "Uses ds/ components only — no raw Tailwind class blocks" and IVW-011 says "Uses ds/ components only in report panels."

**Correction needed:** Remove the "glob found no files" warning from IVW-006 lines 35 and 164. Replace with a confirmation: "`components/ds/` exists. Use `<KPIStat>` for metric display, `<Card>` for panel containers, and `<DataRow>` for benchmark rows. Do not use inline styles — use ds/ components." Same fix needed in IVW-011 wherever it inherits the FitnessKPIPanels pattern note.

---

### C4 — [RESOLVED] IVW-007 assumption: `industry` is "already in scope" in diagnostic/route.ts email_queue insert — it is NOT

**Affects:** IVW-007

**Actual state:** IVW-007 instructs: "The `industry` variable is already in scope at that point in the file (it's destructured from the request body and used in `buildSystemPrompt`)."

Reviewing `diagnostic/route.ts` lines 267–274, the email_queue insert block is inside an immediately-invoked async arrow function `(async () => { ... })()`. The variable `industry` IS destructured from the body at line 85 (`name, email, businessName, businessType, industry`) and is used later at line 114. However, the email_queue rows (lines 268–270) do not currently include `industry`. The claim that it's "in scope" is technically true — `industry` is accessible in that closure — but the rows object doesn't include it. The agent needs to be told to ADD the field to the rows object, not simply that it's already there.

This is less of a correctness bug and more of a misleading phrasing that could cause an agent to skip the actual change. Combined with C1 above (the email_queue isn't the live send path), this compounds the risk.

**Correction needed:** IVW-007 Change 1 should say: "Add `industry: industry ?? null` as a new field to each of the three row objects in the email_queue insert at lines 268–270." Make clear this is adding a missing field, not referencing one already present.

---

## Warnings

### W1 — Cron route does NOT fetch industry from submissions — will need schema + query change

**Affects:** IVW-007 (supplementing C1)

The cron followup route queries:
```ts
.select('id, email, name, business_name, created_at, followup_sent_at')
```
There is no `industry` column in this select. To pass industry to the email templates, the cron must also select `industry` from submissions. The `submissions.industry` column already exists (migration 001), so no schema change is needed — only the SELECT needs to be updated. This is a concrete additional file change that IVW-007 must include in its files-to-change table.

**Correction needed:** IVW-007 files-to-change must include `app/api/cron/followup/route.ts` (add `industry` to SELECT; pass to `sendFollowUpEmail`) and `lib/email-helpers.ts` (update `sendFollowUpEmail` signature to accept `industry?: string`; pass through to `React.createElement` calls).

---

### W2 — IVW-011 modifies OnboardingForm.tsx before confirming IVW-008 state — shared form state risk is real

**Affects:** IVW-011

IVW-011 adds dental fields to `OnboardingForm.tsx` and notes: "softwareUsername and softwarePassword already added by IVW-008." This is correct — both briefs use the same field names (`softwareUsername`, `softwarePassword`). However:

- If IVW-008 and IVW-011 run in the same wave (they are sequenced in waves 4 and 5 respectively, so this should be fine), this is not a parallelism issue
- If the executing agent for IVW-011 reads the original `OnboardingForm.tsx` rather than the post-IVW-008 version, it will add duplicate state fields

The tasks.yaml correctly sequences IVW-011 after IVW-008. As long as the orchestrator executes waves sequentially, this is fine. Flag as Warning to ensure the IVW-011 brief's "Gotchas" section instruction is followed: confirm IVW-008 is merged before starting.

**Correction needed:** No change to brief content — already documented in gotchas. Verify orchestrator enforces wave sequencing before allowing IVW-011 to begin.

---

### W3 — IVW-008 PATCH handler currently has no admin notification and no Resend import

**Affects:** IVW-008

`app/api/onboard/[token]/route.ts` currently has NO import of Resend, no import of react-email render, and no admin notification logic. The brief correctly says "add it there" but IVW-008 Change 4 must add both the import and the full notification block — not just "add the send call." The agent brief says "find if it already sends admin notifications — if not, add it there" which correctly anticipates this, but doesn't spell out that Resend and render both need to be imported.

**Correction needed:** IVW-008 Change 4 should explicitly state: "Add `import { Resend } from 'resend'`, `import { render } from '@react-email/render'`, and `import { AdminOnboardingAlert } from '@/emails/AdminOnboardingAlert'` to `app/api/onboard/[token]/route.ts`. The file currently has none of these."

---

### W4 — NEXT_PUBLIC_CALENDLY_URL is set (closes known issue #4)

**Status:** CLOSED — Not a problem.

`NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/hello-eevolvv` is present in `.env.local` line 20. IVW-008 and IVW-011 hardcode a fallback of `'https://calendly.com/hello-eevolvv'` anyway. No action needed.

---

### W5 — IVW-010 modifies `INDUSTRY_CONTEXT['Dental / Oral Health']` that IVW-001 just created — potential overwrite confusion

**Affects:** IVW-010

IVW-001 adds a basic `'Dental / Oral Health'` entry. IVW-010 then "expands/replaces" that entry with the full expert version. Both tasks modify `lib/diagnosticPrompts.ts`. If the agent for IVW-010 uses a simple "replace the value" approach but IVW-001's entry is structured differently than expected, there is a risk of malformed content.

The brief correctly says "Read the current dental entry first" before expanding. This is the right instruction. Flagging as Warning because two tasks touch the same block in the same file in different waves — the IVW-010 agent must be careful not to duplicate the key.

**Correction needed:** No change required — the brief already handles this. Verify the IVW-010 execution agent reads the post-IVW-001 file state before writing.

---

## Observations

### O1 — Known issue confirmed: KPI panels cannot show user-specific values

`submissions.report` is a TEXT blob (narrative AI output), not structured KPI columns. IVW-006 and IVW-011 both correctly acknowledge this and instruct the agent to display "Review your report" for user values, showing only benchmark comparisons. This is an accepted limitation and correctly documented in the briefs.

---

### O2 — `components/ds/` exists and is fully populated — closes known issue #1

`components/ds/` has KPIStat, DataRow, Card, Badge, Button, and all other referenced components. The known issue is resolved. The incorrect warning in IVW-006's brief (see C3) is the residual problem to fix.

---

### O3 — The existing `'Gym / Fitness / Wellness'` key in diagnosticPrompts.ts will coexist with new `'Fitness / Gym / Studio'` key

Both IVW-002 and IVW-005 briefs correctly document this. The old key covers archived submissions; the new key covers the fitness landing page going forward. No brief cleanup is needed.

---

### O4 — `getIndustryShortName` map does not include 'Dental / Oral Health' or 'Fitness / Gym / Studio'

Both IVW-001 and IVW-005 correctly add these entries. The map currently ends at 'Insurance Agency' (line 270). Neither key is present. Confirming that both tasks will need to add their respective entries — this is already in the acceptance criteria for both briefs.

---

## Verdict

APPROVED

All four critical issues have been corrected. Briefs are cleared for execution.

Corrections applied by the Brief Corrector agent (2026-05-09):

1. **C1 + W1 (IVW-007):** Rewrote "Where follow-ups are sent from" in Codebase Reality to identify `app/api/cron/followup/route.ts` + `lib/email-helpers.ts` as the live send path (not email_queue). Rewrote Change 2 with explicit step-by-step instructions for both files. Updated Files to Change table to include the cron route and email-helpers. Updated Acceptance Criteria to verify the cron route SELECT, the cron route pass-through, and the email-helpers signature update. Updated Gotchas to remove the "search for the send site" instruction (location now known).

2. **C2 (tasks.yaml):** Changed `003_clients_industry_column.sql` to `010_clients_industry_column.sql` in tasks.yaml. The IVW-003.md brief was already correct (used 010).

3. **C3 (IVW-006, IVW-011):** Removed both false warnings about components/ds/ not existing from IVW-006 (Codebase Reality section and Gotchas section). Replaced with confirmed component list and positive instruction to use ds/ components. Updated Styling rules section to require ds/ components. Updated IVW-011 Styling note to match corrected guidance.

4. **C4 (IVW-007):** Changed Change 1 language from "already in scope" to explicitly state that `industry` must be added as a new field to each of the three row objects. Added clarifying note distinguishing variable scope availability from row object inclusion.

Waves 1–3 (IVW-001 through IVW-007) are the most impacted. IVW-008 through IVW-011 (Waves 4–5) are structurally sound.
