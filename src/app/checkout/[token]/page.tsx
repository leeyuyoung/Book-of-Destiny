import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CheckoutWidget } from "@/components/payment/CheckoutWidget";
import { Ornament } from "@/components/ui/SectionHeading";
import { DETAILED_REPORT_PRICE, REPORT_PARTS, formatPrice } from "@/lib/constants/service";
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
  if (!record || record.status !== "ready") notFound();
  if (record.paidAt !== null) redirect(`/report/${token}`);

  const clientKey = process.env.TOSS_CLIENT_KEY;
  if (!clientKey) throw new Error("TOSS_CLIENT_KEY가 설정되지 않았습니다.");

  return (
    <PageShell>
      <section className="flex flex-col items-center gap-4 pb-8 pt-14 text-center">
        <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/80">The full book</span>
        <h1 className="font-serif text-2xl font-light leading-snug">
          <span className="text-gold-gradient">{record.name}</span> 님의 인생 리포트
        </h1>
        <Ornament className="mt-2" />
      </section>

      <div className="glass-card flex flex-col gap-4 rounded-3xl px-6 py-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-serif text-[15px]">{ORDER_NAME}</span>
          <span className="font-serif text-lg text-gold-soft">{formatPrice(DETAILED_REPORT_PRICE)}</span>
        </div>
        <p className="text-xs leading-relaxed text-mist">
          전 {REPORT_PARTS.length}장 · 성격, 재물, 직업, 연애, 대운과 시기별 흐름, 지금의 고민에 대한 맞춤 분석
        </p>
        <p className="rounded-xl border border-line/70 bg-ink/40 px-4 py-3 text-[11px] leading-relaxed text-mist-dim">
          리포트는 이미 완성되어 있으며 결제 즉시 열람할 수 있습니다. 디지털 콘텐츠 특성상 결제 후 리포트를 열람하면
          청약철회(환불)가 제한됩니다.
        </p>
      </div>

      <div className="mt-6">
        <CheckoutWidget clientKey={clientKey} token={token} amount={DETAILED_REPORT_PRICE} />
      </div>

      <p className="mt-6 text-center">
        <Link href={`/result/${token}`} className="text-xs text-mist-dim underline-offset-4 hover:text-mist hover:underline">
          무료 결과로 돌아가기
        </Link>
      </p>
    </PageShell>
  );
}
