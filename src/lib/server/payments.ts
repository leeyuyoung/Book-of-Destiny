import "server-only";

import { randomBytes } from "node:crypto";
import { DETAILED_REPORT_PRICE } from "@/lib/constants/service";
import { markAnalysisPaid, revokeAnalysisPaid } from "./analysis";
import { getAnalysisStore, type OrderRecord } from "./store";

const TOSS_API = "https://api.tosspayments.com/v1/payments";
const REQUEST_TIMEOUT_MS = 30_000;
/** 토스는 결제 인증 후 10분 안에 승인하지 않으면 만료시키므로, 하루 지난 대기 주문은 다시 쓰일 일이 없다. */
const STALE_ORDER_MS = 24 * 60 * 60 * 1000;

export const ORDER_NAME = "도화사주 상세 인생 리포트";
export const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;
export const PAYMENT_KEY_PATTERN = /^[A-Za-z0-9_-]{1,200}$/;

export class PaymentError extends Error {
  constructor(
    readonly status: number,
    readonly userMessage: string,
    detail?: string,
    /** 같은 요청을 다시 보내면 해결될 수 있는 오류. 승인 요청은 멱등 키 덕분에 다시 보내도 중복 결제되지 않는다. */
    readonly retryable = false,
  ) {
    super(`[payment] ${detail ?? userMessage}`);
    this.name = "PaymentError";
  }
}

type TossPayment = { status: string; orderId: string; totalAmount: number; method?: string | null; approvedAt?: string | null };
type TossError = { code?: string; message?: string };

function secretAuthHeader() {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) throw new PaymentError(500, "결제 설정에 문제가 있습니다.", "TOSS_SECRET_KEY missing");
  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

