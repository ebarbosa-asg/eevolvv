import fs from 'fs'
import path from 'path'

const GHOST_DIR = path.join(process.cwd(), 'ghost-locker')

export type Phase = 'INTAKE' | 'BLUEPRINT' | 'BUILD' | 'EVAL' | 'LOCK'

export const PHASES: Phase[] = ['INTAKE', 'BLUEPRINT', 'BUILD', 'EVAL', 'LOCK']

export const PHASE_LABELS: Record<Phase, string> = {
  INTAKE:    '§ 01 · INTAKE',
  BLUEPRINT: '§ 02 · BLUEPRINT',
  BUILD:     '§ 03 · BUILD',
  EVAL:      '§ 04 · EVAL',
  LOCK:      '§ 05 · LOCK',
}

export interface ClientBuild {
  codename: string
  agentName: string
  phase: Phase
  phaseIndex: number   // 0-4
  complexity: number
  complexityLabel: 'STANDARD' | 'COMPLEX' | 'ENTERPRISE'
  started: string
  operator: string
  notes: string
  evalScore?: number
  lockedDate?: string
  nextReview?: string
  isLocked: boolean
}

export interface ClientDetail extends ClientBuild {
  files: Record<string, boolean>
}

// ── Phase detection by file presence ──────────────────────────────────────

const PHASE_GATES: [string, Phase][] = [
  ['handoff/client-docs.md',   'LOCK'],
  ['eval/results.md',          'EVAL'],
  ['build/system-prompt.md',   'BUILD'],
  ['blueprint.md',             'BLUEPRINT'],
  ['intake.md',                'INTAKE'],
]

function detectPhase(clientDir: string): Phase {
  for (const [file, phase] of PHASE_GATES) {
    if (fs.existsSync(path.join(clientDir, file))) return phase
  }
  return 'INTAKE'
}

function phaseIndex(phase: Phase): number {
  return PHASES.indexOf(phase)
}

function complexityLabel(score: number): 'STANDARD' | 'COMPLEX' | 'ENTERPRISE' {
  if (score <= 8)  return 'STANDARD'
  if (score <= 16) return 'COMPLEX'
  return 'ENTERPRISE'
}

// ── Markdown table parser ──────────────────────────────────────────────────

function parseTable(md: string, section: string): string[][] {
  const re = new RegExp(`##\\s+${section}[\\s\\S]*?(?=\\n##|$)`)
  const match = md.match(re)
  if (!match) return []

  return match[0]
    .split('\n')
    .filter(l => l.trim().startsWith('|') && !l.includes('---') && !l.includes('Codename'))
    .map(line => line.split('|').slice(1, -1).map(c => c.trim()))
    .filter(row => row.some(c => c.length > 0 && c !== '*'))
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getClients(): ClientBuild[] {
  const clientsDir = path.join(GHOST_DIR, 'clients')
  if (!fs.existsSync(clientsDir)) return []

  const codenames = fs.readdirSync(clientsDir).filter(f =>
    fs.statSync(path.join(clientsDir, f)).isDirectory()
  )

  const ghostMd = fs.existsSync(path.join(GHOST_DIR, 'GHOST.md'))
    ? fs.readFileSync(path.join(GHOST_DIR, 'GHOST.md'), 'utf-8')
    : ''

  const activeRows  = parseTable(ghostMd, 'Active Builds')
  const lockedRows  = parseTable(ghostMd, 'Locked')

  return codenames.map(codename => {
    const clientDir    = path.join(clientsDir, codename)
    const detectedPhase = detectPhase(clientDir)

    const active = activeRows.find(r => r[0]?.toLowerCase() === codename.toLowerCase())
    const locked = lockedRows.find(r => r[0]?.toLowerCase() === codename.toLowerCase())

    if (locked) {
      const score = parseInt(locked[3]) || undefined
      const cx    = parseInt(locked[4]) || 0
      return {
        codename,
        agentName:      locked[1] || codename,
        phase:          'LOCK' as Phase,
        phaseIndex:     4,
        complexity:     cx,
        complexityLabel: complexityLabel(cx),
        started:        '',
        operator:       'E',
        notes:          '',
        evalScore:      score,
        lockedDate:     locked[2],
        nextReview:     locked[5],
        isLocked:       true,
      }
    }

    const cx    = parseInt(active?.[3] || '0') || 0
    const phase = (active?.[2] as Phase) || detectedPhase

    return {
      codename,
      agentName:      active?.[1] || codename,
      phase,
      phaseIndex:     phaseIndex(phase),
      complexity:     cx,
      complexityLabel: complexityLabel(cx),
      started:        active?.[4] || '',
      operator:       active?.[5] || 'E',
      notes:          active?.[6] || '',
      isLocked:       false,
    }
  })
}

export function getClient(codename: string): ClientDetail | null {
  const clients = getClients()
  const build   = clients.find(c => c.codename === codename)
  if (!build) return null

  const clientDir = path.join(GHOST_DIR, 'clients', codename)
  const fileChecks = [
    'intake.md',
    'blueprint.md',
    'build/system-prompt.md',
    'build/tools.json',
    'build/agent-config.md',
    'build/deployment.md',
    'eval/test-cases.md',
    'eval/results.md',
    'handoff/client-docs.md',
    'handoff/runbook.md',
  ]

  const files: Record<string, boolean> = {}
  for (const f of fileChecks) {
    files[f] = fs.existsSync(path.join(clientDir, f))
  }

  return { ...build, files }
}

export function getFileContent(codename: string, filePath: string): string | null {
  const fullPath = path.join(GHOST_DIR, 'clients', codename, filePath)
  if (!fs.existsSync(fullPath)) return null
  return fs.readFileSync(fullPath, 'utf-8')
}

export function getStats() {
  const clients = getClients()
  return {
    active: clients.filter(c => !c.isLocked).length,
    locked: clients.filter(c =>  c.isLocked).length,
    total:  clients.length,
    avgEval: clients
      .filter(c => c.evalScore !== undefined)
      .reduce((acc, c, _, arr) => acc + (c.evalScore! / arr.length), 0) || 0,
  }
}
