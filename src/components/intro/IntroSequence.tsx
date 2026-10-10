"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { HeroineBackdrop, type HeroineScene } from "@/components/night/HeroineBackdrop";
import { MythicButtonLink } from "@/components/ui/MythicButtonLink";
import { SpeechBubble, type Bubble } from "@/components/webtoon/SpeechBubble";
import { HERO_COPY, INTRO_SCRIPT } from "@/lib/constants/service";

const LIGHT_DELAY_MS = 500;

type Beat = { key: string; scene: HeroineScene; ms: number; bubbles: Bubble[] };

/** 약 20초 동안 저절로 넘어가는 웹툰 컷. 화면을 누르면 다음 컷으로 바로 넘어간다. */
const BEATS = [
  {
    key: "arrive",
    scene: "garden",
    ms: 4000,
    bubbles: [
      { kind: "caption", text: INTRO_SCRIPT.caption, at: 0.8, place: { top: "15%", left: "7%" } },
      { kind: "monologue", text: INTRO_SCRIPT.wonder, at: 1.6, place: { top: "64%" } },
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
    bubbles: [{ kind: "speech", text: INTRO_SCRIPT.who, at: 0.5, place: { top: "36%", left: "6%" } }],
  },
  {
    key: "trapped",
    scene: "trapped",
    ms: 3200,
    bubbles: [
      { kind: "speech", text: INTRO_SCRIPT.stop, at: 0.4, place: { top: "9%", right: "6%" } },
      { kind: "thought", text: INTRO_SCRIPT.flustered, at: 1.6, place: { top: "52%", left: "7%" } },
    ],
  },
  {
    key: "scent",
    scene: "scent",
    ms: 5200,
    bubbles: [
      { kind: "speech", text: INTRO_SCRIPT.scent, at: 0.5, place: { top: "5%", left: "5%" } },
      { kind: "thought", text: INTRO_SCRIPT.gasp, at: 1.9, place: { top: "47%", left: "8%" } },
      { kind: "whisper", text: INTRO_SCRIPT.tease, at: 2.9, place: { top: "57%", right: "5%" } },
    ],
  },
  {
    key: "final",
    scene: "main",
    ms: 0,
    bubbles: [
      { kind: "speech", text: HERO_COPY.lead, at: 0.8, place: { top: "3%", left: "6%" } },
      { kind: "whisper", text: HERO_COPY.invite, at: 2.3, place: { top: "47%", right: "5%" }, big: true },
    ],
  },
] as const satisfies readonly Beat[];

const SCENES = [...new Set(BEATS.map((beat) => beat.scene))];
const FINAL_INDEX = BEATS.length - 1;

/** 메인 장면이 열릴 때 번쩍이는 흰 빛 */
const FLASH_MS = 700;
/** 말풍선 두 개가 뜬 뒤 버튼이 튀어나오는 시각(초) */
const CTA_AT = 3.4;
/** 다시 온 사람은 이미 본 장면이라 말풍선과 버튼을 이 비율만큼 빨리 띄운다. */
const LANDING_PACE = 0.4;

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
        lowVeil
      />

      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-full -translate-x-1/2 landscape:w-[56.25vh]">
        <AnimatePresence>
          {current.bubbles.map((bubble) => (
            <SpeechBubble
              key={`${current.key}-${bubble.text}`}
              bubble={landing ? { ...bubble, at: bubble.at * LANDING_PACE } : bubble}
            />
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
        <h1 className="sr-only">
          {HERO_COPY.lead} {HERO_COPY.invite}
        </h1>
        {isFinal && <FinalReveal landing={landing} onReplay={landing && !reducedMotion ? replayIntro : undefined} />}
      </main>
    </div>
  );
}

/** 말풍선 두 개가 뜬 뒤 화면 아래쪽 가운데에 큰 버튼 하나만 툭 튀어나온다. */
function FinalReveal({ landing, onReplay }: { landing: boolean; onReplay?: () => void }) {
  const ctaAt = landing ? CTA_AT * LANDING_PACE : CTA_AT;

  return (
    <div className="mb-[8dvh] flex w-full max-w-sm flex-col items-center" onClick={(event) => event.stopPropagation()}>
      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.6, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: ctaAt, type: "spring", stiffness: 320, damping: 16 } }}
        onClickCapture={markVisited}
      >
        <MythicButtonLink href="/start">{HERO_COPY.cta}</MythicButtonLink>
      </motion.div>
      {onReplay && (
        <motion.button
          type="button"
          onClick={onReplay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: ctaAt + 0.4, duration: 0.6 } }}
          className="mt-4 px-2 py-1 font-sans text-xs text-paper/60 underline-offset-4 transition-colors hover:text-paper hover:underline"
        >
          인트로 다시 보기
        </motion.button>
      )}
    </div>
  );
}
