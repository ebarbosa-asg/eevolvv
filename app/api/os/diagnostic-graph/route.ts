import { NextRequest, NextResponse } from 'next/server'
import { buildDiagnosticGraph } from '@/lib/graphs/diagnostic'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessInfo, industry } = await req.json()
  if (!businessInfo) return NextResponse.json({ error: 'businessInfo is required' }, { status: 400 })

  try {
    const graph = buildDiagnosticGraph()
    const result = await graph.invoke({ businessInfo, industry: industry ?? '' })
    return NextResponse.json({ report: result.report })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Diagnostic graph failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
