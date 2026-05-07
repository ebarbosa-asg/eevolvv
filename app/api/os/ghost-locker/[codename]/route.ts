import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PHASE_FILES: Record<string, string[]> = {
  onboard: ['onboarding.md'],
  intake: ['intake.md'],
  blueprint: ['blueprint.md'],
  build: ['build/system-prompt.md', 'build/tools.json', 'build/agent-config.md', 'build/deployment.md'],
  eval: ['eval/test-cases.md', 'eval/results.md'],
  lock: ['handoff/client-docs.md', 'handoff/runbook.md'],
}

export async function GET(
  req: Request,
  { params }: { params: { codename: string } }
) {
  const { codename } = params
  const { searchParams } = new URL(req.url)
  const phase = searchParams.get('phase')

  const clientDir = path.join(process.cwd(), 'ghost-locker', 'clients', codename)

  if (!fs.existsSync(clientDir)) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  if (!phase || !PHASE_FILES[phase]) {
    return NextResponse.json({ error: 'Invalid phase' }, { status: 400 })
  }

  const files = PHASE_FILES[phase].map((filePath) => {
    const fullPath = path.join(clientDir, filePath)
    return {
      file: filePath,
      exists: fs.existsSync(fullPath),
      content: fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf-8') : null,
    }
  })

  return NextResponse.json({ codename, phase, files })
}
