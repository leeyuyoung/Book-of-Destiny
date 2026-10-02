"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";
import { ANALYSIS_MESSAGES } from "@/lib/constants/service";

const MESSAGE_INTERVAL_MS = 2600;

export function AnalyzingExperience() {
  const [messageIndex, setMessageIndex] = useState(0);
  const done = messageIndex >= ANALYSIS_MESSAGES.length;

  useEffect(() => {
    if (done) return;
    const timer = window.setTimeout(() => setMessageIndex((index) => index + 1), MESSAGE_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [messageIndex, done]);

  const progress = Math.min(messageIndex / ANALYSIS_MESSAGES.length, 1);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-14 py-16 text-center">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgb(217 164 65 / 0.14)" strokeWidth="1" />
          <motion.circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="url(#progress-gold)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="progress-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbe7b0" />
              <stop offset="100%" stopColor="#c42b1f" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-6 rounded-full border border-line animate-spin-celestial" />
        <div className="absolute inset-0 rounded-full bg-gold/5 blur-2xl animate-breathe" />
        <LogoMark size={72} className="relative animate-breathe" />
      </div>

      <div className="flex min-h-24 flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.9 }}
              className="font-serif text-lg font-light leading-relaxed text-paper"
            >
              {ANALYSIS_MESSAGES[messageIndex]}
            </motion.p>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="flex w-full max-w-xs flex-col items-center gap-8"
            >
              <p className="font-serif text-lg font-light leading-relaxed">
                당신의 첫 페이지가
                <br />
                <span className="text-gold-gradient">완성되었습니다.</span>
              </p>
              <ButtonLink href="/result/sample">첫 장 읽기</ButtonLink>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ol className="flex flex-col gap-2 text-left">
        {ANALYSIS_MESSAGES.map((message, index) => (
          <li
            key={message}
            className={`flex items-center gap-3 text-xs transition-colors duration-700 ${
              index < messageIndex ? "text-gold/70" : index === messageIndex ? "text-paper" : "text-mist-dim/50"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rotate-45 border transition-all duration-700 ${
                index < messageIndex ? "border-gold bg-gold/70" : "border-mist-dim/50"
              }`}
            />
            {message}
          </li>
        ))}
      </ol>

      <p className="text-[11px] text-mist-dim">지금은 화면 흐름 확인용 데모입니다. (PHASE 7에서 실제 분석과 연결)</p>
    </div>
  );
}
