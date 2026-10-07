import Link from "next/link";
import type { ReactNode } from "react";
import { CHARM_STAR_LABELS, REPORT_CHAPTERS } from "@/lib/constants/result";
import type { CharmStarKey } from "@/lib/saju/dohwa";
import type { CharmStarView } from "@/types/result";

export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: ReactNode; description?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {eyebrow && <span className="w-fit rounded-md bg-white/10 px-2.5 py-1 text-xs text-paper/80">{eyebrow}</span>}
      <h2 className="font-eerie text-[26px] leading-snug text-paper">{title}</h2>
      {description && <p className="text-sm leading-relaxed text-mist">{description}</p>}
    </div>
  );
}

/** 결제 전에는 점수를 흐리게 가리고, 결제 후에는 실제 점수를 보여준다. 원국에 있는 살은 카드가 붉게 빛난다. */
export function CharmStars({ stars }: { stars?: CharmStarView[] }) {
  const items = (Object.keys(CHARM_STAR_LABELS) as CharmStarKey[]).map((key) => ({
    ...CHARM_STAR_LABELS[key],
    key,
    found: stars?.find((star) => star.key === key),
  }));
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((star) => {
        const has = Boolean(star.found?.found);
        const score = star.found?.score;
        return (
          <div
            key={star.name}
            className={`relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border px-2 py-4 text-center ${
              stars && has ? "border-cinnabar/60 bg-crimson/25" : "border-line bg-night/70"
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cinnabar/40 bg-crimson-deep/50">
              <StarTulip starKey={star.key} />
            </span>
            <span className="text-sm text-paper">{star.name}</span>
            <span className="text-[11px] leading-snug text-mist break-keep">{star.meaning}</span>
            <span className="mt-auto pt-1 font-serif leading-none">
              {score === undefined ? (
                <span aria-hidden className="inline-block select-none text-[26px] text-paper/90 blur-[6px]">
                  88
                </span>
              ) : (
                <span className={`text-[26px] ${has ? "text-blossom-glow" : "text-paper/90"}`}>{score}</span>
              )}
              <span className="ml-0.5 text-xs text-mist">점</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

const STAR_TULIP_COLORS: Record<CharmStarKey, { light: string; base: string; deep: string }> = {
  dohwa: { light: "#fbd3df", base: "#f0a3bb", deep: "#d97a98" },
  hongyeom: { light: "#f7838f", base: "#e0384f", deep: "#a91c38" },
  hwagae: { light: "#dcc4f5", base: "#b48be0", deep: "#7f52b8" },
};

function StarTulip({ starKey }: { starKey: CharmStarKey }) {
  const color = STAR_TULIP_COLORS[starKey];
  const backId = `star-tulip-back-${starKey}`;
  const frontId = `star-tulip-front-${starKey}`;
  return (
    <svg aria-hidden viewBox="0 0 40 40" className="h-11 w-11 drop-shadow-[0_0_6px_rgb(255_255_255_/_0.15)]">
      <defs>
        <linearGradient id={backId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color.base} />
          <stop offset="100%" stopColor={color.deep} />
        </linearGradient>
        <linearGradient id={frontId} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={color.light} />
          <stop offset="100%" stopColor={color.base} />
        </linearGradient>
      </defs>
      <path d="M20 25 L20 38" stroke="#5f8a5a" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M20 35 C15 33 12.5 29 13 25 C16.5 27 19 30.5 20 35 Z" fill="#5f8a5a" />
      <path d="M20 5 C25 8 27.5 15 26.5 21 C25 25.5 15 25.5 13.5 21 C12.5 15 15 8 20 5 Z" fill={`url(#${backId})`} />
      <path d="M11.5 9 C16 10 19.5 14.5 20.5 20 C21 24 18 26.5 15 25.5 C11 24 10 16 11.5 9 Z" fill={`url(#${backId})`} />
      <path d="M28.5 9 C24 10 20.5 14.5 19.5 20 C19 24 22 26.5 25 25.5 C29 24 30 16 28.5 9 Z" fill={`url(#${backId})`} />
      <path
        d="M20 8.5 C24 11.5 25.2 17.5 23.8 22.5 C22.6 26 17.4 26 16.2 22.5 C14.8 17.5 16 11.5 20 8.5 Z"
        fill={`url(#${frontId})`}
        stroke={color.deep}
        strokeWidth="0.4"
        strokeOpacity="0.6"
      />
      <path d="M18.6 12.5 C17.6 15.5 17.6 19 18.4 22" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 해마다 연도, 그해를 한마디로 담은 제목, 짧은 설명을 세로 타임라인으로 잇는다. */
export function LoveTimeline({ timeline }: { timeline: { year: number; mood: string; body: string }[] }) {
  return (
    <ol className="relative flex flex-col gap-4 pl-9">
      <span aria-hidden className="absolute bottom-6 left-[8px] top-6 w-px bg-gradient-to-b from-cinnabar/70 via-cinnabar/40 to-transparent" />
      {timeline.map((item) => (
        <li key={item.year} className="relative">
          <span
            aria-hidden
            className="absolute -left-[33px] top-5 h-3 w-3 rotate-45 border border-cinnabar bg-crimson-deep shadow-[0_0_10px_rgb(232_137_155_/_0.6)]"
          />
          <div className="rounded-2xl border border-line bg-night/70 px-5 py-4">
            <p className="font-serif text-2xl leading-none text-blossom-glow">{item.year}</p>
            <p className="mt-2 font-serif text-[17px] text-paper">{item.mood}</p>
            <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

type CheckoutProps = { checkoutHref: string };

export function MidCheckoutPrompt({ checkoutHref }: CheckoutProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-cinnabar/30 bg-gradient-to-b from-crimson-deep/60 to-night px-6 py-8 text-center">
      <p className="font-serif text-[17px] leading-relaxed text-paper">
        여기까지는 맛보기란다.
        <br />
        네 매력을 <span className="text-blossom-glow">끝까지 꺼내는 법</span>은
        <br />
        꽃을 펼친 이에게만 알려주마.
      </p>
      <CheckoutLink href={checkoutHref} />
    </div>
  );
}

/** 리포트 전 장의 제목 목록 */
export function ReportContents() {
  return (
    <nav aria-label="리포트 목차" className="rounded-3xl border border-line bg-night/70 px-6 py-5">
      <p className="text-xs text-cinnabar">연애·매력 리포트 전 {REPORT_CHAPTERS.length}장</p>
      <ol className="mt-3 flex flex-col">
        {REPORT_CHAPTERS.map((chapter) => (
          <li key={chapter.key} className="flex items-baseline gap-3 border-b border-line/50 py-3 last:border-0">
            <span className="w-10 shrink-0 text-xs text-cinnabar/80">제{chapter.chapter}장</span>
            <span className="font-serif text-[15px] text-paper">{chapter.title}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CheckoutLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-crimson to-cinnabar px-6 font-serif text-[15px] text-paper shadow-[0_0_40px_-8px_rgb(232_137_155_/_0.8)] transition-transform active:scale-[0.98]"
    >
      숨겨진 도화력 확인하기
    </Link>
  );
}

/** 화면 아래에 늘 떠 있는 결제 버튼 */
export function StickyCheckoutBar({ href, label }: { href: string; label: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-ink via-ink/90 to-transparent px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8">
      <Link
        href={href}
        className="pointer-events-auto mx-auto flex min-h-14 max-w-xl items-center justify-center rounded-full bg-gradient-to-r from-crimson to-cinnabar px-6 font-serif text-[15px] text-paper shadow-[0_0_40px_-8px_rgb(232_137_155_/_0.9)] transition-transform active:scale-[0.98]"
      >
        {label}
      </Link>
    </div>
  );
}

export function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-cinnabar">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
