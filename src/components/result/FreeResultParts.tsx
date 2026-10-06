import Link from "next/link";
import type { ReactNode } from "react";
import { PetalVeil } from "@/components/result/LetterPetals";
import { LockIcon } from "@/components/result/ResultParts";
import { REPORT_CHAPTERS, type ReportChapterKey } from "@/lib/constants/result";
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

/** 도화 지수와 다섯 갈래 매력을 오각형 하나로 보여준다. */
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

      <svg viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`} className="relative mx-auto mt-2 w-full max-w-[300px]" role="img" aria-label="다섯 갈래 매력 지수">
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

      <p className="relative mt-1 text-center text-xs text-mist">
        네 꽃에서 가장 짙은 기운 · <span className="text-blossom">{top.label}</span>
      </p>
    </div>
  );
}

/** 잠긴 장마다 내건 상징 글자 */
const CHAPTER_SEALS: Partial<Record<ReportChapterKey, string>> = {
  firstImpression: "初",
  looks: "顔",
  flirt: "媚",
  language: "言",
  styling: "粧",
  admirers: "蝶",
  inLove: "戀",
  match: "緣",
  heart: "心",
};

/** 무료 화면에서 따로 보여주지 않는 장들을 자물쇠 카드로 모아 보여준다. */
export function LockedChapterGrid({ href, unlocked = false }: { href: string; unlocked?: boolean }) {
  const chapters = REPORT_CHAPTERS.filter((chapter) => chapter.key in CHAPTER_SEALS);

  return (
    <ul className="grid grid-cols-2 gap-2.5">
      {chapters.map((chapter, index) => (
        <li key={chapter.key} className={chapters.length % 2 === 1 && index === chapters.length - 1 ? "col-span-2" : undefined}>
          <Link
            href={href}
            className="relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-line bg-night/70 px-3.5 pb-3.5 pt-3 transition-colors active:bg-crimson-deep/40"
          >
            <span aria-hidden className="pointer-events-none absolute -right-2 -top-3 font-serif text-[64px] leading-none text-cinnabar/10">
              {CHAPTER_SEALS[chapter.key]}
            </span>
            <span className="flex items-center justify-between">
              <span className="text-[11px] text-cinnabar">제{chapter.chapter}장</span>
              {!unlocked && <LockIcon />}
            </span>
            <span className="font-serif text-[15px] leading-snug text-paper break-keep">{chapter.title}</span>
            <span className="line-clamp-2 text-[11px] leading-relaxed text-mist break-keep">{chapter.teaser}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** 앞으로의 연애운을 해마다 꽃 마디로 잇는다. 결제 전에는 내용 대신 꽃잎으로 덮어 둔다. */
export function LoveTimelineStrip({ years }: { years: number[] }) {
  return (
    <div className="rounded-3xl border border-line bg-night/70 px-4 pb-5 pt-6">
      <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}>
        <span aria-hidden className="absolute left-[16%] right-[16%] top-5 h-px bg-gradient-to-r from-cinnabar/20 via-cinnabar/70 to-cinnabar/20" />
        {years.map((year) => (
          <li key={year} className="relative flex flex-col items-center gap-2 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cinnabar/50 bg-ink font-serif text-sm text-blossom shadow-[0_0_20px_-6px_rgb(232_137_155_/_0.8)]">
              ?
            </span>
            <span className="font-serif text-sm text-paper">{year}년</span>
            <span aria-hidden className="select-none text-[11px] leading-relaxed text-paper/70 blur-[4px]">
              인연이 감겨드는 달
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-mist">
        <LockIcon />
        어느 해, 어느 달에 꽃이 터지는지는 펼치면 알려주마
      </p>
    </div>
  );
}

/**
 * 도화선녀가 건네는 서찰. 리포트 몇 장의 첫 귀띔을 선녀 말투로 적고, 핵심 낱말은 꽃잎으로 덮는다.
 * 여기서 귀띔한 내용은 리포트 작성 지시(REPORT_CHAPTERS의 guide)에도 들어 있어야 한다.
 */
export function DohwaLetter({ name, href }: { name: string; href: string }) {
  return (
    <Link href={href} className="group relative block px-1 pt-3">
      <div className="-rotate-[0.8deg] drop-shadow-[0_18px_28px_rgb(0_0_0_/_0.75)] transition-transform group-active:scale-[0.99]">
        <div
          className="relative bg-[#d8d0c2] bg-cover bg-center px-7 pb-8 pt-10 text-[#1e1915] shadow-[inset_0_0_40px_rgb(92_80_64_/_0.35),inset_0_0_6px_rgb(70_60_48_/_0.3)]"
          style={{ clipPath: TORN_EDGE, backgroundImage: "url(/images/letter-paper.jpg)" }}
        >
          <p className="relative font-hand text-[18px] leading-none text-[#6e1f36]">{name}에게</p>

          <div className="relative mt-5 flex flex-col gap-4 font-hand text-[16px] leading-[1.9] break-keep [text-shadow:0_0_0.6px_rgb(30_25_21_/_0.5)]">
            <LetterLine chapter="firstImpression">
              너를 처음 본 이들은 다들 네가 <PetalVeil em={4.2} seed={0} /> 같다고 하지.
            </LetterLine>
            <LetterLine chapter="looks">
              네 도화는 <PetalVeil em={2.6} seed={1} />에 맺혀 있어. 그래서 다들 거기서 눈을 못 떼지.
            </LetterLine>
            <LetterLine chapter="flirt">
              상대가 무너지는 건 네가 <PetalVeil em={5} seed={2} /> 할 때란다.
            </LetterLine>
            <LetterLine chapter="styling">
              <PetalVeil em={2.8} seed={3} /> 빛을 걸치는 날, 네 꽃은 두{"\u00a0"}배로 피어나지.
            </LetterLine>
            <LetterLine chapter="match">
              <PetalVeil em={2.4} seed={4} /> 기운을 지닌 이는 붙잡고, <PetalVeil em={2.4} seed={5} /> 기운을 지닌 이는 멀리하렴.
            </LetterLine>
          </div>

          <div className="relative mt-8 flex items-end justify-between">
            <p className="text-[11px] leading-relaxed text-[#1e1915]/60">
              꽃잎을 걷으면
              <br />
              전부 읽을 수 있느니라
            </p>
            <div className="flex items-center gap-2">
              <span className="font-hand text-[18px] tracking-[0.06em] text-[#1e1915]/90">도화선녀</span>
              <InkSeal />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LetterLine({ chapter, children }: { chapter: ReportChapterKey; children: ReactNode }) {
  const number = REPORT_CHAPTERS.find((item) => item.key === chapter)!.chapter;
  return (
    <p className="relative pl-7">
      <span className="absolute left-0 top-[0.45em] font-serif text-[10px] leading-none text-[#9c3f62]/70">{number}장</span>
      {children}
    </p>
  );
}

/** 붉은 인주가 고르지 않게 묻은 음각 낙관. 가장자리를 거칠게 일그러뜨리고 군데군데 인주가 빠지게 한다. */
function InkSeal() {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className="h-[58px] w-[58px] rotate-[7deg] mix-blend-multiply">
      <defs>
        <filter id="seal-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="11" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.7" result="holes" />
          <feComposite in="rough" in2="holes" operator="in" />
        </filter>
      </defs>
      <g filter="url(#seal-ink)">
        <rect x="5" y="5" width="54" height="54" rx="5" fill="#b0213f" />
        <rect x="9.5" y="9.5" width="45" height="45" rx="2.5" fill="none" stroke="#efe2cb" strokeWidth="1.6" />
        <text x="32" y="29" textAnchor="middle" fontFamily="var(--font-serif)" fontWeight="700" fontSize="19" fill="#efe2cb">
          桃
        </text>
        <text x="32" y="50" textAnchor="middle" fontFamily="var(--font-serif)" fontWeight="700" fontSize="19" fill="#efe2cb">
          花
        </text>
      </g>
    </svg>
  );
}

/** 찢어 낸 종이의 들쭉날쭉한 가장자리. 위쪽은 깊게, 아래와 옆은 얕게 찢는다. 매번 같은 모양이 나오도록 씨앗을 고정한다. */
const TORN_EDGE = (() => {
  let state = 20251007;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  const points: string[] = [];
  for (let x = 0; x <= 100; x += 2.5) points.push(`${x}% ${(random() * 2.2).toFixed(2)}%`);
  for (let y = 8; y <= 92; y += 12) points.push(`${(100 - random() * 0.9).toFixed(2)}% ${y}%`);
  for (let x = 100; x >= 0; x -= 3) points.push(`${x}% ${(100 - random() * 1.3).toFixed(2)}%`);
  for (let y = 92; y >= 8; y -= 12) points.push(`${(random() * 0.9).toFixed(2)}% ${y}%`);
  return `polygon(${points.join(", ")})`;
})();
