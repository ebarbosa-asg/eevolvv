# FULL AUDIT & GAME PLAN — eevolvv + Archimedes Systems Group
# Generated: May 14, 2026

---

## PART 1: EEVOLVV AUDIT

### What Exists Today

**The Stack:**
- Next.js 14.2.5 (React 18, TypeScript, Tailwind CSS)
- Deployed on Vercel, custom domain eevolvv.com
- Database: Supabase (Postgres + Auth)
- AI: Anthropic Claude (diagnostic engine + chat)
- Email: Resend (transactional emails)
- Payments: Stripe (subscriptions + one-time, live products created)
- Analytics: PostHog (funnel tracking)
- Error tracking: Sentry
- Memory: Mem0 (per-client memory, on feature branch)
- Observability: Langfuse

**The App Structure (40+ routes):**

| Section | Routes | Status |
|---------|--------|--------|
| Public site | /, /pricing, /contact, /privacy, /terms, /legal | Live, production |
| Diagnostic engine | / (ChatEngine), /api/chat, /api/diagnostic | Live, working |
| YC pitch deck | /yc (standalone HTML, 13 sections) | Live |
| Industry pages | /accounting, /agency, /auto-shop, /childcare, /chiro, /cleaning, /contractors, /dental, /ecommerce, /fitness, /medspa, /real-estate, /restaurant, /salon | 14 SEO landing pages |
| Client OS | /os/* (dashboard, clients, agents, pipeline, tasks, finance, investors, builds, feed, ghost-locker, links) | Live, auth-gated |
| Onboarding | /onboard/[token], /onboard/success | Live |
| Client dashboard | /client/[token] | Live |
| Reports | /report/[id], /run/[shareToken] | Live |
| Stripe | /api/stripe/* (checkout, webhook, billing portal, cancel, update) | Live, products configured |
| Cron jobs | /api/cron/* (agents, followup, churn-detection, monthly-report, quarterly-recalibration) | Scheduled on Vercel |
| Auth | /api/auth/[...nextauth], /signin | Live |
| Talent (worktree only) | /talent/* (join, post, success, privacy, terms) | In worktree, NOT merged to main |

**Stripe Products (LIVE):**
- Agent One: $499/mo ($4,990/yr) — 1 automation
- Agent Three: $999/mo ($9,990/yr) — 3 automations
- Agent Five: $1,999/mo ($19,990/yr) — 5 automations + ads/SEO/SCO
- Add-ons: Website Build ($2K), SCO Management ($500/mo), Extra Automation ($300-750/mo), Ads Setup ($750), Custom Dashboard ($1.5-5K)

**Email System (13 templates):**
Evolution Report, Welcome, Follow-up (1-3), Monthly Report, Quarterly Recalibration, Build Live/Ready/Started, Payment Failed, Win-Back, Onboarding

**What's On Branches/Worktrees (NOT on main):**
- feature/memory-bridge-client — Supabase client_memories + Bridge sync (current branch, 2 commits ahead of main)
- feature/integrations-mem0-langgraph-llamaindex — Mem0 per-client memory, LangGraph diagnostic graph, LlamaIndex RAG
- feature/industry-vertical-workflows — 14 industry verticals with chat intake, report panels, onboarding, follow-up emails
- 5 locked agent worktrees (KARIMO agents)

### Issues & Tech Debt Found

1. Talent pages exist only in worktree — /talent/* routes are in a locked worktree but never merged to main
2. Uncommitted changes on current branch — AGENTS.md, globals.css, ClientAgentPage.tsx, client-agent-pages.ts modified but not committed
3. Stale worktrees — 5 locked worktrees taking up space
4. No CRM integration — #1 critical gap per ops blueprint
5. No tests — test:agents script exists but tests/ directory is minimal
6. Middleware matcher is broad — runs on every request, performance concern
7. No status page — status.eevolvv.com not set up
8. No document signing — service agreement exists but no e-sign flow
9. No accounting integration — Wave/QuickBooks not connected
10. Industry pages may be thin — need content audit for quality/depth
11. No sitemap.xml or robots.txt — important for SEO

---

## PART 2: ARCHIMEDES SYSTEMS GROUP AUDIT

### What Exists Today

**The Pivot:** ASG was rebranded to eevolvv/talent. The standalone Archimedes platform was absorbed into the eevolvv app.

**ASG Digital Assets Found:**
- /Users/loko/Downloads/asg-design/ — HTML/CSS/JS design prototypes (ASG Dashboard, hero, shell)
- /Users/loko/.cursor/plans/archimedes_marketplace_buildout_69a13bc7.plan.md — Two-sided marketplace plan
- /Users/loko/.claude/plans/applications-archimedes-systems-pure-sutherland.md — Contract Radar redesign plan
- /Users/loko/.gstack/projects/ebarbosa-asg-archimedes-systems-group/ — GStack project
- /Users/loko/.hermes/kanban/boards/asg/ — Kanban board (empty, no tasks)

**The Original ASG Concept (from plans):**
- Two-sided marketplace: contractors post tasks → contributors claim → submit → get paid
- Stripe Connect Express for contributor payouts
- Contract Radar: SAM.gov contract opportunity scanner with AI classification
- Focus on SDVOSB/VOSB set-asides + agent-automatable work

**Current State:** ASG as a standalone product is paused/absorbed. Talent marketplace features not built in main app.

### ASG Issues

1. No standalone ASG website
2. Marketplace not built — exists only as a plan
3. Contract Radar not built — exists only as a plan
4. ASG kanban is empty
5. ASG design prototypes not implemented
6. Unclear if ASG is a separate business or product line

---

## PART 3: THE GAME PLAN

### Immediate Priorities (Week 1-2)

1. Stabilize eevolvv main branch — commit pending changes, merge memory-bridge-client, clean worktrees
2. Merge talent pages to main — unblock talent.eevolvv.com subdomain
3. Set up CRM — HubSpot Free, connect to diagnostic funnel
4. Add missing SEO basics — sitemap.xml, robots.txt, meta tags

### Short-Term Build (Weeks 3-6)

5. Investor pitch deck completion — password gate, redacted report sample, enterprise callout
6. Diagnostic funnel optimization — A/B test, lead scoring, HubSpot automation
7. Client agent page improvements — more interactive features, Mem0 memory
8. Stripe billing improvements — self-service management, proration, add-on purchase flow

### Medium-Term (Months 2-3)

9. Decide on ASG strategy — marketplace vs Contract Radar vs consulting vs fold into eevolvv
10. Build chosen ASG direction
11. Operations infrastructure — status page, DocuSign, Wave, 1Password, Slack
12. Content & SEO engine — blog, ghost work series, founder content calendar

### Long-Term (Months 3-6)

13. Micro tier / WhatsApp integration — WhatsApp Business API, Telegram bot
14. Enterprise wedge execution — QA, finance audit, IT compliance agent templates
15. Fundraising execution — close $1M pre-seed

---

## PART 4: OPTIMAL AGENT SETUP

### My Role: Technical Co-Founder / Head of Ops

**Kanban Boards:**
- eevolvv board — product tasks, bugs, features
- asg board — ASG-specific work

**Cron Jobs to Run:**

| Job | Frequency | Purpose |
|-----|-----------|---------|
| Site health check | Every 6 hours | Ping eevolvv.com, check APIs, alert if down |
| Deployment monitor | Every hour | Check Vercel deployments, verify production |
| Lead digest | Daily 9am | New submissions, contacts, signups |
| Weekly audit | Monday 8am | Review boards, flag stale tasks |
| ASG weekly COO audit | Weekly | ASG pipeline, opportunities, blockers |
| Monthly metrics | 1st of month | Revenue, signups, funnel, performance |

**Development Workflow:**
- I work on feature branches, you review and merge
- I delegate complex features to sub-agents (Claude Code, Codex)
- I handle routine maintenance, bug fixes, deployments autonomously
- You focus on sales, fundraising, and strategy

**What I Need From You:**
1. Strategic decisions — ASG direction, weekly priorities
2. Access to accounts (HubSpot, PostHog, etc.)
3. Feedback loop — tell me when I'm over/under-building
4. Content — your voice, stories, vision (I draft, you approve)

**What I'll Proactively Do:**
1. Monitor everything — site health, deployments, errors, leads
2. Ship features from kanban priority without waiting
3. Fix bugs as I find them
4. Research — competitive intel, market data, tools
5. Report — weekly summaries, immediate alerts for critical issues
