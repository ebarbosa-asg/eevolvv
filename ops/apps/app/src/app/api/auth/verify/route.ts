import { providerFromEnv, verifyOperatorOtp } from "@/lib/operator-auth";
import { reviewPoolFromEnv } from "@/lib/review";
import { reviewJson, wantsHtml } from "@/lib/review-http";
import { AuthError, issueSession, requireAuthEnv, sessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const env = requireAuthEnv();
    const body = await readBody(request);
    const verified = await verifyOperatorOtp(reviewPoolFromEnv(), providerFromEnv(), body.email, body.token);
    const issued = issueSession(verified.userId, env.secret);
    if (wantsHtml(request)) {
      return new Response(null, {
        status: 303,
        headers: { location: new URL("/review", request.url).toString(), "set-cookie": sessionCookie(issued.token) },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json", "set-cookie": sessionCookie(issued.token) },
    });
  } catch (error) {
    const auth = error instanceof AuthError ? error : new AuthError("sign in failed", 500);
    if (wantsHtml(request)) {
      const url = new URL("/login/verify", request.url);
      url.searchParams.set("error", auth.message);
      return Response.redirect(url, 303);
    }
    return reviewJson({ error: auth.message }, auth.status);
  }
}

async function readBody(request: Request): Promise<{ email: string; token: string }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const payload: unknown = await request.json();
    if (typeof payload !== "object" || payload === null) {
      return { email: "", token: "" };
    }
    const body = payload as { email?: unknown; token?: unknown };
    return {
      email: typeof body.email === "string" ? body.email : "",
      token: typeof body.token === "string" ? body.token : "",
    };
  }
  const form = await request.formData();
  return { email: String(form.get("email") ?? ""), token: String(form.get("token") ?? "") };
}
