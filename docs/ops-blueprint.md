# eevolvv — Internal Operations Blueprint
**Version:** 1.0 · May 2026 · For review by E before build begins

---

## Part 1 — Confirmed Current Stack

| Tool | Category | What it does for eevolvv |
|------|----------|--------------------------|
| **Mercury** | Banking | Business checking, wire transfers, debit card |
| **Stripe** | Payments | Invoicing, subscriptions, payment processing |
| **Stripe Atlas** | Entity | Delaware C corp maintenance |
| **Supabase** | Database | Diagnostic submissions, rate limiting, future client data |
| **Vercel** | Hosting | eevolvv.com deployment + preview environments |
| **Resend** | Transactional email | Evolution Report delivery, system emails |
| **Anthropic (Claude)** | AI engine | Diagnostic chat, future agent pipeline |
| **GitHub** | Version control | ebarbosa-asg/eevolvv repo, future team PRs |
| **Grasshopper** | Business phone | +1 (844) 433-8658 — calls + SMS |
| **Calendly** | Scheduling | Prospect + client booking |
| **Google Workspace** | Core productivity | @eevolvv.com Gmail, Calendar, Drive, Docs, Meet |

---

## Part 2 — Recommended Tool Additions

These are the gaps. Each recommendation is the best-fit tool for a pre-seed, solo-founder stage — free or near-free, with clean APIs, and room to scale.

### 2A — CRM (CRITICAL GAP)
**Recommended: HubSpot (Free CRM)**
- Tracks every lead, deal, and client contact in one place
- Pipeline view (Lead → Discovery → Proposal → Contract → Active Client)
- Email sequences + meeting logging (auto-logs Calendly bookings)
- Free forever for contacts/deals; upgrade only if you add sales reps
- Alternative: Pipedrive ($15/mo) — simpler, cleaner UI, better for solo ops

*Why you need this now:* You're fundraising + doing outbound. Without a CRM, deals fall through cracks. This is the #1 missing piece.

### 2B — Project / Task Management (CRITICAL GAP)
**Recommended: Linear (dev tasks) + Notion (docs/knowledge base)**
- **Linear** — issue tracking for all eevolvv product work, GitHub integration, sprint planning. Already using GitHub so Linear slots right in.
- **Notion** — company wiki, SOPs, client onboarding docs, investor materials. Replace scattered .md files with a structured knowledge base.
- Alternative single tool: Notion alone (has project tracking too, less opinionated than Linear)

### 2C — Team Communication
**Recommended: Slack (Free tier)**
- Even solo: create channels per client, per project, per function
- Future hires / contractors slot in immediately
- Integrations: Stripe → #revenue, Vercel → #deploys, GitHub → #engineering
- Alternative: Discord (free, good for async; less professional for client invites)

### 2D — Document Signing
**Recommended: DocuSign or PandaDoc**
- You have a client service agreement (eevolvv-service-agreement.docx) — needs e-sign
- **PandaDoc** (recommended): $19/mo, has proposal + contract templates, CRM sync
- **DocuSign**: $15/mo, industry standard, trusted by enterprise clients
- Free alternative: Adobe Sign (limited) or HelloSign (now Dropbox Sign)

### 2E — Product Analytics
**Recommended: PostHog (Free, self-hosted or cloud)**
- Track diagnostic form starts, completions, drop-off rates, page visits
- Open-source, generous free tier (1M events/mo)
- Vercel integration in one click
- Alternative: Mixpanel (free tier), Plausible ($9/mo — privacy-first, simpler)

### 2F — Accounting / Bookkeeping
**Recommended: Wave (Free) → QuickBooks (when revenue kicks in)**
- **Wave**: 100% free, connects to Mercury, tracks income/expenses, generates P&L
- **QuickBooks Online**: $30/mo — better for Delaware C corp compliance, investor reporting
- You'll need clean books for your pre-seed raise. Start Wave now, migrate to QBO at $10K MRR.

### 2G — Password / Secrets Management
**Recommended: 1Password Teams ($4/user/mo)**
- Store all API keys, env vars, tool credentials
- Share securely when you hire contractors
- Currently your .env.local is the only secrets store — that's a single point of failure

