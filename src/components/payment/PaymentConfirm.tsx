"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";

type PaymentConfirmProps = { paymentKey: string; orderId: string; amount: number };
type ConfirmError = { message: string; retryable: boolean };

export function PaymentConfirm({ paymentKey, orderId, amount }: PaymentConfirmProps) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const lastAttemptRef = useRef(-1);
  const [error, setError] = useState<ConfirmError | null>(null);

  useEffect(() => {
    if (lastAttemptRef.current === attempt) return;
    lastAttemptRef.current = attempt;
    (async () => {
      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });
        const data = (await response.json().catch(() => ({}))) as {
          token?: string;
          message?: string;
          retryable?: boolean;
        };
        if (response.ok && data.token) {
          router.replace(`/report/${data.token}`);
          return;
        }
        setError({
          message: data.message ?? "결제를 확인하지 못했습니다.",
          retryable: data.retryable ?? response.status >= 500,
        });
      } catch {
        setError({ message: "네트워크 연결을 확인한 뒤 다시 확인해주세요.", retryable: true });
      }
    })();
  }, [attempt, paymentKey, orderId, amount, router]);

  const retry = () => {
    setError(null);
    setAttempt((value) => value + 1);
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-2xl font-light">
            {error.retryable ? "결제 확인이 지연되고 있습니다" : "결제가 완료되지 않았습니다"}
          </h1>
          <p role="alert" className="text-sm leading-relaxed text-mist">
            {error.message}
          </p>
          <p className="text-xs text-mist-dim">
            {error.retryable
              ? "다시 확인해도 중복으로 결제되지 않습니다."
              : "승인되지 않은 결제는 청구되지 않습니다."}
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          {error.retryable && <Button onClick={retry}>다시 확인하기</Button>}
          <ButtonLink href="/" variant="ghost">
            처음으로
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20 text-center">
      <LogoMark size={64} className="animate-breathe" />
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-2xl font-light">결제를 확인하고 있습니다</h1>
        <p className="text-sm leading-relaxed text-mist">
          확인이 끝나면 당신의 책이 펼쳐집니다.
          <br />
          이 화면을 닫지 말고 잠시만 기다려주세요.
        </p>
      </div>
    </div>
  );
}
