import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ChapterCard } from "@/components/result/ChapterCard";
import { FiveElementBalance } from "@/components/result/FiveElementBalance";
import { LockedReportPreview } from "@/components/result/LockedReportPreview";
import { PillarChart } from "@/components/result/PillarChart";
import { Reveal } from "@/components/ui/Reveal";
import { Ornament } from "@/components/ui/SectionHeading";
import { SAMPLE_BASIC_RESULT } from "@/lib/mock/sampleResult";

export const metadata: Metadata = {
  title: "나의 첫 장",
  robots: { index: false, follow: false },
};

export default async function ResultPage({ params }: PageProps<"/result/[token]">) {
  const { token } = await params;
  if (token !== "sample") notFound();

  const result = SAMPLE_BASIC_RESULT;

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
          <h1 className="font-serif text-[26px] font-light leading-[1.7]">
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

        <ChapterCard eyebrow="Chapter 1" title="나라는 사람">
          <p>{result.personality.overview}</p>
          <dl className="flex flex-col gap-5">
            {result.personality.traits.map((trait) => (
              <div key={trait.label}>
                <dt className="font-serif text-sm text-gold-soft">{trait.label}</dt>
                <dd className="mt-1.5 text-[14px] leading-[1.85] text-paper/80">{trait.body}</dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-3 sm:grid-cols-2">
            <TagList title="나의 장점" items={result.personality.strengths} tone="gold" />
            <TagList title="주의할 점" items={result.personality.cautions} tone="mist" />
          </div>
        </ChapterCard>

        <ChapterCard eyebrow="Chapter 2" title="재물운 요약">
          <p>{result.money.overview}</p>
        </ChapterCard>

        <ChapterCard eyebrow="Chapter 3" title="애정운 요약">
          <p>{result.love.overview}</p>
        </ChapterCard>

        <ChapterCard eyebrow="Chapter 4" title="직업운 요약">
          <p>{result.career.overview}</p>
        </ChapterCard>

        <div className="mt-6">
          <LockedReportPreview />
        </div>
      </div>
    </PageShell>
  );
}

function TagList({ title, items, tone }: { title: string; items: string[]; tone: "gold" | "mist" }) {
  return (
    <div className="rounded-2xl border border-line p-4">
      <p className={`text-xs tracking-widest ${tone === "gold" ? "text-gold/80" : "text-mist"}`}>{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-paper/80">
            <span className={tone === "gold" ? "text-gold/70" : "text-mist-dim"}>·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
