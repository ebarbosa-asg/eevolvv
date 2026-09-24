import { approvalSecretFromEnv } from "@/lib/links";
import { requireOperator } from "@/lib/operator-auth";
import { ReviewError, issueApprovalLink, reviewPoolFromEnv } from "@/lib/review";
import { escapeHtml, reviewJson, wantsHtml } from "@/lib/review-http";
import { AuthError, requireAuthEnv } from "@/lib/session";

export const dynamic = "force-dynamic";

async function readLinkRequest(request: Request): Promise<{ csrf: string; clientId: string; batchId: string }> {
  const contentType = request.headers.get("content-type") ?? "";
  let csrf = request.headers.get("x-csrf-token") ?? "";
  let clientId = "";
  let batchId = "";
  if (contentType.includes("application/json")) {
    const payload: unknown = await request.json();
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      throw new ReviewError("json object required", 400);
    }
    const body = payload as Record<string, unknown>;
    if (!csrf && typeof body.csrf === "string") {
      csrf = body.csrf;
    }
    if (typeof body.clientId === "string") {
      clientId = body.clientId;
    }
    if (typeof body.batchId === "string") {
      batchId = body.batchId;
    }
  } else {
    const form = await request.formData();
    if (!csrf) {
      csrf = String(form.get("csrf") ?? "");
    }
    clientId = String(form.get("clientId") ?? "");
    batchId = String(form.get("batchId") ?? "");
  }
  return { csrf, clientId, batchId };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const env = requireAuthEnv();
    const body = await readLinkRequest(request);
    const session = await requireOperator(env.secret, request, body.csrf, reviewPoolFromEnv());
    const issued = await issueApprovalLink(reviewPoolFromEnv(), {
      operatorId: session.sub,
      clientId: body.clientId,
      batchId: body.batchId,
      secret: approvalSecretFromEnv(),
    });
    const path = `/a/${issued.token}`;
    if (wantsHtml(request)) {
      const safe = escapeHtml(path);
      return new Response(
        `<!doctype html><html lang="en"><meta charset="utf-8"><title>eevolvv ops</title><body><p>Client link, shown once.</p><p><a href="${safe}">${safe}</a></p><p>Expires ${escapeHtml(issued.expiresAt)}. Email delivery is not wired.</p></body></html>`,
        { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }
    return reviewJson({ path, expiresAt: issued.expiresAt });
  } catch (error) {
    const review =
      error instanceof ReviewError
        ? error
        : error instanceof AuthError
          ? new ReviewError(error.message, error.status)
          : new ReviewError(error instanceof Error ? error.message : "review failed", 500);
    if (wantsHtml(request)) {
      const url = new URL("/review", request.url);
      url.searchParams.set("error", review.message);
      return Response.redirect(url, 303);
    }
    return reviewJson({ error: review.message }, review.status);
  }
}
