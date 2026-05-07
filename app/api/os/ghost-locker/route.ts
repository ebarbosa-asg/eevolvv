import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export type GhostClient = {
  codename: string
  company: string
  contact: string
  contact_role: string
  email: string
  tier: string
  contract_value: number
  phase: string
  agents: number
  start_date: string
  status: string
  notes: string
  phases_complete: {
    onboard: boolean
    intake: boolean
    blueprint: boolean
    build: boolean
    eval: boolean
    lock: boolean
  }
}

function parseGhostMd(content: string): GhostClient[] {
  const clients: GhostClient[] = []
  const blocks = content.split(/^## /m).slice(1)

  for (const block of blocks) {
    const lines = block.trim().split('\n')
    const codename = lines[0].trim()
    const fields: Record<string, string> = {}

    for (const line of lines.slice(1)) {
      const match = line.match(/^(\w+):\s*(.+)$/)
      if (match) fields[match[1]] = match[2].trim()
    }

    const clientDir = path.join(process.cwd(), 'ghost-locker', 'clients', codename)

    clients.push({
      codename,
      company: fields.company ?? '',
      contact: fields.contact ?? '',
      contact_role: fields.contact_role ?? '',
      email: fields.email ?? '',
      tier: fields.tier ?? '',
      contract_value: parseInt(fields.contract_value ?? '0', 10),
      phase: fields.phase ?? '',
      agents: parseInt(fields.agents ?? '0', 10),
      start_date: fields.start_date ?? '',
      status: fields.status ?? '',
      notes: fields.notes ?? '',
      phases_complete: {
        onboard: fs.existsSync(path.join(clientDir, 'onboarding.md')),
        intake: fs.existsSync(path.join(clientDir, 'intake.md')),
        blueprint: fs.existsSync(path.join(clientDir, 'blueprint.md')),
        build: fs.existsSync(path.join(clientDir, 'build', 'system-prompt.md')),
        eval: fs.existsSync(path.join(clientDir, 'eval', 'results.md')),
        lock: fs.existsSync(path.join(clientDir, 'handoff', 'runbook.md')),
      },
    })
  }

  return clients
}

export async function GET() {
  const ghostMdPath = path.join(process.cwd(), 'ghost-locker', 'GHOST.md')

  if (!fs.existsSync(ghostMdPath)) {
    return NextResponse.json([])
  }

  const content = fs.readFileSync(ghostMdPath, 'utf-8')
  return NextResponse.json(parseGhostMd(content))
}
