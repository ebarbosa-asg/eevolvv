import { readFileSync, writeFileSync } from "node:fs";

import { Pool } from "pg";
import { expect, it } from "vitest";

import { MemoryStore } from "../src/lib/memory";
import { PostgresUploadDb } from "../src/lib/postgres";
import { completeUpload, initUpload, PART_SIZE, uploadPart } from "../src/lib/upload";

it("uploads the e2e source through the rights and probe gate", async () => {
  const statePath = process.env.EVV_E2E_STATE;
  const databaseUrl = process.env.DATABASE_URL;
  if (!statePath || !databaseUrl) {
    throw new Error("EVV_E2E_STATE and DATABASE_URL are required");
  }
  const state = JSON.parse(readFileSync(statePath, "utf8")) as {
    clientId: string;
    confirmedBy: string;
    videoPath: string;
    resultPath: string;
  };
  const bytes = readFileSync(state.videoPath);
  expect(bytes.byteLength).toBeGreaterThan(0);
  const pool = new Pool({ connectionString: databaseUrl });
  const store = new MemoryStore();
  const db = new PostgresUploadDb(pool);
  try {
    const opened = await initUpload(
      { store, db },
      { clientId: state.clientId, filename: "episode.mp4", rightsConfirmed: true, confirmedBy: state.confirmedBy },
    );
    const parts: { etag: string; partNumber: number }[] = [];
    for (let offset = 0, partNumber = 1; offset < bytes.byteLength; partNumber += 1) {
      const slice = bytes.subarray(offset, Math.min(offset + PART_SIZE, bytes.byteLength));
      offset += slice.byteLength;
      parts.push(
        await uploadPart(
          { store, db },
          {
            key: opened.key,
            uploadId: opened.uploadId,
            partNumber,
            bodyBase64: Buffer.from(slice).toString("base64"),
          },
        ),
      );
    }
    const created = await completeUpload(
      { store, db },
      {
        clientId: state.clientId,
        key: opened.key,
        uploadId: opened.uploadId,
        parts,
        filename: "episode.mp4",
        rightsConfirmed: true,
        confirmedBy: state.confirmedBy,
      },
    );
    expect(created.deduped).toBe(false);
    writeFileSync(state.resultPath, JSON.stringify(created));
  } finally {
    await pool.end();
  }
});
