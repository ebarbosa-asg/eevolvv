<!-- /autoplan restore point: /Users/loko/.gstack/projects/ebarbosa-asg-eevolvv/feature-industry-vertical-workflows-autoplan-restore-20260511-010258.md -->
# PRD: upgrades
**Status:** draft  
**Created:** 2026-05-09  
**Slug:** upgrades  
**Complexity:** 39 points · 13 tasks · 5 waves · 1 gate  

---

## 1. Problem Statement

eevolvv's diagnostic engine incurs unnecessary LLM cost on cheap, short calls (chat intake, extract-intake) that don't require Sonnet-grade reasoning. The Evolution Report also lacks differentiated data signals — competitors increasingly offer SEO and ad health context. Finally, eevolvv has no video deliverable, missing a high-retention, shareable format that can drive viral top-of-funnel.

---

## 2. Goals

| # | Goal | Success Metric |
|---|------|----------------|
| G1 | Reduce LLM COGS on intake/chat calls | extract-intake + chat routes routed to Haiku/Flash via ClawRouter |
| G2 | Increase Evolution Report perceived value | AD HEALTH and SEO AUDIT sections present in 100% of new reports |
| G3 | Add on-demand video summary deliverable | Video generated on button click, embedded in permalink + emailed |

---

## 3. Non-Goals / Out of Scope

- Google Search Console OAuth integration (domain-only public checks only)
- Per-user video storage quota management
- ClawRouter crypto micropayment features
- Admin dashboard for SEO/ad score trends
- Multi-language video narration

---

## 4. Feature Specifications

### Feature 1: ClawRouter Smart Model Routing

**Overview:** Deploy ClawRouter as a self-hosted OpenAI-compatible proxy. Route cheap/short API calls (chat, extract-intake) to claude-haiku-3 (or equivalent Flash model). Keep diagnostic report generation on claude-sonnet-4-6. This requires zero changes to the Claude SDK call signatures — only the `baseURL` changes.

**Defaults accepted:**
- 1a: Smart router — downgrade extract-intake + chat to Haiku/Flash, keep diagnostic on Sonnet
- 1b: Self-hosted ClawRouter on Railway for production; test locally in dev first

**Implementation detail:**
- `CLAW_ROUTER_URL` env var controls the baseURL for the cheap-model Anthropic client
- A second `AnthropicRouter` client instance is initialized in routes that should use cheap models
- The existing `anthropic` client in `diagnostic/route.ts` is untouched
- Local dev: ClawRouter runs via `docker run` on port 8080; `CLAW_ROUTER_URL=http://localhost:8080`
- Production: Railway deployment, `CLAW_ROUTER_URL` set in Vercel env

**Affected files:**
- `app/api/extract-intake/route.ts` — swap to router client
- `app/api/chat/route.ts` — swap to router client
- `lib/anthropic-router.ts` — NEW: exports cheap-model client using CLAW_ROUTER_URL
- `app/api/diagnostic/route.ts` — add `MODEL` env var comment; keep claude-sonnet-4-6

---

### Feature 2: AD HEALTH + SEO AUDIT Sections

**Overview:** After the diagnostic report is generated, two additional scored sections are appended: `### AD HEALTH` (scored 0–100, Claude-inferred from business type + industry) and `### SEO AUDIT` (scored 0–100, from public Lighthouse/PageSpeed API + meta tag checks against user-provided domain).

**Defaults accepted:**
- 2a: Domain-only SEO checks — user provides domain in intake, eevolvv runs public checks (no OAuth)
- 2b: New sections appended to existing Evolution Report as `### AD HEALTH` and `### SEO AUDIT`

**AD HEALTH implementation:**
- Claude generates a simulated ad health assessment based on business type, industry, and detected pain points
- Score is deterministic from the intake data (no live ad API access required)
- Output format: score 0–100, 3 bullet findings, 1 recommended action

**SEO AUDIT implementation:**
- Intake form accepts optional `domain` field (e.g., `mybusiness.com`)
- Server calls PageSpeed Insights API (free, no key required for basic checks)
- Fallback: fetch the domain and parse `<title>`, `<meta description>`, Open Graph tags
- Score: weighted composite (performance 40%, meta completeness 30%, mobile 30%)
- Output format: score 0–100, 3 findings, 1 recommended action

**Supabase schema change:**
- Add columns to `submissions`: `ad_health_score INT`, `seo_score INT`, `seo_domain TEXT`

**Affected files:**
- `app/api/seo-audit/route.ts` — NEW: standalone audit endpoint
- `app/api/ad-health/route.ts` — NEW: standalone ad health endpoint
- `app/api/diagnostic/route.ts` — call both after report generation, append sections
- `lib/format-report.ts` — parse + render new section headers with score badges
- `app/report/[id]/page.tsx` — styled score badges for AD HEALTH + SEO AUDIT sections
- `supabase/migrations/010_add_audit_scores.sql` — NEW migration

---

### Feature 3: HyperFrames On-Demand Video Summary

**Overview:** A "Generate Video Summary" button appears on the report permalink page. On click, a Next.js API route generates a 60-second personalized video using HyperFrames (HTML-to-MP4). The video is stored (URL returned), embedded on the permalink page, and linked in the outgoing report email.

**Defaults accepted:**
- 3a: On-demand button ("Generate Video Summary") — avoids latency on every diagnostic
- 3b: Video content: business name, top 3 automation opportunities, 3 stat callouts (hours freed, automations, annual savings), closing CTA to Stripe checkout
- 3c: Both — embedded in permalink page AND emailed as a link

