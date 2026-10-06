import { after } from "next/server";
import { SajuCalculationError } from "@/lib/saju";
import { createAnalysis, generationCapacityAvailable, runReportGeneration } from "@/lib/server/analysis";
import { isSameOrigin, jsonError as fail, readJsonBody } from "@/lib/server/http";
import { clientIp, consumeRateLimit } from "@/lib/server/rateLimit";
import { analysisInputSchema } from "@/lib/validation/analysisInput";

export const maxDuration = 300;

const IP_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

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
  if (!generationCapacityAvailable()) {
    return fail(503, "지금 분석 요청이 많습니다. 잠시 후 다시 시도해주세요.", { "Retry-After": "30" });
  }

  let record;
  try {
    record = await createAnalysis(input);
  } catch (error) {
    if (error instanceof SajuCalculationError) {
      if (!error.isUserError) console.error(`[analysis] saju ${error.code}`, error.detail);
      return fail(error.isUserError ? 400 : 500, error.userMessage);
    }
    console.error("[analysis] unexpected", error);
    return fail(500, "분석을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  after(() => runReportGeneration(record));
  return Response.json({ token: record.token }, { status: 202, headers: { "Cache-Control": "no-store" } });
}