async function callToss(path: string, init: RequestInit & { idempotencyKey?: string }) {
  const headers: Record<string, string> = { Authorization: secretAuthHeader(), "Content-Type": "application/json" };
  if (init.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;
  try {
    const response = await fetch(`${TOSS_API}${path}`, { ...init, headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    const body = (await response.json().catch(() => ({}))) as TossPayment & TossError;
    return { ok: response.ok, status: response.status, body };
  } catch (error) {
    throw new PaymentError(502, "결제사와 통신하지 못했습니다. 잠시 후 다시 확인해주세요.", String(error), true);
  }
}

const lookupPayment = (paymentKey: string) => callToss(`/${encodeURIComponent(paymentKey)}`, { method: "GET" });

/** 결제할 수 있는 분석에 대해 주문을 만든다. 금액은 항상 서버의 정가다. */
export async function createOrder(token: string, email: string): Promise<OrderRecord> {
  const store = getAnalysisStore();
  const record = await store.get(token);
  if (!record || record.status !== "ready") throw new PaymentError(404, "결제할 리포트를 찾지 못했습니다.");
  if (record.paidAt !== null) throw new PaymentError(409, "이미 결제가 완료된 리포트입니다.");
  if (record.email !== email) await store.update(token, { email });

  const now = Date.now();
  await store.deleteStalePendingOrders(now - STALE_ORDER_MS).catch((error) => {
    console.error("[payment] stale order cleanup failed", error);
  });

  const order: OrderRecord = {
    orderId: `dohwa_${randomBytes(16).toString("base64url")}`,
    token,
    amount: DETAILED_REPORT_PRICE,
    status: "pending",
    paymentKey: null,
    method: null,
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
  };
  await store.createOrder(order);
  return order;
}

const matchesOrder = (payment: TossPayment, order: OrderRecord) =>
  payment.status === "DONE" && payment.orderId === order.orderId && payment.totalAmount === order.amount;

async function completeOrder(order: OrderRecord, paymentKey: string, payment: TossPayment) {
  await getAnalysisStore().updateOrder(order.orderId, {
    status: "paid",
    paymentKey,
    method: payment.method ?? null,
    approvedAt: payment.approvedAt ? Date.parse(payment.approvedAt) : Date.now(),
  });
  await markAnalysisPaid(order.token);
}

/**
 * 토스가 successUrl로 돌려준 값을 서버에서 검증하고 결제를 승인한다.
 * 금액·주문번호가 서버 기록과 다르면 승인하지 않는다. 같은 결제가 다시 들어오면 한 번만 처리한다.
 */
export async function confirmPayment(input: { paymentKey: string; orderId: string; amount: number }): Promise<string> {
  const store = getAnalysisStore();
  const order = await store.getOrder(input.orderId);
  if (!order) throw new PaymentError(404, "주문 정보를 찾지 못했습니다.");
  if (input.amount !== order.amount) {
    throw new PaymentError(400, "결제 금액이 주문 정보와 일치하지 않습니다.", `amount mismatch ${input.amount} != ${order.amount}`);
  }
  if (order.status === "canceled") throw new PaymentError(409, "환불 처리된 주문입니다.");
  if (order.status === "paid") {
    if (order.paymentKey !== input.paymentKey) throw new PaymentError(409, "이미 처리된 주문입니다.");
    await markAnalysisPaid(order.token);
    return order.token;
  }

  // 다른 탭에서 이미 결제했다면 이번 결제는 승인하지 않는다. 승인하지 않은 결제는 토스가 만료시키고 청구하지 않는다.
  const record = await store.get(order.token);
  if (!record) throw new PaymentError(404, "결제할 리포트를 찾지 못했습니다.");
  if (record.paidAt !== null) {
    throw new PaymentError(409, "이미 결제가 완료된 리포트입니다. 이번 결제는 승인하지 않았으므로 청구되지 않습니다.");
  }

  const confirmed = await callToss("/confirm", {
    method: "POST",
    body: JSON.stringify({ paymentKey: input.paymentKey, orderId: order.orderId, amount: order.amount }),
    idempotencyKey: input.paymentKey,
  });

  let payment: TossPayment | null = confirmed.ok ? confirmed.body : null;
  let upstreamStatus = confirmed.status;
  if (!confirmed.ok && confirmed.body.code === "ALREADY_PROCESSED_PAYMENT") {
    const lookup = await lookupPayment(input.paymentKey);
    payment = lookup.ok ? lookup.body : null;
    upstreamStatus = lookup.status;
  }
  if (!payment) {
    const retryable = upstreamStatus >= 500;
    const message = retryable
      ? "결제사 응답이 지연되고 있습니다. 잠시 후 다시 확인해주세요."
      : (confirmed.body.message ?? "결제를 승인하지 못했습니다.");
    throw new PaymentError(retryable ? 502 : 400, message, `toss ${upstreamStatus} ${confirmed.body.code ?? "unknown"}`, retryable);
  }
  if (!matchesOrder(payment, order)) {
    console.error(`[payment] verification mismatch for ${order.orderId}: status=${payment.status}`);
    throw new PaymentError(400, "결제 정보를 확인하지 못했습니다. 고객센터로 문의해주세요.", "verification mismatch");
  }

  try {
    await completeOrder(order, input.paymentKey, payment);
  } catch (error) {
    throw new PaymentError(
      503,
      "결제는 승인되었지만 리포트를 여는 중 문제가 생겼습니다. 다시 확인해주세요.",
      `complete failed for ${order.orderId}: ${String(error)}`,
      true,
    );
  }
  return order.token;
}

/**
 * 웹훅으로 알림받은 결제를 토스에 직접 조회해 주문 상태를 맞춘다. 웹훅 본문은 믿지 않고 paymentKey만 쓴다.
 * 승인 직후 사용자가 창을 닫아 리포트가 안 열린 경우와, 환불된 경우를 처리한다.
 */
export async function syncPaymentFromToss(paymentKey: string): Promise<"updated" | "ignored"> {
  const lookup = await lookupPayment(paymentKey);
  if (!lookup.ok) {
    if (lookup.status < 500) return "ignored";
    throw new PaymentError(502, "결제사 조회 실패", `lookup ${lookup.status} ${lookup.body.code ?? ""}`, true);
  }
  const payment = lookup.body;
  if (typeof payment.orderId !== "string" || !ORDER_ID_PATTERN.test(payment.orderId)) return "ignored";

  const order = await getAnalysisStore().getOrder(payment.orderId);
  if (!order) return "ignored";

  if (payment.status === "DONE" && matchesOrder(payment, order)) {
    if (order.status === "pending") {
      await completeOrder(order, paymentKey, payment);
      return "updated";
    }
    if (order.status === "paid" && order.paymentKey === paymentKey) {
      await markAnalysisPaid(order.token);
      return "updated";
    }
  }

  if (payment.status === "CANCELED" && order.status === "paid" && order.paymentKey === paymentKey) {
    await getAnalysisStore().updateOrder(order.orderId, { status: "canceled" });
    await revokeAnalysisPaid(order.token);
    console.info(`[payment] order ${order.orderId} canceled; report locked again`);
    return "updated";
  }
  return "ignored";
}
