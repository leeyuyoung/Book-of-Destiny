import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ChapterCard } from "@/components/result/ChapterCard";
import { FiveElementBalance } from "@/components/result/FiveElementBalance";
import { LockedReportPreview } from "@/components/result/LockedReportPreview";
import { PillarChart } from "@/components/result/PillarChart";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Ornament } from "@/components/ui/SectionHeading";
import { TOKEN_PATTERN } from "@/lib/server/analysis";
import { SAMPLE_FREE_RESULT, toFreeResultView } from "@/lib/server/resultView";
import { getAnalysisStore } from "@/lib/server/store";
import type { FreeResultView } from "@/types/result";

export const metadata: Metadata = {
  title: "나의 첫 장",
  robots: { index: false, follow: false },
};

async function loadResult(token: string): Promise<FreeResultView | "generating" | "failed" | null> {
  if (token === "sample") return SAMPLE_FREE_RESULT;
  if (!TOKEN_PATTERN.test(token)) return null;
  const record = await getAnalysisStore().get(token);
  if (!record) return null;
  if (record.status === "generating" || record.status === "failed") return record.status;
  return toFreeResultView(record);
}

export default async function ResultPage({ params }: PageProps<"/result/[token]">) {
  const { token } = await params;
  const result = await loadResult(token);
  if (!result) notFound();
  if (result === "generating" || result === "failed") return <PendingNotice status={result} />;

  return (
    <PageShell>
      <section className="flex flex-col items-center gap-6 pb-12 pt-16 text-center">
        <Reveal>
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/80">Chapter 0 · Prologue</span>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="font-serif text-sm text-mist">{result.name} 님의 사주 한 줄</p>
        </Reveal>
        <Reveal delay={0.3}>
          <h1 className="font-serif text-[26px] font-light leading-[1.7] break-keep">
            <span className="text-gold-gradient">“{result.summary}”</span>
          </h1>
        </Reveal>
        <Reveal delay={0.45}>
          <ul className="flex flex-wrap justify-center gap-2">
            {result.keywords.map((keyword) => (
              <li key={keyword} className="rounded-full border border-gold/30 px-4 py-1.5 text-xs text-gold-soft">
                #{keyword}
              </li>
            ))}
          </ul>
        </Reveal>
        <Ornament className="mt-6" />
      </section>

      <div className="flex flex-col gap-6">
        <ChapterCard eyebrow="The eight characters" title="나의 사주 핵심">
          <PillarChart pillars={result.pillars} />
          <div className="mt-2 rounded-2xl border border-line bg-night/50 p-5">
            <p className="text-xs tracking-widest text-gold/70">일간 · 나를 상징하는 글자</p>
            <p className="mt-2 font-serif text-lg">
              {result.dayMaster.hanja} <span className="text-mist">{result.dayMaster.korean}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mist">{result.dayMaster.description}</p>
          </div>
          <div className="mt-2">
            <p className="mb-4 text-xs tracking-widest text-gold/70">오행의 균형</p>
            <FiveElementBalance counts={result.fiveElements} />
          </div>
        </ChapterCard>

        <div className="mt-6">
          <LockedReportPreview checkoutHref={token === "sample" ? undefined : `/checkout/${token}`} />
        </div>
      </div>
    </PageShell>
  );
}

function PendingNotice({ status }: { status: "generating" | "failed" }) {
  return (
    <PageShell>
      <section className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
        <p className="font-serif text-lg font-light leading-relaxed">
          {status === "generating" ? (
            <>
              아직 당신의 첫 장을
              <br />
              <span className="text-gold-gradient">쓰고 있습니다.</span>
            </>
          ) : (
            <>
              리포트를 완성하지 못했습니다.
              <br />
              <span className="text-mist">잠시 후 다시 시도해주세요.</span>
            </>
          )}
        </p>
        {status === "generating" ? (
          <p className="text-sm text-mist">잠시 후 이 페이지를 새로고침해주세요.</p>
        ) : (
          <ButtonLink href="/start">다시 입력하기</ButtonLink>
        )}
      </section>
    </PageShell>
  );
}
