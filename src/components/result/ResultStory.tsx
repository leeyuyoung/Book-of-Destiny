"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";
import { josa } from "@/lib/constants/sajuLabels";
import type { DohwaView } from "@/types/result";

const EASE = [0.22, 0.61, 0.36, 1] as const;
/** 신선이 떠오른 뒤 첫 말풍선을 띄우기까지(ms) */
const FIRST_BUBBLE_MS = 1400;
/** 말풍선마다 "…" 을 보여주는 시간(ms) */
const TYPING_MS = 700;
/** 말풍선을 읽을 시간. 글자 수에 비례하되 너무 짧거나 길지 않게 자른다. */
const readMs = (chars: number) => Math.min(3600, Math.max(1300, chars * 55));
/** 마지막 말풍선을 다 읽은 뒤 분위기를 띄우기까지(ms) */
const VIBES_AFTER_MS = 400;
const VIBE_STAGGER_S = 0.35;

type ResultStoryProps = { name: string; type: DohwaView["type"]; children: ReactNode };

/** 결과 첫머리. 신선이 말풍선으로 한 마디씩 건넨 뒤 분위기를 세로로 띄우고, 그 아래로 결과를 펼친다. 중간에 건너뛸 수 없다. */
export function ResultStory({ name, type, children }: ResultStoryProps) {
  const instant = !!useReducedMotion();
  const lines: { text: ReactNode; chars: number }[] = [
    {
      text: (
        <>
          {name}, 넌 보아하니 <span className="text-blossom-glow">{type.name}</span>이구나
        </>
      ),
      chars: name.length + type.name.length + 10,
    },
    { text: josa(type.headline, "이지", "지"), chars: type.headline.length + 2 },
    ...type.story.split(/(?<=[.!?])\s+/).map((sentence) => ({ text: sentence, chars: sentence.length })),
    { text: type.tease, chars: type.tease.length },
  ];
  const lineCount = lines.length;
  const bubbleAt: number[] = [];
  lines.reduce((at, line) => {
    bubbleAt.push(at);
    return at + TYPING_MS + readMs(line.chars);
  }, FIRST_BUBBLE_MS);
  const vibesAt = bubbleAt[lineCount - 1] + TYPING_MS + readMs(lines[lineCount - 1].chars) + VIBES_AFTER_MS;
  const timeline = bubbleAt.join(",");

  const [shownState, setShown] = useState(0);
  const [revealedState, setRevealed] = useState(false);
  const shown = instant ? lineCount : shownState;
  const revealed = instant || revealedState;

  useEffect(() => {
    if (instant) return;
    const timers = timeline
      .split(",")
      .map((at, index) => window.setTimeout(() => setShown(index + 1), Number(at)));
    timers.push(window.setTimeout(() => setRevealed(true), vibesAt));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [instant, timeline, vibesAt]);

  return (
    <>
      <section className={`relative flex flex-col items-center ${revealed ? "" : "min-h-[calc(100dvh-9rem)]"}`}>
        <motion.div
          className="relative -mx-5 aspect-[4/5] w-[calc(100%+2.5rem)]"
          initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: instant ? 0 : 1.6, ease: EASE }}
          style={{
            maskImage: "linear-gradient(180deg, transparent 0%, black 14%, black 62%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 14%, black 62%, transparent 100%)",
          }}
        >
          <Image
            src="/images/sinseon/hero.jpg"
            alt="달밤의 복숭아꽃 정원에서 꽃가지를 입가에 대고 웃는 한복 차림의 도화신선"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 576px"
            className="object-cover object-[50%_20%]"
          />
        </motion.div>

        <div className="-mt-32 flex w-full flex-col items-start gap-2.5">
          {lines.slice(0, shown).map((line, index) => (
            <SpeechBubble key={index} instant={instant}>
              {line.text}
            </SpeechBubble>
          ))}
        </div>
      </section>

      {revealed && (
        <>
          <section className="mt-10 rounded-3xl border border-line bg-night/70 px-5 py-5">
            <p className="text-xs font-medium text-cinnabar">{type.name}의 분위기</p>
            <ul className="mt-3 flex flex-col gap-2">
              {type.vibes.map((vibe, index) => (
                <motion.li
                  key={vibe}
                  className="flex items-center gap-3 rounded-xl border border-line/70 bg-ink/50 px-4 py-3.5 text-[14px] leading-snug text-paper/90 break-keep"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: instant ? 0 : 0.6, delay: instant ? 0 : index * VIBE_STAGGER_S, ease: EASE }}
                >
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rotate-45 bg-cinnabar" />
                  {vibe}
                </motion.li>
              ))}
            </ul>
          </section>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: instant ? 0 : 1.1, delay: instant ? 0 : type.vibes.length * VIBE_STAGGER_S + 0.3, ease: EASE }}
          >
            {children}
          </motion.div>
        </>
      )}
    </>
  );
}

function SpeechBubble({ instant, children }: { instant: boolean; children: ReactNode }) {
  const [typing, setTyping] = useState(!instant);
  useEffect(() => {
    if (!typing) return;
    const timer = window.setTimeout(() => setTyping(false), TYPING_MS);
    return () => window.clearTimeout(timer);
  }, [typing]);

  return (
    <motion.div
      className="relative max-w-[88%] rounded-2xl rounded-tl-sm border border-cinnabar/30 bg-night/85 px-4 py-3 font-serif text-[16px] leading-relaxed text-paper shadow-[0_8px_30px_-10px_rgb(232_137_155_/_0.45)] backdrop-blur-sm break-keep"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: instant ? 0 : 0.5, ease: EASE }}
    >
      {typing ? (
        <span aria-label="신선이 말하는 중" className="flex h-[26px] items-center gap-1">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-blossom"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
            />
          ))}
        </span>
      ) : (
        children
      )}
    </motion.div>
  );
}
