import { randomUUID } from "node:crypto";

import { Pool, type PoolClient } from "pg";

import { hashApprovalToken, signApprovalToken, verifyApprovalToken } from "./links";

/** MVP default until a link lifetime is chosen. Tests pass an explicit expiry. */
export const DEFAULT_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class ReviewError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ReviewError";
  }
}

export type Decision = "approve" | "reject" | "changes_requested";

export type QaRow = {
  checkCode: string;
  blocking: boolean;
  status: string;
  detail: unknown;
};

export type ReviewQueueItem = {
  clipId: string;
  clientName: string;
  hook: string | null;
  durationMs: number | null;
  storageKey: string | null;
};

export type ClipReview = {
  clipId: string;
  clientId: string;
  clientName: string;
  batchId: string;
  status: string;
  storageKey: string | null;
  thumbKey: string | null;
  durationMs: number | null;
  metadata: unknown;
  hook: string | null;
  topic: string | null;
  excerpt: string;
  qa: QaRow[];
  operatorDecision: string | null;
  clientDecision: string | null;
};

export type ClientClip = {
  clipId: string;
  hook: string | null;
  storageKey: string | null;
  excerpt: string;
  metadata: unknown;
  qa: QaRow[];
  status: string;
};

export type ClientBatch =
  | { state: "invalid" }
  | { state: "expired" }
  | { state: "used" }
  | { state: "ok"; clientName: string; clips: ClientClip[] };

type ClipRow = {
  id: string;
  batch_id: string;
  client_id: string;
  client_name: string;
  status: string;
  storage_key: string | null;
  thumb_key: string | null;
  duration_ms: number | null;
  metadata: unknown;
  hook_line: string | null;
  topic: string | null;
  start_ms: number | null;
  end_ms: number | null;
  sentences: unknown;
  operator_decision: string | null;
  client_decision: string | null;
};

let singleton: Pool | undefined;

export function reviewPoolFromEnv(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new ReviewError("DATABASE_URL is required", 500);
  }
  singleton ??= new Pool({ connectionString });
  return singleton;
}

export async function closeReviewPool(): Promise<void> {
  if (singleton) {
    const current = singleton;
    singleton = undefined;
    await current.end();
  }
}

export function parseDecision(value: unknown): Decision {
  if (value === "approve" || value === "reject" || value === "changes_requested") {
    return value;
  }
  throw new ReviewError("decision must be approve, reject, or changes_requested", 400);
}

export function requireUuid(value: string, label: string): string {
  if (!UUID_RE.test(value)) {
    throw new ReviewError(`${label} must be a uuid`, 400);
  }
  return value;
}

export function metadataLabel(metadata: unknown): string {
  if (metadata == null) {
    return "No metadata recorded.";
  }
  return JSON.stringify(metadata, null, 2);
}

export function previewLabel(storageKey: string | null, thumbKey: string | null): string {
  if (storageKey) {
    return storageKey;
  }
  if (thumbKey) {
    return thumbKey;
  }
  return "No preview stored.";
}

export function transcriptExcerpt(sentences: unknown, startMs: number | null, endMs: number | null): string {
  if (!Array.isArray(sentences) || startMs == null || endMs == null) {
    return "No transcript stored.";
  }
  const parts: string[] = [];
  for (const item of sentences) {
    if (typeof item !== "object" || item === null) {
      continue;
    }
    const row = item as Record<string, unknown>;
    const start = typeof row.start_ms === "number" ? row.start_ms : Number.NaN;
    const end = typeof row.end_ms === "number" ? row.end_ms : Number.NaN;
    const text = typeof row.text === "string" ? row.text.trim() : "";
    if (!text || Number.isNaN(start) || Number.isNaN(end)) {
      continue;
    }
    if (end > startMs && start < endMs) {
      parts.push(text);
    }
  }
  if (parts.length === 0) {
    return "No transcript stored.";
  }
  const joined = parts.join(" ");
  return joined.length > 280 ? `${joined.slice(0, 277)}…` : joined;
}

