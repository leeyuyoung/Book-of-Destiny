import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "결제 실패",
  robots: { index: false, follow: false },
};

const MAX_MESSAGE_LENGTH = 120;

export default async function PaymentFailPage({ searchParams }: PageProps<"/payment/fail">) {
  const { message } = await searchParams;
  const reason =
    typeof message === "string" && message.trim()
      ? message.slice(0, MAX_MESSAGE_LENGTH)
      : "결제가 완료되지 않았습니다.";

  return (
    <PageShell showFooter={false}>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-2xl font-light">결제가 이루어지지 않았습니다</h1>
          <p className="text-sm leading-relaxed text-mist">{reason}</p>
          <p className="text-xs text-mist-dim">비용은 청구되지 않았습니다. 다시 시도해주세요.</p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <ButtonLink href="/result/sample">결과 페이지로 돌아가기</ButtonLink>
          <ButtonLink href="/" variant="ghost">
            처음으로
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
