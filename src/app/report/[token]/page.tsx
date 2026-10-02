import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ChapterCard } from "@/components/result/ChapterCard";
import { FiveElementBalance } from "@/components/result/FiveElementBalance";
import { PillarChart } from "@/components/result/PillarChart";
import { Reveal } from "@/components/ui/Reveal";
import { Ornament } from "@/components/ui/SectionHeading";
import { SERVICE } from "@/lib/constants/service";
import { TOKEN_PATTERN } from "@/lib/server/analysis";
import { SAMPLE_FULL_REPORT, toFullReportView } from "@/lib/server/resultView";
import { getAnalysisStore } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "나의 인생 리포트",
  robots: { index: false, follow: false },
};

export default async function ReportPage({ params }: PageProps<"/report/[token]">) {
  const { token } = await params;
  let report = token === "sample" ? SAMPLE_FULL_REPORT : null;

  if (!report) {
    const record = TOKEN_PATTERN.test(token) ? await getAnalysisStore().get(token) : null;
    if (!record) notFound();
    report = toFullReportView(record);
    // 결제가 확인되지 않았으면 본문을 보내지 않고 무료 화면으로 돌려보낸다.
    if (!report) redirect(`/result/${token}`);
  }

  return (
    <PageShell>
      <section className="flex min-h-[70dvh] flex-col items-center justify-center gap-6 py-16 text-center">
        <Reveal>
          <span className="font-display text-xs uppercase tracking-[0.45em] text-gold/80">{SERVICE.englishTagline}</span>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="font-serif text-[32px] font-light leading-[1.5]">
            <span className="text-gold-gradient">{report.name}</span> 님의
            <br />
            인생 리포트
          </h1>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="max-w-sm font-serif text-[15px] font-light leading-[1.8] text-paper/80 break-keep">
            “{report.summary}”
          </p>
        </Reveal>
        <Reveal delay={0.55}>
          <p className="text-sm text-mist">{report.analyzedAt} 작성 · 전 {report.parts.length}장</p>
        </Reveal>
        <Ornament className="mt-4" />
      </section>

      <ChapterCard eyebrow="The eight characters" title="나의 사주 핵심">
        <PillarChart pillars={report.pillars} />
        <div className="mt-2 rounded-2xl border border-line bg-night/50 p-5">
          <p className="text-xs tracking-widest text-gold/70">일간 · 나를 상징하는 글자</p>
          <p className="mt-2 font-serif text-lg">
            {report.dayMaster.hanja} <span className="text-mist">{report.dayMaster.korean}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mist">{report.dayMaster.description}</p>
        </div>
        <div className="mt-2">
          <p className="mb-4 text-xs tracking-widest text-gold/70">오행의 균형</p>
          <FiveElementBalance counts={report.fiveElements} />
        </div>
      </ChapterCard>

      <Reveal>
        <nav aria-label="목차" className="glass-card mt-10 rounded-3xl px-6 py-6">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-gold/70">Contents</p>
          <ol className="mt-4 flex flex-col">
            {report.parts.map((part) => (
              <li key={part.part}>
                <a
                  href={`#part-${part.part}`}
                  className="flex items-baseline gap-4 border-b border-line/60 py-3 transition-colors last:border-0 hover:text-gold-soft"
                >
                  <span className="w-14 shrink-0 font-display text-xs tracking-[0.15em] text-gold/60">PART {part.part}</span>
                  <span className="font-serif text-[15px]">{part.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>

      <div className="mt-16 flex flex-col gap-24">
        {report.parts.map((part) => (
          <article key={part.part} id={`part-${part.part}`} className="scroll-mt-20">
            <Reveal>
              <header className="flex flex-col items-center gap-3 text-center">
                <span className="font-display text-xs tracking-[0.4em] text-gold/70">PART {part.part}</span>
                <h2 className="font-serif text-2xl font-light">{part.title}</h2>
                <p className="text-xs text-mist-dim">{part.summary}</p>
                <span className="hairline mt-4 w-24" />
              </header>
            </Reveal>
            <Reveal>
              <div className="mt-10 flex flex-col gap-6 font-serif text-[16px] font-light leading-[2] text-paper/85 break-keep">
                <blockquote className="border-l border-gold/40 pl-5 text-[15px] text-gold-soft/90">{part.headline}</blockquote>
                {part.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </article>
        ))}
      </div>

      <section className="mt-24 flex flex-col items-center gap-4 text-center">
        <Ornament />
        <p className="font-serif text-lg font-light leading-relaxed text-mist">
          이 책의 다음 장은
          <br />
          <span className="text-gold-gradient">당신이 써 내려갑니다.</span>
        </p>
        <p className="mt-6 max-w-sm text-[11px] leading-relaxed text-mist-dim">
          이 리포트는 사주 명리학의 전통적 해석 체계를 바탕으로 한 참고용 콘텐츠이며, 의료·법률·투자 등 전문적인 판단을
          대신하지 않습니다.
        </p>
      </section>
    </PageShell>
  );
}
