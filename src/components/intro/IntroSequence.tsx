"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useCallback, useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { HeroineBackdrop, type HeroineScene } from "@/components/night/HeroineBackdrop";
import { ButtonLink } from "@/components/ui/Button";
import { HERO_COPY, INTRO_SCRIPT } from "@/lib/constants/service";

const LIGHT_DELAY_MS = 500;

type BubbleKind = "caption" | "thought" | "speech" | "whisper" | "sfx";
/** 말풍선 꼬리가 향하는 쪽 */
type Tail = "bottom-left" | "bottom-right" | "top-left" | "top-right";
type Bubble = {
  kind: BubbleKind;
  text: string;
  /** 컷이 시작된 뒤 말풍선이 뜨는 시각(초) */
  at: number;
  /** 그림 위 자리. 그림 크기에 대한 백분율로 적는다. */
  place: Pick<CSSProperties, "top" | "left" | "right">;
  tail?: Tail;
};
type Beat = { key: string; scene: HeroineScene; ms: number; bubbles: Bubble[] };

/** 약 20초 동안 저절로 넘어가는 웹툰 컷. 화면을 누르면 다음 컷으로 바로 넘어간다. */
const BEATS = [
  {
    key: "arrive",
    scene: "garden",
    ms: 3400,
    bubbles: [
      { kind: "caption", text: INTRO_SCRIPT.caption, at: 0.8, place: { top: "9%", left: "7%" } },
      { kind: "thought", text: INTRO_SCRIPT.wonder, at: 2.0, place: { top: "44%", right: "9%" } },
    ],
  },
  {
    key: "found",
    scene: "sleeping",
    ms: 3800,
    bubbles: [
      { kind: "thought", text: INTRO_SCRIPT.found, at: 0.7, place: { top: "7%", left: "6%" } },
      { kind: "sfx", text: INTRO_SCRIPT.rustle, at: 1.8, place: { top: "58%", left: "10%" } },
    ],
  },
  {
    key: "awake",
    scene: "awake",
    ms: 3000,
    bubbles: [{ kind: "speech", text: INTRO_SCRIPT.who, at: 0.5, place: { top: "36%", left: "6%" }, tail: "top-right" }],
  },
  {
    key: "trapped",
    scene: "trapped",
    ms: 3200,
    bubbles: [
      { kind: "speech", text: INTRO_SCRIPT.stop, at: 0.4, place: { top: "9%", right: "6%" }, tail: "bottom-left" },
      { kind: "thought", text: INTRO_SCRIPT.flustered, at: 1.6, place: { top: "52%", left: "7%" } },
    ],
  },
  {
    key: "scent",
    scene: "scent",
    ms: 5200,
    bubbles: [
      { kind: "speech", text: INTRO_SCRIPT.scent, at: 0.5, place: { top: "5%", left: "5%" }, tail: "bottom-right" },
      { kind: "thought", text: INTRO_SCRIPT.gasp, at: 1.9, place: { top: "47%", left: "8%" } },
      { kind: "whisper", text: INTRO_SCRIPT.tease, at: 2.9, place: { top: "57%", right: "5%" }, tail: "top-right" },
    ],
  },
  { key: "final", scene: "main", ms: 0, bubbles: [] },
] as const satisfies readonly Beat[];

const SCENES = [...new Set(BEATS.map((beat) => beat.scene))];
const FINAL_INDEX = BEATS.length - 1;

/** 메인 장면이 열릴 때 번쩍이는 흰 빛 */
const FLASH_MS = 700;
const LEAD_AT = 1.0;
/** 자막 한 글자가 찍히는 간격(초). 띄어쓰기도 한 글자로 친다. */
const TYPE_STEP_S = 0.06;
const typedEnd = (lines: readonly string[], startAt = 0) =>
  startAt + lines.reduce((count, line) => count + Array.from(line).length, 0) * TYPE_STEP_S;
const INVITE_AT = typedEnd(HERO_COPY.lead, LEAD_AT) + 0.3;
const CTA_AT = typedEnd([HERO_COPY.invite], INVITE_AT) + 0.3;

const EASE = [0.22, 0.61, 0.36, 1] as const;

const VISITED_KEY = "dohwa-saju:visited";

