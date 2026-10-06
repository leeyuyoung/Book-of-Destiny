"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";
import {
  clearAnalysisToken,
  clearPendingAnalysis,
  loadAnalysisToken,
  loadPendingAnalysis,
  saveAnalysisToken,
} from "@/lib/client/inputStorage";
import { ANALYSIS_MESSAGES } from "@/lib/constants/service";
import { analysisInputSchema } from "@/lib/validation/analysisInput";

const MESSAGE_INTERVAL_MS = 2600;
const POLL_INTERVAL_MS = 2000;
const GIVE_UP_AFTER_MS = 6 * 60 * 1000;
/** 진행 원이 대략 이 시간에 63%쯤 차도록 한다. 실제 진행률이 아니라 기다림을 보여주는 장치다. */
const PROGRESS_TIME_CONSTANT_MS = 25_000;
const MAX_PENDING_PROGRESS = 0.95;

type Phase =
  | { kind: "working" }
  | { kind: "ready"; token: string }
  | { kind: "error"; message: string; canRetry: boolean }
  | { kind: "missing" };

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** 보관된 입력으로 분석을 요청한다. 성공하면 토큰, 실패하면 보여줄 화면 상태를 돌려준다. */
async function submitPending(): Promise<{ token: string } | { phase: Phase }> {
  const pending = analysisInputSchema.safeParse(loadPendingAnalysis());
  if (!pending.success) return { phase: { kind: "missing" } };
  try {
    const response = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending.data),
    });
    const data = (await response.json().catch(() => ({}))) as { token?: string; message?: string };
    if (response.status === 202 && data.token) return { token: data.token };
    return {
      phase: {
        kind: "error",
        message: data.message ?? "분석을 시작하지 못했습니다.",
        canRetry: response.status === 429 || response.status >= 500,
      },
    };
  } catch {
    return { phase: { kind: "error", message: "네트워크 연결을 확인해주세요.", canRetry: true } };
  }
}

async function fetchStatus(token: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/analysis/${token}`, { cache: "no-store" });
    return ((await response.json()) as { status: string }).status;
  } catch {
    return null;
  }
}

/** 분석 요청부터 완성 확인까지 진행한다. 서버가 토큰을 잃어버린 경우(재시작 등) 한 번 다시 요청한다. */
async function runAnalysis(isActive: () => boolean, startedAt: number): Promise<Phase | null> {
  let token = loadAnalysisToken();
  let resubmitted = false;
  while (isActive()) {
    if (!token) {
      const submitted = await submitPending();
      if ("phase" in submitted) return submitted.phase;
      token = submitted.token;
      saveAnalysisToken(token);
    }
    if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
      return { kind: "error", message: "분석이 평소보다 오래 걸리고 있습니다.", canRetry: true };
    }
    const status = await fetchStatus(token);
    if (status === "ready") {
      clearPendingAnalysis();
      clearAnalysisToken();
      return { kind: "ready", token };
    }
    if (status === "failed") {
      clearAnalysisToken();
      return { kind: "error", message: "리포트를 쓰는 중에 문제가 생겼습니다.", canRetry: true };
    }
    if (status === "not_found") {
      clearAnalysisToken();
      if (resubmitted) return { kind: "error", message: "분석 기록을 찾지 못했습니다.", canRetry: true };
      resubmitted = true;
      token = null;
      continue;
    }
    await wait(POLL_INTERVAL_MS);
  }
  return null;
}

export function AnalyzingExperience() {
  const [phase, setPhase] = useState<Phase>({ kind: "working" });
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedRef = useRef(false);
  const activeRef = useRef(true);
  const startTimeRef = useRef(0);

  const begin = useCallback(() => {
    const startedAt = Date.now();
    startTimeRef.current = startedAt;
    setElapsedMs(0);
    setMessageIndex(0);
    setPhase({ kind: "working" });
    void runAnalysis(() => activeRef.current, startedAt).then((next) => {
      if (next && activeRef.current) setPhase(next);
    });
  }, []);

  useEffect(() => {
    activeRef.current = true;
    if (!startedRef.current) {
      startedRef.current = true;
      begin();
    }
    return () => {
      activeRef.current = false;
    };
  }, [begin]);

  const working = phase.kind === "working";
  const lastMessage = ANALYSIS_MESSAGES.length - 1;

  useEffect(() => {
    if (!working || messageIndex >= lastMessage) return;
    const timer = window.setTimeout(() => setMessageIndex((index) => index + 1), MESSAGE_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [working, messageIndex, lastMessage]);

  useEffect(() => {
    if (!working) return;
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startTimeRef.current), 1000);
    return () => window.clearInterval(timer);
  }, [working]);

  const progress =
    phase.kind === "ready"
      ? 1
      : Math.min(1 - Math.exp(-elapsedMs / PROGRESS_TIME_CONSTANT_MS), MAX_PENDING_PROGRESS);
  const listIndex = phase.kind === "ready" ? ANALYSIS_MESSAGES.length : messageIndex;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-14 py-16 text-center">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgb(214 176 122 / 0.14)" strokeWidth="1" />
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
              <stop offset="0%" stopColor="#fff3dc" />
              <stop offset="100%" stopColor="#e8899b" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-6 rounded-full border border-line animate-spin-celestial" />
        <div className="absolute inset-0 rounded-full bg-gold/5 blur-2xl animate-breathe" />
        <LogoMark size={72} className="relative animate-breathe" />
      </div>

      <div className="flex min-h-24 flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {phase.kind === "working" && (
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
          )}
          {phase.kind === "ready" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="flex w-full max-w-xs flex-col items-center gap-8"
            >
              <p className="font-serif text-lg font-light leading-relaxed">
                네 꽃의 첫 잎이
                <br />
                <span className="text-gold-gradient">피어났구나.</span>
              </p>
              <ButtonLink href={`/result/${phase.token}`}>내 꽃 보러 가기</ButtonLink>
            </motion.div>
          )}
          {phase.kind === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex w-full max-w-xs flex-col items-center gap-6"
            >
              <p role="alert" className="font-serif text-base leading-relaxed text-paper">
                {phase.message}
              </p>
              {phase.canRetry ? (
                <Button onClick={begin}>다시 시도하기</Button>
              ) : (
                <ButtonLink href="/start">입력 다시 확인하기</ButtonLink>
              )}
            </motion.div>
          )}
          {phase.kind === "missing" && (
            <motion.div
              key="missing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex w-full max-w-xs flex-col items-center gap-6"
            >
              <p className="font-serif text-base leading-relaxed text-paper">
                아직 네 이야기를 듣지 못했구나.
                <br />
                <span className="text-mist">처음부터 다시 들려주겠느냐?</span>
              </p>
              <ButtonLink href="/start">정보 입력하기</ButtonLink>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ol className="flex flex-col gap-2 text-left">
        {ANALYSIS_MESSAGES.map((message, index) => (
          <li
            key={message}
            className={`flex items-center gap-3 text-xs transition-colors duration-700 ${
              index < listIndex ? "text-gold/70" : index === listIndex ? "text-paper" : "text-mist-dim/50"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rotate-45 border transition-all duration-700 ${
                index < listIndex ? "border-gold bg-gold/70" : "border-mist-dim/50"
              }`}
            />
            {message}
          </li>
        ))}
      </ol>
    </div>
  );
}
