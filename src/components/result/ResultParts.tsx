import Link from "next/link";
import type { ReactNode } from "react";
import { BLURRED_FILLER, CHARM_STAR_LABELS, REPORT_CHAPTERS } from "@/lib/constants/result";
import { DETAILED_REPORT_PRICE, formatPrice } from "@/lib/constants/service";
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

/** 결제 전에는 이름만 보이고, 결제 후에는 실제로 있는지와 자리를 보여준다. */
export function CharmStars({ stars }: { stars?: CharmStarView[] }) {
  const items = stars ?? Object.values(CHARM_STAR_LABELS).map((label) => ({ ...label, found: false, where: "" }));
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((star) => (
        <div
          key={star.name}
          className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-4 text-center ${
            stars && star.found ? "border-cinnabar/60 bg-crimson/25" : "border-line bg-night/70"
          }`}
        >
          <span className="font-serif text-lg text-paper">{stars ? (star.found ? "있음" : "없음") : "???"}</span>
          <span className="text-xs text-blossom">{star.name}</span>
          {stars && star.found && <span className="text-[10px] text-mist">{star.where}</span>}
        </div>
      ))}
    </div>
  );
}

/** 잠긴 장. 실제 리포트 대신 자리 채움 글을 흐리게 보여준다. */
export function LockedChapter({ chapter }: { chapter: (typeof REPORT_CHAPTERS)[number] }) {
  return (
    <article className="flex flex-col gap-4">
      <SectionTitle eyebrow={`제${chapter.chapter}장`} title={chapter.title} description={chapter.teaser} />
      <BlurredText />
    </article>
  );
}

export function BlurredText({ lines = 1 }: { lines?: number }) {
  return (
    <div aria-hidden className="relative select-none">
      {Array.from({ length: lines }, (_, index) => (
        <p key={index} className="text-[15px] leading-[1.9] text-paper/80 blur-[5px]">
          {BLURRED_FILLER}
        </p>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center gap-1.5 rounded-full border border-cinnabar/30 bg-ink/90 px-3 py-1.5 text-xs text-paper/90 shadow-[0_0_24px_rgb(7_6_14_/_0.9)]">
          <LockIcon />
          펼치면 전부 알려주마
        </span>
      </div>
    </div>
  );
}

/** 연애운 표. timeline이 없으면 연도만 보이고 내용은 흐리게 가린다. */
export function LoveTimelineTable({ years, timeline }: { years: number[]; timeline?: { year: number; mood: string; body: string }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="grid grid-cols-[4.5rem_1fr] bg-white/5 px-4 py-2.5 text-xs text-mist">
        <span>시기</span>
        <span>연애운</span>
      </div>
      {years.map((year, index) => {
        const item = timeline?.[index];
        return (
          <div key={year} className="grid grid-cols-[4.5rem_1fr] gap-y-1 border-t border-line/60 px-4 py-4">
            <span className="font-serif text-sm text-cinnabar">{year}년</span>
            {item ? (
              <div className="flex flex-col gap-1">
                <span className="font-serif text-[15px] text-paper">{item.mood}</span>
                <span className="text-sm leading-relaxed text-mist">{item.body}</span>
              </div>
            ) : (
              <span aria-hidden className="select-none text-sm text-paper/80 blur-[5px]">
                네 꽃이 가장 짙게 피는 순간과 그 사람을 붙잡는 법
              </span>
            )}
          </div>
        );
      })}
    </div>
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

export function FinalCheckoutPrompt({ checkoutHref }: CheckoutProps) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-cinnabar/40 bg-gradient-to-b from-crimson-deep/70 via-night to-night px-6 py-9">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-eerie text-[26px] leading-snug text-paper">
          넌 이미 충분히 색기 있어.
          <br />
          <span className="text-blossom-glow">이제 그걸 쓸 차례란다.</span>
        </p>
        <p className="text-sm text-mist">어떻게 꺼내고, 누구에게 쓰고, 언제 터뜨릴지. 네 사주로만 쓰는 연애·매력 리포트 전 {REPORT_CHAPTERS.length}장</p>
      </div>
      <ol className="flex flex-col gap-2">
        {REPORT_CHAPTERS.map((chapter) => (
          <li key={chapter.chapter} className="flex items-center gap-3 rounded-xl border border-line/70 bg-ink/50 px-4 py-3">
            <LockIcon />
            <span className="w-9 shrink-0 text-[11px] text-cinnabar">제{chapter.chapter}장</span>
            <span className="font-serif text-sm text-paper/90">{chapter.title}</span>
          </li>
        ))}
      </ol>
      <CheckoutLink href={checkoutHref} />
      <p className="text-center text-[11px] leading-relaxed text-mist-dim">결제하면 1~2분 안에 리포트가 완성되고, 이메일로도 보내드려요.</p>
    </section>
  );
}

function CheckoutLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-crimson to-cinnabar px-6 font-serif text-[15px] text-paper shadow-[0_0_40px_-8px_rgb(232_137_155_/_0.8)] transition-transform active:scale-[0.98]"
    >
      숨겨진 도화력 확인하기 · {formatPrice(DETAILED_REPORT_PRICE)}
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

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-cinnabar">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
