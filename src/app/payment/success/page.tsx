import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PaymentConfirm } from "@/components/payment/PaymentConfirm";
import { ButtonLink } from "@/components/ui/Button";
import { ORDER_ID_PATTERN, PAYMENT_KEY_PATTERN } from "@/lib/server/payments";

export const metadata: Metadata = {
  title: "결제 확인",
  robots: { index: false, follow: false },
};

export default async function PaymentSuccessPage({ searchParams }: PageProps<"/payment/success">) {
  const { paymentKey, orderId, amount } = await searchParams;
  const parsedAmount = typeof amount === "string" && /^\d+$/.test(amount) ? Number(amount) : NaN;
  const valid =
    typeof paymentKey === "string" &&
    PAYMENT_KEY_PATTERN.test(paymentKey) &&
    typeof orderId === "string" &&
    ORDER_ID_PATTERN.test(orderId) &&
    Number.isSafeInteger(parsedAmount);

  return (
    <PageShell showFooter={false}>
      {valid ? (
        <PaymentConfirm paymentKey={paymentKey} orderId={orderId} amount={parsedAmount} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20 text-center">
          <h1 className="font-serif text-2xl font-light">결제 정보를 확인할 수 없습니다</h1>
          <div className="w-full max-w-xs">
            <ButtonLink href="/" variant="ghost">
              처음으로
            </ButtonLink>
          </div>
        </div>
      )}
    </PageShell>
  );
}
