# eevolvv Design System — `components/ds/`

A portable, self-contained component library for all eevolvv surfaces. Three files define the entire system.

## Portability Model

Copy these three paths to any new project and the design system is fully operational:

| File | Purpose |
|------|---------|
| `components/ds/` | All components |
| `app/globals.css` | CSS variables + utility classes |
| `tailwind.config.js` | Token bindings (`paper`, `ink`, `accent`, `rule`) |

---

## Design Tokens

Defined in `app/globals.css` `:root`. Always use these — never raw hex values.

| Token | Value | Role |
|-------|-------|------|
| `--paper` | `#faf7f0` | Page background — warm off-white |
| `--ink` | `#141413` | Primary text + dark section backgrounds |
| `--accent` | `oklch(0.45 0.13 25)` | Brick red — CTAs, markers, highlights |
| `--rule` | `rgba(20,20,19,.14)` | Borders, dividers, separators |

**Inverted sections** (dark bg): swap `--paper` / `--ink` usage. Accent stays the same.

---

## Font Stack

| Family | Weights | Role |
|--------|---------|------|
| Space Grotesk | 400 500 600 700 | UI — headings, wordmarks, body |
| JetBrains Mono | 300 400 500 600 700 | Labels, section markers, terminal blocks, code |
| Newsreader | 300 400 500 700 + italic | Editorial serif — italic accent phrases |

Apply with:
- Space Grotesk: default / `font-display` Tailwind class
- JetBrains Mono: `.mono` utility class
- Newsreader: `--font-serif` / `.serif` utility class

---

## Tailwind Tokens

These map directly to CSS variables via `tailwind.config.js`:

| Tailwind class | Maps to | Usage |
|----------------|---------|-------|
| `bg-paper` / `text-paper` | `var(--paper)` | Background, inverted text |
| `bg-ink` / `text-ink` | `var(--ink)` | Dark backgrounds, primary text |
| `text-accent` / `bg-accent` | `var(--accent)` | CTAs, markers, highlights |
| `border-rule` | `var(--rule)` | Borders, dividers |

---

## Components

### Primitives

---

#### `Button`

File: `components/ds/Button.tsx`

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
}
```

Usage:

```tsx
import { Button } from '@/components/ds/Button';

<Button variant="primary" onClick={handleSubmit}>Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn more</Button>
<Button variant="danger" onClick={handleDelete}>Delete</Button>
```

Notes: `primary` uses `--accent` background with `--paper` text. `ghost` is transparent with `--ink` border. `danger` uses a muted red distinct from `--accent`.

---

#### `Card`

File: `components/ds/Card.tsx`

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
```

Usage:

```tsx
import { Card, CardHeader, CardContent } from '@/components/ds/Card';

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Body content here.</CardContent>
</Card>
```

Notes: White/paper background, `1px solid var(--rule)` border, subtle shadow. Compose with `CardHeader` and `CardContent`.

---

#### `CardHeader`

File: `components/ds/Card.tsx` (exported from same file as `Card`)

```typescript
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}
```

Notes: Bottom border `1px solid var(--rule)`, padding `16px 20px`. Typically holds a title and optional action.

---

#### `CardContent`

File: `components/ds/Card.tsx` (exported from same file as `Card`)

```typescript
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}
```

Notes: Padding `20px`. Main body area of a Card.

---

#### `Badge`

File: `components/ds/Badge.tsx`

```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'neutral';
  children: React.ReactNode;
  className?: string;
}
```

Usage:

```tsx
import { Badge } from '@/components/ds/Badge';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>
<Badge variant="neutral">Draft</Badge>
```

Notes: Pill shape, 11px JetBrains Mono, uppercase. Color-coded background fills. No dot indicator — use `StatusPill` when a live indicator dot is needed.

---

#### `StatusPill`

File: `components/ds/StatusPill.tsx`

```typescript
interface StatusPillProps {
  variant: 'success' | 'warning' | 'danger' | 'neutral';
  children: React.ReactNode;
  className?: string;
}
```

Usage:

```tsx
import { StatusPill } from '@/components/ds/StatusPill';

<StatusPill variant="success">Live</StatusPill>
<StatusPill variant="warning">Degraded</StatusPill>
```

Notes: Same as `Badge` but prepends a filled dot indicator (`●`). Use for system/service status displays.

---

#### `Input`

File: `components/ds/Input.tsx`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
```

Usage:

```tsx
import { Input } from '@/components/ds/Input';

<Input type="text" placeholder="Enter value..." />
<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
```

Notes: `border: 1px solid var(--rule)`, focus ring uses `--accent`. Background `--paper`. Pairs with `Label`.

---

#### `Textarea`

File: `components/ds/Textarea.tsx`

```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}
```

Usage:

```tsx
import { Textarea } from '@/components/ds/Textarea';

<Textarea rows={4} placeholder="Describe the situation..." />
```

Notes: Same visual style as `Input`. Resizable vertically only (`resize-y`).

---

#### `Label`

File: `components/ds/Label.tsx`

```typescript
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}
```

Usage:

```tsx
import { Label } from '@/components/ds/Label';

<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

Notes: JetBrains Mono, 11px, uppercase, 0.1em letter-spacing, `--ink` at 60% opacity. Use above every form field.

---

