"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { FloatingShaman } from "@/components/shrine/FloatingShaman";
import { ShamanBells } from "@/components/shrine/ShamanBells";
import { ShrineBackground } from "@/components/shrine/ShrineBackground";
import { Talisman } from "@/components/shrine/Talisman";
import { ButtonLink } from "@/components/ui/Button";
import { INTRO_LINES, SERVICE } from "@/lib/constants/service";

const IGNITE_DELAY_MS = 500;
const RITUAL_HOLD_MS = 4600;
const LINE_HOLD_MS = 4200;
const RITUAL_STAGE = -1;
const FINAL_STAGE = INTRO_LINES.length;
const EASE = [0.22, 0.61, 0.36, 1] as const;
const smokeExit = {
  opacity: 0,
  y: -24,
  filter: "blur(12px)",
  transition: { duration: 1.1, ease: EASE },
};

export function IntroSequence() {
  const reducedMotion = useReducedMotion();
  const instant = !!reducedMotion;
  const [stage, setStage] = useState(RITUAL_STAGE);
  const [lit, setLit] = useState(false);
  const currentStage = instant ? FINAL_STAGE : stage;
  const isFinal = currentStage >= FINAL_STAGE;

  useEffect(() => {
    const timer = window.setTimeout(() => setLit(true), IGNITE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (instant || isFinal) return;
    const delay = stage === RITUAL_STAGE ? RITUAL_HOLD_MS : LINE_HOLD_MS;
    const timer = window.setTimeout(() => setStage((previous) => previous + 1), delay);
    return () => window.clearTimeout(timer);
  }, [stage, isFinal, instant]);

  const advance = useCallback(() => {
    if (!isFinal) setStage((previous) => Math.min(previous + 1, FINAL_STAGE));
  }, [isFinal]);

  const skip = useCallback(() => setStage(FINAL_STAGE), []);

  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden" onClick={advance}>
      <ShrineBackground intensity="full" candlesLit={instant || lit} />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-10 w-14 -translate-x-1/2"
        initial={instant ? false : { y: -120 }}
        animate={{ y: 0, transition: { duration: 2.2, delay: 0.3, ease: EASE } }}
      >
        <div className="relative origin-top animate-sway will-change-transform">
          <div
            className="absolute inset-x-[-60%] bottom-[-10%] top-[35%] rounded-full"
            style={{ background: "radial-gradient(circle, rgb(224 170 46 / 0.28), transparent 65%)" }}
          />
          <ShamanBells className="relative w-full" />
        </div>
      </motion.div>

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

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-7 pb-[18dvh] pt-24">
        <AnimatePresence>
          {!isFinal && (
            <motion.div
              key="shaman"
              aria-hidden
              className="pointer-events-none mb-4 h-[min(40dvh,360px)]"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 2.4, delay: 0.8, ease: EASE } }}
              exit={{ opacity: 0, y: -40, filter: "blur(12px)", transition: { duration: 1.1, ease: EASE } }}
            >
              <FloatingShaman playDelay={1.6} className="h-full" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentStage === RITUAL_STAGE && <RitualPrompt key="ritual" />}
          {currentStage >= 0 && !isFinal && <IntroLine key={currentStage} lines={INTRO_LINES[currentStage]} />}
          {isFinal && <FinalReveal key="final" instant={instant} />}
        </AnimatePresence>

        {!isFinal && (
          <div className="mt-14 flex gap-3" aria-hidden>
            {INTRO_LINES.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rotate-45 transition-all duration-1000 ${
                  index <= currentStage ? "bg-cinnabar shadow-[0_0_10px_rgb(196_43_31/0.9)]" : "bg-mist-dim/30"
                }`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function RitualPrompt() {
  return (
    <motion.div className="flex flex-col items-center text-center" exit={smokeExit}>
      <motion.p
        className="font-serif text-[17px] font-light tracking-[0.08em] text-paper/85"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)", transition: { duration: 1.6, delay: 1.2, ease: EASE } }}
      >
        잠시 눈을 감고
      </motion.p>
      <BrushText className="mt-4 text-[clamp(1.5rem,7vw,2.25rem)]" delay={2.1}>
        마음속 고민 하나를
        <br />
        떠올려 주세요
      </BrushText>
    </motion.div>
  );
}

function IntroLine({ lines }: { lines: readonly [string, string] }) {
  return (
    <motion.div className="flex flex-col items-center text-center" exit={smokeExit}>
      <motion.p
        className="font-serif text-[clamp(1.15rem,5.2vw,1.5rem)] font-light leading-relaxed break-keep text-paper/90"
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.4, ease: EASE } }}
      >
        {lines[0]}
      </motion.p>
      <BrushText className="mt-3 text-[clamp(1.7rem,8vw,2.5rem)]" delay={0.9}>
        {lines[1]}
      </BrushText>
    </motion.div>
  );
}

/** 붓으로 오른쪽으로 그어 나가듯 글자가 드러난다. */
function BrushText({ children, className, delay }: { children: ReactNode; className?: string; delay: number }) {
  return (
    <motion.p
      className={`font-eerie leading-[1.3] tracking-[0.12em] break-keep text-blood-glow ${className ?? ""}`}
      initial={{ clipPath: "inset(-20% 100% -20% 0%)", opacity: 0.6 }}
      animate={{ clipPath: "inset(-20% 0% -20% 0%)", opacity: 1, transition: { duration: 1.6, delay, ease: [0.6, 0.05, 0.3, 1] } }}
    >
      {children}
    </motion.p>
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
    <motion.div className="flex w-full max-w-sm flex-col items-center text-center" onClick={(event) => event.stopPropagation()}>
      <motion.div
        className="relative"
        {...(instant
          ? {}
          : {
              initial: { opacity: 0, y: -90, rotate: -12 },
              animate: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 60, damping: 9, mass: 1.1 } },
            })}
      >
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[160%] w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full animate-glow-pulse will-change-transform"
          style={{ background: "radial-gradient(circle, rgb(196 43 31 / 0.4), rgb(196 43 31 / 0.15) 35%, transparent 65%)" }}
        />
        <div className="origin-top animate-sway-slow will-change-transform">
          <Talisman className="w-[min(30vw,128px,15dvh)]" />
        </div>
      </motion.div>

      <motion.p {...reveal(0.9)} className="mt-8 font-serif text-xs tracking-[0.6em] text-gold/90">
        {SERVICE.tagline}
      </motion.p>
      <motion.h1 {...reveal(1.2)} className="mt-1 font-brush text-[clamp(3.4rem,17vw,4.6rem)] leading-none">
        <span className="text-gold-gradient">{SERVICE.name}</span>
      </motion.h1>
      <motion.p {...reveal(1.6)} className="mt-4 font-serif text-[15px] leading-relaxed text-mist">
        촛불 앞에서, 당신의 여덟 글자를 읽어드립니다.
      </motion.p>

      <motion.div {...reveal(2.2)} className="mt-9 flex w-full flex-col gap-3">
        <ButtonLink href="/start">팔자 펼쳐보기</ButtonLink>
      </motion.div>
    </motion.div>
  );
}
