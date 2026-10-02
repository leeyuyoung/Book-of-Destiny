import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Ornament, SectionHeading } from "@/components/ui/SectionHeading";
import { DETAILED_REPORT_PRICE, REPORT_PARTS, SERVICE, formatPrice } from "@/lib/constants/service";

export const metadata: Metadata = {
  title: "서비스 소개",
};

const WRITING_PROCESS = [
  {
    hanja: "時",
    title: "태어난 순간을 기록합니다",
    body: "생년월일과 태어난 시간, 양력·음력 여부를 받아 당신이 세상에 온 순간의 하늘을 펼칩니다.",
  },
  {
    hanja: "柱",
    title: "여덟 글자를 세웁니다",
    body: "한국천문연구원 기준의 만세력으로 년·월·일·시, 네 기둥의 여덟 글자를 정확하게 계산합니다. 이 과정은 AI가 추측하지 않습니다.",
  },
  {
    hanja: "理",
    title: "구조를 읽습니다",
    body: "오행의 균형, 일간과 십신의 관계, 지장간, 10년 단위의 대운까지 명리학의 해석 틀로 구조화합니다.",
  },
  {
    hanja: "書",
    title: "당신의 이야기로 엮습니다",
    body: "계산된 구조와 지금의 삶, 당신이 적어준 고민을 연결해 한 사람만을 위한 인생 리포트를 씁니다.",
  },
] as const;

const PRINCIPLES = [
  {
    title: "계산은 정확하게",
    body: "사주 계산은 검증된 만세력 라이브러리가, 해석은 AI가 맡습니다. 두 개의 계산 엔진으로 교차 확인합니다.",
  },
  {
    title: "단정하지 않는 해석",
    body: "‘반드시 일어난다’고 말하지 않습니다. 어떤 구조가 어떤 경향으로 해석되는지, 근거와 함께 설명합니다.",
  },
  {
    title: "선택은 당신의 몫",
    body: "고민에 대한 정답을 정해주지 않습니다. 각 선택지의 흐름과 장단점을 펼쳐 보여드립니다.",
  },
  {
    title: "조용히 보관되는 이야기",
    body: "입력하신 정보는 리포트 작성에만 쓰이며, 필요 이상으로 보관하지 않습니다.",
  },
] as const;

export default function AboutPage() {
  return (
    <PageShell intensity="full">
      <section className="flex min-h-[78dvh] flex-col items-center justify-center gap-8 py-16 text-center">
        <Reveal>
          <span className="font-display text-xs uppercase tracking-[0.45em] text-gold/80">
            {SERVICE.englishName}
          </span>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="font-serif text-[30px] font-light leading-[1.6] sm:text-4xl">
            오늘의 운세가 아닌,
            <br />
            <span className="text-gold-gradient">당신이라는 한 권의 책</span>
          </h1>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="max-w-sm text-[15px] leading-[1.9] text-mist">
            팔자서재는 태어난 순간의 여덟 글자와 지금 당신이 서 있는 자리, 마음속의 고민을 함께 읽어 오직
            한 사람을 위한 인생의 기록을 씁니다.
          </p>
        </Reveal>
        <Reveal delay={0.6}>
          <Ornament className="mt-6" />
        </Reveal>
      </section>

      <section className="py-16">
        <Reveal>
          <SectionHeading eyebrow="How it is written" title="한 권의 책이 쓰이는 과정" />
        </Reveal>
        <ol className="mt-12 flex flex-col gap-4">
          {WRITING_PROCESS.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1}>
              <li className="glass-card flex gap-5 rounded-2xl p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 font-serif text-xl text-gold-soft">
                  {item.hanja}
                </span>
                <div className="flex flex-col gap-2">
                  <span className="font-display text-[11px] tracking-[0.3em] text-gold/70">
                    0{index + 1}
                  </span>
                  <h3 className="font-serif text-lg text-paper">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-mist">{item.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Table of contents"
            title="당신의 책에 담길 이야기"
            description="상세 리포트는 열한 개의 장으로 구성됩니다."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass-card mt-12 rounded-2xl px-6 py-4">
            <ul className="divide-y divide-line">
              {REPORT_PARTS.map((part) => (
                <li key={part.part} className="flex items-baseline gap-4 py-4">
                  <span className="w-14 shrink-0 font-display text-xs tracking-[0.2em] text-gold/70">
                    PART {part.part}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-[15px] text-paper">{part.title}</span>
                    <span className="text-xs leading-relaxed text-mist-dim">{part.summary}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="py-16">
        <Reveal>
          <SectionHeading eyebrow="Our principles" title="팔자서재가 지키는 것" />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.1}>
              <div className="h-full rounded-2xl border border-line p-6">
                <h3 className="font-serif text-base text-gold-soft">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16">
        <Reveal>
          <SectionHeading eyebrow="Free & detailed" title="먼저 첫 장을 무료로 읽어보세요" />
        </Reveal>
        <div className="mt-12 flex flex-col gap-4">
          <Reveal>
            <div className="rounded-2xl border border-line p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-lg">기본 풀이</h3>
                <span className="font-serif text-gold-soft">무료</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                사주 한 줄 요약, 기본 성격, 재물·애정·직업운 요약, 당신을 설명하는 핵심 키워드
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass-card relative overflow-hidden rounded-2xl border-gold/40 p-6">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
              <div className="relative flex items-baseline justify-between">
                <h3 className="font-serif text-lg">상세 인생 리포트</h3>
                <span className="font-serif text-gold-soft">{formatPrice(DETAILED_REPORT_PRICE)}</span>
              </div>
              <p className="relative mt-3 text-sm leading-relaxed text-mist">
                열한 개의 장으로 구성된 장문의 개인 맞춤 리포트. 대운별 흐름과 지금의 고민에 대한 분석까지
                담아 이메일로도 보내드립니다.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 py-16 text-center">
        <Reveal>
          <p className="font-serif text-xl font-light leading-relaxed">
            이제, 당신의 이야기를
            <br />
            들려주세요.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="w-full">
          <ButtonLink href="/start">나의 책 쓰기 시작</ButtonLink>
        </Reveal>
        <p className="text-xs text-mist-dim">입력에는 약 3분이 걸립니다.</p>
      </section>
    </PageShell>
  );
}
