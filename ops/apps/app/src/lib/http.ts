import { UploadError } from "./types";

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const payload: unknown = await request.json();
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new UploadError("json object required", 400);
  }
  return payload as Record<string, unknown>;
}

export async function handle(fn: () => Promise<unknown>): Promise<Response> {
  try {
    return json(await fn());
  } catch (error) {
    if (error instanceof UploadError) {
      return json({ error: error.message }, error.status);
    }
    if (error instanceof SyntaxError) {
      return json({ error: "json object required" }, 400);
    }
    const message = error instanceof Error ? error.message : "upload failed";
    return json({ error: message }, 500);
  }
}
