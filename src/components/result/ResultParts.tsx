import Link from "next/link";
import type { ReactNode } from "react";
import { CHARM_STAR_LABELS, REPORT_CHAPTERS } from "@/lib/constants/result";
import { POSITION_LABELS } from "@/lib/constants/sajuLabels";
import { DETAILED_REPORT_PRICE, formatPrice } from "@/lib/constants/service";
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

/** 결제 전에는 이름과 뜻만 보이고, 결제 후에는 실제로 있는지와 자리를 보여준다. */
export function CharmStars({ stars }: { stars?: CharmStarView[] }) {
  const items = (Object.keys(CHARM_STAR_LABELS) as CharmStarKey[]).map((key) => ({
    ...CHARM_STAR_LABELS[key],
    found: stars?.find((star) => star.key === key),
  }));
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((star) => {
        const has = Boolean(star.found?.found);
        return (
          <div
            key={star.name}
            className={`relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border px-2 py-4 text-center ${
              stars && has ? "border-cinnabar/60 bg-crimson/25" : "border-line bg-night/70"
            }`}
          >
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-full border border-cinnabar/40 bg-crimson-deep/50 font-serif text-[17px] tracking-tight text-blossom [writing-mode:vertical-rl]"
            >
              {star.hanja}
            </span>
            <span className="text-sm text-paper">{star.name}</span>
            <span className="text-[11px] leading-snug text-mist break-keep">{star.meaning}</span>
            {stars ? (
              <span className={`mt-1 rounded-full px-2 py-0.5 text-[11px] ${has ? "bg-cinnabar/25 text-blossom" : "bg-white/5 text-mist-dim"}`}>
                {has ? "품고 있어" : "지금은 잠들어 있어"}
              </span>
            ) : (
              <span className="mt-1 text-xs text-mist">???</span>
            )}
            {stars && has && star.found && (
              <span className="text-[10px] text-mist">{star.found.positions.map((position) => POSITION_LABELS[position]).join(" · ")}</span>
            )}
          </div>
        );
      })}
    </div>
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
      <ul className="grid grid-cols-3 gap-2 text-center">
        {[
          { value: `${REPORT_CHAPTERS.length}장`, label: "연애·매력 리포트" },
          { value: "1~2분", label: "완성까지" },
          { value: "이메일", label: "함께 보내 드려요" },
        ].map((item) => (
          <li key={item.label} className="flex flex-col gap-1 rounded-xl border border-line/70 bg-ink/50 px-2 py-3">
            <span className="font-serif text-lg text-blossom">{item.value}</span>
            <span className="text-[11px] text-mist">{item.label}</span>
          </li>
        ))}
      </ul>
      <CheckoutLink href={checkoutHref} />
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

export function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-cinnabar">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
