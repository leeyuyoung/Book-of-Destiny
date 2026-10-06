import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { FiveElementsCard } from "@/components/result/FiveElementsCard";
import { DohwaRadarCard } from "@/components/result/FreeResultParts";
import { ManseryeokTable } from "@/components/result/ManseryeokTable";
import { ReportWaiting } from "@/components/result/ReportWaiting";
import { CharmStars, LoveTimeline, SectionTitle } from "@/components/result/ResultParts";
import { TypeHero } from "@/components/result/TypeHero";
import { Reveal } from "@/components/ui/Reveal";
import { TOKEN_PATTERN } from "@/lib/server/analysis";
import { toFullReportView } from "@/lib/server/resultView";
import { getAnalysisStore } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "나의 연애·매력 리포트",
  robots: { index: false, follow: false },
};

export default async function ReportPage({ params }: PageProps<"/report/[token]">) {
  const { token } = await params;
  const record = TOKEN_PATTERN.test(token) ? await getAnalysisStore().get(token) : null;
  if (!record) notFound();
  // 결제가 확인되지 않았으면 본문을 보내지 않고 무료 화면으로 돌려보낸다.
  if (record.paidAt === null) redirect(`/result/${token}`);

  const report = toFullReportView(record);
  if (!report) {
    return (
      <PageShell showFooter={false}>
        <ReportWaiting token={token} failed={record.status === "failed"} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <TypeHero name={report.name} type={report.dohwa.type} eyebrow={`${report.analyzedAt} · 활짝 펼친 꽃`} />

      <Reveal>
        <section className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="font-serif text-[19px] font-light leading-[1.8] text-paper">“{report.summary}”</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {report.keywords.map((keyword) => (
              <li key={keyword} className="rounded-full border border-cinnabar/40 px-3.5 py-1.5 text-xs text-blossom">
                #{keyword}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <div className="mt-14 flex flex-col gap-14">
        <Reveal>
          <DohwaRadarCard dohwa={report.dohwa} />
        </Reveal>

        <Reveal>
          <section className="flex flex-col gap-5">
            <SectionTitle
              eyebrow="타고난 글자"
              title="네가 태어난 순간의 하늘"
              description="태어난 해·달·날·시에 새겨진 기운이란다. 이게 네 매력의 뿌리야."
            />
            <ManseryeokTable
              name={report.name}
              dayPillarName={report.dayPillarName}
              birthLabel={report.birthLabel}
              pillars={report.pillars}
            />
          </section>
        </Reveal>

        <Reveal>
          <section className="flex flex-col gap-5">
            <SectionTitle
              eyebrow="다섯 기운"
              title="네 안에 흐르는 다섯 기운"
              description="나무·불·흙·쇠·물. 어떤 기운이 짙고 어떤 기운이 비었는지가 네 분위기를 만든단다."
            />
            <FiveElementsCard fiveElements={report.fiveElements} currentLuck={report.currentLuck} />
          </section>
        </Reveal>

        <Reveal>
          <section className="flex flex-col gap-5">
            <SectionTitle eyebrow="매력의 씨앗" title="네 사주에 숨은 매력의 씨앗" />
            <CharmStars stars={report.stars} />
          </section>
        </Reveal>

        <nav aria-label="목차" className="rounded-3xl border border-line bg-night/70 px-6 py-5">
          <p className="text-xs text-cinnabar">목차</p>
          <ol className="mt-3 flex flex-col">
            {report.chapters.map((chapter) => (
              <li key={chapter.chapter}>
                <a
                  href={`#chapter-${chapter.chapter}`}
                  className="flex items-baseline gap-3 border-b border-line/50 py-3 last:border-0 hover:text-blossom"
                >
                  <span className="w-10 shrink-0 text-xs text-cinnabar/80">제{chapter.chapter}장</span>
                  <span className="font-serif text-[15px]">{chapter.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {report.chapters.map((chapter) => {
          const isTimeline = chapter.key === "timeline";
          const paragraphs = isTimeline ? chapter.paragraphs.slice(0, 1) : chapter.paragraphs;
          return (
            <article key={chapter.chapter} id={`chapter-${chapter.chapter}`} className="flex scroll-mt-20 flex-col gap-6">
              <Reveal>
                <SectionTitle eyebrow={`제${chapter.chapter}장`} title={chapter.title} description={chapter.teaser} />
              </Reveal>
              <Reveal>
                <div className="flex flex-col gap-5 font-serif text-[16px] font-light leading-[2] text-paper/90">
                  <blockquote className="border-l-2 border-cinnabar/60 pl-4 text-[17px] text-blossom">{chapter.headline}</blockquote>
                  {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
              {isTimeline && (
                <Reveal>
                  <LoveTimeline timeline={report.loveTimeline} />
                </Reveal>
              )}
            </article>
          );
        })}
      </div>

      <section className="mt-20 flex flex-col items-center gap-4 text-center">
        <p className="font-serif text-lg font-light leading-relaxed text-mist">
          네 꽃은 이제 막 피었을 뿐.
          <br />
          <span className="text-blossom-glow">어떻게 흐드러질지는 네 몫이란다.</span>
        </p>
        <p className="mt-6 max-w-sm text-[11px] leading-relaxed text-mist-dim">
          이 리포트는 사주 명리학의 전통적 해석 체계를 바탕으로 한 오락·참고용 콘텐츠이며, 의료·법률·투자 등 전문적인 판단을
          대신하지 않습니다.
        </p>
      </section>
    </PageShell>
  );
}