### 2H — Status Page / Uptime Monitoring
**Recommended: BetterUptime (Free tier)**
- Monitor eevolvv.com + your API endpoints
- Auto-notify if site goes down (Slack + email)
- Public status page at status.eevolvv.com — builds enterprise client trust

---

## Part 3 — Full Dashboard Module Map

The ops dashboard (`ops.eevolvv.com`) is organized into 8 modules. Each module has a data source and a primary action.

### MODULE 1 — Command Center (Home)
*"What do I need to do today"*

| Widget | Data Source | What it shows |
|--------|-------------|---------------|
| Today's meetings | Google Calendar API | Next 3 events, join links |
| Open tasks | Linear / Notion API | Overdue + due-today items |
| Flagged emails | Gmail API | Starred or labeled "Action Required" |
| Revenue pulse | Stripe API | MTD revenue vs. last month |
| Site status | BetterUptime / Vercel | Green/yellow/red health indicator |

### MODULE 2 — Revenue & Finance
*"Is the business healthy"*

| Widget | Data Source | What it shows |
|--------|-------------|---------------|
| MRR / ARR | Stripe | Monthly recurring revenue, trend chart |
| Cash balance | Mercury API | Current bank balance |
| Recent transactions | Mercury + Stripe | Last 10 charges + bank movements |
| Invoices | Stripe | Open, overdue, paid this month |
| Runway calculator | Mercury + Wave | Months of runway at current burn |
| Top customers | Stripe | Revenue by client |

### MODULE 3 — Pipeline & CRM
*"Where are deals"*

| Widget | Data Source | What it shows |
|--------|-------------|---------------|
| Deal pipeline | HubSpot API | Kanban: Lead → Discovery → Proposal → Contract → Active |
| Deals closing this month | HubSpot | Value + probability |
| Recent activity | HubSpot | Last email, call, meeting per deal |
| Follow-up queue | HubSpot | Contacts not touched in 7+ days |
| Calendly bookings | Calendly API | Scheduled calls this week |

### MODULE 4 — Clients
*"How are active clients doing"*

| Widget | Data Source | What it shows |
|--------|-------------|---------------|
| Active client roster | Supabase (custom table) | Client name, tier, start date, contract end |
| Health score | Supabase | Last check-in, tasks completed, status (green/yellow/red) |
| Next action | Supabase | What's due per client |
| Contract expiries | Supabase + DocuSign/PandaDoc | 30/60/90 day warnings |
| Client communications | Gmail API | Last email thread per client |

### MODULE 5 — Product & Tech
*"Is the product working"*

| Widget | Data Source | What it shows |
|--------|-------------|---------------|
| Deployment status | Vercel API | Last deploy, build status, preview URLs |
| Diagnostic submissions | Supabase | Total, this week, completion rate |
| Email delivery | Resend API | Evolution Reports sent, bounce/open rates |
| API health | Custom ping | Claude API, Supabase, Resend latency |
| Error log | Vercel runtime logs | Last 10 errors |
| Rate limit hits | Supabase | IPs that hit the 3/hr cap |

### MODULE 6 — Marketing & Growth
*"Are people finding us"*

| Widget | Data Source | What it shows |
|--------|-------------|---------------|
| Website traffic | PostHog / Plausible | Sessions, unique visitors, top pages |
| Diagnostic funnel | PostHog | Start → Complete → Email sent conversion |
| Top traffic sources | PostHog | Where visitors come from |
| Email campaigns | Resend / future Loops.so | Open rates, click rates |
| LinkedIn / social | Manual or later API | Impressions, follows (manual entry until API) |

### MODULE 7 — Engineering
*"What's being built"*

| Widget | Data Source | What it shows |
|--------|-------------|---------------|
| Open PRs | GitHub API | Title, author, age, review status |
| Recent commits | GitHub API | Last 10 commits, branch, message |
| Open issues | GitHub / Linear | Bug count, feature requests by priority |
| Active sprints | Linear API | Current sprint progress |
| Deploy history | Vercel API | Last 10 production deploys |

### MODULE 8 — Investor Relations
*"Fundraise readiness"*

