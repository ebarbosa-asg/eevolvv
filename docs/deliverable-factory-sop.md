# Deliverable Factory SOP

## Purpose

eevolvv can sell immediately only if every purchase turns into a visible product. The Deliverable Factory is the standard operating system for that.

## Rule

No paid product exists without a deliverable card.

Every deliverable must show:

- client
- product name
- price
- status
- promise
- scope
- proof
- owner
- delivery window
- linked OS task
- checkout URL if it is an add-on

## Status Ladder

| Status | Meaning |
| --- | --- |
| `recommended` | Good next purchase or action; not paid yet. |
| `paid` | Included in plan or already paid. |
| `intake` | Needs details, access, files, or approval. |
| `queued` | Accepted and waiting for eevolvv work. |
| `building` | Actively being implemented. |
| `review` | Needs client or eevolvv approval. |
| `live` | Delivered with proof attached. |

## Product Templates

### Client Agent Page

Promise: private command center for requests, recommendations, products, and proof.

Proof:

- private URL
- authorized emails
- agent console
- Ghost Locker product view

### Website Build

Price: `$2,000 one-time`

Scope:

- site/page structure
- responsive build
- contact CTA
- basic metadata
- launch checklist

Proof:

- website URL
- page inventory
- launch checklist
- edit notes

### SCO Management

Price: `$500/mo`

Scope:

- search/AI discovery targets
- service proof
- FAQ/content updates
- monthly action log

Proof:

- monthly SCO action log
- updated pages/content list
- next recommendations

### Extra Automation / Integration

Price: `$300-$750/mo`

Scope:

- one job
- one trigger
- one destination
- one test
- owner-facing runbook

Proof:

- scope card
- integration list
- test result
- live status

### Ads Campaign Setup

Price: `$750 one-time`

Scope:

- campaign map
- landing recommendation
- tracking checklist
- launch notes

Proof:

- campaign map
- audience/keyword notes
- spend approval
- tracking checklist

### Custom Dashboard

Price: `$1,500+`

Scope:

- metric definition
- source list
- dashboard build
- refresh cadence
- owner notes

Proof:

- dashboard URL or screenshot
- source list
- update cadence

## Fulfillment Flow

1. Client pays or submits request.
2. eevolvv creates/receives OS task.
3. Deliverable card is created.
4. Status moves to `intake`.
5. Missing info/access is collected.
6. Status moves to `building`.
7. Proof artifact is attached.
8. Status moves to `review`.
9. Client approves or requests change.
10. Status moves to `live`.

## What Exists In Code

- Client portal: `/os/[clientSlug]`
- Requests API: `/api/os/client-agent/[slug]/requests`
- Deliverables API: `/api/os/client-agent/[slug]/deliverables`
- Deliverable templates: `lib/deliverables.ts`
- Migration: `supabase/migrations/20260515000000_create_client_deliverables.sql`

## To Activate Persistence

Run the Supabase migration:

```bash
supabase db push
```

Or paste `supabase/migrations/20260515000000_create_client_deliverables.sql` into Supabase SQL Editor.

Until the table exists, the client portal shows template deliverables so the product remains understandable.
