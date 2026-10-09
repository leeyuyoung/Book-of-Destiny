"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";

/** monologue는 말풍선 없이 화면 위에 떠오르는 보는 이 자신의 속마음이다. */
export type BubbleKind = "caption" | "thought" | "monologue" | "speech" | "whisper" | "sfx";
/** 말풍선 꼬리가 향하는 쪽 */
export type Tail = "bottom-left" | "bottom-right" | "top-left" | "top-right";
export type Bubble = {
  kind: BubbleKind;
  text: string;
  /** 컷이 시작된 뒤 말풍선이 뜨는 시각(초) */
  at: number;
  /** 그림 위 자리. 그림 크기에 대한 백분율로 적는다. */
  place: Pick<CSSProperties, "top" | "left" | "right">;
  tail?: Tail;
  /** 짧고 힘준 한마디라 글자를 크게 키운다. */
  big?: boolean;
};

/** 웹툰 칸 위에 얹는 말풍선. 종류마다 모양을 달리한다. */
export function SpeechBubble({ bubble }: { bubble: Bubble }) {
  const pop = {
    initial: { opacity: 0, scale: 0.6, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { delay: bubble.at, type: "spring", stiffness: 420, damping: 22 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  } as const;

  if (bubble.kind === "caption") {
    return (
      <motion.p
        {...pop}
        className="absolute max-w-[78%] border border-paper/25 bg-ink/80 px-4 py-2.5 font-serif text-[14px] leading-relaxed tracking-[0.06em] text-paper break-keep shadow-[0_6px_24px_rgb(0_0_0_/_0.5)]"
        style={bubble.place}
      >
        {bubble.text}
      </motion.p>
    );
  }

  if (bubble.kind === "monologue") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: bubble.at, duration: 1 } }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
        className="absolute inset-x-0 flex justify-center"
        style={bubble.place}
      >
        <p className="max-w-[calc(100%-2rem)] whitespace-pre-line rounded-[2rem] bg-[radial-gradient(closest-side,rgb(10_6_20_/_0.6),rgb(10_6_20_/_0.3)_75%,transparent)] px-6 py-4 text-center font-serif text-[clamp(16px,5vw,20px)] font-light leading-relaxed text-paper break-keep [text-shadow:0_1px_4px_rgba(10,6,20,0.95),0_0_14px_rgba(10,6,20,0.8)]">
          {bubble.text}
        </p>
      </motion.div>
    );
  }

  if (bubble.kind === "sfx") {
    return (
      <motion.p
        initial={{ opacity: 0, scale: 1.8, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: -8, transition: { delay: bubble.at, type: "spring", stiffness: 380, damping: 14 } }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
        className="absolute font-brush text-[clamp(2.4rem,12vw,3.4rem)] leading-none text-paper [-webkit-text-stroke:1.5px_#1a1424] [text-shadow:0_4px_18px_rgb(0_0_0_/_0.8)]"
        style={bubble.place}
      >
        {bubble.text}
      </motion.p>
    );
  }

  if (bubble.kind === "thought") {
    return (
      <motion.div {...pop} className="absolute max-w-[64%] drop-shadow-[0_8px_20px_rgb(0_0_0_/_0.45)]" style={bubble.place}>
        <p className="min-w-[8.5rem] whitespace-pre-line rounded-[50%] border border-[#cdbccb] bg-white px-8 py-5 text-center font-sans text-[17px] font-medium leading-snug text-[#3a2f3f] break-keep">
          {bubble.text}
        </p>
        <span aria-hidden className="absolute -bottom-3 left-[26%] h-4 w-4 rounded-full border border-[#cdbccb] bg-white" />
        <span aria-hidden className="absolute -bottom-6 left-[20%] h-2.5 w-2.5 rounded-full border border-[#cdbccb] bg-white" />
      </motion.div>
    );
  }

  const whisper = bubble.kind === "whisper";
  const fill = whisper ? "#2a0f1f" : "#ffffff";
  const stroke = whisper ? "#c97a9a" : "#4a3f55";
  /** 줄바꿈을 직접 정한 대사는 그 줄이 다시 꺾이지 않도록 조금 더 넓게 둔다. */
  const width = bubble.text.includes("\n") ? "max-w-[80%]" : "max-w-[68%]";
  return (
    <motion.div {...pop} className={`absolute ${width} drop-shadow-[0_10px_24px_rgb(0_0_0_/_0.5)]`} style={bubble.place}>
      {bubble.tail && <BubbleTail tail={bubble.tail} fill={fill} stroke={stroke} layer="under" />}
      <p
        className={`relative z-10 min-w-[9rem] whitespace-pre-line rounded-[50%] border-[1.5px] px-8 py-6 text-center font-sans font-semibold leading-snug break-keep ${
          bubble.big ? "text-[24px]" : whisper ? "text-[17px]" : "text-[19px]"
        } ${whisper ? "text-blossom-glow" : "text-[#16121f]"}`}
        style={{ backgroundColor: fill, borderColor: stroke }}
      >
        {bubble.text}
      </p>
      {bubble.tail && <BubbleTail tail={bubble.tail} fill={fill} stroke={stroke} layer="over" />}
    </motion.div>
  );
}

const TAIL_PATH = "M4 0 C 6 9, 7 16, 5 26 C 11 20, 15 10, 18 0 Z";

/**
 * 타원 말풍선에서 휘어져 나오는 꼬리.
 * 아래 장은 테두리를 두껍게 그리고, 위 장은 속만 칠해 말풍선 테두리와 꼬리 안쪽 선을 지운다.
 * 그래서 꼬리와 말풍선이 한 덩어리로 이어져 보인다.
 */
function BubbleTail({ tail, fill, stroke, layer }: { tail: Tail; fill: string; stroke: string; layer: "under" | "over" }) {
  const [vertical, horizontal] = tail.split("-") as ["top" | "bottom", "left" | "right"];
  const style: CSSProperties = {
    [vertical === "bottom" ? "top" : "bottom"]: "calc(100% - 12px)",
    [horizontal]: "24%",
    transform: `scale(${horizontal === "right" ? -1 : 1}, ${vertical === "top" ? -1 : 1})`,
  };

  return (
    <svg
      aria-hidden
      viewBox="0 0 22 26"
      className={`pointer-events-none absolute h-[26px] w-[22px] overflow-visible ${layer === "over" ? "z-20" : "z-0"}`}
      style={style}
    >
      {layer === "under" ? (
        <path d={TAIL_PATH} fill={fill} stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
      ) : (
        <path d={TAIL_PATH} fill={fill} />
      )}
    </svg>
  );
}
