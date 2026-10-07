"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { HeroineBackdrop, type HeroineScene } from "@/components/night/HeroineBackdrop";
import { ButtonLink } from "@/components/ui/Button";
import { HERO_COPY, INTRO_SCRIPT } from "@/lib/constants/service";

const LIGHT_DELAY_MS = 500;

/** 화면을 누를 때마다 다음 컷으로 넘어간다. */
const BEATS = [
  { key: "tryst", scene: "tryst" },
  { key: "sensed", scene: "sensed" },
  { key: "who", scene: "noticed" },
  { key: "stop", scene: "caught" },
  { key: "tease", scene: "caught" },
  { key: "secret", scene: "caught" },
  { key: "final", scene: "offer" },
] as const satisfies readonly { key: string; scene: HeroineScene }[];
type Beat = (typeof BEATS)[number]["key"];

const SCENES = [...new Set(BEATS.map((beat) => beat.scene))];
const FINAL_INDEX = BEATS.length - 1;
/** 선녀가 다가와 얼굴을 가까이 보여주는 구간 */
const APPROACH_BEATS: readonly Beat[] = ["tease", "secret"];
/** 첫 컷은 그림이 밝아진 뒤에 자막을 친다. */
const TRYST_AT = 1.4;

/** 자막 한 글자가 찍히는 간격(초). 띄어쓰기도 한 글자로 친다. */
const TYPE_STEP_S = 0.075;
/** 앞 줄을 다 친 뒤 다음 줄을 치기 전 숨 고르는 시간 */
const TYPE_PAUSE_S = 0.5;

const typedEnd = (lines: readonly string[], startAt = 0) =>
  startAt + lines.reduce((count, line) => count + Array.from(line).length, 0) * TYPE_STEP_S;

const TEASE_AT = typedEnd([INTRO_SCRIPT.teaseLead]) + TYPE_PAUSE_S;
const LEAD_AT = 0.6;
const INVITE_AT = typedEnd(HERO_COPY.lead, LEAD_AT) + TYPE_PAUSE_S;
const CTA_AT = typedEnd([HERO_COPY.invite], INVITE_AT) + 0.4;

/** 컷마다 자막을 다 친 시각. 안내 문구는 이 뒤에 띄운다. */
const COPY_END_S: Record<Beat, number> = {
  tryst: typedEnd([INTRO_SCRIPT.tryst], TRYST_AT),
  sensed: typedEnd([INTRO_SCRIPT.rustle]),
  who: typedEnd([INTRO_SCRIPT.who]),
  stop: typedEnd([INTRO_SCRIPT.stop]),
  tease: typedEnd(INTRO_SCRIPT.tease, TEASE_AT),
  secret: typedEnd(INTRO_SCRIPT.secret),
  final: CTA_AT,
};

/** 자막을 먼저 띄우고, 이만큼(초) 뒤에야 그림을 이 컷의 장면으로 바꾸는 컷. 그 전까지는 앞 컷의 그림을 둔다. */
const SCENE_DELAY_S: Partial<Record<Beat, number>> = { sensed: COPY_END_S.sensed + 0.5 };
/** 그림이 겹쳐 바뀌는 시간(ms)을 기본보다 길게 잡는 컷 */
const SCENE_FADE_MS: Partial<Record<Beat, number>> = { sensed: 2000 };

const EASE = [0.22, 0.61, 0.36, 1] as const;
const mistExit = {
  opacity: 0,
  y: -24,
  filter: "blur(12px)",
  transition: { duration: 0.8, ease: EASE },
};

