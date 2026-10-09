import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CheckoutWidget } from "@/components/payment/CheckoutWidget";
import { Ornament } from "@/components/ui/SectionHeading";
import { REPORT_CHAPTERS, REPORT_SECTION_COUNT } from "@/lib/constants/result";
import { DETAILED_REPORT_PRICE, formatPrice } from "@/lib/constants/service";
import { TOKEN_PATTERN } from "@/lib/server/analysis";
import { ORDER_NAME } from "@/lib/server/payments";
import { getAnalysisStore } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "상세 리포트 결제",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({ params }: PageProps<"/checkout/[token]">) {
  const { token } = await params;
  const record = TOKEN_PATTERN.test(token) ? await getAnalysisStore().get(token) : null;
  if (!record) notFound();
  if (record.paidAt !== null) redirect(`/report/${token}`);

  const clientKey = process.env.TOSS_CLIENT_KEY;
  if (!clientKey) throw new Error("TOSS_CLIENT_KEY가 설정되지 않았습니다.");

  return (
    <PageShell>
      <section className="flex flex-col items-center gap-4 pb-8 pt-14 text-center">
        <span className="text-xs text-cinnabar">끝까지 펼친 꽃</span>
        <h1 className="font-eerie text-[26px] leading-snug">
          <span className="text-blossom-glow">{record.name}</span>의 연애·매력 리포트
        </h1>
        <Ornament className="mt-2" />
      </section>

      <div className="glass-card flex flex-col gap-4 rounded-3xl px-6 py-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-serif text-[15px]">{ORDER_NAME}</span>
          <span className="font-serif text-lg text-gold-soft">{formatPrice(DETAILED_REPORT_PRICE)}</span>
        </div>
        <p className="text-xs leading-relaxed text-mist">
          전 {REPORT_CHAPTERS.length}장 {REPORT_SECTION_COUNT}개 소제목 · {REPORT_CHAPTERS.map((chapter) => chapter.title).join(", ")}
        </p>
        <p className="rounded-xl border border-line/70 bg-ink/40 px-4 py-3 text-[11px] leading-relaxed text-mist-dim">
          결제가 확인되면 네 사주로만 리포트를 새로 쓰기 시작하며, 보통 1~2분 안에 완성되어 이 화면과 이메일로 열람할 수
          있습니다. 디지털 콘텐츠 특성상 리포트 작성이 시작된 뒤에는 청약철회(환불)가 제한됩니다.
        </p>
      </div>

      <div className="mt-6">
        <CheckoutWidget clientKey={clientKey} token={token} amount={DETAILED_REPORT_PRICE} />
      </div>

      <p className="mt-6 text-center">
        <Link href={`/result/${token}`} className="text-xs text-mist-dim underline-offset-4 hover:text-mist hover:underline">
          내 도화 지수로 돌아가기
        </Link>
      </p>
    </PageShell>
  );
}
