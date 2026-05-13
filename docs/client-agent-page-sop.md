# Client Agent Page SOP

**Status:** New operating model  
**Applies to:** Every future eevolvv client  
**Core pivot:** The product is the client agent page. Everything else is a file, action, or paid unlock inside it.

---

## 1. Product Definition

Every client gets one private operating page:

```text
eevolvv.com/os/[client-slug]
```

Example:

```text
eevolvv.com/os/studio23
```

This page is the client-facing product. It is not just a dashboard and not just a website preview. It is the place where the client can:

- Ask for business ideas and next actions.
- Run or request agent actions.
- See what they already paid for.
- See what eevolvv has already built.
- Open files, pages, reports, roadmaps, and assets.
- Buy or unlock the next useful system.

The client should feel: “This is my AI operator for the business.”

---

## 2. Standard Page Sections

Every client agent page should have these sections.

### 1. Agent Header

Purpose: Orient the client.

Required fields:

- Client company name
- Agent name
- Business type
- Current stage: `diagnose`, `onboard`, `build`, or `maintain`
- Primary CTA for the next action

### 2. Paid / Built Files

Purpose: Show proof of work and make deliverables easy to find.

Every thing we build becomes a file card:

- Website
- Landing page
- SEO/SCO idea bank
- Automation roadmap
- Evolution report
- Ads plan
- Brand assets
- Client docs
- Agent workflows
- Future integrations

Each file has one of three statuses:

- `PAID`: included in the current package
- `AVAILABLE`: useful next unlock
- `INCLUDED`: already delivered or in progress

### 3. Agent Actions

Purpose: Make the page operational.

Actions are things the client can do from the page:

- Package a lead
- Generate a content idea
- Create a follow-up message
- Summarize a call
- Request a website update
- Ask for a campaign idea
- Queue a new automation
- Review current tasks

Each action has one of three states:

- `READY`: usable now
- `ACTIVE`: currently being built or used
- `LOCKED`: paid upgrade or future phase

### 4. Next Paid Builds

Purpose: Sell the next logical improvement without feeling salesy.

Paid options should be contextual. Do not show random packages. Show unlocks that naturally follow from the client’s current business system.

Examples:

- CRM sync
- Booking automation
- Local SEO content engine
- Ads management
- Follow-up system
- Review/reputation automation
- Reporting dashboard

---

## 3. Delivery Rule

If eevolvv builds something for a client, it must appear on the agent page.

This includes rough drafts. The page is the source of truth. If a file, build, report, or feature only exists in Slack, email, local docs, or our internal OS, it is not truly delivered yet.

---

## 4. Internal vs Client-Facing OS

There are two views of the same relationship.

### Internal OS

Used by eevolvv.

Routes:

- `/os`
- `/os/clients`
- `/os/clients/[id]`
- `/os/pipeline`
- `/os/tasks`
- `/os/builds`

Tracks:

- Internal tasks
- Client stage
- Contract value
- Notes
- Agents
- Service tasks
- Activity log

### Client Agent Page

Used by the client.

Route:

- `/os/[client-slug]`

Shows:

- Their agent page
- Their paid files
- Their available unlocks
- Their agent actions
- Their next recommendations

No internal sidebar. No eevolvv admin controls. No internal-only notes.

---

## 5. First Client Standard: Studio 23

Canonical route:

```text
/os/studio23
```

Initial files:

- Brand website preview
- Inspection intake agent
- Evolution report
- SEO/SCO idea bank
- Automation roadmap

Initial actions:

- Qualify new inspection request
- Prepare callback packet
- Choose first live automation
- Generate local content idea

Initial paid unlocks:

- CRM sync
- Storm follow-up system
- Local SEO content engine

---

## 6. SOP For New Clients

### Step 1. Create client slug

Use lowercase, no spaces, no punctuation unless needed.

Examples:

- `studio23`
- `mariasalon`
- `northloopdental`
- `apexroofing`

### Step 2. Create client agent config

Add the client to:

```text
data/clientAgentPages.ts
```

Required:

- `slug`
- `company`
- `allowedEmails`
- `agentName`
- `businessType`
- `stage`
- `headline`
- `summary`
- `files`
- `actions`
- `paidOptions`

Client agent pages are protected by Google OAuth. Add the client email address or addresses that should be allowed to view the page. eevolvv owner emails retain access for support.

### Step 3. Add first files

At minimum, every new client should start with:

- Diagnostic / intake notes
- Evolution report
- First build or preview
- Automation roadmap
- Needed-from-client list

### Step 4. Add first operational action

Every client agent page needs at least one action that does something concrete for the business.

Examples:

- Roofing: qualify inspection lead
- Salon: package booking request
- Dental: route new patient inquiry
- Fitness: recover missed lead
- Restaurant: package catering request

### Step 5. Add contextual paid unlocks

Add 2-4 next-build options that match the diagnostic.

Bad:

- “Buy more services”

Good:

- “Turn inspection leads into CRM jobs”
- “Generate weekly service-area SEO pages”
- “Send automated post-visit review requests”

### Step 6. Keep the page current

Every client work session ends by updating the agent page.

Checklist:

- [ ] New build added as a file
- [ ] Delivered docs linked
- [ ] Paid status updated
- [ ] Next actions updated
- [ ] Upsell options still relevant
- [ ] Internal OS client record updated

---

## 7. Strategic Positioning

The client is not paying for “a website” or “SEO” or “ads” in isolation.

They are paying for an AI business agent page that compounds:

- The website becomes a file.
- SEO becomes a file and recurring action.
- Ads become a file and recurring action.
- Automations become actions.
- Reports become files.
- Strategy becomes recommendations.

This makes eevolvv a service, not software, while still giving the client one clear product they can understand.
