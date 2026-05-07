# Brief Review: autonomous-sidegig-pivot

**Reviewed:** 2026-05-07
**Briefs:** 24
**Status:** needs-fixes

---

## Critical Issues

**C1 · T08 ↔ T06 circular dependency — tasks.yaml dependency direction is backwards**
T08 creates `lib/email-helpers.ts`; T06 imports it. But tasks.yaml has T08 depending on T06 — the reverse of what's needed.
Fix: Change T08 `depends_on` from `[T04, T06]` → `[T04]`. Change T06 `depends_on` from `[T04, T05]` → `[T04, T05, T08]`.

**C2 · T05 brief has inaccurate comment about clients table origin**
Brief says "clients table created in migration 005" — it was not. The `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` approach is correct; only the comment is wrong.
Fix: Update T05 brief context to accurately describe the clients table as pre-existing (not from migration 005).

**C3 · T02 human gate required before Wave 2 runtime tests**
T02 requires E to manually create Stripe products in the dashboard. T03 and T07 acceptance criteria can't pass at runtime until price ID env vars are populated. No brief communicates this gate explicitly.
Fix: Add human-gate note to T03 and T07 briefs. Add explicit prerequisite to T02 acceptance criteria.

**C5 · T09 references non-existent app/run/[shareToken]/ directory**
Brief-writer couldn't find this path. T09 brief references it with a fallback to `app/os/ghost-locker/[codename]/page.tsx`.
Fix: Remove the `app/run/[shareToken]/` reference from T09 brief; use only the ghost-locker pattern.

**C7 · T04 includes Pages Router config export — dead code in App Router**
`export const config = { api: { bodyParser: false } }` has no effect in Next.js App Router. `req.text()` is the correct approach (already used in the brief).
Fix: Remove the dead config export from T04 brief.

**C8 · T12/T21/T22/T23 all write vercel.json across waves — last writer wins**
T12 (Wave 3), T21, T22 (Wave 4), T23 (Wave 5) each modify `vercel.json`. Parallel execution within a wave will cause cron entries to be dropped.
Fix: Add T22 depends_on T21 in tasks.yaml. Change all vercel.json modifications to append-only (read → merge → write) rather than full file replacement.

**C9 · T17 modifies T16's route.ts — needs explicit guard**
T17 adds email sending to `app/api/builds/update-status/route.ts` created by T16. Brief must explicitly state not to alter T16's VALID_TRANSITIONS or status update logic.
Fix: Add DO NOT section to T17 brief.

**W5 · T22 PostgREST filter syntax for nested columns will not work**
`supabase.from('clients').select('..., onboarding_sessions!inner(...)').is('onboarding_sessions.completed_at', null)` — filtering on related table columns with `.is()` is not supported in the Supabase JS client. Will return unfiltered results or throw.
Fix: Rewrite T22 churn detection query to use separate queries or a raw SQL RPC call.

---

## Warnings

**W1 · T14 creates inline Supabase client instead of importing from lib/supabase.ts**
Intentional per brief (circular dependency concern) but creates a second client instance. Design choice, not a bug.

**W2 · T03 success_url points to /onboard/success — no brief creates this page**
Post-checkout redirect will 404. Recommend T09 creates a simple `/onboard/success` page, or T03 redirects to `/pricing?checkout=success`.

**W3 · T06 sets company = name on client insert**
Both fields will show the same value in the OS until manually updated. Not a data error.

**W4 · T20 win-back email fires before cancellation confirmation**
Multiple clicks could send multiple win-back emails. No duplicate-send guard in brief.

**W6 · T12 off-by-one edge case in follow-up sequence timing**
A lead exactly at 72h with 0 emails sent won't match any sequence condition. Minor gap in cron timing logic.

---

## Observations

**O1** PostHog already partially instruments the funnel — T24 may introduce event name overlap.
**O2** `stripe` package confirmed NOT installed — T01 is necessary.
**O3** `@react-email/components` already installed — T08 does not need to install it.
**O4** CRON_SECRET pattern already in use — all new cron briefs follow it correctly.
**O5** T07 line number reference slightly off (~488 vs ~499) — executor should match by code content.
**O6** T06 and T09 both guard against double builds record creation — correct.
**O7** `lib/email.ts` already exists — executors should not confuse it with new `lib/email-helpers.ts`.
**O8** T24 changes PostHog distinctId from email to submissionId — breaking change to identity graph. Flag for E.

---

## Summary

5 fixes required in tasks.yaml (dependency direction corrections, wave sequencing). 3 briefs need content corrections (T04 dead code, T09 non-existent path reference, T22 PostgREST syntax). T02's manual Stripe setup step needs explicit human-gate documentation in downstream briefs. The vercel.json multi-writer conflict needs sequential dependency enforcement. All issues are fixable without re-running the interview.
