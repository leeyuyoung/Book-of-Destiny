"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { HeroineBackdrop } from "@/components/night/HeroineBackdrop";
import { ButtonLink } from "@/components/ui/Button";
import { HERO_COPY, INTRO_GREETING, SERVICE } from "@/lib/constants/service";

const LIGHT_DELAY_MS = 500;
const RITUAL_HOLD_MS = 6200;
const EASE = [0.22, 0.61, 0.36, 1] as const;
const mistExit = {
  opacity: 0,
  y: -24,
  filter: "blur(12px)",
  transition: { duration: 1.1, ease: EASE },
};

export function IntroSequence() {
  const reducedMotion = useReducedMotion();
  const instant = !!reducedMotion;
  const [revealed, setRevealed] = useState(false);
  const [lit, setLit] = useState(false);
  const isFinal = instant || revealed;

  useEffect(() => {
    const timer = window.setTimeout(() => setLit(true), LIGHT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isFinal) return;
    const timer = window.setTimeout(() => setRevealed(true), RITUAL_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [isFinal]);

  const reveal = useCallback(() => setRevealed(true), []);

  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden" onClick={reveal}>
      <HeroineBackdrop lit={instant || lit} />

      <AnimatePresence>
        {!isFinal && (
          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              reveal();
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
            {isFinal ? <FinalReveal key="final" instant={instant} /> : <RitualPrompt key="ritual" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function RitualPrompt() {
  return (
    <motion.div className="flex flex-col items-center text-center" exit={mistExit}>
      <motion.p
        className="font-serif text-[19px] font-light tracking-[0.12em] text-paper/90"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)", transition: { duration: 1.6, delay: 1.4, ease: EASE } }}
      >
        {INTRO_GREETING[0]}
      </motion.p>
      <GlowText className="mt-4 text-[clamp(1.5rem,7vw,2.2rem)]" delay={2.4}>
        {INTRO_GREETING[1]}
        <br />
        {INTRO_GREETING[2]}
      </GlowText>
    </motion.div>
  );
}

/** 안개가 걷히듯 왼쪽에서 오른쪽으로 글자가 드러난다. */
function GlowText({ children, className, delay }: { children: ReactNode; className?: string; delay: number }) {
  return (
    <motion.p
      className={`font-eerie leading-[1.35] tracking-[0.1em] break-keep text-blossom-glow ${className ?? ""}`}
      initial={{ clipPath: "inset(-20% 100% -20% 0%)", opacity: 0.6 }}
      animate={{ clipPath: "inset(-20% 0% -20% 0%)", opacity: 1, transition: { duration: 1.8, delay, ease: [0.6, 0.05, 0.3, 1] } }}
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
      <motion.p {...reveal(0.2)} className="font-serif text-xs tracking-[0.6em] text-gold/90">
        {SERVICE.tagline}
      </motion.p>
      <motion.h1 {...reveal(0.5)} className="mt-3 font-brush text-[clamp(2.4rem,11vw,3.4rem)] leading-[1.2] tracking-[0.06em] break-keep">
        <span className="text-gold-gradient">
          {HERO_COPY.headline[0]}
          <br />
          {HERO_COPY.headline[1]}
        </span>
      </motion.h1>
      <motion.p {...reveal(0.9)} className="mt-4 font-serif text-[15px] leading-relaxed break-keep text-mist">
        {HERO_COPY.description}
      </motion.p>

      <motion.div {...reveal(1.4)} className="mt-8 flex w-full flex-col gap-3">
        <ButtonLink href="/start">{HERO_COPY.cta}</ButtonLink>
      </motion.div>
    </motion.div>
  );
}
