/**
 * Mem0 per-client persistent memory.
 * Set MEM0_API_KEY to enable. Falls back silently when not configured.
 */

import { MemoryClient } from 'mem0ai'

let _client: MemoryClient | null = null

function getClient(): MemoryClient | null {
  if (!process.env.MEM0_API_KEY) return null
  if (!_client) _client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY })
  return _client
}

export async function addMemory(clientId: string, content: string): Promise<void> {
  const client = getClient()
  if (!client) return
  try {
    // AddMemoryOptions extends EntityOptions which has user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await client.add([{ role: 'user', content }], { user_id: clientId } as any)
  } catch {
    // never throw — memory must not break agent runs
  }
}

export async function searchMemory(clientId: string, query: string): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  try {
    // In mem0ai v3+, user_id goes in filters for search
    const results = await client.search(query, { filters: { user_id: clientId } })
    return results.results.map((r) => r.memory ?? '').filter(Boolean)
  } catch {
    return []
  }
}

export async function getAllMemories(clientId: string): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  try {
    // In mem0ai v3+, user_id goes in filters for getAll
    const results = await client.getAll({ filters: { user_id: clientId } } as Parameters<typeof client.getAll>[0])
    return results.results.map((r) => r.memory ?? '').filter(Boolean)
  } catch {
    return []
  }
}