function mapDb(error: unknown): never {
  if (error instanceof ReviewError) {
    throw error;
  }
  const message = error instanceof Error ? error.message : "review failed";
  if (message.includes("require a reason") || message.includes("approvals_reason_required")) {
    throw new ReviewError("reject and request-edit require a reason", 400);
  }
  if (message.includes("operator approval requires an operator")) {
    throw new ReviewError("operator approval requires an operator", 403);
  }
  if (message.includes("magic link")) {
    throw new ReviewError("magic link is expired, used, or does not match this clip", 403);
  }
  if (message.includes("clip cannot reach approved")) {
    throw new ReviewError("clip cannot reach approved without operator and client approval", 409);
  }
  throw error;
}

async function withService<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL ROLE evv_service");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // The connection is released either way.
    }
    throw mapDb(error);
  } finally {
    client.release();
  }
}

const PASSING_QA = `
  EXISTS (
    SELECT 1 FROM qa_results qr
    WHERE qr.clip_id = c.id
      AND qr.qa_run = (SELECT MAX(qa_run) FROM qa_results WHERE clip_id = c.id)
  )
  AND NOT EXISTS (
    SELECT 1 FROM qa_results qr
    WHERE qr.clip_id = c.id
      AND qr.qa_run = (SELECT MAX(qa_run) FROM qa_results WHERE clip_id = c.id)
      AND qr.blocking
      AND qr.status = 'fail'
  )
`;

export async function listReviewQueue(pool: Pool): Promise<ReviewQueueItem[]> {
  return withService(pool, async (client) => {
    const result = await client.query<{
      id: string;
      client_name: string;
      hook_line: string | null;
      duration_ms: number | null;
      storage_key: string | null;
    }>(
      `SELECT c.id, cl.name AS client_name, m.hook_line, c.duration_ms, c.storage_key
       FROM clips c
       JOIN batches b ON b.id = c.batch_id
       JOIN clients cl ON cl.id = b.client_id
       LEFT JOIN moments m ON m.id = c.moment_id
       WHERE c.status = 'needs_review' AND ${PASSING_QA}
       ORDER BY c.created_at, c.id`,
    );
    return result.rows.map((row) => ({
      clipId: row.id,
      clientName: row.client_name,
      hook: row.hook_line,
      durationMs: row.duration_ms,
      storageKey: row.storage_key,
    }));
  });
}

async function loadClipRow(client: PoolClient, clipId: string): Promise<ClipRow | null> {
  const result = await client.query<ClipRow>(
    `SELECT c.id, c.batch_id, c.status, c.storage_key, c.thumb_key, c.duration_ms, c.metadata,
            b.client_id, cl.name AS client_name,
            m.hook_line, m.topic, m.start_ms, m.end_ms,
            t.sentences,
            evv.latest_decision(c.id, 'operator') AS operator_decision,
            evv.latest_decision(c.id, 'client') AS client_decision
     FROM clips c
     JOIN batches b ON b.id = c.batch_id
     JOIN clients cl ON cl.id = b.client_id
     LEFT JOIN moments m ON m.id = c.moment_id
     LEFT JOIN transcripts t ON t.source_asset_id = b.source_asset_id
     WHERE c.id = $1`,
    [clipId],
  );
  return result.rows[0] ?? null;
}

async function loadQa(client: PoolClient, clipId: string): Promise<QaRow[]> {
  const result = await client.query<{ check_code: string; blocking: boolean; status: string; detail: unknown }>(
    `SELECT check_code, blocking, status, detail
     FROM qa_results
     WHERE clip_id = $1
       AND qa_run = (SELECT MAX(qa_run) FROM qa_results WHERE clip_id = $1)
     ORDER BY check_code`,
    [clipId],
  );
  return result.rows.map((row) => ({
    checkCode: row.check_code,
    blocking: row.blocking,
    status: row.status,
    detail: row.detail,
  }));
}

function toReview(row: ClipRow, qa: QaRow[]): ClipReview {
  return {
    clipId: row.id,
    clientId: row.client_id,
    clientName: row.client_name,
    batchId: row.batch_id,
    status: row.status,
    storageKey: row.storage_key,
    thumbKey: row.thumb_key,
    durationMs: row.duration_ms,
    metadata: row.metadata,
    hook: row.hook_line,
    topic: row.topic,
    excerpt: transcriptExcerpt(row.sentences, row.start_ms, row.end_ms),
    qa,
    operatorDecision: row.operator_decision,
    clientDecision: row.client_decision,
  };
}

