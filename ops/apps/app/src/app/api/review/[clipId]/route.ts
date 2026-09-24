import { requireOperator } from "@/lib/operator-auth";
import { operatorDecision, reviewPoolFromEnv } from "@/lib/review";
import { handleReview, readOperatorAction } from "@/lib/review-http";
import { requireAuthEnv } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ clipId: string }> }): Promise<Response> {
  const { clipId } = await context.params;
  return handleReview(
    request,
    async () => {
      const env = requireAuthEnv();
      const action = await readOperatorAction(request);
      const session = await requireOperator(env.secret, request, action.csrf, reviewPoolFromEnv());
      return operatorDecision(reviewPoolFromEnv(), {
        clipId,
        operatorId: session.sub,
        decision: action.decision,
        reason: action.reason,
      });
    },
    `/review/${clipId}?saved=1`,
  );
}
