import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Client, Pool } from "pg";
import { afterAll, beforeAll, expect, it } from "vitest";

import { signApprovalToken, verifyApprovalToken } from "../src/lib/links";
import {
  issueApprovalLink,
  listReviewQueue,
  loadClientBatch,
  loadClipReview,
  metadataLabel,
  operatorDecision,
  ReviewError,
  submitClientDecisions,
  transcriptExcerpt,
} from "../src/lib/review";

const SECRET = "test-approval-secret";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const dbName = `evv_review_${randomUUID().replaceAll("-", "").slice(0, 12)}`;

function adminConfig(): string | { host: string; database: string } {
  const raw = process.env.DATABASE_URL;
  if (raw && raw.startsWith("postgres")) {
    const url = new URL(raw);
    url.pathname = "/postgres";
    return url.toString();
  }
  return { host: "/var/run/postgresql", database: "postgres" };
}

function databaseUrl(name: string): string {
  const raw = process.env.DATABASE_URL;
  if (raw && raw.startsWith("postgres")) {
    const url = new URL(raw);
    url.pathname = `/${name}`;
    return url.toString();
  }
  return `postgresql:///${name}?host=/var/run/postgresql`;
}

function psql(target: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("psql", [target, "-v", "ON_ERROR_STOP=1", "-q", ...args], { stdio: ["ignore", "pipe", "pipe"] });
    const err: Buffer[] = [];
    child.stderr.on("data", (chunk: Buffer) => err.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(Buffer.concat(err).toString("utf8") || `psql exited ${code ?? "null"}`));
      }
    });
  });
}

let database = "";
let pool: Pool | undefined;

function db(): Pool {
  if (!pool) {
    throw new Error("database is not ready");
  }
  return pool;
}

beforeAll(async () => {
  const admin = new Client(typeof adminConfig() === "string" ? { connectionString: adminConfig() as string } : adminConfig());
  await admin.connect();
  await admin.query(`CREATE DATABASE "${dbName}"`);
  await admin.end();
  database = databaseUrl(dbName);
  for (const file of ["0001_core.sql", "0002_proof.sql", "0003_review_posting.sql"]) {
    await psql(database, ["-f", path.join(root, "supabase/migrations", file)]);
  }
  pool = new Pool({ connectionString: database });
}, 60_000);