export function IntroSequence() {
  const reducedMotion = useReducedMotion();
  const instant = !!reducedMotion;
  const [index, setIndex] = useState(0);
  const [lit, setLit] = useState(false);
  const current = BEATS[instant ? FINAL_INDEX : index];
  const isFinal = current.key === "final";

  useEffect(() => {
    const timer = window.setTimeout(() => setLit(true), LIGHT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const advance = useCallback(() => setIndex((value) => Math.min(value + 1, FINAL_INDEX)), []);
  const skip = useCallback(() => setIndex(FINAL_INDEX), []);

  const sceneDelay = instant ? undefined : SCENE_DELAY_S[current.key];
  const [sceneReadyFor, setSceneReadyFor] = useState<Beat | null>(null);
  useEffect(() => {
    if (sceneDelay === undefined) return;
    const timer = window.setTimeout(() => setSceneReadyFor(current.key), sceneDelay * 1000);
    return () => window.clearTimeout(timer);
  }, [current.key, sceneDelay]);
  const scene = sceneDelay !== undefined && sceneReadyFor !== current.key ? BEATS[Math.max(0, index - 1)].scene : current.scene;

  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden" onClick={advance}>
      <HeroineBackdrop lit={instant || lit} scenes={SCENES} scene={scene} fadeMs={SCENE_FADE_MS[current.key]} approach={APPROACH_BEATS.includes(current.key)} lowVeil={isFinal} />

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
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))] z-20 px-2 py-2 font-display text-xs uppercase tracking-[0.35em] text-mist-dim transition-colors hover:text-gold-soft"
          >
            Skip
          </motion.button>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-end px-7 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16">
        <div className="flex min-h-[220px] w-full flex-col items-center justify-end">
          <AnimatePresence mode="wait">
            <BeatCopy key={current.key} beat={current.key} instant={instant} />
          </AnimatePresence>
        </div>
        <div className="mt-6 h-5">
          <AnimatePresence mode="wait">
            {!isFinal && (
              <motion.p
                key={current.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.75, 0.35, 0.75], transition: { delay: COPY_END_S[current.key] + 0.6, duration: 2.4, repeat: Infinity, repeatType: "reverse" } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="font-serif text-xs tracking-[0.3em] text-mist-dim"
              >
                화면을 눌러 넘기기
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function BeatCopy({ beat, instant }: { beat: Beat; instant: boolean }) {
  switch (beat) {
    case "tryst":
      return <Narration lines={[INTRO_SCRIPT.tryst]} startAt={TRYST_AT} />;
    case "sensed":
      return <Narration lines={[INTRO_SCRIPT.rustle]} />;
    case "who":
      return <Line lines={[INTRO_SCRIPT.who]} />;
    case "stop":
      return <Line lines={[INTRO_SCRIPT.stop]} />;
    case "tease":
      return (
        <motion.div className="flex flex-col items-center text-center" exit={mistExit}>
          <p className={LINE_CLASS}>
            <Typed lines={[INTRO_SCRIPT.teaseLead]} />
          </p>
          <p className={`mt-4 text-[clamp(1.5rem,7vw,2.2rem)] ${GLOW_CLASS}`}>
            <Typed lines={INTRO_SCRIPT.tease} startAt={TEASE_AT} />
          </p>
        </motion.div>
      );
    case "secret":
      return (
        <motion.h2 exit={mistExit} className="text-center font-brush text-[clamp(1.5rem,7.6vw,2.5rem)] leading-[1.25] tracking-[0.04em] break-keep">
          <Typed lines={INTRO_SCRIPT.secret} charClassName="text-gold-gradient" />
        </motion.h2>
      );
    case "final":
      return <FinalReveal instant={instant} />;
  }
}

const LINE_CLASS = "text-center font-serif text-[21px] font-light tracking-[0.08em] break-keep text-paper";
/** 달빛을 받은 복숭아꽃처럼 번지는 강조 대사 */
const GLOW_CLASS = "font-eerie leading-[1.35] tracking-[0.1em] break-keep text-blossom-glow";

/** 인물의 대사가 아닌 상황 설명과 효과음. 대사보다 작고 흐리게 둔다. */
function Narration({ lines, startAt }: { lines: readonly string[]; startAt?: number }) {
  return (
    <motion.p exit={mistExit} className="text-center font-serif text-[15px] font-light italic tracking-[0.3em] break-keep text-mist">
      <Typed lines={lines} startAt={startAt} />
    </motion.p>
  );
}

function Line({ lines }: { lines: readonly string[] }) {
  return (
    <motion.p exit={mistExit} className={LINE_CLASS}>
      <Typed lines={lines} />
    </motion.p>
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

function FinalReveal({ instant }: { instant: boolean }) {
  const reveal = (delay: number) =>
    instant
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.4, delay, ease: EASE } },
        };

  return (
    <motion.div className="flex w-full max-w-md flex-col items-center text-center" onClick={(event) => event.stopPropagation()}>
      <p className="mb-3 font-serif text-[17px] font-medium leading-relaxed tracking-[0.06em] break-keep text-paper [text-shadow:0_1px_10px_rgba(10,6,20,0.9)]">
        <Typed lines={HERO_COPY.lead} startAt={LEAD_AT} instant={instant} />
      </p>
      <h1 className="font-brush text-[clamp(1.7rem,8.2vw,2.75rem)] leading-[1.25] tracking-[0.06em] break-keep">
        <Typed lines={[HERO_COPY.invite]} startAt={INVITE_AT} charClassName="text-gold-gradient" instant={instant} />
      </h1>

      <motion.div {...reveal(CTA_AT)} className="mt-6 flex w-full flex-col gap-3">
        <ButtonLink href="/start">{HERO_COPY.cta}</ButtonLink>
      </motion.div>
    </motion.div>
  );
}
