"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeroineBackdrop, type HeroineScene } from "@/components/night/HeroineBackdrop";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SpeechBubble, type Bubble } from "@/components/webtoon/SpeechBubble";
import {
  clearAnalysisToken,
  clearPendingAnalysis,
  loadAnalysisToken,
  loadPendingAnalysis,
  saveAnalysisToken,
} from "@/lib/client/inputStorage";
import { ANALYSIS_SCRIPT } from "@/lib/constants/service";
import { analysisInputSchema } from "@/lib/validation/analysisInput";

type Beat = { scene: HeroineScene; ms: number; bubbles: Bubble[] };

/** 두 손을 쥐었다가, 그 손을 머리 위로 들어 벽에 누르는 두 컷 */
const BEATS = [
  {
    scene: "pinHands",
    ms: 4200,
    bubbles: [
      { kind: "speech", text: ANALYSIS_SCRIPT.hold, at: 0.6, place: { top: "6%", left: "5%" }, tail: "bottom-right" },
      { kind: "thought", text: ANALYSIS_SCRIPT.flustered, at: 2.1, place: { top: "52%", right: "6%" } },
    ],
  },
  {
    scene: "pinRaised",
    ms: 5000,
    bubbles: [
      { kind: "sfx", text: ANALYSIS_SCRIPT.pin, at: 0.2, place: { top: "3%", right: "24%" } },
      { kind: "speech", text: ANALYSIS_SCRIPT.doubt, at: 0.9, place: { top: "38%", right: "4%" }, tail: "top-right" },
      { kind: "whisper", text: ANALYSIS_SCRIPT.tease, at: 2.6, place: { top: "56%", left: "5%" }, tail: "top-right" },
    ],
  },
] as const satisfies readonly Beat[];

const SCENES = BEATS.map((beat) => beat.scene);
/** 계산은 금방 끝나지만, 의식처럼 보이도록 두 컷이 모두 지나갈 때까지는 보여준다. */
const MIN_RITUAL_MS = BEATS.reduce((total, beat) => total + beat.ms, 0);
const REDIRECT_DELAY_MS = 1400;
const POLL_INTERVAL_MS = 2000;
const GIVE_UP_AFTER_MS = 60 * 1000;
/** 진행 바가 대략 이 시간에 63%쯤 차도록 한다. 실제 진행률이 아니라 기다림을 보여주는 장치다. */
const PROGRESS_TIME_CONSTANT_MS = 3200;
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
    if (response.ok && data.token) return { token: data.token };
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
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "working" });
  const [beatIndex, setBeatIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedRef = useRef(false);
  const activeRef = useRef(true);
  const startTimeRef = useRef(0);

  const begin = useCallback(() => {
    const startedAt = Date.now();
    startTimeRef.current = startedAt;
    setElapsedMs(0);
    setBeatIndex(0);
    setPhase({ kind: "working" });
    void runAnalysis(() => activeRef.current, startedAt).then(async (next) => {
      if (!next || !activeRef.current) return;
      if (next.kind === "ready") {
        await wait(Math.max(0, MIN_RITUAL_MS - (Date.now() - startedAt)));
        if (!activeRef.current) return;
        setPhase(next);
        await wait(REDIRECT_DELAY_MS);
        if (activeRef.current) router.replace(`/result/${next.token}`);
        return;
      }
      setPhase(next);
    });
  }, [router]);

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
  const lastBeat = BEATS.length - 1;

  useEffect(() => {
    if (!working || beatIndex >= lastBeat) return;
    const timer = window.setTimeout(() => setBeatIndex((index) => index + 1), BEATS[beatIndex].ms);
    return () => window.clearTimeout(timer);
  }, [working, beatIndex, lastBeat]);

  useEffect(() => {
    if (!working) return;
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startTimeRef.current), 1000);
    return () => window.clearInterval(timer);
  }, [working]);

  const progress =
    phase.kind === "ready"
      ? 1
      : Math.min(1 - Math.exp(-elapsedMs / PROGRESS_TIME_CONSTANT_MS), MAX_PENDING_PROGRESS);
  const beat = BEATS[beatIndex];
  const showBubbles = phase.kind === "working" || phase.kind === "ready";

  return (
    <div className="relative flex flex-1 flex-col text-center">
      <HeroineBackdrop scenes={SCENES} scene={beat.scene} fadeMs={700} />

      <div
        role="progressbar"
        aria-label="사주를 읽는 중"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="fixed inset-x-0 top-[env(safe-area-inset-top)] z-30 h-[3px] bg-paper/10"
      >
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-[#fff3dc] via-blossom-glow to-blossom shadow-[0_0_12px_rgb(232_143_176_/_0.8)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </div>

      <div className="pointer-events-none fixed inset-y-0 left-1/2 z-10 w-full -translate-x-1/2 landscape:w-[56.25vh]">
        <AnimatePresence>
          {showBubbles &&
            beat.bubbles.map((bubble) => <SpeechBubble key={`${beat.scene}-${bubble.text}`} bubble={bubble} />)}
        </AnimatePresence>
      </div>

      <div className="relative z-20 mt-auto flex min-h-40 flex-col items-center justify-end px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {phase.kind === "ready" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="flex w-full max-w-xs flex-col items-center gap-6"
            >
              <p className="font-serif text-lg font-light leading-relaxed [text-shadow:0_1px_10px_rgba(10,6,20,0.9)]">
                다 찾았다. 네가 숨긴 데까지.
                <br />
                <span className="text-gold-gradient">이제… 하나씩 벗겨 주마.</span>
              </p>
              <ButtonLink href={`/result/${phase.token}`}>숨김없이 보여줘</ButtonLink>
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
    </div>
  );
}