#### `Sidebar`

File: `components/ds/Sidebar.tsx`

```typescript
interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}
```

Usage:

```tsx
import { Sidebar } from '@/components/ds/Sidebar';

<Sidebar
  items={[
    { icon: <HomeIcon />, label: 'Dashboard', href: '/dashboard' },
    { icon: <ChartIcon />, label: 'Reports', href: '/reports', active: true },
  ]}
  collapsed={false}
  onToggle={() => setCollapsed(!collapsed)}
/>
```

Notes: Left nav, fixed or sticky. Collapses to icon-only mode. Active item uses `--accent` left border indicator. Icon + label rows with `--rule` bottom borders.

---

### eevolvv-Specific Components

---

#### `SectionMarker`

File: `components/ds/SectionMarker.tsx`

```typescript
interface SectionMarkerProps {
  num: string;
  label: string;
  className?: string;
}
```

Usage:

```tsx
import { SectionMarker } from '@/components/ds/SectionMarker';

<SectionMarker num="01" label="OVERVIEW" />
<SectionMarker num="02" label="DIAGNOSTIC ENGINE" />
```

Output renders: `§ 01 · OVERVIEW`

Notes: JetBrains Mono, 11px, uppercase, 0.2em letter-spacing, `--accent` color. Use as a section header in any diagnostic, report, or dashboard surface.

---

#### `TerminalBlock`

File: `components/ds/TerminalBlock.tsx`

```typescript
interface TerminalLine {
  type: 'arrow' | 'sub' | 'comment';
  key: string;
  value?: string;
}

interface TerminalBlockProps {
  lines: TerminalLine[];
  className?: string;
}
```

Usage:

```tsx
import { TerminalBlock } from '@/components/ds/TerminalBlock';

<TerminalBlock
  lines={[
    { type: 'arrow', key: 'STATUS', value: 'ACTIVE' },
    { type: 'sub', key: 'last run', value: '2026-05-03' },
    { type: 'comment', key: '// diagnostics complete' },
  ]}
/>
```

Output:
```
→ STATUS    ACTIVE
  ↳ last run    2026-05-03
// diagnostics complete
```

Notes: Background `rgba(20,20,19,.055)`, `1px solid var(--rule)`, left accent border `3px solid var(--accent)`. JetBrains Mono 13px, line-height 1.9. `arrow` type prefixes `→`, `sub` prefixes `↳` at 50% opacity, `comment` prefixes `//` at 30% opacity.

---

#### `KPIStat`

File: `components/ds/KPIStat.tsx`

```typescript
interface KPIStatProps {
  value: string | number;
  label: string;
  className?: string;
}
```

Usage:

```tsx
import { KPIStat } from '@/components/ds/KPIStat';

<KPIStat value="87" label="SCORE" />
<KPIStat value="12" label="NODES MAPPED" />
<KPIStat value="$4.2M" label="PROJECTED SAVINGS" />
```

Notes: `value` renders large (48–64px, Space Grotesk 600). `label` renders below in JetBrains Mono 11px uppercase, `--ink` at 50% opacity. Use in diagnostic reports and dashboard summary rows.

---

#### `DataRow`

File: `components/ds/DataRow.tsx`

```typescript
interface DataRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}
```

Usage:

```tsx
import { DataRow } from '@/components/ds/DataRow';

<DataRow label="STATUS" value="Active" />
<DataRow label="INDUSTRY" value="Healthcare" />
<DataRow label="REVENUE RANGE" value="$1M–$10M" />
```

Notes: Horizontal layout. `label` is JetBrains Mono 11px uppercase, `--ink` at 50% opacity. `value` is Space Grotesk 14px, `--ink`. Separated by `border-bottom: 1px solid var(--rule)`. Stack multiple `DataRow` components for a data table effect.

---

## Portability Instructions

To transplant this design system into a new project:

1. Copy `components/ds/` — all component files
2. Copy the `:root` block and all utility classes from `app/globals.css`
3. Copy the `theme.extend.colors` block from `tailwind.config.js`:
   ```js
   colors: {
     paper: 'var(--paper)',
     ink: 'var(--ink)',
     accent: 'var(--accent)',
     rule: 'var(--rule)',
   }
   ```
4. Add the Google Fonts CDN link to the new project's `<head>`:
   ```
   https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,700;1,6..72,400;1,6..72,500&family=Instrument+Serif:ital@0;1&family=Press+Start+2P&display=swap
   ```

No additional dependencies required beyond React and Tailwind CSS.

---

## Rules for Claude

**Always use `components/ds/` components. Never build UI from raw Tailwind classes.**

When implementing any UI in the eevolvv project:

- Use `Button`, `Card`, `Input`, etc. from `components/ds/` — do not write ad-hoc `className` strings that duplicate their styles
- Use `--paper`, `--ink`, `--accent`, `--rule` via Tailwind tokens (`bg-paper`, `text-ink`, `text-accent`, `border-rule`) — never raw hex values
- Use `SectionMarker` for any section heading, `TerminalBlock` for any log/process display, `KPIStat` for any metric display
- Apply `.mono` class for JetBrains Mono text, `.serif` for Newsreader — do not set `fontFamily` inline
- Full token and pattern reference: `CLAUDE.md` § Brand Design System
