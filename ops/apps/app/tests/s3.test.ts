import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import { afterAll, beforeAll, expect, it } from "vitest";

import { S3Store } from "../src/lib/s3";

const workers = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../workers");
const port = 45661;
let server: ChildProcess | undefined;

function waitForReady(child: ChildProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("moto server did not start")), 20_000);
    child.stdout?.on("data", (chunk: Buffer) => {
      if (chunk.toString("utf8").includes("ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`moto exited ${code ?? "null"}`));
    });
  });
}

beforeAll(async () => {
  server = spawn(
    "uv",
    [
      "run",
      "python",
      "-c",
      [
        "from moto.server import ThreadedMotoServer",
        "import time",
        `server = ThreadedMotoServer(ip_address='127.0.0.1', port=${port})`,
        "server.start()",
        "print('ready', flush=True)",
        "time.sleep(600)",
      ].join("\n"),
    ],
    { cwd: workers, stdio: ["ignore", "pipe", "pipe"] },
  );
  await waitForReady(server);
}, 30_000);

afterAll(() => {
  server?.kill("SIGTERM");
});

it("completes a multipart upload against the S3 API", async () => {
  const client = new S3Client({
    region: "us-east-1",
    endpoint: `http://127.0.0.1:${port}`,
    forcePathStyle: true,
    credentials: { accessKeyId: "test", secretAccessKey: "test" },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  await client.send(new CreateBucketCommand({ Bucket: "evv-ops" }));
  const store = new S3Store(client, "evv-ops");
  const key = "sources/demo/episode.bin";
  const uploadId = await store.createMultipart(key, "application/octet-stream");
  const first = new Uint8Array(5 * 1024 * 1024);
  first.set([1, 2, 3], 0);
  const etag1 = await store.uploadPart(key, uploadId, 1, first);
  const etag2 = await store.uploadPart(key, uploadId, 2, Uint8Array.from([4, 5, 6]));
  await store.completeMultipart(key, uploadId, [
    { partNumber: 1, etag: etag1 },
    { partNumber: 2, etag: etag2 },
  ]);
  const stored = await store.getBytes(key);
  expect(stored.byteLength).toBe(first.byteLength + 3);
  expect(stored[0]).toBe(1);
  expect(stored.at(-1)).toBe(6);
  await store.deleteObject(key);
  client.destroy();
});