**Video content template:**
```
Scene 1 (0-5s):  Business name + "Your eevolvv Report" wordmark
Scene 2 (5-20s): Top 3 automation opportunities (animated reveal)
Scene 3 (20-35s): Stat callouts — [N] hours/week freed · [N] automations · $[N] annual savings
Scene 4 (35-55s): "Ready to build it?" + Stripe checkout CTA URL
Scene 5 (55-60s): eevolvv logo + eevolvv.com
```

**HyperFrames integration:**
- `HYPERFRAMES_RENDER_URL` env var points to the renderer (local subprocess or hosted endpoint)
- MVP: local subprocess render via `hyperframes` CLI package
- Claude generates the HTML/CSS/JS for each scene; HyperFrames renders to MP4
- Output stored: video file uploaded to Supabase Storage (bucket: `report-videos`) or returned as base64 for small files
- `submissions.video_url` column stores the final URL

**Supabase schema change:**
- Add column to `submissions`: `video_url TEXT`
- Create storage bucket `report-videos` (public read, service-role write)

**Affected files:**
- `app/api/video-summary/route.ts` — NEW: generates HTML, calls HyperFrames, stores URL
- `app/report/[id]/page.tsx` — add `VideoSummaryButton` client component + video embed
- `components/VideoSummaryButton.tsx` — NEW: client component with loading state
- `emails/EvolutionReport.tsx` — add optional `videoUrl` prop + video CTA block
- `supabase/migrations/010_add_audit_scores.sql` — include `video_url` column

---

## 5. UX Notes

- AD HEALTH and SEO AUDIT sections use the existing `report-content` prose style with a score badge rendered as a JetBrains Mono block: `▓▓▓▓▓▓░░░░ 63/100`
- "Generate Video Summary" button uses `<Button variant="secondary">` from `components/ds/`
- While video generates: spinner + "Building your 60-second summary..." copy
- Video embed: `<video controls>` tag with `autoPlay={false}` — no autoplay on permalink
- Email CTA: text link only — "Watch your 60-second summary →" — no inline video in email

---

## 6. Dependencies

| Dependency | Type | Notes |
|-----------|------|-------|
| ClawRouter (BlockRunAI/ClawRouter) | External service | Self-hosted Railway; local Docker for dev |
| PageSpeed Insights API | External API | Free, no key; `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` |
| HyperFrames (@heygen/hyperframes) | npm package | Apache 2.0; subprocess render |
| Supabase Storage | Existing infra | New bucket `report-videos` required |
| `CLAW_ROUTER_URL` | New env var | Dev: localhost:8080; Prod: Railway URL |
| `HYPERFRAMES_RENDER_URL` | New env var | Optional; subprocess fallback if unset |

---

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| ClawRouter Railway deploy latency | Low | Haiku is fast; chat/extract are non-critical path for UX feel |
| PageSpeed API rate limits | Low | Public endpoint; 25,000 req/day free quota |
| HyperFrames render time (>30s) | Medium | Button triggers async job; poll for completion; 90s timeout |
| Domain field not provided by user | High | SEO AUDIT gracefully omits score, shows "domain not provided" |
| Supabase Storage egress cost | Low | Videos are small (<10MB); cost negligible at current scale |

---

## 8. Open Questions

| # | Question | Owner |
|---|---------|-------|
| OQ1 | HyperFrames: subprocess vs hosted endpoint for production? | Eduardo — confirm before Wave 5 |
| OQ2 | Where to add `domain` field in the chat intake flow? | Eduardo — can be optional, post-chat prompt |
| OQ3 | Video storage: Supabase Storage or return signed URL from Railway? | Eduardo — default is Supabase Storage |

---

## 9. Complexity Assessment

```
Tasks:           13
Total points:    39
Sonnet (1-4):   10 tasks
Opus (5-10):     3 tasks  [2a-1: seo-audit, 2a-2: ad-health, 3a-2: video-summary]
High-risk (7+):  0 tasks
Slicing:         Not needed (<100 points)
Gate:            1 gate after Wave 3 — AUDIT CHECKPOINT
```

---

## 10. Orchestration Config

```
Integration cadence:  worktree
Review trigger:       per-gate (manual, no provider configured)
Review scope:         pr-diff
Gate model:           sonnet
Gate count:           1
Gate placement:       After Wave 3 — before video feature starts
Gate label:           AUDIT CHECKPOINT
```

---

## 11. Model Assignments

| Task | Model |
|------|-------|
| 1a-1 Install ClawRouter + dev config | Sonnet |
| 1a-2 Patch extract-intake route | Sonnet |
| 1a-3 Patch chat route | Sonnet |
| 1a-4 Diagnostic route model config | Sonnet |
| 1b-1 Railway deploy + Vercel env | Sonnet |
| 2a-1 seo-audit API route | Opus |
| 2a-2 ad-health API route | Opus |
| 2b-1 Patch diagnostic to append sections | Sonnet |
| 2b-2 Patch format-report + report page | Sonnet |
| DB migration (Wave 4) | Sonnet |
| 3a-1 VideoSummaryButton component | Sonnet |
| 3a-2 video-summary API route | Opus |
| 3b-1 Video content template | Sonnet |
| 3c-1 Email + permalink embed | Sonnet |
