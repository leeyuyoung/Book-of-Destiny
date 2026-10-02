import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { Ornament } from "@/components/ui/SectionHeading";
import { REPORT_PARTS, SERVICE } from "@/lib/constants/service";
import { SAMPLE_BASIC_RESULT } from "@/lib/mock/sampleResult";

export const metadata: Metadata = {
  title: "나의 인생 리포트",
  robots: { index: false, follow: false },
};

export default async function ReportPage({ params }: PageProps<"/report/[token]">) {
  const { token } = await params;
  if (token !== "sample") notFound();

  const { name, analyzedAt } = SAMPLE_BASIC_RESULT;

  return (
    <PageShell>
      <section className="flex min-h-[70dvh] flex-col items-center justify-center gap-6 py-16 text-center">
        <Reveal>
          <span className="font-display text-xs uppercase tracking-[0.45em] text-gold/80">{SERVICE.englishTagline}</span>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="font-serif text-[32px] font-light leading-[1.5]">
            <span className="text-gold-gradient">{name}</span> 님의
            <br />
            인생 리포트
          </h1>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="text-sm text-mist">{analyzedAt} 작성 · 전 11장</p>
        </Reveal>
        <Ornament className="mt-4" />
      </section>

      <Reveal>
        <nav aria-label="목차" className="glass-card rounded-3xl px-6 py-6">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-gold/70">Contents</p>
          <ol className="mt-4 flex flex-col">
            {REPORT_PARTS.map((part) => (
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
        {REPORT_PARTS.map((part) => (
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
              <div className="mt-10 flex flex-col gap-6 font-serif text-[16px] font-light leading-[2] text-paper/85">
                <p>
                  이 장의 본문은 PHASE 9에서 AI가 작성한 상세 리포트로 채워집니다. 실제 리포트에서는 사주 구조에 근거한
                  설명, 행동 패턴, 상황별 예시, 시기별 변화, 현실적인 대처법이 여러 문단에 걸쳐 이어집니다.
                </p>
                <blockquote className="border-l border-gold/40 pl-5 text-[15px] text-gold-soft/90">
                  각 장의 핵심 문장은 이렇게 인용 형태로 강조되어 읽는 흐름에 쉼표를 만듭니다.
                </blockquote>
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
      </section>
    </PageShell>
  );
}
