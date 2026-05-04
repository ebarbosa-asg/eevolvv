# Brief Review: os-dashboard-redesign

**Critical (7):** Issues that will cause task failure or build breaks
**Warnings (6):** Issues that may cause problems or reduce quality
**Observations (5):** Minor notes and improvements

---

## Critical Issues

### C1: T01 — layout.tsx injects `<style>` tag, but T01 brief says "no change needed"
**Task:** T01
**Finding:** `app/os/layout.tsx` line 33 injects `<style>{LAYOUT_CSS}</style>`. The PRD Goal 6 requires "Replace all injected `<style>` tags with Tailwind responsive classes." The T01 brief says `app/os/layout.tsx`: "no change — already delegates correctly." This contradicts the PRD goal and leaves a `<style>` injection in the final output. The CSS inside LAYOUT_CSS includes `.os-layout`, `.os-sidebar-space`, `.os-main`, `.os-sidebar-overlay` — these drive the entire shell layout and responsive collapse. If left as-is, the PRD acceptance criteria ("zero inline `<style>` tags") is violated.
**Fix:** T01 should also convert LAYOUT_CSS to Tailwind classes. The layout grid is achievable with `flex min-h-screen` on `.os-layout`, the sidebar space with a div using dynamic `style={{ width }}` (acceptable per the brief's exception list for dynamic values), and `.os-sidebar-overlay` as a Tailwind-classed fixed overlay. If this is intentionally deferred, the PRD acceptance criteria for T01 should explicitly carve it out, and a cleanup task should be added. As written, the success criteria and PRD are in conflict.

---

### C2: T01 — OSSidebar imports `Client` and `CompanyTask` types from `./HubClient`; brief says "keep for now" but this leaves a broken import risk
**Task:** T01
**Finding:** `app/os/OSSidebar.tsx` line 7: `import type { Client, CompanyTask } from './HubClient'`. The T01 brief (Implementation Guidance, "Type imports" section) acknowledges this and says "keep importing those types from ./HubClient — they will be relocated in a later cleanup pass." However, no cleanup task exists in this PRD. HubClient.tsx is marked "do NOT modify" and will not be deleted during this PRD. This is acceptable for the duration of this PRD — but the brief should explicitly note that the import stays deliberately (it currently reads as a risk rather than an intentional decision), so the executing agent doesn't try to resolve it by modifying HubClient.
**Fix:** Add a sentence to the T01 Implementation Guidance explicitly stating: "The `import type { Client, CompanyTask } from './HubClient'` import in OSSidebar stays unchanged for the duration of this PRD. HubClient.tsx is not deleted here." Currently the wording is ambiguous and may cause the executor to touch HubClient.

---

### C3: T03 — data fetch uses `NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'` but app runs on port 3004
**Task:** T03
**Finding:** T03 brief line 83: `const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'`. The eevolvv dev server runs on port 3004 (`package.json`: `"dev": "next dev --turbo --port 3004"`). `NEXT_PUBLIC_APP_URL` is not set in `.env.local` and not defined anywhere in the project (only found in `app/api/cron/agents/route.ts` with a production fallback to `os.eevolvv.com`). In local development, all internal fetches in T03 will fail silently and render four "—" KPI cards.
**Fix:** Change the fallback to `'http://localhost:3004'`, or better: use Next.js server-side data access directly (call the route handler logic directly, or use the Supabase client / API route helper functions) instead of HTTP self-fetch. The cleanest solution for a server component is to import the route handler logic directly and avoid the HTTP hop entirely.

---

### C4: T03 — `export type Submission` must be preserved but brief instruction is ambiguous about whether it stays or goes
**Task:** T03
**Finding:** `app/os/page.tsx` currently exports `type Submission` at line 11. `HubClient.tsx` line 7 imports it: `import type { Submission } from './page'`. T03 brief (Implementation Guidance) says to keep the export "until HubClient.tsx is deleted" — but this instruction is buried in a guidance note, not in the Success Criteria. An executing agent rewriting the file from scratch may omit it. If dropped, HubClient.tsx gets a TypeScript error, breaking `npx tsc --noEmit` (which is a success criterion for multiple tasks).
**Fix:** Add an explicit Success Criteria item: "[ ] `export type Submission` is preserved in the new `app/os/page.tsx`." Also note that `export const metadata: Metadata = { robots: { index: false, follow: false } }` from the current page.tsx must be preserved (the brief does not mention this at all).

---

### C5: T04 — Internal docs list is wrong; brief omits Calendly and misidentifies the link path
**Task:** T04
**Finding:** T04 brief (links page, "Internal docs" section) lists 4 items: Service Agreement, Pitch Deck, Privacy Policy, Terms — and says the Pitch Deck URL is `/investor/pitch.html`. But the actual HubClient.tsx source (line 976) shows the internal docs section has exactly these 4 items with `/investor/pitch.html` — that part is correct. However, the `§ 07 QUICK LINKS` section (line 945, separate from §08) has a "Pitch Deck" and "Calendly" quick-link row rendered as a mini card above the main QUICK_LINKS grid — inside the §06 INVESTOR section. The brief for links page does not account for this distinction: the §07 quick links grid and §08 internal docs are both in HubClient but the investor pitch link appears TWICE (once inside §06, once inside §08). The brief's instruction to "copy verbatim" from lines 127–145 for QUICK_LINKS is accurate (18 items), but the 4-item internal docs list omits this distinction. More critically: the brief states "4 internal docs" but the actual §08 section has Service Agreement + 3 items (Pitch Deck, Privacy, Terms) = 4 total. That count is correct. No factual error here, but the executor should not accidentally include the Calendly link that appears inside §06 as an §08 internal doc.
**Fix:** Minor clarification — add a note to T04 links page section: "The Pitch Deck + Calendly row rendered at the bottom of §06 INVESTOR section (HubClient.tsx line 945) is part of the investors page, not the links page. Do not include it in `app/os/links/page.tsx`."

---

### C6: T07 — import path for `OSBreadcrumb` uses `@/app/os/components/OSBreadcrumb` but the `@/` alias maps to repo root, not `src/`
**Task:** T07, T08
**Finding:** T07 brief line 145 shows: `import { OSBreadcrumb } from '@/app/os/components/OSBreadcrumb'`. The `tsconfig.json` `paths` shows `"@/*": ["./*"]` which maps to the repo root `/Users/loko/eevolvv/`. So `@/app/os/components/OSBreadcrumb` resolves to `/Users/loko/eevolvv/app/os/components/OSBreadcrumb.tsx`. This is correct as written. However, the relative path alternative shown in Implementation Guidance — `../../components/OSBreadcrumb` from `app/os/clients/[id]/ClientWorkspace.tsx` — also resolves correctly (up to `app/os/`, then into `components/`). Both paths are valid. No error here — this is a confirmation.
**Fix:** No change needed. Both `@/app/os/components/OSBreadcrumb` and relative `../../components/OSBreadcrumb` resolve correctly from `app/os/clients/[id]/ClientWorkspace.tsx`.

---

### C7: T04 — `cycleTaskStatus` logic differs from what the brief documents
**Task:** T04
**Finding:** T04 brief says `cycleTaskStatus` cycles `todo → in_progress → done → todo`. The actual HubClient.tsx line 364: `const order: CompanyTask['status'][] = ['todo', 'in_progress', 'done', 'todo']` — the `done` state cycles back to `todo`, meaning clicking a `done` task un-dones it to `todo`. This is correct in the brief. However, the brief says (line 106): "cycles `todo → in_progress → done → todo`" — which is accurate. Also correct. No error. But note: the actual `filteredTasks` (HubClient line 431) shows `status !== 'done'` filter — meaning `done` tasks are hidden from the default view. If a user clicks to cycle `in_progress → done`, the task disappears from the list immediately (which is the intended UX). The T04 brief does not explain this behavior. An executor who doesn't understand this may add a "done" tab or leave done tasks visible.
**Fix:** Add to T04 tasks page requirements: "filteredTasks hides done-status tasks from the default list view. This is intentional — cycling a task to 'done' removes it from view. The category filter tabs show count of non-done tasks per category."

---

## Warnings

### W1: T01 — OSSidebar sidebar nav items are currently only shown when `isOsRoot === true` (line 213); converting to route-based nav means they should always show
**Task:** T01
**Finding:** `OSSidebar.tsx` line 213: `{isOsRoot && ( <div>...nav items...</div> )}` — the navigation section is conditionally rendered ONLY when on `/os`. On any other `/os/*` route, the nav items are hidden and only the client list at the bottom shows. After T01 converts to route-based nav, the nav items should always be visible (not gated by `isOsRoot`). The brief does say to remove `isOsRoot` logic from `scrollTo` — but the `isOsRoot` gate on the nav section itself (line 213) is not explicitly mentioned as something to remove.
**Fix:** Add to T01 requirements: "Remove the `{isOsRoot && (...)}` conditional wrapper around the navigation section (line 213). After converting to route links, the nav items should render on all `/os/*` routes, not just the root."

---

### W2: T04 — Feed page's `FeedClient.tsx` is a second file that the brief describes but doesn't list in the "Files to Modify" table
**Task:** T04
**Finding:** T04 brief describes creating `app/os/feed/FeedClient.tsx` as a client component (server+client split pattern). The "Files to Modify" table only lists `app/os/feed/page.tsx`. An executor following the table strictly may put all logic in a single file and mark it `'use client'`, losing the auth guard (which must be server-side).
**Fix:** Add `app/os/feed/FeedClient.tsx` to the Files to Modify table with action "create" and purpose "Client component for feed interactive state."

---

### W3: T04 — `Badge` component does not have an `onClick` prop in the ds/ interface; using it as a clickable element requires a wrapper
**Task:** T04, T05
**Finding:** `components/ds/Badge.tsx` extends no click handler — it's a `<span>` element. T04 brief says "clickable `<Badge variant={...} onClick={...}>`" for deal stage cycling (pipeline page) and investor stage cycling. `<span>` elements can accept `onClick` in React, but TypeScript will require adding `onClick` to the props manually. Since `BadgeProps` doesn't extend `React.HTMLAttributes`, adding `onClick` directly to `<Badge onClick={...}>` will cause a TypeScript error. The executor will need to wrap the Badge in a `<button>` or `<div>`, or apply the click handler to a wrapping element.
**Fix:** Add a note to T04 pipeline and investors pages: "Badge does not accept onClick natively — wrap with `<button className='cursor-pointer border-none bg-transparent p-0' onClick={...}><Badge ...></Badge></button>` or add `role='button' tabIndex={0}` to a wrapping div."

---

### W4: T07 — ClientWorkspace has a dark root background (`background: 'var(--ink)'`) that will clash with ds/ light components (Card, Input, etc.)
**Task:** T07
**Finding:** ClientWorkspace root div (line 262 approx) has `style={{ background: 'var(--ink)', color: 'var(--paper)' }}`. The brief acknowledges the Textarea and Input override issue, but `<Card>` from ds/ uses `bg-white` and `<Badge>` uses `bg-green-100 text-green-800`. These light components will look jarring on a dark background. The brief does not address Card or Badge dark-context overrides, only Input and Textarea.
**Fix:** Add to T07 Implementation Guidance: "All `<Card>` instances inside ClientWorkspace need a className override for the dark context: `<Card className='bg-white/6 border-white/8'>`. All `<Badge>` instances should use opacity-based variants that work on dark backgrounds — the current Badge success/warning/danger variants use Tailwind green/amber/red which render acceptably on dark. No change needed for Badge."

---

### W5: T03 — `OSTopbar` is rendered inside `app/os/page.tsx` (the child page) but the layout already wraps all children with a sidebar+main shell; this creates a structural inconsistency
**Task:** T03, T04, T05, T06
**Finding:** The layout shell (`OSLayoutClient`) renders `<main className="os-main">{children}</main>`. Each page (T03–T06) renders `<OSTopbar>` as its first element inside that main. This means OSTopbar is inside the scrollable content area, not pinned at the shell level. The brief says `position: sticky; top: 0; z-index: 50` which will make it stick within the main content area — that is functionally correct. However, each page manages its own topbar, meaning navigating between pages will briefly unmount/remount the topbar. This is a UX inconsistency but not a build failure. The PRD architecture diagram shows OSTopbar as part of the shell — placing it in each page is a departure from that intent.
**Fix:** Consider moving OSTopbar into `OSLayoutClient` with a context-driven title, OR explicitly accept the per-page topbar pattern and update the PRD architecture note. As written, the execution will work but the topbar flickers on navigation. If the per-page approach is intentional, add a note to T01: "OSTopbar is rendered per-page, not in the layout shell. This is intentional."

---

### W6: T08 — AgentBuilder left rail step buttons are missing `type="button"` attribute; brief's replacement code adds it but existing code doesn't have it
**Task:** T08
**Finding:** Current `AgentBuilder.tsx` step buttons (line 268) have `onClick={() => setStep(n)}` but no `type="button"`. Since AgentBuilder is not inside a `<form>`, this is currently harmless. The T08 brief replacement code (line 138) correctly adds `type="button"`. This is an improvement, not a risk. However, the brief's replacement code for navigation buttons (line 375) uses `<Button variant="ghost">` which renders a `<button>` — these ARE inside the page which has a save action, so the correct `type="button"` attribute matters for preventing unintended form submissions. The ds/ `Button` component doesn't add `type="button"` by default — it passes `...props` to `<button>`, which defaults to `type="submit"`.
**Fix:** Add to T08 requirements: "All `<Button>` instances that are NOT the 'Save & Continue' primary action must have `type='button'` passed explicitly (e.g., `<Button variant='ghost' type='button'>← Back</Button>`) to prevent accidental form submission behavior."

---

## Observations

### O1: `app/os/components/` directory does not exist yet — both T01 and T02 create files in it
**Tasks:** T01, T02
**Finding:** The `app/os/components/` directory does not exist. T01 creates `OSTopbar.tsx` there; T02 creates `OSBreadcrumb.tsx` and `shared.tsx` there. Both are Wave 1 and run in parallel. The first task to write a file will implicitly create the directory. This is fine — Node.js file creation creates parent directories in most frameworks. No conflict. Both tasks are aware of this (T02 brief explicitly says "There is currently no `app/os/components/` directory. T01 creates `OSTopbar.tsx` there."). No action needed.

---

### O2: `app/os/page.tsx` currently exports `const metadata: Metadata` which T03 brief does not mention
**Task:** T03
**Finding:** Current `app/os/page.tsx` lines 7–9: `export const metadata: Metadata = { robots: { index: false, follow: false } }`. T03 brief does not mention preserving this. Since the new page is a full rewrite, this export will likely be dropped unless the executing agent notices it. Dropping it means the `/os` route will become indexable by search engines. This is a minor SEO issue but not a build failure.
**Fix (recommended):** Add to T03 Success Criteria: "[ ] `export const metadata: Metadata = { robots: { index: false, follow: false } }` preserved from the original page.tsx."

---

### O3: `cycleDealStage` wraps around to 'lead' when stage is 'lost' (last element)
**Task:** T04
**Finding:** HubClient line 374: `const next = DEAL_STAGES[idx + 1] ?? 'lead'`. When stage is `'lost'` (last in array), `idx + 1` returns undefined, so it falls back to `'lead'`. T04 brief correctly documents this: "advance through DEAL_STAGES, wrap to 'lead'". This is accurate. No issue — confirmed correct.

---

### O4: T04 feed page — `TerminalBlock` on a `bg-paper` light page has a dark background style (`rgba(20,20,19,0.055)`) that will appear correct on light surfaces
**Task:** T04
**Finding:** `TerminalBlock` uses `background: 'rgba(20,20,19,0.055)'` (very light dark tint). On `bg-paper` (#faf7f0), this renders as a very subtle warm gray tint — correct for the design. The diagnostic report may contain long pre-wrap text. The brief notes "If TerminalBlock doesn't handle multi-line values well, wrap in a `<pre>`..." — this is a good contingency note. TerminalBlock maps each array item to a `<div>` with `→` prefix. A single multi-line report string passed as `value` will render on one line without wrapping. The executor should split the report on `\n` as the brief suggests.

---

### O5: Wave 2 parallel execution — no file conflicts confirmed
**Tasks:** T03–T08
**Finding:** Cross-checking the file overlap table in `briefs.overview.md` against actual file paths — confirmed no two Wave 2 tasks write to the same file. `HubClient.tsx` is read-only for all tasks. The only potential confusion is that T03 modifies `app/os/page.tsx` while T04 creates `app/os/tasks/page.tsx` — these are different files. T05 creates `app/os/clients/page.tsx` while T03 and T07 don't touch it. No parallel write conflicts exist.

---

## Summary

**Must fix before execution (Critical):**
- C3: Fix the T03 baseUrl fallback from `localhost:3000` to `localhost:3004` (or use direct data access)
- C4: Add `export type Submission` and `export const metadata` preservation to T03 success criteria
- C7: Add documentation to T04 about filteredTasks hiding done tasks (executor will likely mishandle UX)
- C1: Resolve the T01 / layout.tsx `<style>` injection gap vs PRD goal (either add it to T01 scope or explicitly carve it out with rationale)
- C2: Clarify T01 that the OSSidebar HubClient type import stays intentionally
- W1: Explicitly add removal of `isOsRoot &&` nav wrapper to T01 requirements (high risk of silent miss)
- W2: Add `FeedClient.tsx` to T04 files table

**Lower priority (Warnings/Observations):**
- W3: Badge onClick wrapper pattern for T04 pipeline/investors
- W4: Card dark context overrides for T07
- W5: Decide OSTopbar placement strategy (per-page vs layout shell)
- W6: `type="button"` on all non-submit Button instances in T08
- O2: Preserve metadata export in T03
