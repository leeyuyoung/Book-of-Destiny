import Image from "next/image";
import type { ReactNode } from "react";
import { LockIcon } from "@/components/result/ResultParts";
import { Reveal } from "@/components/ui/Reveal";
import { REPORT_CHAPTERS, type ReportChapterKey, withPartner } from "@/lib/constants/result";
import type { DohwaView } from "@/types/result";

const RADAR_SIZE = 300;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 92;
/** 지수가 대부분 80~90점대라, 아래쪽을 잘라 내야 꼭짓점 차이가 눈에 보인다. */
const RADAR_FLOOR = 40;

const radarPoint = (index: number, total: number, ratio: number) => {
  const angle = ((-90 + (360 / total) * index) * Math.PI) / 180;
  return [RADAR_CENTER + Math.cos(angle) * RADAR_RADIUS * ratio, RADAR_CENTER + Math.sin(angle) * RADAR_RADIUS * ratio] as const;
};

const toPath = (points: (readonly [number, number])[]) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** 도화 지수와 네 갈래 매력을 다각형 하나로 보여준다. */
export function DohwaRadarCard({ dohwa }: { dohwa: DohwaView }) {
  const total = dohwa.indices.length;
  const ratios = dohwa.indices.map((index) => Math.min(1, Math.max(0.12, (index.score - RADAR_FLOOR) / (100 - RADAR_FLOOR))));
  const top = dohwa.indices.reduce((best, index) => (index.score > best.score ? index : best));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cinnabar/30 bg-gradient-to-b from-crimson-deep/70 via-night/90 to-night px-5 pb-6 pt-7">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cinnabar/20 blur-3xl" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-mist">사람을 홀리는 힘</p>
          <p className="font-serif leading-none">
            <span className="text-blossom-glow text-[56px] font-light">{dohwa.score}</span>
            <span className="ml-1 text-lg text-mist">점</span>
          </p>
        </div>
        <span className="flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center rounded-full border border-cinnabar/50 bg-crimson/30">
          <span className="font-serif text-base leading-none text-blossom">{dohwa.grade.hanja}</span>
          <span className="mt-1 text-[10px] text-paper/80">{dohwa.grade.label}</span>
        </span>
      </div>
      <p className="relative mt-3 font-serif text-[14px] leading-relaxed text-paper/90">“{dohwa.grade.line}”</p>

      <svg viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`} className="relative mx-auto mt-2 w-full max-w-[300px]" role="img" aria-label="네 갈래 매력 지수">
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <polygon
            key={ring}
            points={toPath(dohwa.indices.map((_, index) => radarPoint(index, total, ring)))}
            fill="none"
            stroke="rgb(214 176 122 / 0.18)"
            strokeWidth="1"
          />
        ))}
        {dohwa.indices.map((index, i) => {
          const [x, y] = radarPoint(i, total, 1);
          return <line key={index.key} x1={RADAR_CENTER} y1={RADAR_CENTER} x2={x} y2={y} stroke="rgb(214 176 122 / 0.14)" strokeWidth="1" />;
        })}
        <defs>
          <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-blossom)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-crimson)" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <polygon
          points={toPath(ratios.map((ratio, index) => radarPoint(index, total, ratio)))}
          fill="url(#radar-fill)"
          stroke="var(--color-cinnabar)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {ratios.map((ratio, index) => {
          const [x, y] = radarPoint(index, total, ratio);
          return <circle key={index} cx={x} cy={y} r="3" fill="var(--color-blossom)" />;
        })}
        {dohwa.indices.map((index, i) => {
          const [x, y] = radarPoint(i, total, 1.32);
          const isTop = index.key === top.key;
          return (
            <text key={index.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle">
              <tspan x={x} dy="-0.5em" className="font-serif" fontSize="13" fill={isTop ? "var(--color-blossom)" : "var(--color-paper)"}>
                {index.label}
              </tspan>
              <tspan x={x} dy="1.25em" className="font-serif" fontSize="15" fill={isTop ? "var(--color-blossom)" : "var(--color-gold-soft)"}>
                {index.score}
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/** 그림 없이 검은 바탕에 대사만 크게 띄우는 칸. 줄마다 차례로 떠오르고, 줄 사이에 붉은 선을 긋는다. */
export function StatementCut({ lines }: { lines: ReactNode[] }) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      {lines.map((line, index) => (
        <Reveal key={index} delay={index * 0.15} className="flex flex-col items-center gap-6">
          {index > 0 && <span aria-hidden className="h-10 w-px bg-gradient-to-b from-transparent via-cinnabar/70 to-transparent" />}
          <p className="font-eerie text-[clamp(1.5rem,7vw,1.9rem)] leading-snug text-paper break-keep [text-shadow:0_0_24px_rgb(232_137_155_/_0.35)]">
            {line}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/** 결제 전에 보여주는 무료 풀이. 유형 판정 다음에, 색기가 먹히는 모습 둘과 정작 못 쓰는 모습 하나를 체크리스트로 짚는다. */
export function FreeReading({ type }: { type: DohwaView["type"] }) {
  const [charm1, charm2, flaw] = type.checks;
  return (
    <section className="flex flex-col gap-16">
      <Reveal className="flex flex-col items-center gap-3 text-center">
        <p className="font-serif text-[16px] text-mist">네 색기 유형은…</p>
        <div className="relative flex items-center justify-center py-2">
          <span aria-hidden className="absolute font-serif text-[120px] leading-none text-cinnabar/15">
            {type.elementHanja}
          </span>
          <h3 className="relative font-eerie text-[clamp(2.6rem,13vw,3.2rem)] leading-none text-blossom-glow [text-shadow:0_0_30px_rgb(232_137_155_/_0.7)]">
            {type.name}
          </h3>
        </div>
        <p className="font-serif text-[18px] text-paper">{type.plain}</p>
      </Reveal>

      <div className="flex flex-col gap-4">
        <Reveal>
          <p className="text-center font-eerie text-[clamp(1.3rem,6vw,1.55rem)] text-paper">솔직히, 이거 너잖아?</p>
        </Reveal>
        <ul className="flex flex-col gap-3">
          {[charm1, charm2].map((line, index) => (
            <Reveal key={line} delay={0.25 + index * 0.35}>
              <li className="flex items-center gap-3 rounded-2xl border border-line bg-night/70 px-4 py-4">
                <CheckMark />
                <span className="font-serif text-[16px] text-paper break-keep">{line}</span>
              </li>
            </Reveal>
          ))}
          <Reveal delay={0.95}>
            <li className="flex items-center gap-3 rounded-2xl border border-line bg-night/70 px-4 py-4">
              <CheckMark />
              <span className="font-serif text-[16px] text-paper break-keep">{flaw}</span>
            </li>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

function CheckMark() {
  return (
    <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cinnabar/90 text-ink">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** 분량 어필에 내세우는 본문 글자 수. 예시 리포트(public/images/result/report-columns.jpg)는 5,507자였다. 리포트 분량을 줄이면 함께 고친다. */
const REPORT_MIN_CHARS = 4000;

/** 결제 전에 보여주는 리포트 분량. 실제 예시 리포트를 흐리게 가려 여러 줄로 이어 붙인 그림 위에 글자 수를 크게 띄운다. */
export function ReportVolume() {
  return (
    <section className="flex flex-col items-center gap-2 text-center">
      <Reveal>
        <h2 className="font-eerie text-[clamp(1.9rem,9vw,2.4rem)] leading-tight text-paper">
          {REPORT_MIN_CHARS.toLocaleString()}자 이상의
          <br />
          <span className="text-blossom-glow">미친 분량</span>
        </h2>
      </Reveal>
      <Reveal>
        <p className="font-serif text-[16px] text-paper/85">네 색기 쓰는 법, 하나도 빼놓지 않았다</p>
      </Reveal>
      <div className="relative -mx-5 mt-4 aspect-[760/912] w-[calc(100%+2.5rem)]">
        <Image
          src="/images/result/report-columns.jpg"
          alt="흐리게 가린 실제 예시 리포트를 여러 줄로 이어 붙인 화면"
          fill
          sizes="(max-width: 640px) 100vw, 576px"
          className="object-cover object-top"
          style={{
            maskImage: "linear-gradient(180deg, transparent 0%, black 8%, black 72%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 8%, black 72%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}

/** 장 표지 그림. 위아래 모두 배경으로 스며들어, 아래에 얹은 제목이 배경 위에서 읽힌다. */
export function ChapterCoverImage({ src, whole = false }: { src: string; whole?: boolean }) {
  const mask = whole
    ? "linear-gradient(180deg, rgb(0 0 0 / 0.15) 0%, black 7%, black 59%, rgb(0 0 0 / 0.5) 74%, transparent 86%)"
    : "linear-gradient(180deg, transparent 0%, black 16%, black 50%, rgb(0 0 0 / 0.35) 78%, transparent 100%)";
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 640px) 100vw, 576px"
      className={whole ? "object-contain object-top" : "object-cover"}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

/** 그림 위아래 장식까지 다 보여야 하는 장. 틀을 세로로 늘려 그림(3:4)을 자르지 않고 위에 붙이고, 제목은 그림 끝자락에 살짝 걸친다. */
export const WHOLE_COVER_KEYS: ReadonlySet<ReportChapterKey> = new Set(["gaze", "night"]);

export function coverFrameClass(key: ReportChapterKey) {
  return WHOLE_COVER_KEYS.has(key) ? "aspect-[3/4.65]" : "aspect-[4/5]";
}

/**
 * 결제 전 표지에서 얼굴을 가려 두는 장. 그림은 얼굴 자리를 흐리게 한 사본을 쓰고, x·y는 가린 자리의 중심이다.
 * x·y는 그림이 아니라 표지 틀 기준이라, 틀 비율(4:5 또는 통째로 보이는 3:4.65)이 바뀌면 다시 잡아야 한다.
 */
const LOCKED_FACES: Partial<Record<ReportChapterKey, { image: string; x: string; y: string; caption: string }>> = {
  gaze: { image: "/images/result/chapter-2-locked.jpg", x: "49.8%", y: "37.8%", caption: "그 남자가 보는 네 얼굴" },
  fate: { image: "/images/result/chapter-5-locked.jpg", x: "50.1%", y: "29.6%", caption: "네 남자의 얼굴" },
};

function FaceLock({ x, y, caption }: { x: string; y: string; caption: string }) {
  return (
    <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5" style={{ left: x, top: y }}>
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full border border-gold/50 bg-ink/70 text-gold-soft shadow-[0_0_20px_rgb(232_137_155_/_0.45)] backdrop-blur-sm"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      <p className="whitespace-nowrap rounded-full bg-ink/70 px-3 py-1 text-[11px] text-paper/90 backdrop-blur-sm">{caption}</p>
    </div>
  );
}

const ADULT_TAG = "[19금]";

/** 장 제목 앞의 [19금] 표시만 빨갛게 칠한다. */
export function ChapterTitle({ title }: { title: string }) {
  if (!title.startsWith(ADULT_TAG)) return title;
  return (
    <>
      <span className="text-[#ff3b55]">{ADULT_TAG}</span>
      {title.slice(ADULT_TAG.length)}
    </>
  );
}

/** 페이지 맨 아래의 리포트 목차. 장마다 그림·제목·한 줄 소개만 보이고, 소제목은 눌러야 펼쳐진다. */
export function ReportToc({ gender }: { gender: "female" | "male" }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-xs tracking-[0.3em] text-gold-soft">목차</p>
        <h2 className="font-serif text-[20px] text-paper">들킬 준비 됐지?</h2>
      </div>
      <ol className="flex flex-col gap-2.5">
        {REPORT_CHAPTERS.map((chapter) => (
          <li key={chapter.key}>
            <details className="group overflow-hidden rounded-2xl border border-line/70 bg-night/70">
              <summary className="flex cursor-pointer list-none items-center gap-4 p-3 [&::-webkit-details-marker]:hidden">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={LOCKED_FACES[chapter.key]?.image ?? chapter.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[11px] tracking-[0.2em] text-gold-soft">제{chapter.chapter}장</span>
                  <span className="font-serif text-[16px] leading-snug text-paper break-keep">
                    <ChapterTitle title={chapter.title} />
                  </span>
                  <span className="text-[12.5px] leading-snug text-mist break-keep">{chapter.subtitle}</span>
                </span>
                <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-4 shrink-0 text-mist transition-transform group-open:rotate-180">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <ol className="flex flex-col gap-2 border-t border-line/40 px-4 py-3.5">
                {chapter.sections.map((section, index) => (
                  <li key={section.title} className="flex items-center gap-2.5 text-[13.5px] text-paper/85">
                    <span className="font-serif text-cinnabar">{index + 1}</span>
                    <span className="flex-1 break-keep">{withPartner(section.title, gender)}</span>
                    <LockIcon />
                  </li>
                ))}
              </ol>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 유료 리포트 목차. 장마다 그림 표지와 두 줄 제목, 그 아래 잠긴 소제목을 보여준다. */
export function ChapterCovers({ gender }: { gender: "female" | "male" }) {
  return (
    <div className="flex flex-col gap-14">
      {REPORT_CHAPTERS.map((chapter) => {
        const lockedFace = LOCKED_FACES[chapter.key];
        const whole = WHOLE_COVER_KEYS.has(chapter.key);
        return (
          <Reveal key={chapter.key}>
            <article className="flex flex-col gap-5">
              <figure className={`relative -mx-5 overflow-hidden ${coverFrameClass(chapter.key)}`}>
                <ChapterCoverImage src={lockedFace?.image ?? chapter.image} whole={whole} />
                {lockedFace && <FaceLock x={lockedFace.x} y={lockedFace.y} caption={lockedFace.caption} />}
                <figcaption className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-6 pb-4 text-center">
                  <span className="rounded-full border border-gold/40 bg-ink/60 px-3 py-1 text-xs tracking-[0.2em] text-gold-soft backdrop-blur-sm">
                    제{chapter.chapter}장
                  </span>
                  <h3 className="font-eerie text-[clamp(1.7rem,8vw,2.2rem)] leading-tight text-paper [text-shadow:0_0_24px_rgb(232_137_155_/_0.55)]">
                    <ChapterTitle title={chapter.title} />
                  </h3>
                  <p className="font-serif text-[15px] text-blossom-glow">{chapter.subtitle}</p>
                </figcaption>
              </figure>
              <ol className="flex flex-col gap-2">
                {chapter.sections.map((section, index) => (
                  <li key={section.title} className="flex items-center gap-3 rounded-2xl border border-line/70 bg-night/70 px-4 py-3.5">
                    <span className="font-serif text-sm text-cinnabar">{index + 1}</span>
                    <span className="flex-1 font-serif text-[15px] text-paper break-keep">{withPartner(section.title, gender)}</span>
                    <LockIcon />
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
