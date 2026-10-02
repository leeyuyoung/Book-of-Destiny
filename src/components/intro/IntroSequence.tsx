"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { CosmicBackground } from "@/components/cosmos/CosmicBackground";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";
import { INTRO_LINES, SERVICE } from "@/lib/constants/service";

const OPENING_DELAY_MS = 1400;
const LINE_HOLD_MS = 3800;
const TITLE_STAGE = INTRO_LINES.length;
const CINEMATIC_EASE = [0.22, 0.61, 0.36, 1] as const;

export function IntroSequence() {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState(-1);
  const currentStage = reducedMotion ? TITLE_STAGE : stage;
  const showTitle = currentStage >= TITLE_STAGE;

  useEffect(() => {
    if (reducedMotion || showTitle) return;
    const delay = stage === -1 ? OPENING_DELAY_MS : LINE_HOLD_MS;
    const timer = window.setTimeout(() => setStage((previous) => previous + 1), delay);
    return () => window.clearTimeout(timer);
  }, [stage, showTitle, reducedMotion]);

  const advance = useCallback(() => {
    if (!showTitle) setStage((previous) => Math.min(previous + 1, TITLE_STAGE));
  }, [showTitle]);

  const skip = useCallback(() => setStage(TITLE_STAGE), []);

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden" onClick={advance}>
      <CosmicBackground showRing intensity="full" />

      <AnimatePresence>
        {!showTitle && (
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

      <div className="relative z-10 flex flex-1 items-center justify-center px-8">
        <AnimatePresence mode="wait">
          {currentStage >= 0 && !showTitle && (
            <IntroLine key={currentStage} lines={INTRO_LINES[currentStage]} />
          )}
          {showTitle && <TitleReveal key="title" instant={!!reducedMotion} />}
        </AnimatePresence>
      </div>

      {!showTitle && (
        <div className="relative z-10 flex justify-center gap-2 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          {INTRO_LINES.map((_, index) => (
            <span
              key={index}
              className={`h-px transition-all duration-1000 ${
                index <= currentStage ? "w-6 bg-gold/70" : "w-3 bg-mist-dim/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IntroLine({ lines }: { lines: readonly [string, string] }) {
  return (
    <motion.p
      className="text-center font-serif text-[22px] font-light leading-[1.9] text-paper sm:text-3xl"
      exit={{ opacity: 0, filter: "blur(6px)", y: -8, transition: { duration: 1.2, ease: CINEMATIC_EASE } }}
    >
      {lines.map((line, index) => (
        <motion.span
          key={line}
          className="block"
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: { duration: 1.8, delay: index * 0.7, ease: CINEMATIC_EASE },
          }}
        >
          {index === 1 ? <span className="text-gold-gradient">{line}</span> : line}
        </motion.span>
      ))}
    </motion.p>
  );
}

function TitleReveal({ instant }: { instant: boolean }) {
  const reveal = (delay: number) =>
    instant
      ? {}
      : {
          initial: { opacity: 0, y: 12, filter: "blur(8px)" },
          animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 1.8, delay, ease: CINEMATIC_EASE },
          },
        };

  return (
    <motion.div className="flex w-full max-w-sm flex-col items-center text-center" onClick={(event) => event.stopPropagation()}>
      <motion.div
        {...(instant
          ? {}
          : {
              initial: { opacity: 0, scale: 0.85 },
              animate: { opacity: 1, scale: 1, transition: { duration: 2.4, ease: CINEMATIC_EASE } },
            })}
        className="relative mb-10"
      >
        <div className="absolute inset-0 -m-8 rounded-full bg-gold/10 blur-2xl animate-breathe" />
        <LogoMark size={88} className="relative" />
      </motion.div>

      <motion.div {...reveal(0.6)} className="mb-4 flex items-center gap-3">
        <span className="hairline w-10" />
        <span className="font-serif text-sm tracking-[0.5em] text-gold/90">{SERVICE.tagline}</span>
        <span className="hairline w-10" />
      </motion.div>

      <motion.h1 {...reveal(1.0)} className="font-serif text-5xl font-light tracking-[0.18em] sm:text-6xl">
        <span className="text-gold-gradient">{SERVICE.name}</span>
      </motion.h1>

      <motion.p
        {...reveal(1.5)}
        className="mt-5 font-display text-sm uppercase tracking-[0.35em] text-mist"
      >
        {SERVICE.englishTagline}
      </motion.p>

      <motion.div {...reveal(2.4)} className="mt-16 flex w-full flex-col gap-3">
        <ButtonLink href="/about">나의 책 펼치기</ButtonLink>
        <ButtonLink href="/start" variant="ghost">
          바로 시작하기
        </ButtonLink>
      </motion.div>
    </motion.div>
  );
}
