import "server-only";

import { randomBytes } from "node:crypto";
import { DETAILED_REPORT_PRICE } from "@/lib/constants/service";
import { markAnalysisPaid } from "./analysis";
import { getAnalysisStore, type OrderRecord } from "./store";

const TOSS_API = "https://api.tosspayments.com/v1/payments";
const REQUEST_TIMEOUT_MS = 30_000;

export const ORDER_NAME = "팔자서재 상세 인생 리포트";
export const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;
export const PAYMENT_KEY_PATTERN = /^[A-Za-z0-9_-]{1,200}$/;

export class PaymentError extends Error {
  constructor(
    readonly status: number,
    readonly userMessage: string,
    detail?: string,
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
    return { ok: response.ok, body };
  } catch (error) {
    throw new PaymentError(502, "결제사와 통신하지 못했습니다. 잠시 후 다시 시도해주세요.", String(error));
  }
}

/** 결제할 수 있는 분석에 대해 주문을 만든다. 금액은 항상 서버의 정가다. */
export async function createOrder(token: string): Promise<OrderRecord> {
  const store = getAnalysisStore();
  const record = await store.get(token);
  if (!record || record.status !== "ready") throw new PaymentError(404, "결제할 리포트를 찾지 못했습니다.");
  if (record.paidAt !== null) throw new PaymentError(409, "이미 결제가 완료된 리포트입니다.");

  const now = Date.now();
  const order: OrderRecord = {
    orderId: `palja_${randomBytes(16).toString("base64url")}`,
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
  const order = await getAnalysisStore().getOrder(input.orderId);
  if (!order) throw new PaymentError(404, "주문 정보를 찾지 못했습니다.");
  if (input.amount !== order.amount) {
    throw new PaymentError(400, "결제 금액이 주문 정보와 일치하지 않습니다.", `amount mismatch ${input.amount} != ${order.amount}`);
  }
  if (order.status === "paid") {
    if (order.paymentKey === input.paymentKey) return order.token;
    throw new PaymentError(409, "이미 처리된 주문입니다.");
  }

  const confirmed = await callToss("/confirm", {
    method: "POST",
    body: JSON.stringify({ paymentKey: input.paymentKey, orderId: order.orderId, amount: order.amount }),
    idempotencyKey: input.paymentKey,
  });

  let payment: TossPayment | null = confirmed.ok ? confirmed.body : null;
  if (!confirmed.ok && confirmed.body.code === "ALREADY_PROCESSED_PAYMENT") {
    const lookup = await callToss(`/${encodeURIComponent(input.paymentKey)}`, { method: "GET" });
    payment = lookup.ok ? lookup.body : null;
  }
  if (!payment) {
    const message = confirmed.body.message ?? "결제를 승인하지 못했습니다.";
    throw new PaymentError(400, message, `toss ${confirmed.body.code ?? "unknown"}`);
  }
  if (!matchesOrder(payment, order)) {
    console.error(`[payment] verification mismatch for ${order.orderId}: status=${payment.status}`);
    throw new PaymentError(400, "결제 정보를 확인하지 못했습니다. 고객센터로 문의해주세요.", "verification mismatch");
  }

  await completeOrder(order, input.paymentKey, payment);
  return order.token;
}
