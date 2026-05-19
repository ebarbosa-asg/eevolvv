# eevolvv

## Project
eevolvv, Inc. — Delaware C Corp. AI business transformation platform.
- Codebase: `/Users/loko/eevolvv` (single Next.js app)
- Production: eevolvv.com (Vercel, auto-deploy on push to main)
- Stack: Next.js, TypeScript, Tailwind, Supabase, Anthropic, Resend
- Toll-free: +1 (844) 433-8658 (Grasshopper)

## Key Routes
- `/` — main AI transformation site
- `/privacy` — privacy policy (eevolvv, Inc., Delaware)
- `/terms` — terms of service
- `/contact` — TCPA-compliant SMS opt-in contact form → POST /api/contact → Resend

## Conventions
- Entity name: always "eevolvv, Inc." in legal/UI copy
- Governing law: Delaware
- Use `apps/talent/*` paths for talent sub-routes (they live at /talent/*)
- Run `pnpm dev` to start local dev server
- Run `pnpm build` before pushing to verify clean build
- After every push, Vercel auto-deploys — production is live in ~60s

## Current Branch / State
- Check `git status` and `git log --oneline -5` at session start
- Pending: merge feature/memory-bridge-client, clean stale worktrees

## What NOT to do
- Do not hardcode "eevolvv" without ", Inc." in legal copy
- Do not create new worktrees without cleaning up stale ones first
- Do not use `mcp__claude-in-chrome__*` tools — use `/browse` skill instead


<claude-mem-context>
# Memory Context

# [eevolvv] recent context, 2026-05-18 11:17pm CDT

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (18,305t read) | 345,666t work | 95% savings

### May 14, 2026
S1300 eevolvv marketing automation game plan review + execution start — PostHog CTA tracking instrumentation on homepage and pricing section (May 14 at 9:20 PM)
S1324 eevolvv Marketing Automation Gameplan — Full Execution Session (May 15): PostHog CTA instrumentation, lead scoring, partners funnel, share card, Google Ads doc (May 14 at 9:38 PM)
### May 18, 2026
1702 10:43p ⚖️ eevolvv Marketing Strategy — No Refunds, Free Value Hooks Instead
1703 " ⚖️ eevolvv UI Direction — Volvv-e Street Art Easter Eggs Planned Across Site
1704 " ⚖️ eevolvv Homepage Redesign Direction — Noise Reduction + Free Value Showcase
1705 10:52p ⚖️ eevolvv Marketing Strategy — No Refunds, Free Value Hooks Instead
1706 " ⚖️ eevolvv UI Direction — Volvv-e Street Art Easter Eggs Planned Across Site
1707 " ⚖️ eevolvv Homepage Redesign Direction — Noise Reduction + Free Value Showcase
1708 10:53p ✅ eevolvv Homepage Messaging Pivoted — Free-First Framing Replaced with Service/Protocol Positioning
1712 10:54p ✅ eevolvv homepage-v3.css — FreeStreetWall CSS Block Purged
1713 " 🟣 eevolvv CTA Section — Volvv-e Tiny Spray "v" Easter Egg Introduced
1714 " ⚖️ eevolvv Brand Memory Updated — Volvv-E Easter Egg Strategy Dialed Back to Subtle
1715 " 🔵 eevolvv Homepage Sweep — Full Scope of Modified Files Revealed by git status
1719 10:55p 🔵 eevolvv Production Build Passes — Homepage Sweep Changes Compile Clean
1720 10:57p ⚖️ eevolvv Marketing Strategy — No Refunds, Free Value Hooks Instead
1721 " ⚖️ Volvv-e Street Art Easter Eggs — Spray-Paint Mascot Series Planned Across Site
1722 " ⚖️ eevolvv Homepage Redesign Direction — Noise Reduction + Free Value Showcase
1723 " 🔵 eevolvv Homepage Architecture Audit — Current Section Map Before Redesign
1724 " 🔵 eevolvv Diagnostic API — Full Pipeline Architecture Confirmed
1725 " ✅ hero-v3.tsx Deleted — Homepage Hero Being Rebuilt
1726 10:58p 🟣 hero-v3.tsx Rebuilt — Free-Report-First Hero Replaces Animation-Heavy Version
1727 " 🟣 cta-v3.tsx Rebuilt — Complex Before/After Panel Replaced with Minimal Free-to-Paid Path
1731 10:59p 🟣 VolvvEIntro Section Created — New Mascot Introduction Page Section
1732 " 🟣 eevolvv Homepage Structural Overhaul — 8 Sections Collapsed to 5, Free-First Navigation
1733 " 🟣 homepage-v3.css — Full CSS System Added for Report-Hero, VolvvEIntro, and Report-Close Sections
1737 " ✅ homepage-v3.css — Responsive Breakpoints Added for All New Homepage Sections
1738 11:00p 🟣 DiagnosticClient.tsx Created — Full Diagnostic Form Page with Live API Submission
1739 11:01p 🟣 Diagnostic Page CSS Added to homepage-v3.css — Full /diagnostic Page Styling Complete
1740 " 🔴 Pricing Page Diagnostic Link Fixed — Hash Anchor Replaced with Direct Route
1741 " ✅ brand-virality.md Updated — Homepage Strategy Codified in Brand Memory
1745 " 🔵 Orphaned .live-ops CSS Classes — Still in homepage-v3.css After Hero Section Removal
1746 " ✅ eevolvv Homepage Overhaul — Full Diff Scope: 15 Files, Net 44 Lines Removed
1747 11:02p 🔄 Orphaned .live-ops CSS Purged from homepage-v3.css
1748 " 🔴 organize-v3.tsx Class Reference Fixed — live-ops-head-dot Renamed to org-head-dot
1749 " 🟣 eevolvv Production Build Green — Homepage Overhaul Ships Clean, 88 Pages Generated
1751 " 🔵 Dev Server ENOENT Errors — Turbopack Manifest Conflict After pnpm build Run
1752 11:03p 🟣 tiny-spray-v CSS Class Defined — Core Volvv-E Easter Egg Implementation
1756 11:04p ✅ ArcadeTicker Removed from Homepage — Final Noise-Reduction Cut
1757 " ✅ Homepage Route Size Reduced to 2.85 kB After Ticker Removal — Final Build Confirmed Clean
1758 " 🔵 Dev Server Returns HTTP 500 After Build — "missing required error components" Turbopack State
1759 11:12p ⚖️ eevolvv Marketing Strategy — No Refunds, Free Value Hooks Instead
1760 " ✅ eevolvv Homepage — VolvvEIntro Replaced with CapabilityTriptych Section
1761 " ✅ eevolvv HeroV3 — Right Panel Preview Card + Secondary CTA Removed, Simplified Layout
1765 " 🟣 eevolvv CapabilityTriptych — New Homepage Section with Three Service Panels
1766 11:13p ✅ eevolvv — VolvvEIntro Component Deleted, CapabilityTriptych Is Full Replacement
1767 11:14p ✅ eevolvv homepage-v3.css — VolvvEIntro + Report Preview Styles Removed, CapabilityTriptych Styles Added
1768 " ✅ eevolvv homepage-v3.css — CapabilityTriptych Responsive Overrides Added at 1000px and 640px
1769 " ⚖️ eevolvv Homepage Graphics Plan Documented — Free-Report Sandwich Structure Codified
1770 " 🔵 eevolvv Homepage Overhaul — Full Git Diff Scope: 16 Files, Net -140 Lines
1771 " 🔵 eevolvv Production Build — Clean Pass, Homepage Bundle 3.11 kB, 88 Pages
1772 11:15p 🔴 eevolvv Dev Server HTTP 500 — Fixed by Killing Post-Build Processes and Restarting Dev Only
1773 " 🔵 eevolvv Git Status — 16 Modified + 4 Untracked Files Pending Commit

Access 346k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>