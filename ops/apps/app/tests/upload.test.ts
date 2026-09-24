import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { handle } from "../src/lib/http";
import { MemoryStore, MemoryUploadDb } from "../src/lib/memory";
import { probeBytes } from "../src/lib/probe";
import type { ProbeResult } from "../src/lib/types";
import { UploadError } from "../src/lib/types";
import { completeUpload, initUpload, uploadPart } from "../src/lib/upload";

const clientId = "11111111-1111-4111-8111-111111111111";
const confirmedBy = "22222222-2222-4222-8222-222222222222";

function videoProbe(): ProbeResult {
  return { durationS: 1.5, width: 320, height: 240, videoCodec: "h264" };
}

async function putParts(store: MemoryStore, db: MemoryUploadDb, bytes: Uint8Array) {
  const init = await initUpload(
    { store, db },
    { clientId, filename: "episode.mp4", contentType: "video/mp4", rightsConfirmed: true, confirmedBy },
  );
  const midpoint = Math.max(1, Math.floor(bytes.byteLength / 2));
  const first = await uploadPart(
    { store, db },
    {
      key: init.key,
      uploadId: init.uploadId,
      partNumber: 1,
      bodyBase64: Buffer.from(bytes.subarray(0, midpoint)).toString("base64"),
    },
  );
  const second = await uploadPart(
    { store, db },
    {
      key: init.key,
      uploadId: init.uploadId,
      partNumber: 2,
      bodyBase64: Buffer.from(bytes.subarray(midpoint)).toString("base64"),
    },
  );
  return { init, parts: [first, second] };
}

describe("upload", () => {
  it("requires the rights checkbox before opening an upload", async () => {
    const store = new MemoryStore();
    const db = new MemoryUploadDb();
    await expect(
      initUpload({ store, db }, { clientId, rightsConfirmed: false, confirmedBy }),
    ).rejects.toBeInstanceOf(UploadError);
    const response = await handle(() =>
      initUpload({ store, db }, { clientId, rightsConfirmed: false, confirmedBy }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "rights checkbox required" });
  });

  it("stores a probed video, dedupes sha256 per client, and enqueues transcribe once", async () => {
    const store = new MemoryStore();
    const db = new MemoryUploadDb();
    const bytes = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);
    const deps = { store, db, probe: async () => videoProbe() };
    const firstParts = await putParts(store, db, bytes);
    const created = await completeUpload(deps, {
      clientId,
      key: firstParts.init.key,
      uploadId: firstParts.init.uploadId,
      parts: firstParts.parts,
      filename: "episode.mp4",
      rightsConfirmed: true,
      confirmedBy,
    });
    expect(created.deduped).toBe(false);
    expect(created.idempotencyKey).toBe(`transcribe:${created.assetId}`);
    expect(db.assets).toHaveLength(1);
    expect(db.assets[0]?.sha256).toMatch(/^[0-9a-f]{64}$/);

    const secondParts = await putParts(store, db, bytes);
    const again = await completeUpload(deps, {
      clientId,
      key: secondParts.init.key,
      uploadId: secondParts.init.uploadId,
      parts: secondParts.parts,
      filename: "episode-copy.mp4",
      rightsConfirmed: true,
      confirmedBy,
    });
    expect(again.deduped).toBe(true);
    expect(again.assetId).toBe(created.assetId);
    expect(again.jobId).toBe(created.jobId);
    expect(db.assets).toHaveLength(1);
    expect(db.jobs).toHaveLength(1);
    await expect(store.getBytes(secondParts.init.key)).rejects.toThrow(/missing object/);
  });

  it("rejects audio-only and non-video probes", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "evv-media-"));
    try {
      const wav = path.join(dir, "tone.wav");
      await run("ffmpeg", ["-y", "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000", "-t", "1", wav]);
      const wavBytes = new Uint8Array(await import("node:fs/promises").then((fs) => fs.readFile(wav)));
      await expect(probeBytes(wavBytes)).rejects.toThrow(/audio-only or non-video/);

      const mp4 = path.join(dir, "clip.mp4");
      await run("ffmpeg", [
        "-y",
        "-f",
        "lavfi",
        "-i",
        "testsrc=size=160x120:rate=30",
        "-f",
        "lavfi",
        "-i",
        "sine=frequency=440:sample_rate=48000",
        "-t",
        "1",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        mp4,
      ]);
      const videoBytes = new Uint8Array(await import("node:fs/promises").then((fs) => fs.readFile(mp4)));
      const probed = await probeBytes(videoBytes);
      expect(probed.videoCodec).toBe("h264");
      expect(probed.durationS).toBeGreaterThan(0);
      expect(probed.width).toBe(160);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("does not insert an asset when the probe rejects the object", async () => {
    const store = new MemoryStore();
    const db = new MemoryUploadDb();
    const bytes = Uint8Array.from([9, 9, 9]);
    const opened = await putParts(store, db, bytes);
    await expect(
      completeUpload(
        {
          store,
          db,
          probe: async () => {
            throw new UploadError("reject: audio-only or non-video", 400);
          },
        },
        {
          clientId,
          key: opened.init.key,
          uploadId: opened.init.uploadId,
          parts: opened.parts,
          rightsConfirmed: true,
          confirmedBy,
        },
      ),
    ).rejects.toThrow(/audio-only/);
    expect(db.assets).toHaveLength(0);
    expect(db.jobs).toHaveLength(0);
    expect(randomUUID()).toMatch(UUID_SHAPE);
  });
});

const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited ${code ?? "null"}`));
      }
    });
  });
}
