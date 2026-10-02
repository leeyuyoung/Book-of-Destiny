import "server-only";

import type { AnalysisRecord } from "@/lib/server/store";
import { buildReportEmail } from "./reportEmail";

const RESEND_API = "https://api.resend.com/emails";
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * 결제가 끝난 리포트의 링크를 입력한 이메일로 보낸다.
 * 같은 리포트로 여러 번 불려도 Resend 멱등 키(24시간 유효)로 한 통만 나간다.
 * 메일 실패가 결제를 되돌리면 안 되므로 예외를 던지지 않고 결과만 돌려준다.
 */
export async function sendReportEmail(record: Pick<AnalysisRecord, "token" | "name" | "email">): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const appUrl = process.env.APP_URL;
  if (!apiKey || !from || !appUrl) {
    console.error("[email] RESEND_API_KEY, EMAIL_FROM, APP_URL must be set; report email skipped");
    return false;
  }

  const reportUrl = new URL(`/report/${record.token}`, appUrl).toString();
  const { subject, html, text } = buildReportEmail({ name: record.name, reportUrl });

  try {
    const response = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `report-email/${record.token}`,
      },
      body: JSON.stringify({ from, to: [record.email], subject, html, text }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[email] resend HTTP ${response.status} ${body.slice(0, 200)}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] resend request failed", String(error));
    return false;
  }
}
