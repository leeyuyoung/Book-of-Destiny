"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

/** 버튼 둘레에서 번갈아 반짝이는 별빛 자리 */
const SPARKLES = [
  { top: "-14px", left: "8%", size: 14, delay: 0 },
  { top: "-10px", right: "14%", size: 10, delay: 0.9 },
  { bottom: "-16px", left: "22%", size: 11, delay: 1.6 },
  { bottom: "-12px", right: "6%", size: 15, delay: 0.4 },
] as const;

/** 밝은 분홍 바탕에서도 읽히도록 글자 둘레에 얇은 먹색 테두리를 두른다. */
const INK_OUTLINE = [
  [0.8, 0],
  [-0.8, 0],
  [0, 0.8],
  [0, -0.8],
]
  .map(([x, y]) => `${x}px ${y}px 0 rgb(27 20 36 / 0.55)`)
  .concat("0 1px 4px rgb(27 20 36 / 0.35)")
  .join(", ");

/**
 * 메인 화면 전용 큰 버튼. 금박 이중 테두리와 양 끝의 복숭아꽃 문양을 새겼다.
 * 분홍 후광이 숨 쉬듯 번지고, 빛줄기가 주기적으로 버튼을 훑고 지나간다.
 */
export function MythicButtonLink({ href, children }: { href: string; children: ReactNode }) {
  const still = !!useReducedMotion();

  return (
    <div className="relative w-full">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(closest-side,rgb(255_170_192_/_0.75),transparent)] blur-xl"
        animate={still ? undefined : { opacity: [0.55, 1, 0.55], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {SPARKLES.map(({ size, delay, ...place }, index) => (
        <motion.svg
          key={index}
          aria-hidden
          viewBox="0 0 20 20"
          width={size}
          height={size}
          className="pointer-events-none absolute z-20 drop-shadow-[0_0_6px_rgb(255_236_179_/_0.95)]"
          style={place}
          animate={still ? undefined : { opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4], rotate: [0, 45, 90] }}
          transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
        >
          <path d="M10 0 C11 7, 13 9, 20 10 C13 11, 11 13, 10 20 C9 13, 7 11, 0 10 C7 9, 9 7, 10 0 Z" fill="#fff4d6" />
        </motion.svg>
      ))}

      <Link
        href={href}
        className="group relative z-10 flex min-h-[4.25rem] w-full items-center justify-center overflow-hidden rounded-full border-[1.5px] border-[#f6d58e] bg-[linear-gradient(180deg,#ffc4cf_0%,#f48da6_50%,#cf5a7e_100%)] px-11 shadow-[0_0_0_1px_rgb(122_31_67_/_0.5),0_10px_30px_rgb(0_0_0_/_0.45),0_0_36px_-6px_rgb(255_178_196_/_0.85)] transition-transform duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f6d58e]/70"
      >
        <span aria-hidden className="pointer-events-none absolute inset-[5px] rounded-full border border-[#f6d58e]/55" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-[5px] h-1/3 rounded-full bg-gradient-to-b from-white/45 to-transparent"
        />

        {!still && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-[24deg] bg-gradient-to-r from-transparent via-white/70 to-transparent"
            initial={{ left: "-45%" }}
            animate={{ left: "130%" }}
            transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 1.9, ease: "easeInOut" }}
          />
        )}

        <Blossom className="left-4" />
        <Blossom className="right-4" />

        <span
          className="relative whitespace-nowrap font-serif text-[clamp(13px,4.4vw,18px)] font-bold leading-none tracking-[0.06em] text-[#fffaf3]"
          style={{ textShadow: INK_OUTLINE }}
        >
          {children}
        </span>
      </Link>
    </div>
  );
}

/** 버튼 양 끝에 새긴 금빛 복숭아꽃 */
function Blossom({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 drop-shadow-[0_0_4px_rgb(255_226_160_/_0.9)] ${className}`}
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx="12" cy="6.5" rx="3.6" ry="5" fill="#ffe7a8" stroke="#8a4a10" strokeWidth="0.8" transform={`rotate(${angle} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.4" fill="#e0457f" stroke="#8a4a10" strokeWidth="0.8" />
    </svg>
  );
}
