"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const SURFACE =
  "relative z-10 flex min-h-16 w-full items-center justify-center overflow-hidden rounded-full border border-gold/60 bg-gradient-to-b from-crimson to-crimson-deep px-[clamp(2.1rem,11vw,2.75rem)] shadow-[0_0_44px_-8px_rgb(232_137_155_/_0.7),inset_0_1px_0_rgb(242_221_184_/_0.3)] transition-all duration-500 hover:border-gold hover:shadow-[0_0_60px_-6px_rgb(232_137_155_/_0.9),inset_0_1px_0_rgb(242_221_184_/_0.4)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60";

type Props = { children: ReactNode } & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

/**
 * 화면의 마무리를 맡는 큰 버튼. 다른 화면의 기본 버튼과 같은 자두빛 바탕·옛 금색 글씨를 쓰되,
 * 안쪽 금선과 양 끝의 복숭아꽃 선화를 더하고 은은한 후광과 빛결로 한 번 더 눈길을 끈다.
 * href를 주면 링크, onClick을 주면 버튼이 된다.
 */
export function MythicButtonLink({ href, onClick, children }: Props) {
  const still = !!useReducedMotion();

  const inner = (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-[4px] rounded-full border border-gold/25" />

      {!still && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-[24deg] bg-gradient-to-r from-transparent via-gold-soft/20 to-transparent"
          initial={{ left: "-35%" }}
          animate={{ left: "125%" }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" }}
        />
      )}

      <Blossom className="left-[clamp(10px,4.5vw,18px)]" />
      <Blossom className="right-[clamp(10px,4.5vw,18px)]" />

      <span className="relative whitespace-nowrap font-serif text-[clamp(14px,4.2vw,16px)] font-medium tracking-[0.12em] text-gold-soft">
        {children}
      </span>
    </>
  );

  return (
    <div className="relative w-full">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-full bg-[radial-gradient(closest-side,rgb(232_137_155_/_0.45),transparent)] blur-xl"
        animate={still ? undefined : { opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {href !== undefined ? (
        <Link href={href} className={SURFACE}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={`${SURFACE} cursor-pointer`}>
          {inner}
        </button>
      )}
    </div>
  );
}

/** 버튼 양 끝에 금선으로 그린 복숭아꽃 */
function Blossom({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gold/70 ${className}`}
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="12"
          cy="6.5"
          rx="3.4"
          ry="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
