import { z } from "zod";
import { isSameOrigin, jsonError as fail, readJsonBody } from "@/lib/server/http";
import { ORDER_ID_PATTERN, PAYMENT_KEY_PATTERN, PaymentError, confirmPayment } from "@/lib/server/payments";
import { clientIp, consumeRateLimit } from "@/lib/server/rateLimit";

const IP_LIMIT = { limit: 30, windowMs: 60 * 60 * 1000 };
const bodySchema = z.object({
  paymentKey: z.string().regex(PAYMENT_KEY_PATTERN),
  orderId: z.string().regex(ORDER_ID_PATTERN),
  amount: z.number().int().positive(),
});

/** 토스 결제 인증 후 서버에서 금액을 검증하고 승인한다. 성공해야만 리포트가 열린다. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "허용되지 않은 요청입니다.");
  const parsed = bodySchema.safeParse(await readJsonBody(request));
  if (!parsed.success) return fail(400, "결제 정보가 올바르지 않습니다.");

  const retryAfter = consumeRateLimit(`confirm:ip:${clientIp(request)}`, IP_LIMIT);
  if (retryAfter !== null) return fail(429, "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", { "Retry-After": String(retryAfter) });

  try {
    const token = await confirmPayment(parsed.data);
    return Response.json({ token }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PaymentError) {
      console.error(error.message);
      return fail(error.status, error.userMessage);
    }
    console.error("[payment] confirm failed", error);
    return fail(500, "결제를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }
}