export async function loadClipReview(pool: Pool, clipId: string): Promise<ClipReview | null> {
  requireUuid(clipId, "clip id");
  return withService(pool, async (client) => {
    const row = await loadClipRow(client, clipId);
    if (!row) {
      return null;
    }
    return toReview(row, await loadQa(client, clipId));
  });
}

async function applyStatus(client: PoolClient, clipId: string, decision: Decision): Promise<string> {
  if (decision === "reject") {
    await client.query("UPDATE clips SET status = 'rejected' WHERE id = $1", [clipId]);
    return "rejected";
  }
  if (decision === "changes_requested") {
    await client.query("UPDATE clips SET status = 'needs_review' WHERE id = $1", [clipId]);
    return "needs_review";
  }
  const latest = await client.query<{ operator: string | null; client: string | null }>(
    `SELECT evv.latest_decision($1, 'operator') AS operator, evv.latest_decision($1, 'client') AS client`,
    [clipId],
  );
  const row = latest.rows[0];
  if (row?.operator === "approve" && row.client === "approve") {
    await client.query("UPDATE clips SET status = 'approved' WHERE id = $1", [clipId]);
    return "approved";
  }
  const current = await client.query<{ status: string }>("SELECT status FROM clips WHERE id = $1", [clipId]);
  return current.rows[0]?.status ?? "needs_review";
}

export async function operatorDecision(
  pool: Pool,
  input: { clipId: string; operatorId: string; decision: Decision; reason?: string | null },
): Promise<{ status: string }> {
  requireUuid(input.clipId, "clip id");
  requireUuid(input.operatorId, "operator id");
  const decision = parseDecision(input.decision);
  return withService(pool, async (client) => {
    const clip = await client.query("SELECT id FROM clips WHERE id = $1", [input.clipId]);
    if (clip.rowCount === 0) {
      throw new ReviewError("clip not found", 404);
    }
    await client.query(
      `INSERT INTO approvals (clip_id, decision, decided_by, actor_role, reason)
       VALUES ($1, $2, $3, 'operator', $4)`,
      [input.clipId, decision, input.operatorId, input.reason ?? null],
    );
    const status = await applyStatus(client, input.clipId, decision);
    return { status };
  });
}

