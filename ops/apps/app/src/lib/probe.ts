import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { UploadError, type ProbeResult } from "./types";

interface FfprobeStream {
  codec_type?: string;
  codec_name?: string;
  width?: number;
  height?: number;
}

interface FfprobePayload {
  streams?: FfprobeStream[];
  format?: { duration?: string };
}

function run(command: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    child.stdout.on("data", (chunk: Buffer) => out.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => err.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        code: code ?? 1,
        stdout: Buffer.concat(out).toString("utf8"),
        stderr: Buffer.concat(err).toString("utf8"),
      });
    });
  });
}

export async function probeBytes(bytes: Uint8Array): Promise<ProbeResult> {
  const dir = await mkdtemp(path.join(tmpdir(), "evv-probe-"));
  const file = path.join(dir, "source.bin");
  try {
    await writeFile(file, bytes);
    const proc = await run(process.env.FFPROBE_PATH ?? "ffprobe", [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_streams",
      "-show_format",
      file,
    ]);
    if (proc.code !== 0) {
      throw new UploadError("reject: audio-only or non-video", 400);
    }
    const payload = JSON.parse(proc.stdout) as FfprobePayload;
    const streams = Array.isArray(payload.streams) ? payload.streams : [];
    const video = streams.find((stream) => stream.codec_type === "video");
    const durationRaw = payload.format?.duration;
    const durationS = durationRaw && durationRaw !== "N/A" ? Number(durationRaw) : 0;
    if (!video?.codec_name || !(durationS > 0)) {
      throw new UploadError("reject: audio-only or non-video", 400);
    }
    return {
      durationS,
      width: typeof video.width === "number" ? video.width : null,
      height: typeof video.height === "number" ? video.height : null,
      videoCodec: video.codec_name,
    };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