function readVisited() {
  try {
    return window.localStorage.getItem(VISITED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * 인트로를 보는 도중에 값이 바뀌면 화면이 랜딩으로 튀므로,
 * 페이지를 떠날 때와 메인 버튼을 누를 때만 남긴다.
 */
function markVisited() {
  try {
    window.localStorage.setItem(VISITED_KEY, "1");
  } catch {
    // 사생활 보호 모드처럼 저장소를 못 쓰면 다음에도 인트로를 보여 준다.
  }
}

const subscribeNothing = () => () => {};

/** 처음 온 사람은 인트로부터, 다시 온 사람은 메인 화면부터 본다. */
export function IntroSequence() {
  const reducedMotion = !!useReducedMotion();
  /** 서버와 첫 렌더에서는 아직 모르므로 null */
  const visited = useSyncExternalStore(subscribeNothing, readVisited, () => null);
  const [replay, setReplay] = useState(false);
  const [index, setIndex] = useState(0);
  const [lit, setLit] = useState(false);
  const landing = !replay && (visited === true || reducedMotion);
  const current = BEATS[landing ? FINAL_INDEX : index];
  const isFinal = current.key === "final";

  useEffect(() => {
    const timer = window.setTimeout(() => setLit(true), LIGHT_DELAY_MS);
    window.addEventListener("pagehide", markVisited);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", markVisited);
    };
  }, []);

  const advance = useCallback(() => setIndex((value) => Math.min(value + 1, FINAL_INDEX)), []);
  const skip = useCallback(() => setIndex(FINAL_INDEX), []);
  const replayIntro = useCallback(() => {
    setIndex(0);
    setReplay(true);
  }, []);

  useEffect(() => {
    if (visited === null || landing || isFinal) return;
    const timer = window.setTimeout(advance, current.ms);
    return () => window.clearTimeout(timer);
  }, [visited, landing, isFinal, current, advance]);

  if (visited === null) return <div className="min-h-dvh w-full" />;

  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden" onClick={landing ? undefined : advance}>
      <HeroineBackdrop
        lit={landing || lit}
        scenes={SCENES}
        scene={current.scene}
        fadeMs={isFinal ? 400 : 900}
        lowVeil={isFinal}
      />

      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-full -translate-x-1/2 landscape:w-[56.25vh]">
        <AnimatePresence>
          {current.bubbles.map((bubble) => (
            <SpeechBubble key={`${current.key}-${bubble.text}`} bubble={bubble} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFinal && !landing && (
          <motion.div
            key="flash"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-30 bg-white"
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0, transition: { duration: FLASH_MS / 1000, ease: "easeOut" } }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isFinal && (
          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              skip();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 z-20 px-2 py-2 font-sans text-xs text-paper/70 transition-colors hover:text-paper"
          >
            인트로 스킵하기 →
          </motion.button>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-end px-7 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16">
        {isFinal && <FinalReveal instant={landing} onReplay={landing && !reducedMotion ? replayIntro : undefined} />}
      </main>
    </div>
  );
}

/** 웹툰 칸 위에 얹는 말풍선. 종류마다 모양을 달리한다. */
function SpeechBubble({ bubble }: { bubble: Bubble }) {
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
        <p className="min-w-[8.5rem] rounded-[50%] border-[2.5px] border-[#b9a3b6] bg-white px-8 py-5 text-center font-sans text-[17px] font-semibold leading-snug text-[#3a2f3f] break-keep">
          {bubble.text}
        </p>
        <span aria-hidden className="absolute -bottom-3 left-[26%] h-4 w-4 rounded-full border-2 border-[#b9a3b6] bg-white" />
        <span aria-hidden className="absolute -bottom-6 left-[20%] h-2.5 w-2.5 rounded-full border-2 border-[#b9a3b6] bg-white" />
      </motion.div>
    );
  }

  const whisper = bubble.kind === "whisper";
  const fill = whisper ? "#2a0f1f" : "#ffffff";
  const stroke = whisper ? "#e58fb0" : "#1b1424";
  return (
    <motion.div {...pop} className="absolute max-w-[68%] drop-shadow-[0_10px_24px_rgb(0_0_0_/_0.5)]" style={bubble.place}>
      {bubble.tail && <BubbleTail tail={bubble.tail} fill={fill} stroke={stroke} layer="under" />}
      <p
        className={`relative z-10 min-w-[9rem] rounded-[50%] border-[2.5px] px-8 py-6 text-center font-sans font-bold leading-snug break-keep ${
          whisper ? "text-[17px] text-blossom-glow" : "text-[19px] text-[#16121f]"
        }`}
        style={{ backgroundColor: fill, borderColor: stroke }}
      >
        {bubble.text}
      </p>
      {bubble.tail && <BubbleTail tail={bubble.tail} fill={fill} stroke={stroke} layer="over" />}
    </motion.div>
  );
}

const TAIL_PATH = "M3 0 C 8 14, 10 24, 4 34 C 16 28, 24 16, 27 0 Z";

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
      viewBox="0 0 30 34"
      className={`pointer-events-none absolute h-[34px] w-[30px] overflow-visible ${layer === "over" ? "z-20" : "z-0"}`}
      style={style}
    >
      {layer === "under" ? (
        <path d={TAIL_PATH} fill={fill} stroke={stroke} strokeWidth={5} strokeLinejoin="round" />
      ) : (
        <path d={TAIL_PATH} fill={fill} />
      )}
    </svg>
  );
}

/** instant면 인트로를 건너뛴 랜딩이라 문구를 한꺼번에 살며시 띄운다. */
function FinalReveal({ instant, onReplay }: { instant: boolean; onReplay?: () => void }) {
  const reveal = (delay: number) =>
    instant
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, delay, ease: EASE } },
        };

  return (
    <motion.div
      className="flex w-full max-w-md flex-col items-center text-center"
      onClick={(event) => event.stopPropagation()}
      initial={instant ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }}
    >
      <motion.span
        {...reveal(0.5)}
        className="mb-4 rounded-full border border-blossom/50 bg-crimson/40 px-3 py-1 font-sans text-[11px] font-semibold tracking-[0.12em] text-blossom-glow"
      >
        {HERO_COPY.badge}
      </motion.span>
      <p className="mb-3 font-serif text-[17px] font-medium leading-relaxed tracking-[0.06em] break-keep text-paper [text-shadow:0_1px_10px_rgba(10,6,20,0.9)]">
        <Typed lines={HERO_COPY.lead} startAt={LEAD_AT} instant={instant} />
      </p>
      <h1 className="font-brush text-[clamp(1.7rem,8.2vw,2.75rem)] leading-[1.25] tracking-[0.06em] break-keep">
        <Typed lines={[HERO_COPY.invite]} startAt={INVITE_AT} charClassName="text-gold-gradient" instant={instant} />
      </h1>

      <motion.div {...reveal(CTA_AT)} className="mt-6 flex w-full flex-col gap-3" onClickCapture={markVisited}>
        <ButtonLink href="/start">{HERO_COPY.cta}</ButtonLink>
      </motion.div>
      {onReplay && (
        <button
          type="button"
          onClick={onReplay}
          className="mt-4 px-2 py-1 font-sans text-xs text-paper/60 underline-offset-4 transition-colors hover:text-paper hover:underline"
        >
          인트로 다시 보기
        </button>
      )}
    </motion.div>
  );
}

