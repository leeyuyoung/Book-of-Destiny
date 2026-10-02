"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/SectionHeading";
import { DETAILED_REPORT_PRICE, REPORT_PARTS, formatPrice } from "@/lib/constants/service";

/** checkoutHref가 없으면(샘플 화면) 결제 대신 안내만 보여준다. */
export function LockedReportPreview({ checkoutHref }: { checkoutHref?: string }) {
  const [notice, setNotice] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-indigo/60 to-night/90 px-6 py-10">
      <div className="absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <span className="font-display text-[11px] uppercase tracking-[0.4em] text-gold/80">The full book</span>
        <h2 className="font-serif text-2xl font-light leading-snug">
          지금까지는
          <br />
          <span className="text-gold-gradient">첫 장에 불과합니다</span>
        </h2>
        <p className="text-sm leading-relaxed text-mist">
          열한 개의 장으로 이어지는 당신만의 인생 리포트.
          <br />
          지금의 고민에 대한 맞춤 분석까지 담았습니다.
        </p>
      </div>

      <ul className="relative mt-8 flex flex-col gap-2">
        {REPORT_PARTS.map((part, index) => (
          <li
            key={part.part}
            className="flex items-center gap-3 rounded-xl border border-line/70 bg-ink/40 px-4 py-3"
            style={{ opacity: 1 - index * 0.06 }}
          >
            <LockIcon />
            <span className="w-12 shrink-0 font-display text-[11px] tracking-[0.15em] text-gold/60">
              PART {part.part}
            </span>
            <span className="font-serif text-sm text-paper/80">{part.title}</span>
          </li>
        ))}
      </ul>

      <Ornament className="relative my-8" />

      <div className="relative flex flex-col items-center gap-4">
        <p className="font-serif text-lg">
          <span className="text-mist-dim">상세 리포트</span>{" "}
          <span className="text-gold-soft">{formatPrice(DETAILED_REPORT_PRICE)}</span>
        </p>
        {checkoutHref ? (
          <ButtonLink href={checkoutHref}>나의 책 전체 펼치기</ButtonLink>
        ) : (
          <Button onClick={() => setNotice(true)}>나의 책 전체 펼치기</Button>
        )}
        <p className="text-[11px] text-mist-dim">결제하면 이미 완성된 전체 리포트가 바로 열리며, 입력하신 이메일로도 보내드립니다.</p>
        {notice && (
          <p role="status" className="text-xs text-gold/80">
            샘플 화면입니다. 실제 결과 화면에서 결제할 수 있습니다.
          </p>
        )}
      </div>
    </section>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-gold/60">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
