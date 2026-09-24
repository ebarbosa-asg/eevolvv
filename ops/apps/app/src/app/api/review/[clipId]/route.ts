import { handleReview, readOperatorAction } from "@/lib/review-http";
import { operatorDecision, reviewPoolFromEnv } from "@/lib/review";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ clipId: string }> }): Promise<Response> {
  const { clipId } = await context.params;
  return handleReview(
    request,
    async () => {
      const action = await readOperatorAction(request);
      return operatorDecision(reviewPoolFromEnv(), {
        clipId,
        operatorId: action.operatorId,
        decision: action.decision,
        reason: action.reason,
      });
    },
    `/review/${clipId}?saved=1`,
  );
}
