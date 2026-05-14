import { createClient } from "@supabase/supabase-js";

// Bridge memory_semantic uses subject/predicate/object triples
export interface BridgeMemoryTriple {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  agent_id?: string | null;
  app_id?: string | null;
  updated_at?: string;
}

export interface SyncResult {
  synced: number;
  error?: string;
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function syncMemoriesFromBridge(
  clientId: string
): Promise<SyncResult> {
  const bridgeUrl = process.env.BRIDGE_API_URL;
  if (!bridgeUrl)
    return { synced: 0, error: "BRIDGE_API_URL not configured" };

  const supabase = getSupabaseClient();
  if (!supabase)
    return { synced: 0, error: "Supabase not configured" };

  // Get last sync time for this client
  const { data: lastSync } = await supabase
    .from("client_memories")
    .select("synced_at")
    .eq("client_id", clientId)
    .order("synced_at", { ascending: false })
    .limit(1)
    .single();

  const since = lastSync?.synced_at ?? "2020-01-01T00:00:00Z";

  // Fetch from Bridge
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const secret = process.env.BRIDGE_API_SECRET;
  if (secret) headers["x-bridge-secret"] = secret;

  let response: Response;
  try {
    response = await fetch(
      `${bridgeUrl}/api/memory/export?client_id=${encodeURIComponent(clientId)}&since=${encodeURIComponent(since)}`,
      { headers }
    );
  } catch (err) {
    return {
      synced: 0,
      error: `Bridge fetch error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (!response.ok) {
    return { synced: 0, error: `Bridge fetch failed: ${response.status}` };
  }

  const { memories }: { memories: BridgeMemoryTriple[] } =
    await response.json();
  if (!memories || memories.length === 0) return { synced: 0 };

  const now = new Date().toISOString();
  const rows = memories.map((m) => ({
    client_id: clientId,
    subject: m.subject,
    predicate: m.predicate,
    object: m.object,
    agent_id: m.agent_id ?? null,
    app_id: m.app_id ?? null,
    source: "bridge" as const,
    synced_at: now,
  }));

  const { error } = await supabase
    .from("client_memories")
    .upsert(rows, { onConflict: "client_id,subject,predicate" });

  return { synced: rows.length, error: error?.message };
}

export async function getClientMemories(
  clientId: string
): Promise<BridgeMemoryTriple[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("client_memories")
    .select("subject, predicate, object, agent_id, app_id, synced_at")
    .eq("client_id", clientId)
    .order("synced_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];

  return data.map((r) => ({
    id: "",
    subject: r.subject,
    predicate: r.predicate,
    object: r.object,
    agent_id: r.agent_id ?? null,
    app_id: r.app_id ?? null,
    updated_at: r.synced_at,
  }));
}