afterAll(async () => {
  await pool?.end();
  const admin = new Client(typeof adminConfig() === "string" ? { connectionString: adminConfig() as string } : adminConfig());
  await admin.connect();
  await admin.query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`);
  await admin.end();
});

it("keeps an excerpt inside the moment and says when nothing is stored", () => {
  const sentences = [
    { id: "s1", start_ms: 0, end_ms: 1000, speaker: "a", text: "Before" },
    { id: "s2", start_ms: 1000, end_ms: 4000, speaker: "a", text: "Inside the cut" },
    { id: "s3", start_ms: 8000, end_ms: 9000, speaker: "a", text: "After" },
  ];
  expect(transcriptExcerpt(sentences, 1000, 5000)).toBe("Inside the cut");
  expect(transcriptExcerpt(null, 1000, 5000)).toBe("No transcript stored.");
});

it("rejects a tampered magic-link token before it is looked up", () => {
  const linkId = randomUUID();
  const token = signApprovalToken(linkId, SECRET);
  expect(verifyApprovalToken(token, SECRET)).toBe(linkId);
  const flipped = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
  expect(verifyApprovalToken(flipped, SECRET)).toBeNull();
  expect(verifyApprovalToken(token, "other-secret")).toBeNull();
});

type Seed = {
  operatorId: string;
  clientId: string;
  memberId: string;
  batchId: string;
  clipId: string;
};

async function seedClip(status: string, qaStatus: "pass" | "fail"): Promise<Seed> {
  const operatorId = randomUUID();
  const clientId = randomUUID();
  const memberId = randomUUID();
  const clipId = randomUUID();
  const admin = new Client({ connectionString: database });
  await admin.connect();
  await admin.query("INSERT INTO operators (user_id) VALUES ($1)", [operatorId]);
  await admin.query("INSERT INTO clients (id, name) VALUES ($1, 'review client')", [clientId]);
  await admin.query("INSERT INTO client_members (client_id, user_id) VALUES ($1, $2)", [clientId, memberId]);
  const asset = await admin.query<{ id: string }>(
    `INSERT INTO source_assets (
       client_id, sha256, storage_key, has_video, rights_confirmed_at, rights_confirmed_by
     ) VALUES ($1, $2, 'sources/review', true, now(), $3) RETURNING id`,
    [clientId, randomUUID().replaceAll("-", "") + randomUUID().replaceAll("-", "").slice(0, 32), memberId],
  );
  const batch = await admin.query<{ id: string }>(
    "INSERT INTO batches (client_id, source_asset_id) VALUES ($1, $2) RETURNING id",
    [clientId, asset.rows[0]?.id],
  );
  const batchId = batch.rows[0]?.id;
  if (!batchId) {
    throw new Error("seed did not return a batch");
  }
  await admin.query(
    `INSERT INTO moments (
       batch_id, start_sentence_id, end_sentence_id, start_ms, end_ms,
       hook_line, hook_archetype, topic, standalone_score, rationale
     ) VALUES ($1, 's2', 's2', 1000, 5000, 'Inside hook', 'how_to', 'ops', 8, 'fixture')`,
    [batchId],
  );
  await admin.query(
    `INSERT INTO transcripts (source_asset_id, provider, words, sentences, speakers)
     VALUES ($1, 'fixture', '[]'::jsonb, $2::jsonb, '[]'::jsonb)`,
    [
      asset.rows[0]?.id,
      JSON.stringify([
        { id: "s2", start_ms: 1000, end_ms: 4000, speaker: "a", text: "Inside the cut" },
        { id: "s3", start_ms: 8000, end_ms: 9000, speaker: "a", text: "After" },
      ]),
    ],
  );
  await admin.query(
    `INSERT INTO clips (id, batch_id, moment_id, status, qa_run, storage_key, metadata)
     SELECT $1, $2, id, $3, 1, 'clips/one.mp4', NULL FROM moments WHERE batch_id = $2`,
    [clipId, batchId, status],
  );
  await admin.query(
    `INSERT INTO qa_results (clip_id, qa_run, check_code, blocking, status)
     VALUES ($1, 1, 'B1', true, $2)`,
    [clipId, qaStatus],
  );
  await admin.end();
  return { operatorId, clientId, memberId, batchId, clipId };
}

it("lists a clip that passed QA and hides qa failures", async () => {
  const passing = await seedClip("needs_review", "pass");
  const failed = await seedClip("qa_failed", "fail");
  const blocked = await seedClip("needs_review", "fail");
  const queue = await listReviewQueue(db());
  const ids = queue.map((item) => item.clipId);
  expect(ids).toContain(passing.clipId);
  expect(ids).not.toContain(failed.clipId);
  expect(ids).not.toContain(blocked.clipId);
  const detail = await loadClipReview(db(), passing.clipId);
  expect(detail?.excerpt).toBe("Inside the cut");
  expect(detail?.qa[0]?.checkCode).toBe("B1");
  expect(metadataLabel(detail?.metadata)).toBe("No metadata recorded.");
  expect(detail?.storageKey).toBe("clips/one.mp4");
});

it("writes an audit row for an operator decision and refuses a reason-less reject", async () => {
  const seeded = await seedClip("needs_review", "pass");
  const approved = await operatorDecision(db(), {
    clipId: seeded.clipId,
    operatorId: seeded.operatorId,
    decision: "approve",
  });
  expect(approved.status).toBe("needs_review");
  const audit = await db().query<{ action: string }>(
    "SELECT action FROM audit_log WHERE entity = 'clips' AND entity_id = $1",
    [seeded.clipId],
  );
  expect(audit.rows.map((row) => row.action)).toContain("approval.approve");

  const before = audit.rowCount ?? 0;
  await expect(
    operatorDecision(db(), { clipId: seeded.clipId, operatorId: seeded.operatorId, decision: "reject" }),
  ).rejects.toMatchObject({ message: "reject and request-edit require a reason", status: 400 });
  const after = await db().query("SELECT id FROM audit_log WHERE entity = 'clips' AND entity_id = $1", [seeded.clipId]);
  expect(after.rowCount).toBe(before);

  await expect(
    operatorDecision(db(), { clipId: seeded.clipId, operatorId: randomUUID(), decision: "approve" }),
  ).rejects.toBeInstanceOf(ReviewError);

  const edited = await operatorDecision(db(), {
    clipId: seeded.clipId,
    operatorId: seeded.operatorId,
    decision: "changes_requested",
    reason: "tighten the hook",
  });
  expect(edited.status).toBe("needs_review");
  const actions = await db().query<{ action: string }>(
    "SELECT action FROM audit_log WHERE entity = 'clips' AND entity_id = $1 ORDER BY created_at",
    [seeded.clipId],
  );
  expect(actions.rows.map((row) => row.action)).toContain("approval.changes_requested");
});

it("approves through a single-use link and blocks expiry, reuse, tamper, and another client", async () => {
  const seeded = await seedClip("needs_review", "pass");
  const other = await seedClip("needs_review", "pass");
  await operatorDecision(db(), { clipId: seeded.clipId, operatorId: seeded.operatorId, decision: "approve" });

  const issued = await issueApprovalLink(db(), {
    operatorId: seeded.operatorId,
    clientId: seeded.clientId,
    batchId: seeded.batchId,
    secret: SECRET,
    expiresAt: new Date(Date.now() + 60_000),
  });
  const audit = await db().query<{ payload: { link_id?: string } }>(
    "SELECT payload FROM audit_log WHERE action = 'approval_link.issued' AND entity_id = $1",
    [seeded.batchId],
  );
  expect(JSON.stringify(audit.rows)).not.toContain(issued.token);
  expect(audit.rows[0]?.payload.link_id).toBe(issued.linkId);

  const view = await loadClientBatch(db(), issued.token, SECRET);
  expect(view.state).toBe("ok");
  if (view.state === "ok") {
    expect(view.clips.map((clip) => clip.clipId)).toContain(seeded.clipId);
    expect(view.clips.map((clip) => clip.clipId)).not.toContain(other.clipId);
  }

  const tampered = `${issued.token.slice(0, -1)}${issued.token.endsWith("a") ? "b" : "a"}`;
  await expect(
    submitClientDecisions(db(), {
      token: tampered,
      secret: SECRET,
      decisions: [{ clipId: seeded.clipId, decision: "approve" }],
    }),
  ).rejects.toMatchObject({ message: "magic link is not valid" });

  await expect(
    submitClientDecisions(db(), {
      token: issued.token,
      secret: SECRET,
      decisions: [{ clipId: other.clipId, decision: "approve" }],
    }),
  ).rejects.toMatchObject({ message: "magic link is expired, used, or does not match this clip" });
  const unused = await db().query("SELECT used_at FROM approval_links WHERE id = $1", [issued.linkId]);
  expect(unused.rows[0]?.used_at).toBeNull();

  await submitClientDecisions(db(), {
    token: issued.token,
    secret: SECRET,
    decisions: [{ clipId: seeded.clipId, decision: "approve" }],
  });
  const status = await db().query<{ status: string }>("SELECT status FROM clips WHERE id = $1", [seeded.clipId]);
  expect(status.rows[0]?.status).toBe("approved");
  await expect(
    submitClientDecisions(db(), {
      token: issued.token,
      secret: SECRET,
      decisions: [{ clipId: seeded.clipId, decision: "approve" }],
    }),
  ).rejects.toMatchObject({ message: "magic link is expired, used, or does not match this clip" });

  const expired = await issueApprovalLink(db(), {
    operatorId: seeded.operatorId,
    clientId: seeded.clientId,
    batchId: seeded.batchId,
    secret: SECRET,
    expiresAt: new Date(Date.now() - 60_000),
  });
  expect((await loadClientBatch(db(), expired.token, SECRET)).state).toBe("expired");
  await expect(
    submitClientDecisions(db(), {
      token: expired.token,
      secret: SECRET,
      decisions: [{ clipId: seeded.clipId, decision: "changes_requested", reason: "late" }],
    }),
  ).rejects.toMatchObject({ status: 403 });

  await expect(
    issueApprovalLink(db(), {
      operatorId: randomUUID(),
      clientId: seeded.clientId,
      batchId: seeded.batchId,
      secret: SECRET,
    }),
  ).rejects.toMatchObject({ status: 403 });

  const member = new Client({ connectionString: database });
  await member.connect();
  await member.query("BEGIN");
  await member.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [other.memberId]);
  await member.query("SET LOCAL ROLE evv_member");
  const clips = await member.query("SELECT id FROM clips WHERE id = $1", [seeded.clipId]);
  const links = await member.query("SELECT id FROM approval_links WHERE client_id = $1", [seeded.clientId]);
  expect(clips.rowCount).toBe(0);
  expect(links.rowCount).toBe(0);
  await member.query("ROLLBACK");
  await member.end();
});

it("refuses the posting state until both the operator and the client have approved", async () => {
  const seeded = await seedClip("needs_review", "pass");
  await operatorDecision(db(), { clipId: seeded.clipId, operatorId: seeded.operatorId, decision: "approve" });
  const admin = new Client({ connectionString: database });
  await admin.connect();
  await expect(admin.query("UPDATE clips SET status = 'approved' WHERE id = $1", [seeded.clipId])).rejects.toThrow(
    /operator and client approval/,
  );
  await expect(admin.query("INSERT INTO posts (clip_id, status) VALUES ($1, 'queued')", [seeded.clipId])).rejects.toThrow(
    /post gate/,
  );

  const issued = await issueApprovalLink(db(), {
    operatorId: seeded.operatorId,
    clientId: seeded.clientId,
    batchId: seeded.batchId,
    secret: SECRET,
  });
  await submitClientDecisions(db(), {
    token: issued.token,
    secret: SECRET,
    decisions: [{ clipId: seeded.clipId, decision: "approve" }],
  });
  await admin.query("INSERT INTO posts (clip_id, status) VALUES ($1, 'queued')", [seeded.clipId]);
  const posted = await admin.query<{ status: string }>("SELECT status FROM posts WHERE clip_id = $1", [seeded.clipId]);
  expect(posted.rows[0]?.status).toBe("queued");
  await admin.end();
});
