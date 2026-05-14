import { NextRequest, NextResponse } from 'next/server'
import { indexDocument } from '@/lib/rag'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId, content, filename } = await req.json()
  if (!clientId || !content || !filename) {
    return NextResponse.json({ error: 'clientId, content, and filename are required' }, { status: 400 })
  }

  await indexDocument({
    id: crypto.randomUUID(),
    clientId,
    content,
    filename,
  })

  return NextResponse.json({ success: true })
}