export async function issueApprovalLink(
  pool: Pool,
  input: { operatorId: string; clientId: string; batchId: string; secret: string; expiresAt?: Date },
): Promise<{ linkId: string; token: string; expiresAt: string }> {
  requireUuid(input.operatorId, "operator id");
  requireUuid(input.clientId, "client id");
  requireUuid(input.batchId, "batch id");
  const linkId = randomUUID();
  const token = signApprovalToken(linkId, input.secret);
  const expiresAt = input.expiresAt ?? new Date(Date.now() + DEFAULT_LINK_TTL_MS);
  await withService(pool, async (client) => {
    const operator = await client.query("SELECT 1 FROM operators WHERE user_id = $1", [input.operatorId]);
    if (operator.rowCount === 0) {
      throw new ReviewError("operator approval requires an operator", 403);
    }
    const batch = await client.query("SELECT id FROM batches WHERE id = $1 AND client_id = $2", [
      input.batchId,
      input.clientId,
    ]);
    if (batch.rowCount === 0) {
      throw new ReviewError("batch does not belong to this client", 404);
    }
    await client.query(
      `INSERT INTO approval_links (id, client_id, batch_id, token_hash, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [linkId, input.clientId, input.batchId, hashApprovalToken(token), expiresAt],
    );
    await client.query(
      `INSERT INTO audit_log (actor_id, action, entity, entity_id, payload)
       VALUES ($1, 'approval_link.issued', 'batches', $2, $3::jsonb)`,
      [
        input.operatorId,
        input.batchId,
        JSON.stringify({ link_id: linkId, client_id: input.clientId, expires_at: expiresAt.toISOString() }),
      ],
    );
  });
  return { linkId, token, expiresAt: expiresAt.toISOString() };
}

type LinkRow = {
  id: string;
  client_id: string;
  batch_id: string;
  expires_at: Date;
  used_at: Date | null;
  client_name: string;
};

async function lockLink(client: PoolClient, token: string, secret: string): Promise<LinkRow | "invalid"> {
  const linkId = verifyApprovalToken(token, secret);
  if (!linkId) {
    return "invalid";
  }
  const result = await client.query<LinkRow>(
    `SELECT l.id, l.client_id, l.batch_id, l.expires_at, l.used_at, cl.name AS client_name
     FROM approval_links l
     JOIN clients cl ON cl.id = l.client_id
     WHERE l.id = $1 AND l.token_hash = $2
     FOR UPDATE`,
    [linkId, hashApprovalToken(token)],
  );
  const row = result.rows[0];
  if (!row) {
    return "invalid";
  }
  return row;
}

function linkState(row: LinkRow): "expired" | "used" | "ok" {
  if (row.used_at) {
    return "used";
  }
  if (row.expires_at.getTime() <= Date.now()) {
    return "expired";
  }
  return "ok";
}

export async function loadClientBatch(pool: Pool, token: string, secret: string): Promise<ClientBatch> {
  return withService(pool, async (client) => {
    const link = await lockLink(client, token, secret);
    if (link === "invalid") {
      return { state: "invalid" };
    }
    const state = linkState(link);
    if (state !== "ok") {
      return { state };
    }
    const clips = await client.query<ClipRow>(
      `SELECT c.id, c.batch_id, c.status, c.storage_key, c.thumb_key, c.duration_ms, c.metadata,
              b.client_id, cl.name AS client_name,
              m.hook_line, m.topic, m.start_ms, m.end_ms, t.sentences,
              NULL::text AS operator_decision, NULL::text AS client_decision
       FROM clips c
       JOIN batches b ON b.id = c.batch_id
       JOIN clients cl ON cl.id = b.client_id
       LEFT JOIN moments m ON m.id = c.moment_id
       LEFT JOIN transcripts t ON t.source_asset_id = b.source_asset_id
       WHERE c.batch_id = $1 AND c.status IN ('needs_review', 'approved') AND ${PASSING_QA}
       ORDER BY c.created_at, c.id`,
      [link.batch_id],
    );
    const view: ClientClip[] = [];
    for (const row of clips.rows) {
      view.push({
        clipId: row.id,
        hook: row.hook_line,
        storageKey: row.storage_key,
        excerpt: transcriptExcerpt(row.sentences, row.start_ms, row.end_ms),
        metadata: row.metadata,
        qa: await loadQa(client, row.id),
        status: row.status,
      });
    }
    return { state: "ok", clientName: link.client_name, clips: view };
  });
}

export async function submitClientDecisions(
  pool: Pool,
  input: {
    token: string;
    secret: string;
    decisions: { clipId: string; decision: Decision; reason?: string | null }[];
  },
): Promise<{ consumed: true }> {
  if (input.decisions.length === 0) {
    throw new ReviewError("choose a decision for at least one clip", 400);
  }
  return withService(pool, async (client) => {
    const link = await lockLink(client, input.token, input.secret);
    if (link === "invalid") {
      throw new ReviewError("magic link is not valid", 403);
    }
    const state = linkState(link);
    if (state !== "ok") {
      throw new ReviewError("magic link is expired, used, or does not match this clip", 403);
    }
    for (const item of input.decisions) {
      requireUuid(item.clipId, "clip id");
      const decision = parseDecision(item.decision);
      await client.query(
        `INSERT INTO approvals (clip_id, decision, decided_by, actor_role, link_id, reason)
         VALUES ($1, $2, NULL, 'client', $3, $4)`,
        [item.clipId, decision, link.id, item.reason ?? null],
      );
      await applyStatus(client, item.clipId, decision);
    }
    await client.query("SELECT evv.consume_approval_link($1)", [link.id]);
    return { consumed: true as const };
  });
}
