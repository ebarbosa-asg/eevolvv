/**
 * Per-client document RAG using LlamaIndex.
 * Current implementation: scaffold with in-memory store.
 * Production path: Supabase pgvector via LlamaIndex SupabaseVectorStore
 * (requires SUPABASE_SERVICE_KEY + pgvector extension — Eduardo configures).
 */

export interface RagDocument {
  id: string
  clientId: string
  content: string
  filename: string
}

// Simple in-memory store for the scaffold
const _store = new Map<string, RagDocument[]>()

export async function indexDocument(doc: RagDocument): Promise<void> {
  // TODO: replace with Supabase pgvector via LlamaIndex SupabaseVectorStore
  const existing = _store.get(doc.clientId) ?? []
  existing.push(doc)
  _store.set(doc.clientId, existing)
  console.log(`[RAG] Indexed document "${doc.filename}" for client ${doc.clientId}`)
}

export async function queryDocuments(clientId: string, query: string): Promise<string> {
  // TODO: replace with vector similarity search via Supabase
  const docs = _store.get(clientId) ?? []
  if (docs.length === 0) {
    return `No documents indexed yet for client ${clientId}.`
  }
  // Simple keyword match for scaffold — production uses embeddings
  const queryLower = query.toLowerCase()
  const relevant = docs.filter(d => d.content.toLowerCase().includes(queryLower))
  if (relevant.length === 0) {
    return `No relevant documents found for query: "${query}"`
  }
  return relevant.map(d => `[${d.filename}]\n${d.content.slice(0, 500)}`).join('\n\n')
}
