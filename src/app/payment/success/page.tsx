import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";

export const metadata: Metadata = {
  title: "결제 확인",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <PageShell showFooter={false}>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20 text-center">
        <LogoMark size={64} className="animate-breathe" />
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-2xl font-light">결제를 확인하고 있습니다</h1>
          <p className="text-sm leading-relaxed text-mist">
            결제가 확인되면 당신의 책을 쓰기 시작합니다.
            <br />
            잠시만 기다려주세요.
          </p>
        </div>
        <p className="text-[11px] text-mist-dim">
          서버 결제 승인·검증은 PHASE 10~11에서 연결됩니다. 지금은 화면 확인용입니다.
        </p>
        <div className="w-full max-w-xs">
          <ButtonLink href="/report/sample">샘플 리포트 보기</ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
