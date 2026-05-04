# OS Dashboard — ds/ Replacement Map

| File | Current pattern | Replace with |
|------|----------------|-------------|
| `app/os/HubClient.tsx` | Local `SectionMarker` function | `<SectionMarker>` from `components/ds/` |
| `app/os/HubClient.tsx` | Local `Stat` KPI card (rgba div) | `<KPIStat>` from `components/ds/` |
| `app/os/HubClient.tsx` | `CARD` constant div (`rgba(255,255,255,0.04)` bg) | `<Card><CardContent>` from `components/ds/` |
| `app/os/HubClient.tsx` | Local `StatusBadge` (agent status chip) | `<Badge variant="success|warning|danger|neutral">` |
| `app/os/HubClient.tsx` | `.os-status-chip` task status (todo/in_progress/done/blocked) | `<Badge variant="neutral|warning|success|danger">` |
| `app/os/HubClient.tsx` | `.os-stage-pill` deal stage pills | `<Badge>` variant mapped per stage |
| `app/os/HubClient.tsx` | `.os-stage-pill` investor stage pills | `<Badge>` variant mapped per stage |
| `app/os/HubClient.tsx` | `.finance-stat-card` div | `<Card><CardContent>` |
| `app/os/HubClient.tsx` | `.finance-source-tag` ("live stripe") | `<StatusPill variant="success">live stripe</StatusPill>` |
| `app/os/HubClient.tsx` | `.finance-manual-tag` ("manual") | `<Badge variant="neutral">manual</Badge>` |
| `app/os/HubClient.tsx` | `<input style={INPUT_STYLE}>` in all add forms | `<Input>` from `components/ds/` |
| `app/os/HubClient.tsx` | `<div style={MONO_LABEL}>` form labels | `<Label>` from `components/ds/` |
| `app/os/HubClient.tsx` | `.os-meta-btn` ("+ new task", "+ add investor") | `<Button variant="ghost" size="sm">` |
| `app/os/HubClient.tsx` | Form submit buttons ("create", "add deal") | `<Button variant="primary" size="sm">` |
| `app/os/HubClient.tsx` | "cancel" text buttons | `<Button variant="ghost" size="sm">` |
| `app/os/HubClient.tsx` | Report expand block (accent left border, mono text) | `<TerminalBlock lines={[...]} />` |
| `app/os/HubClient.tsx` | Quick links cards (§ 07 — 18-item grid) | `<Card>` with hover |
| `app/os/HubClient.tsx` | Internal docs cards (§ 08 — 4-item grid) | `<Card>` with hover |
| `app/os/HubClient.tsx` | Sticky topbar frosted div | New `<OSTopbar>` in `app/os/components/OSTopbar.tsx` |
| `app/os/HubClient.tsx` | `HealthDot` export | New `app/os/components/shared.tsx` |
| `app/os/HubClient.tsx` | `StagePipeline` export | New `app/os/components/shared.tsx` |
| `app/os/HubClient.tsx` | `<style>{RESPONSIVE_CSS}</style>` injected styles | Tailwind responsive classes |
| `app/os/HubClient.tsx` | 989-line monolith | Split into 9 section components + `<HubClient>` orchestrator |
| `app/os/clients/[id]/ClientWorkspace.tsx` | Local `SectionLabel` function | `<SectionMarker>` from `components/ds/` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | Topbar breadcrumb div | New `<OSBreadcrumb>` in `app/os/components/OSBreadcrumb.tsx` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | `.ws-card` div | `<Card>` from `components/ds/` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | `.agent-card` div | `<Card><CardContent>` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | `<input style={INPUT}>` | `<Input>` from `components/ds/` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | `<textarea style={INPUT}>` | `<Textarea>` from `components/ds/` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | `<div style={MONO_LABEL}>` labels | `<Label>` from `components/ds/` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | Task status badge buttons | `<Badge>` variant mapped from status |
| `app/os/clients/[id]/ClientWorkspace.tsx` | Activity log entries (time + action) | `<DataRow label={relativeTime} value={action}>` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | Notes textarea with terminal border | `<Textarea>` inside terminal-border wrapper |
| `app/os/clients/[id]/ClientWorkspace.tsx` | Form submit buttons | `<Button variant="primary" size="sm">` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | "cancel" buttons | `<Button variant="ghost" size="sm">` |
| `app/os/clients/[id]/ClientWorkspace.tsx` | `<style>{WORKSPACE_CSS}</style>` | Tailwind responsive classes |
| `app/os/clients/[id]/ClientWorkspace.tsx` | Cross-imports from HubClient | Import from `app/os/components/shared.tsx` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | Left rail step nav (200px fixed div) | `<Sidebar items={STEPS}>` from `components/ds/` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | Step header `§ 0{step} · LABEL` div | `<SectionMarker num="01" label="IDENTITY" />` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | Topbar breadcrumb div | New `<OSBreadcrumb>` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | `<input style={INPUT}>` | `<Input>` from `components/ds/` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | `<textarea style={INPUT}>` | `<Textarea>` from `components/ds/` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | `<div style={MONO_LABEL}>` labels | `<Label>` from `components/ds/` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | Review `CARD` constant divs | `<Card><CardContent>` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | Next-runs preview (accent left border, mono) | `<TerminalBlock lines={nextRuns.map(...)} />` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | Deploy environment cards | `<Card>` with accent left border |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | Run output `<pre>` block | `<TerminalBlock lines={[...]} />` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | Run history rows with status dot | `<Card><CardContent>` + `<StatusPill>` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | `● success / ● error` status spans | `<StatusPill variant="success|danger">` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | "Save & Continue →" button | `<Button variant="primary">Save & Continue →</Button>` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | "← Back" button | `<Button variant="ghost">← Back</Button>` |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | "Done — back to workspace" Link | `<Button variant="primary">` as `<Link>` |
