"use client";

import { useRef, useState } from "react";
import { REVIEWS, REVIEWS_INCLUDE_SAMPLES, REVIEW_AVERAGE } from "@/lib/constants/result";
export function ReviewCarousel() {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const list = listRef.current;
    const first = list?.firstElementChild as HTMLElement | null;
    if (!list || !first) return;
    const step = first.offsetWidth + 12;
    setActive(Math.min(REVIEWS.length - 1, Math.max(0, Math.round(list.scrollLeft / step))));
  };

  const scrollTo = (index: number) => {
    const item = listRef.current?.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h2 className="font-eerie text-[28px] leading-snug text-paper">
          어? 이거 내 얘기인데?
          <br />
          <span className="text-blossom-glow">{REVIEWS_INCLUDE_SAMPLES ? "먼저 꽃을 펼친 이들" : `100% 솔직 리뷰`}</span>
        </h2>
        {REVIEW_AVERAGE && (
          <p className="text-sm leading-relaxed text-mist">
            나의 도화 기운을 확인한 이용자들이
            <br />
            평균 <span className="font-medium text-paper">{REVIEW_AVERAGE}</span>점의 만족도를 남겨주었어요.
          </p>
        )}
        {REVIEWS_INCLUDE_SAMPLES && (
          <p className="text-[11px] text-mist-dim">※ 예시 후기가 함께 실려 있어요. 평균 별점은 실제 후기로만 계산했어요.</p>
        )}
      </div>

      <ul
        ref={listRef}
        onScroll={onScroll}
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {REVIEWS.map((review) => (
          <li
            key={review.name + review.date}
            className={`flex shrink-0 snap-center flex-col gap-4 rounded-3xl bg-white/[0.18] p-5 ${REVIEWS.length > 1 ? "w-[86%]" : "w-full"}`}
          >
            <div className="flex items-center gap-3">
              <span
                aria-label={review.zodiac.label}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cinnabar/40 bg-gradient-to-b from-crimson/60 to-crimson-deep font-serif text-xl text-blossom shadow-[0_0_18px_-6px_rgb(232_137_155_/_0.7)]"
              >
                {review.zodiac.hanja}
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-[15px] font-medium text-paper">
                  {review.name}
                  {review.sample && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-normal text-mist">예시</span>
                  )}
                </span>
                <span className="text-xs tracking-wider text-gold" aria-label={`별점 ${review.rating}점`}>
                  {"★".repeat(review.rating)}
                  <span className="text-white/20">{"★".repeat(5 - review.rating)}</span>
                </span>
              </div>
              <span className="self-start text-xs text-mist-dim">{review.date}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-paper/90">{review.body}</p>
          </li>
        ))}
      </ul>

      <div className={`justify-center gap-1.5 ${REVIEWS.length > 1 ? "flex" : "hidden"}`}>
        {REVIEWS.map((review, index) => (
          <button
            key={review.name + review.date}
            type="button"
            aria-label={`${index + 1}번째 리뷰 보기`}
            onClick={() => scrollTo(index)}
            className={`h-1.5 rounded-full transition-all ${index === active ? "w-4 bg-paper" : "w-1.5 bg-white/25"}`}
          />
        ))}
      </div>
    </section>
  );
}
