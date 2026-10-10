import Image from "next/image";
import type { ReactNode } from "react";
import { LockIcon } from "@/components/result/ResultParts";
import { Reveal } from "@/components/ui/Reveal";
import type { Bubble } from "@/components/webtoon/SpeechBubble";
import { WebtoonPanel } from "@/components/webtoon/WebtoonPanel";
import type { FreeResultView } from "@/types/result";

/** 카드 사이에 끼는 도화신선의 대사. 문단마다 차례로 떠오른다. */
export function SinseonLines({ lines }: { lines: ReactNode[] }) {
  return (
    <div className="flex flex-col items-center gap-5 py-14 text-center">
      {lines.map((line, index) => (
        <Reveal key={index} delay={index * 0.25}>
          <p className="font-serif text-[clamp(1.2rem,5.4vw,1.4rem)] leading-relaxed text-paper break-keep [text-shadow:0_0_20px_rgb(232_137_155_/_0.25)]">
            {line}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/** 말풍선을 단 도화신선 그림 한 칸과 그 아래에 이어지는 대사 */
export function SinseonScene({
  src,
  alt,
  bubbles,
  headroom = 0.2,
  cropBottom,
  lines,
}: {
  src: string;
  alt: string;
  bubbles: Bubble[];
  headroom?: number;
  cropBottom?: number;
  lines: ReactNode[];
}) {
  return (
    <div className="mt-14">
      <WebtoonPanel src={src} alt={alt} bubbles={bubbles} headroom={headroom} cropBottom={cropBottom} />
      <div className="relative -mt-10">
        <SinseonLines lines={lines} />
      </div>
    </div>
  );
}

/** 결과 화면의 카드 틀. 어두운 종이 위에 얇은 금테를 두른다. */
function TeaserCard({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <Reveal>
      <section className="overflow-hidden rounded-2xl border border-gold/35 bg-night/80 shadow-[0_0_40px_rgb(232_137_155_/_0.08)]">
        <h2 className="border-b border-gold/20 px-5 py-3.5 text-center font-serif text-[14px] tracking-[0.04em] text-gold-soft">{title}</h2>
        {children}
      </section>
    </Reveal>
  );
}

/**
 * oneLine이면 글자를 줄 폭에 맞춰 줄여 좁은 화면에서도 한 줄로 남긴다.
 * 13.8은 가장 긴 첫인상 문구의 폭을 글자 크기로 나눈 값이라, 문구가 더 길어지면 함께 키워야 한다.
 */
function Row({ label, oneLine = false, children }: { label: string; oneLine?: boolean; children: ReactNode }) {
  return (
    <div className={`flex items-center gap-4 border-t border-line/40 px-5 py-3.5 first:border-t-0 ${oneLine ? "[container-type:inline-size]" : ""}`}>
      <span className="w-[6.5rem] shrink-0 whitespace-nowrap rounded border border-gold/30 px-2 py-0.5 text-center text-[12px] text-gold-soft">{label}</span>
      {oneLine ? (
        <span className="flex-1 whitespace-nowrap font-serif text-paper" style={{ fontSize: "clamp(11px, calc((100cqw - 7.5rem) / 13.8), 16px)" }}>
          {children}
        </span>
      ) : (
        <span className="flex-1 font-serif text-[16px] text-paper break-keep">{children}</span>
      )}
    </div>
  );
}

/** 잠긴 칸. 값 대신 흐린 가짜 글자를 깔아 둔다. */
function LockedRow({ label, mask = "■■■■■■" }: { label: string; mask?: string }) {
  return (
    <div className="flex items-center gap-4 border-t border-line/40 px-5 py-3.5">
      <span className="w-[6.5rem] shrink-0 whitespace-nowrap rounded border border-line/60 px-2 py-0.5 text-center text-[12px] text-mist">{label}</span>
      <span aria-label="잠김" className="flex-1 select-none font-serif text-[16px] text-paper/70 blur-[6px]">
        {mask}
      </span>
      <LockIcon />
    </div>
  );
}

/** 얼굴을 가린 그림 가운데에 자물쇠를 띄운다. */
function LockedPicture({ src, alt, caption, lockY, ratio }: { src: string; alt: string; caption: string; lockY: string; ratio: string }) {
  return (
    <figure className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes="(max-width: 640px) 100vw, 576px" className="object-cover object-top" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night to-transparent" />
      <figcaption className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5" style={{ top: lockY }}>
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full border border-gold/50 bg-ink/70 text-gold-soft shadow-[0_0_20px_rgb(232_137_155_/_0.45)] backdrop-blur-sm"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
        <span className="whitespace-nowrap rounded-full bg-ink/70 px-3 py-1 text-[11px] text-paper/90 backdrop-blur-sm">{caption}</span>
      </figcaption>
    </figure>
  );
}

/** 도화 점수와 네 매력 지수를 막대로 보여준다. */
export function ScoreCard({ result }: { result: FreeResultView }) {
  const { dohwa } = result;
  return (
    <TeaserCard title={`${result.name}의 도화 점수`}>
      <div className="flex flex-col items-center gap-2 px-5 pb-5 pt-6">
        <p className="font-serif leading-none">
          <span className="text-blossom-glow text-[64px] font-light">{dohwa.score}</span>
          <span className="ml-1 text-xl text-mist">점</span>
        </p>
        <p className="font-serif text-[15px] text-paper">
          {dohwa.type.name} <span className="text-mist">· {dohwa.type.alias}</span>
        </p>
      </div>
      <ul className="flex flex-col gap-3 border-t border-line/40 px-5 py-5">
        {dohwa.indices.map((index) => (
          <li key={index.key} className="flex items-center gap-3">
            <span className="w-12 shrink-0 font-serif text-[14px] text-paper">{index.label}</span>
            <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-crimson to-blossom"
                style={{ width: `${index.score}%` }}
              />
            </span>
            <span className="w-7 text-right font-serif text-[15px] text-gold-soft">{index.score}</span>
          </li>
        ))}
      </ul>
    </TeaserCard>
  );
}

const PEACH_MONTH_RANGE: Record<number, string> = { 12: "12월 초 ~ 1월 초", 3: "3월 초 ~ 4월 초", 6: "6월 초 ~ 7월 초", 9: "9월 초 ~ 10월 초" };

export function BloomCard({ result }: { result: FreeResultView }) {
  const { bloom } = result.teasers;
  return (
    <TeaserCard title={`${result.name}의 도화가 피는 ${bloom.now ? "달" : "다음 달"}`}>
      <div className="flex flex-col items-center gap-2 px-5 pb-6 pt-6 text-center">
        <p className="font-serif text-[clamp(2.2rem,11vw,2.8rem)] leading-none text-paper">
          {bloom.year}년 <span className="text-blossom-glow">{bloom.month}월</span>
        </p>
        <p className="text-[13px] text-mist">
          {PEACH_MONTH_RANGE[bloom.month]} · {bloom.hanja}月{bloom.now && " · 바로 지금"}
        </p>
      </div>
      <div className="border-t border-line/40">
        <LockedRow label="겹도화 해" mask="■■■■년 ■월" />
        <LockedRow label="조심할 남자" mask="■■■■ ■■■ ■■" />
      </div>
    </TeaserCard>
  );
}

export function PartnerCard({ result }: { result: FreeResultView }) {
  const { partner } = result.teasers;
  return (
    <TeaserCard title={`${result.name}에게 끌리는 남자`}>
      <LockedPicture src="/images/result/chapter-5-locked.jpg" alt="얼굴을 흐리게 가린 남자" caption="그 남자의 얼굴" lockY="41%" ratio="1 / 1" />
      <Row label="분위기">{partner.vibe}</Row>
      <Row label="나이">{partner.age}</Row>
      <LockedRow label="직업의 결" mask="■■■ ■■■■" />
      <LockedRow label="체격·키" mask="■■■cm ■■" />
      <LockedRow label="처음 만나는 곳" mask="■■ ■■■ ■■" />
    </TeaserCard>
  );
}

export function FaceCard({ result }: { result: FreeResultView }) {
  const { face } = result.teasers;
  return (
    <div className="flex flex-col gap-6">
      <TeaserCard title="남자들 눈에 비친 네 얼굴">
        <LockedPicture src="/images/result/chapter-2-locked.jpg" alt="거울 속 얼굴이 흐리게 가려진 모습" caption="그 남자가 보는 네 얼굴" lockY="53%" ratio="10 / 11" />
        <Row label="첫인상" oneLine>
          {face.impression}
        </Row>
        <LockedRow label="매력 포인트" mask="■■■ ■■■■" />
        <LockedRow label="필살 멘트" mask="■■■ ■■ ■■" />
        <LockedRow label="잊지 못할 장면" mask="■■■■ ■■■" />
      </TeaserCard>

      <TeaserCard title="이렇게만 바꾸면 더 예뻐질 텐데">
        <div className="flex items-center gap-4 px-5 py-3.5">
          <span className="w-[6.5rem] shrink-0 whitespace-nowrap rounded border border-gold/30 px-2 py-0.5 text-center text-[12px] text-gold-soft">포인트 컬러</span>
          <span aria-hidden className="size-5 shrink-0 rounded-full border border-white/30" style={{ backgroundColor: face.color.hex }} />
          <span className="flex-1 font-serif text-[16px] text-paper">
            {face.color.name} <span className="text-[13px] text-mist">({face.color.hanja})</span>
          </span>
        </div>
        <LockedRow label="헤어·메이크업" mask="■■■ ■■ ■■■" />
        <LockedRow label="어울리는 향" mask="■■■ ■■" />
        <LockedRow label="예뻐 보이는 때" mask="■■ ■시 ■■" />
      </TeaserCard>
    </div>
  );
}
