"use client";

import { ANONYMOUS, loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/constants/service";

type CheckoutWidgetProps = {
  clientKey: string;
  token: string;
  amount: number;
};

type OrderResponse = { orderId?: string; amount?: number; orderName?: string; message?: string };

const PAYMENT_METHOD_SELECTOR = "#toss-payment-method";
const AGREEMENT_SELECTOR = "#toss-payment-agreement";
/** 구매자가 결제창을 닫았을 때 SDK가 던지는 오류 코드 */
const USER_CANCEL_CODES = new Set(["USER_CANCEL", "PAY_PROCESS_CANCELED"]);

export function CheckoutWidget({ clientKey, token, amount }: CheckoutWidgetProps) {
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const startedRef = useRef(false);
  const activeRef = useRef(true);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    activeRef.current = true;
    if (!startedRef.current) {
      startedRef.current = true;
      (async () => {
        try {
          const tossPayments = await loadTossPayments(clientKey);
          const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
          await widgets.setAmount({ currency: "KRW", value: amount });
          await Promise.all([
            widgets.renderPaymentMethods({ selector: PAYMENT_METHOD_SELECTOR, variantKey: "DEFAULT" }),
            widgets.renderAgreement({ selector: AGREEMENT_SELECTOR, variantKey: "AGREEMENT" }),
          ]);
          widgetsRef.current = widgets;
          if (activeRef.current) setReady(true);
        } catch {
          if (activeRef.current) setError("결제 화면을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.");
        }
      })();
    }
    return () => {
      activeRef.current = false;
    };
  }, [clientKey, amount]);

  const pay = async () => {
    const widgets = widgetsRef.current;
    if (!widgets || paying) return;
    setPaying(true);
    setError(null);
    try {
      const response = await fetch("/api/payments/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const order = (await response.json().catch(() => ({}))) as OrderResponse;
      if (!response.ok || !order.orderId || !order.orderName || order.amount !== amount) {
        setError(order.message ?? "주문을 만들지 못했습니다. 잠시 후 다시 시도해주세요.");
        setPaying(false);
        return;
      }
      await widgets.requestPayment({
        orderId: order.orderId,
        orderName: order.orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail?token=${encodeURIComponent(token)}`,
      });
    } catch (caught) {
      const code = (caught as { code?: string } | null)?.code;
      if (!code || !USER_CANCEL_CODES.has(code)) setError("결제를 시작하지 못했습니다. 다시 시도해주세요.");
      setPaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-2xl bg-white">
        <div id="toss-payment-method" />
        <div id="toss-payment-agreement" />
      </div>
      {error && (
        <p role="alert" className="text-center text-sm text-gold-soft">
          {error}
        </p>
      )}
      <Button onClick={pay} disabled={!ready || paying}>
        {paying ? "결제창을 여는 중…" : `${formatPrice(amount)} 결제하기`}
      </Button>
    </div>
  );
}