| Widget | Data Source | What it shows |
|--------|-------------|---------------|
| Raise status | Manual | Target: $1M · Stage: Pre-seed · Q2 2026 |
| Investor pipeline | HubSpot (custom pipeline) | Investors: Intro → DD → Term Sheet → Closed |
| Key metrics for deck | Stripe + PostHog + Supabase | MRR, diagnostics run, clients, NPS |
| Data room links | Google Drive | Quick links to pitch.html, financials, incorporation docs |
| [X] placeholders | Manual | Traction metrics to fill in pitch.html |

---

## Part 4 — Integration Map

```
GOOGLE WORKSPACE ──────────────────── Calendar, Gmail, Drive
STRIPE ─────────────────────────────── Revenue, Invoices, Customers
MERCURY ────────────────────────────── Cash balance, Transactions
HUBSPOT ────────────────────────────── CRM Pipeline, Contacts, Deals
SUPABASE ───────────────────────────── Diagnostic submissions, Client table, Health scores
VERCEL ─────────────────────────────── Deployments, Build status, Runtime logs
GITHUB ─────────────────────────────── PRs, Commits, Issues
LINEAR ─────────────────────────────── Tasks, Sprints, Issues
RESEND ─────────────────────────────── Email delivery stats
CALENDLY ───────────────────────────── Scheduled meetings
POSTHOG ────────────────────────────── Analytics, Funnel
BETTERUPTIME ───────────────────────── Uptime, Incident alerts
PANDADOC/DOCUSIGN ──────────────────── Contract status, Signatures
```

---

## Part 5 — Build Phases

### Phase 0 — Tool Setup (Before building the dashboard)
1. Set up HubSpot CRM (free) → import any existing contacts
2. Create Linear workspace → migrate GitHub issues
3. Set up PostHog → add tracking to eevolvv.com
4. Create Wave account → connect Mercury
5. Set up BetterUptime → monitor eevolvv.com
6. Set up 1Password → migrate all credentials

### Phase 1 — Dashboard MVP (Build first)
- Auth: Google OAuth restricted to @eevolvv.com
- Modules: Command Center, Revenue & Finance, Product & Tech
- Integrations: Google Calendar, Stripe, Mercury, Supabase, Vercel
- Stack: Next.js, Tailwind, Vercel, Supabase (session store)

### Phase 2 — Pipeline + Clients
- Modules: Pipeline & CRM, Clients
- Integrations: HubSpot, Calendly, DocuSign/PandaDoc

### Phase 3 — Full Operations
- Modules: Marketing & Growth, Engineering, Investor Relations
- Integrations: GitHub, Linear, PostHog, Resend

---

## Part 6 — Tech Architecture

```
ops.eevolvv.com (standalone Next.js app)
├── /                     → Command Center (home)
├── /revenue              → Revenue & Finance
├── /pipeline             → Pipeline & CRM
├── /clients              → Clients
├── /product              → Product & Tech
├── /marketing            → Marketing & Growth
├── /engineering          → Engineering
└── /investor             → Investor Relations

AUTH: NextAuth.js + Google OAuth (restrict to @eevolvv.com)
API ROUTES: /api/[integration]/[resource] → proxy + cache
CACHE: Supabase (store refreshed API data, TTL per source)
DEPLOY: Vercel (separate project from eevolvv.com)
DOMAIN: ops.eevolvv.com (CNAME → Vercel)
```

### API Authentication Strategy
Each integration uses read-only API keys stored in Vercel env vars. The dashboard never writes to external systems (read-only by design in Phase 1). Write actions (create deal, send email, update task) come in Phase 2 with explicit confirmation UI.

---

## Open Questions for E to Confirm

1. **CRM**: HubSpot Free vs. Pipedrive $15/mo — preference?
2. **Project mgmt**: Linear + Notion vs. Notion alone?
3. **Accounting**: Start with Wave (free) or go straight to QuickBooks?
4. **E-sign**: DocuSign vs. PandaDoc?
5. **Analytics**: PostHog vs. Plausible ($9/mo, simpler)?
6. **Domain**: ops.eevolvv.com confirmed?
7. **Slack**: Set up now even solo, or wait until first hire?
8. Are there any clients / prospects currently tracked anywhere (spreadsheet, notes)?

---

*Next step: Confirm tool stack + module priorities → begin Phase 0 tool setup → Phase 1 dashboard build*
