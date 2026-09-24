import { Pool, type PoolClient } from "pg";

import type { EnqueuedJob, SourceAsset, UploadDb } from "./types";

export function poolFromEnv(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }
  return new Pool({ connectionString });
}

async function withService<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("SET ROLE evv_service");
    return await fn(client);
  } finally {
    client.release();
  }
}

export class PostgresUploadDb implements UploadDb {
  constructor(private readonly pool: Pool) {}

  async findAssetByHash(clientId: string, sha256: string): Promise<SourceAsset | null> {
    return withService(this.pool, async (client) => {
      const result = await client.query<{ id: string; client_id: string; sha256: string; storage_key: string }>(
        `SELECT id, client_id, sha256, storage_key
         FROM source_assets
         WHERE client_id = $1 AND sha256 = $2`,
        [clientId, sha256],
      );
      const row = result.rows[0];
      if (!row) {
        return null;
      }
      return { id: row.id, clientId: row.client_id, sha256: row.sha256, storageKey: row.storage_key };
    });
  }

  async insertAsset(input: {
    clientId: string;
    sha256: string;
    storageKey: string;
    filename: string;
    durationMs: number;
    width: number | null;
    height: number | null;
    confirmedBy: string;
  }): Promise<SourceAsset> {
    return withService(this.pool, async (client) => {
      const result = await client.query<{ id: string }>(
        `INSERT INTO source_assets (
           client_id, sha256, storage_key, filename, duration_ms, width, height, has_video,
           rights_confirmed_at, rights_confirmed_by
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, now(), $8)
         RETURNING id`,
        [
          input.clientId,
          input.sha256,
          input.storageKey,
          input.filename,
          input.durationMs,
          input.width,
          input.height,
          input.confirmedBy,
        ],
      );
      const id = result.rows[0]?.id;
      if (!id) {
        throw new Error("insert did not return an asset");
      }
      return { id, clientId: input.clientId, sha256: input.sha256, storageKey: input.storageKey };
    });
  }

  async enqueueTranscribe(assetId: string, clientId: string): Promise<EnqueuedJob> {
    const idempotencyKey = `transcribe:${assetId}`;
    return withService(this.pool, async (client) => {
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO jobs (kind, payload, idempotency_key)
         VALUES ('transcribe', $1::jsonb, $2)
         ON CONFLICT (idempotency_key) DO NOTHING
         RETURNING id`,
        [JSON.stringify({ source_asset_id: assetId, client_id: clientId }), idempotencyKey],
      );
      const createdId = inserted.rows[0]?.id;
      if (createdId) {
        return { id: createdId, idempotencyKey, created: true };
      }
      const existing = await client.query<{ id: string }>(
        "SELECT id FROM jobs WHERE idempotency_key = $1",
        [idempotencyKey],
      );
      const id = existing.rows[0]?.id;
      if (!id) {
        throw new Error("enqueue did not return a job");
      }
      return { id, idempotencyKey, created: false };
    });
  }
}
