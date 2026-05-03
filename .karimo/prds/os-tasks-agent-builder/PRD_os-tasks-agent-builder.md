# PRD: OS Tasks Area + Agent Builder
**Slug:** os-tasks-agent-builder  
**Status:** approved  
**Date:** 2026-05-02

## Problem
The `/os` client workspace has basic task tracking and a flat agent add form. Neither is sufficient for actually delivering an automation project to a client:
- Tasks can't be linked to the agent they're building toward
- The agent add form has no trigger, instructions, or deployment pipeline — it's just metadata storage
- There's no structured way to take an agent from "concept" to "live"

## Solution
Two upgrades to the existing OS:

### 1. Tasks Area Upgrade (ClientWorkspace)
Upgrade the existing `§ B SERVICE TASKS` section in `/os/clients/[id]`:
- Link tasks to a specific agent via `agent_id` (shows as pill badge)
- Add `category` (research / build / qa / review / deploy / comms)
- Add `estimated_hrs`, `blocked_reason` (visible only when blocked)
- Add delete button per task (API exists, no UI yet)
- Move `+ add task` to top of section

### 2. Agent Builder (New Page)
New route `/os/clients/[id]/agents/[agentId]` with a 6-step wizard:
1. **Identity** — name, type, description
2. **Instructions** — full monospace system prompt textarea
3. **Integrations** — inline chip multi-select (HubSpot, Slack, GitHub, Supabase, etc.)
4. **Trigger** — 3-card picker: Manual / Schedule / Webhook, with per-type config and "Next 3 runs" preview for cron
5. **Review** — read-only summary + synthesized "This agent will…" sentence
6. **Deploy** — Heroku-style 3-stage pipeline (DEV → STAGING → LIVE) with promote buttons

## Out of Scope
- OAuth flows for integration authentication
- Actual agent execution engine
- Cross-client task board
- Mobile sidebar changes

## Research
See `.karimo/prds/os-tasks-agent-builder/research/summary.md`
