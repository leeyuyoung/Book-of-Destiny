import "server-only";

import type { SajuProfile } from "@/lib/saju";
import { REPORT_INSTRUCTIONS, buildReportInput, type ReportContext } from "./prompt";
import { AI_REPORT_JSON_SCHEMA, aiReportSchema, type AiReport } from "./reportSchema";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const REQUEST_TIMEOUT_MS = 240_000;
const MAX_OUTPUT_TOKENS = 32_000;
const MAX_ATTEMPTS = 2;

export type AiReportErrorCode = "CONFIG" | "UPSTREAM" | "TIMEOUT" | "INVALID_OUTPUT" | "REFUSED";

export class AiReportError extends Error {
  readonly code: AiReportErrorCode;
  constructor(code: AiReportErrorCode, message: string) {
    super(`[ai-report] ${code}: ${message}`);
    this.name = "AiReportError";
    this.code = code;
  }
}

type ResponsesPayload = {
  status?: string;
  incomplete_details?: { reason?: string } | null;
  error?: { message?: string } | null;
  output?: { type: string; content?: { type: string; text?: string; refusal?: string }[] }[];
};

function readConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!apiKey || !model) throw new AiReportError("CONFIG", "OPENAI_API_KEY 또는 OPENAI_MODEL이 설정되지 않았습니다.");
  return { apiKey, model };
}

async function requestOnce(input: string): Promise<AiReport> {
  const { apiKey, model } = readConfig();
  let response: Response;
  try {
    response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        instructions: REPORT_INSTRUCTIONS,
        input,
        reasoning: { effort: "low" },
        max_output_tokens: MAX_OUTPUT_TOKENS,
        store: false,
        text: { format: { type: "json_schema", name: "saju_report", strict: true, schema: AI_REPORT_JSON_SCHEMA } },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    throw new AiReportError(timedOut ? "TIMEOUT" : "UPSTREAM", timedOut ? "응답 시간 초과" : String(error));
  }

  const payload = (await response.json().catch(() => null)) as ResponsesPayload | null;
  if (!response.ok || !payload) {
    throw new AiReportError("UPSTREAM", `HTTP ${response.status} ${payload?.error?.message ?? ""}`.trim());
  }
  if (payload.status !== "completed") {
    throw new AiReportError("INVALID_OUTPUT", `status=${payload.status} ${payload.incomplete_details?.reason ?? ""}`.trim());
  }

  const content = (payload.output ?? []).filter((item) => item.type === "message").flatMap((item) => item.content ?? []);
  if (content.some((item) => item.type === "refusal")) throw new AiReportError("REFUSED", "모델이 응답을 거부했습니다.");
  const text = content.find((item) => item.type === "output_text")?.text;
  if (!text) throw new AiReportError("INVALID_OUTPUT", "응답 본문이 비어 있습니다.");

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new AiReportError("INVALID_OUTPUT", "JSON 파싱 실패");
  }
  const parsed = aiReportSchema.safeParse(json);
  if (!parsed.success) {
    throw new AiReportError("INVALID_OUTPUT", parsed.error.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`).join("; "));
  }
  return parsed.data;
}

/** 계산된 사주로 11-PART 전체 리포트를 한 번에 생성한다. 형식이 어긋나거나 일시 오류면 한 번 더 시도한다. */
export async function generateReport(profile: SajuProfile, context: ReportContext): Promise<AiReport> {
  const input = buildReportInput(profile, context);
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await requestOnce(input);
    } catch (error) {
      lastError = error;
      const retryable = error instanceof AiReportError && (error.code === "INVALID_OUTPUT" || error.code === "UPSTREAM");
      if (!retryable) break;
    }
  }
  throw lastError;
}
