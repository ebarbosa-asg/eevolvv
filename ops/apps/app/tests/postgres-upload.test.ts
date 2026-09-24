import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "pg";
import { afterAll, beforeAll, expect, it } from "vitest";

import { MemoryStore } from "../src/lib/memory";
import { PostgresUploadDb } from "../src/lib/postgres";
import type { ProbeResult } from "../src/lib/types";
import { completeUpload, initUpload, uploadPart } from "../src/lib/upload";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const dbName = `evv_app_${randomUUID().replaceAll("-", "").slice(0, 12)}`;

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
    const child = spawn("psql", [target, "-v", "ON_ERROR_STOP=1", "-q", ...args], {
      stdio: ["ignore", "pipe", "pipe"],
    });
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

let database: string;

beforeAll(async () => {
  const admin = new Client(typeof adminConfig() === "string" ? { connectionString: adminConfig() as string } : adminConfig());
  await admin.connect();
  await admin.query(`CREATE DATABASE "${dbName}"`);
  await admin.end();
  database = databaseUrl(dbName);
  const migrations = ["0001_core.sql", "0002_proof.sql", "0003_review_posting.sql"];
  for (const file of migrations) {
    await psql(database, ["-f", path.join(root, "supabase/migrations", file)]);
  }
}, 60_000);

afterAll(async () => {
  const admin = new Client(typeof adminConfig() === "string" ? { connectionString: adminConfig() as string } : adminConfig());
  await admin.connect();
  await admin.query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`);
  await admin.end();
});

it("persists a source asset and one transcribe job under the service role", async () => {
  process.env.DATABASE_URL = database;
  const clientId = randomUUID();
  const confirmedBy = randomUUID();
  const admin = new Client({ connectionString: database });
  await admin.connect();
  await admin.query("INSERT INTO clients (id, name) VALUES ($1, $2)", [clientId, "upload client"]);
  await admin.end();

  const { Pool } = await import("pg");
  const pool = new Pool({ connectionString: database });
  const store = new MemoryStore();
  const db = new PostgresUploadDb(pool);
  const probe = async (): Promise<ProbeResult> => ({ durationS: 2, width: 320, height: 240, videoCodec: "h264" });
  const bytes = Uint8Array.from([4, 5, 6, 7, 8]);
  const opened = await initUpload(
    { store, db },
    { clientId, filename: "episode.mp4", rightsConfirmed: true, confirmedBy },
  );
  const part = await uploadPart(
    { store, db },
    { key: opened.key, uploadId: opened.uploadId, partNumber: 1, bodyBase64: Buffer.from(bytes).toString("base64") },
  );
  const created = await completeUpload(
    { store, db, probe },
    {
      clientId,
      key: opened.key,
      uploadId: opened.uploadId,
      parts: [part],
      filename: "episode.mp4",
      rightsConfirmed: true,
      confirmedBy,
    },
  );
  const again = await completeUpload(
    { store, db, probe },
    {
      clientId,
      ...(await (async () => {
        const second = await initUpload(
          { store, db },
          { clientId, filename: "episode.mp4", rightsConfirmed: true, confirmedBy },
        );
        const secondPart = await uploadPart(
          { store, db },
          {
            key: second.key,
            uploadId: second.uploadId,
            partNumber: 1,
            bodyBase64: Buffer.from(bytes).toString("base64"),
          },
        );
        return { key: second.key, uploadId: second.uploadId, parts: [secondPart] };
      })()),
      filename: "episode.mp4",
      rightsConfirmed: true,
      confirmedBy,
    },
  );

  const check = new Client({ connectionString: database });
  await check.connect();
  const assets = await check.query("SELECT count(*)::int AS n FROM source_assets WHERE client_id = $1", [clientId]);
  const jobs = await check.query(
    "SELECT kind, idempotency_key, status FROM jobs WHERE idempotency_key = $1",
    [created.idempotencyKey],
  );
  await check.end();
  await pool.end();

  expect(assets.rows[0]?.n).toBe(1);
  expect(jobs.rows).toEqual([{ kind: "transcribe", idempotency_key: `transcribe:${created.assetId}`, status: "pending" }]);
  expect(again.deduped).toBe(true);
  expect(again.jobId).toBe(created.jobId);
});
