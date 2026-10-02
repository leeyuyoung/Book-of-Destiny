"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";

type PaymentConfirmProps = { paymentKey: string; orderId: string; amount: number };

export function PaymentConfirm({ paymentKey, orderId, amount }: PaymentConfirmProps) {
  const router = useRouter();
  const startedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });
        const data = (await response.json().catch(() => ({}))) as { token?: string; message?: string };
        if (response.ok && data.token) {
          router.replace(`/report/${data.token}`);
          return;
        }
        setError(data.message ?? "결제를 확인하지 못했습니다.");
      } catch {
        setError("네트워크 연결을 확인한 뒤 이 페이지를 새로고침해주세요.");
      }
    })();
  }, [paymentKey, orderId, amount, router]);

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-2xl font-light">결제가 완료되지 않았습니다</h1>
          <p role="alert" className="text-sm leading-relaxed text-mist">
            {error}
          </p>
          <p className="text-xs text-mist-dim">승인되지 않은 결제는 청구되지 않습니다.</p>
        </div>
        <div className="w-full max-w-xs">
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
