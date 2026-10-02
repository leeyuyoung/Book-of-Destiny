import { TOKEN_PATTERN } from "@/lib/server/analysis";
import { getAnalysisStore } from "@/lib/server/store";

const NO_STORE = { "Cache-Control": "no-store" };

/** 생성 진행 상태만 알려준다. 리포트 내용은 이 응답에 담지 않는다. */
export async function GET(_request: Request, ctx: RouteContext<"/api/analysis/[token]">) {
  const { token } = await ctx.params;
  const record = TOKEN_PATTERN.test(token) ? await getAnalysisStore().get(token) : null;
  if (!record) return Response.json({ status: "not_found" }, { status: 404, headers: NO_STORE });
  return Response.json({ status: record.status }, { headers: NO_STORE });
}