/** 줄 → 낱말 → 글자로 나누고, 글자마다 찍힐 시각을 붙인다. 띄어쓰기도 한 박자 쉰다. */
function layoutTyping(lines: readonly string[], startAt: number) {
  let step = 0;
  return lines.map((line) =>
    line.split(" ").map((word, wordIndex) => {
      if (wordIndex > 0) step += 1;
      return Array.from(word).map((char) => ({ char, at: startAt + step++ * TYPE_STEP_S }));
    }),
  );
}

/**
 * 붓으로 한 자씩 써 내려가듯 글자가 차례로 또렷해진다.
 * 자리는 처음부터 잡아 두어 글자가 늘어나도 줄이 흔들리지 않는다.
 */
function Typed({
  lines,
  startAt = 0,
  charClassName,
  instant = false,
}: {
  lines: readonly string[];
  startAt?: number;
  /** 배경을 글자 모양으로 오려 칠하는 효과는 글자마다 따로 입혀야 한다. */
  charClassName?: string;
  instant?: boolean;
}) {
  const rows = layoutTyping(lines, startAt);

  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden>
        {rows.map((words, row) => (
          <span key={row}>
            {row > 0 && <br />}
            {words.map((chars, wordIndex) => (
              <Fragment key={wordIndex}>
                {wordIndex > 0 && " "}
                <span className="whitespace-nowrap">
                  {chars.map(({ char, at }, charIndex) =>
                    instant ? (
                      <span key={charIndex} className={charClassName}>
                        {char}
                      </span>
                    ) : (
                      <motion.span
                        key={charIndex}
                        className={charClassName}
                        initial={{ opacity: 0, filter: "blur(6px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)", transition: { duration: 0.35, delay: at, ease: EASE } }}
                      >
                        {char}
                      </motion.span>
                    ),
                  )}
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}
