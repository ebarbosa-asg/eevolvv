# Studio 23 Agent Page Plan

**Canonical client route:** `/os/studio23`  
**Internal client record:** see `08-os-records-draft.md`  
**Product framing:** Studio 23 is not just buying a website. Studio 23 is buying an operating agent page.
**Current allowed Google email:** `info@studio23roofing.com`

---

## Page Promise

Studio 23’s agent page should answer:

> What has eevolvv built for us, what can we do from here, and what should we unlock next?

---

## Current Included Files

- Brand website preview: `/studio-23`
- Inspection intake agent: `/studio-23/agent`
- Evolution report: `02-evolution-report.md`
- SEO/SCO idea bank: `05-seo-sco-ideas.md`
- Automation roadmap: `06-automation-roadmap.md`

---

## Current Agent Actions

1. **Qualify new inspection request**
   - Capture lead, property, service, urgency, claim status, and project details.

2. **Prepare callback packet**
   - Create clean handoff for the Studio 23 team.

3. **Choose first live automation**
   - Decide whether to prioritize CRM sync, booking, follow-up, or claim tracking.

4. **Generate local content idea**
   - Future locked action: create roofing content ideas from the SEO/SCO bank.

---

## First Paid Unlocks

1. **CRM sync**
   - Push inspection leads into the chosen CRM.

2. **Storm follow-up system**
   - Automated follow-up for storm, hail, wind, and inspection leads.

3. **Local SEO content engine**
   - Monthly service-area content briefs and published pages.

---

## Client Conversation Frame

Use this language:

> “Your website is one file inside your Studio 23 agent page. The real product is the page that lets you control leads, content, automations, and future business ideas from one place.”

Avoid this language:

> “We built you a website and some extras.”

---

## Next Implementation Pass

- [x] Create `/os/studio23` as the first client-facing agent page.
- [x] Remove internal OS chrome from client-facing `/os/[client-slug]` routes.
- [x] Protect `/os/studio23` with Google OAuth allowlist access.
- [ ] Connect files to public-safe rendered docs instead of raw markdown paths.
- [ ] Replace mailto inspection intake with saved lead records.
- [ ] Add auth/token gate before sending to a real client.
- [ ] Add “request this build” flow for paid unlocks.
- [ ] Mirror agent-page file/action changes into the internal OS client record.
