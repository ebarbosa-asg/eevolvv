import { json } from "./http";
import { AuthError } from "./session";
import { ReviewError, parseDecision, type Decision } from "./review";

export function reviewJson(body: unknown, status = 200): Response {
  return json(body, status);
}

export async function handleReview(request: Request, fn: () => Promise<unknown>, okPath: string): Promise<Response> {
  try {
    const body = await fn();
    if (wantsHtml(request)) {
      return Response.redirect(new URL(okPath, request.url), 303);
    }
    return reviewJson(body);
  } catch (error) {
    const review = asReviewError(error);
    if (wantsHtml(request)) {
      const url = new URL(okPath, request.url);
      url.search = "";
      url.searchParams.set("error", review.message);
      return Response.redirect(url, 303);
    }
    return reviewJson({ error: review.message }, review.status);
  }
}

export function wantsHtml(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
}

export async function readOperatorAction(request: Request): Promise<{ csrf: string; decision: Decision; reason: string | null }> {
  const contentType = request.headers.get("content-type") ?? "";
  let csrf = request.headers.get("x-csrf-token") ?? "";
  let decision = "";
  let reason: string | null = null;
  if (contentType.includes("application/json")) {
    const payload: unknown = await request.json();
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      throw new ReviewError("json object required", 400);
    }
    const body = payload as Record<string, unknown>;
    if (!csrf && typeof body.csrf === "string") {
      csrf = body.csrf;
    }
    if (typeof body.decision === "string") {
      decision = body.decision;
    }
    if (typeof body.reason === "string") {
      reason = body.reason;
    }
  } else {
    const form = await request.formData();
    if (!csrf) {
      csrf = String(form.get("csrf") ?? "");
    }
    decision = String(form.get("decision") ?? "");
    const raw = form.get("reason");
    reason = typeof raw === "string" && raw.trim().length > 0 ? raw : null;
  }
  return { csrf, decision: parseDecision(decision), reason };
}

function asReviewError(error: unknown): ReviewError {
  if (error instanceof ReviewError) {
    return error;
  }
  if (error instanceof AuthError) {
    return new ReviewError(error.message, error.status);
  }
  return new ReviewError(error instanceof Error ? error.message : "review failed", 500);
}

export async function readClientDecisions(
  request: Request,
): Promise<{ clipId: string; decision: Decision; reason: string | null }[]> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const payload: unknown = await request.json();
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      throw new ReviewError("json object required", 400);
    }
    const decisions = (payload as { decisions?: unknown }).decisions;
    if (!Array.isArray(decisions)) {
      throw new ReviewError("decisions are required", 400);
    }
    return decisions.map((item) => {
      if (typeof item !== "object" || item === null) {
        throw new ReviewError("decision must be approve, reject, or changes_requested", 400);
      }
      const row = item as Record<string, unknown>;
      return {
        clipId: String(row.clipId ?? ""),
        decision: parseDecision(row.decision),
        reason: typeof row.reason === "string" ? row.reason : null,
      };
    });
  }
  const form = await request.formData();
  const decisions: { clipId: string; decision: Decision; reason: string | null }[] = [];
  for (const [key, value] of form.entries()) {
    if (!key.startsWith("decision-") || typeof value !== "string") {
      continue;
    }
    const clipId = key.slice("decision-".length);
    const raw = form.get(`reason-${clipId}`);
    decisions.push({
      clipId,
      decision: parseDecision(value),
      reason: typeof raw === "string" && raw.trim().length > 0 ? raw : null,
    });
  }
  return decisions;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
