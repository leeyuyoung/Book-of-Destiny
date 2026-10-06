import { TOKEN_PATTERN, startReportGeneration, storedReport } from "@/lib/server/analysis";
import { isSameOrigin, jsonError as fail } from "@/lib/server/http";
import { clientIp, consumeRateLimit } from "@/lib/server/rateLimit";
import { getAnalysisStore } from "@/lib/server/store";

const NO_STORE = { "Cache-Control": "no-store" };
const RETRY_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 };

export const maxDuration = 300;

/** 리포트 생성 진행 상태만 알려준다. 리포트 내용은 이 응답에 담지 않는다. */
export async function GET(_request: Request, ctx: RouteContext<"/api/analysis/[token]">) {
  const { token } = await ctx.params;
  const record = TOKEN_PATTERN.test(token) ? await getAnalysisStore().get(token) : null;
  if (!record) return Response.json({ status: "not_found" }, { status: 404, headers: NO_STORE });
  return Response.json({ status: record.status, reportReady: storedReport(record) !== null }, { headers: NO_STORE });
}

/** 결제된 리포트의 생성이 실패했거나 멈췄을 때 다시 시작한다. 결제되지 않았으면 아무것도 하지 않는다. */
export async function POST(request: Request, ctx: RouteContext<"/api/analysis/[token]">) {
  if (!isSameOrigin(request)) return fail(403, "허용되지 않은 요청입니다.");
  const retryAfter = consumeRateLimit(`report-retry:ip:${clientIp(request)}`, RETRY_LIMIT);
  if (retryAfter !== null) return fail(429, "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", { "Retry-After": String(retryAfter) });

  const { token } = await ctx.params;
  const record = TOKEN_PATTERN.test(token) ? await getAnalysisStore().get(token) : null;
  if (!record || record.paidAt === null) return fail(404, "리포트를 찾지 못했습니다.");
  await startReportGeneration(token);
  return Response.json({ ok: true }, { status: 202, headers: NO_STORE });
}
