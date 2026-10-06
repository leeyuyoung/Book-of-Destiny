import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { DohwaScoreCard } from "@/components/result/DohwaScoreCard";
import { ManseryeokTable } from "@/components/result/ManseryeokTable";
import {
  BlurredText,
  CharmStars,
  FinalCheckoutPrompt,
  LockedChapter,
  LoveTimelineTable,
  MidCheckoutPrompt,
  SectionTitle,
  StickyCheckoutBar,
} from "@/components/result/ResultParts";
import { ReviewCarousel } from "@/components/result/ReviewCarousel";
import { TypeHero } from "@/components/result/TypeHero";
import { Reveal } from "@/components/ui/Reveal";
import { chapterOf } from "@/lib/constants/result";
import { DETAILED_REPORT_PRICE, formatPrice } from "@/lib/constants/service";
import { TOKEN_PATTERN } from "@/lib/server/analysis";
import { sampleFreeResult, toFreeResultView } from "@/lib/server/resultView";
import { getAnalysisStore } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "나의 도화 지수",
  robots: { index: false, follow: false },
};

async function loadResult(token: string) {
  if (token === "sample") return { result: sampleFreeResult(), paid: false };
  if (!TOKEN_PATTERN.test(token)) return null;
  const record = await getAnalysisStore().get(token);
  if (!record) return null;
  return { result: toFreeResultView(record), paid: record.paidAt !== null };
}

const starTypes = chapterOf("starTypes");
const timeline = chapterOf("timeline");

export default async function ResultPage({ params }: PageProps<"/result/[token]">) {
  const { token } = await params;
  const loaded = await loadResult(token);
  if (!loaded) notFound();
  const { result, paid } = loaded;

  const checkoutHref = token === "sample" ? "/start" : `/checkout/${token}`;
  const sticky = paid
    ? { href: `/report/${token}`, label: "펼친 꽃 다시 보러 가기" }
    : token === "sample"
      ? { href: "/start", label: "내 꽃도 보러 가기" }
      : { href: checkoutHref, label: `숨겨진 도화력 확인하기 · ${formatPrice(DETAILED_REPORT_PRICE)}` };

  return (
    <PageShell>
      <TypeHero name={result.name} type={result.dohwa.type} eyebrow="제1장 · 네 꽃의 이름"
        hook="근데 이게 전부가 아니란다. 넌 아직 가진 걸 반도 안 꺼냈어. 그걸 깨우는 법, 내가 알려 주마."
      />

      <div className="mt-12 flex flex-col gap-14 pb-28">
        <Reveal>
          <section className="flex flex-col gap-5">
            <SectionTitle
              eyebrow="도화 지수"
              title={
                <>
                  너, 생각보다 훨씬
                  <br />
                  <span className="text-blossom-glow">색기 있는 아이란다</span>
                </>
              }
            />
            <DohwaScoreCard dohwa={result.dohwa} />
          </section>
        </Reveal>

        <Reveal>
          <section className="flex flex-col gap-5">
            <SectionTitle eyebrow="만세력" title="네 여덟 글자" description="네가 사람을 홀리는 건 우연이 아니란다. 태어난 순간, 하늘이 여기 새겨 뒀지." />
            <ManseryeokTable
              name={result.name}
              dayPillarName={result.dayPillarName}
              birthLabel={result.birthLabel}
              pillars={result.pillars}
            />
          </section>
        </Reveal>

        <LockedChapter chapter={chapterOf("firstImpression")} />
        <LockedChapter chapter={chapterOf("looks")} />

        <Reveal>
          <section className="flex flex-col gap-5">
            <SectionTitle
              eyebrow={`제${starTypes.chapter}장`}
              title={starTypes.title}
              description="도화살, 홍염살, 화개살. 몇 개를 쥐고 태어났는지, 어디에 숨겨 뒀는지, 언제 깨어나는지가 네 색기의 결을 정한단다."
            />
            <CharmStars />
            <BlurredText />
          </section>
        </Reveal>

        <LockedChapter chapter={chapterOf("flirt")} />

        {!paid && <MidCheckoutPrompt checkoutHref={checkoutHref} />}

        <ReviewCarousel />

        <LockedChapter chapter={chapterOf("language")} />
        <LockedChapter chapter={chapterOf("styling")} />
        <LockedChapter chapter={chapterOf("admirers")} />
        <LockedChapter chapter={chapterOf("inLove")} />
        <LockedChapter chapter={chapterOf("match")} />

        <section className="flex flex-col gap-4">
          <SectionTitle eyebrow={`제${timeline.chapter}장`} title={timeline.title} description={timeline.teaser} />
          <LoveTimelineTable years={result.timelineYears} />
        </section>

        {!paid && <FinalCheckoutPrompt checkoutHref={checkoutHref} />}
      </div>

      <StickyCheckoutBar href={sticky.href} label={sticky.label} />
    </PageShell>
  );
}
