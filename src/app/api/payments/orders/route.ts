import { z } from "zod";
import { TOKEN_PATTERN } from "@/lib/server/analysis";
import { isSameOrigin, jsonError as fail, readJsonBody } from "@/lib/server/http";
import { ORDER_NAME, PaymentError, createOrder } from "@/lib/server/payments";
import { clientIp, consumeRateLimit } from "@/lib/server/rateLimit";
import { checkoutContactSchema } from "@/lib/validation/analysisInput";

const IP_LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 };
const bodySchema = checkoutContactSchema.extend({ token: z.string().regex(TOKEN_PATTERN) });

/** 결제 직전에 주문을 만든다. 금액은 서버가 정해 돌려준다. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "허용되지 않은 요청입니다.");
  const parsed = bodySchema.safeParse(await readJsonBody(request));
  if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "잘못된 요청입니다.");

  const retryAfter = consumeRateLimit(`order:ip:${clientIp(request)}`, IP_LIMIT);
  if (retryAfter !== null) return fail(429, "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", { "Retry-After": String(retryAfter) });

  try {
    const order = await createOrder(parsed.data.token, parsed.data.email);
    return Response.json(
      { orderId: order.orderId, amount: order.amount, orderName: ORDER_NAME },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof PaymentError) return fail(error.status, error.userMessage);
    console.error("[payment] create order failed", error);
    return fail(500, "주문을 만들지 못했습니다. 잠시 후 다시 시도해주세요.");
  }
}
