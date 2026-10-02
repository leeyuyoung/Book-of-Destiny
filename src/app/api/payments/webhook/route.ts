import { z } from "zod";
import { jsonError as fail, readJsonBody } from "@/lib/server/http";
import { PAYMENT_KEY_PATTERN, PaymentError, syncPaymentFromToss } from "@/lib/server/payments";
import { clientIp, consumeRateLimit } from "@/lib/server/rateLimit";

const IP_LIMIT = { limit: 300, windowMs: 60 * 60 * 1000 };
const eventSchema = z.object({
  eventType: z.string(),
  data: z.object({ paymentKey: z.string().regex(PAYMENT_KEY_PATTERN) }).passthrough(),
});

/**
 * 토스페이먼츠 PAYMENT_STATUS_CHANGED 웹훅. 서명이 없는 이벤트라 본문은 믿지 않고,
 * paymentKey로 토스에 다시 조회한 결과만 반영한다. 200을 받지 못하면 토스가 최대 7회 재전송한다.
 */
export async function POST(request: Request) {
  const retryAfter = consumeRateLimit(`webhook:ip:${clientIp(request)}`, IP_LIMIT);
  if (retryAfter !== null) return fail(429, "too many requests", { "Retry-After": String(retryAfter) });

  const parsed = eventSchema.safeParse(await readJsonBody(request));
  if (!parsed.success || parsed.data.eventType !== "PAYMENT_STATUS_CHANGED") {
    return Response.json({ result: "ignored" });
  }

  try {
    const result = await syncPaymentFromToss(parsed.data.data.paymentKey);
    return Response.json({ result });
  } catch (error) {
    console.error(error instanceof PaymentError ? error.message : "[payment] webhook failed", error);
    return fail(500, "temporary failure");
  }
}
