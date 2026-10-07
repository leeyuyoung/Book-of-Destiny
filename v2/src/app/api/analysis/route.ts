import { SajuCalculationError } from "@/lib/saju";
import { isSameOrigin, jsonError as fail, readJsonBody } from "@/lib/server/http";
import { saveInputCookie } from "@/lib/server/inputCookie";
import { clientIp, consumeRateLimit } from "@/lib/server/rateLimit";
import { freeResultFromInput } from "@/lib/server/resultView";
import { analysisInputSchema } from "@/lib/validation/analysisInput";

const IP_LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 };

/** 만세력으로 계산이 되는지 확인하고, 결과 화면에서 다시 계산할 수 있게 입력값을 쿠키에 둔다. AI는 호출하지 않는다. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "허용되지 않은 요청입니다.");

  const json = await readJsonBody(request);
  const parsed = analysisInputSchema.safeParse(json);
  if (!parsed.success) return fail(400, "입력값을 다시 확인해주세요.");
  const input = parsed.data;

  const retryAfter = consumeRateLimit(`analysis:ip:${clientIp(request)}`, IP_LIMIT);
  if (retryAfter !== null) {
    return fail(429, "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", { "Retry-After": String(retryAfter) });
  }

  try {
    freeResultFromInput(input);
    await saveInputCookie(input);
    return Response.json({ ok: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SajuCalculationError) {
      if (!error.isUserError) console.error(`[analysis] saju ${error.code}`, error.detail);
      return fail(error.isUserError ? 400 : 500, error.userMessage);
    }
    console.error("[analysis] unexpected", error);
    return fail(500, "분석을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }
}
