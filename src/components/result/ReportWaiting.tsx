"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { BloomingBlossom } from "@/components/ui/BloomingBlossom";
import { REPORT_WRITING_MESSAGES } from "@/lib/constants/service";

const POLL_INTERVAL_MS = 3000;
const MESSAGE_INTERVAL_MS = 4000;
const GIVE_UP_AFTER_MS = 6 * 60 * 1000;
/** 리포트는 보통 1~2분 걸리니, 그동안 꽃이 천천히 거의 다 피도록 한다. 실제 진행률은 아니다. */
const BLOOM_TIME_CONSTANT_MS = 45 * 1000;
const MAX_PENDING_BLOOM = 0.95;

type Phase = "writing" | "failed";

/** 결제 후 리포트가 완성될 때까지 기다린다. 완성되면 서버 화면을 다시 불러온다. */
export function ReportWaiting({ token, failed }: { token: string; failed: boolean }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(failed ? "failed" : "writing");
  const [messageIndex, setMessageIndex] = useState(0);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (phase !== "writing") return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startedAt), 1000);
    return () => {
      window.clearInterval(timer);
      setElapsedMs(0);
    };
  }, [phase]);

  const bloom = Math.min(1 - Math.exp(-elapsedMs / BLOOM_TIME_CONSTANT_MS), MAX_PENDING_BLOOM);

  useEffect(() => {
    if (phase !== "writing") return;
    const startedAt = Date.now();
    let active = true;
    const poll = async () => {
      while (active) {
        await new Promise((resolve) => window.setTimeout(resolve, POLL_INTERVAL_MS));
        if (!active) return;
        if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
          setPhase("failed");
          return;
        }
        try {
          const response = await fetch(`/api/analysis/${token}`, { cache: "no-store" });
          const data = (await response.json()) as { status?: string; reportReady?: boolean };
          if (data.reportReady) {
            router.refresh();
            return;
          }
          if (data.status === "failed") {
            setPhase("failed");
            return;
          }
        } catch {
          // 일시적인 네트워크 오류는 다음 확인에서 다시 시도한다.
        }
      }
    };
    void poll();
    return () => {
      active = false;
    };
  }, [phase, token, router]);

  useEffect(() => {
    if (phase !== "writing") return;
    const timer = window.setInterval(
      () => setMessageIndex((index) => Math.min(index + 1, REPORT_WRITING_MESSAGES.length - 1)),
      MESSAGE_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [phase]);

  const retry = useCallback(async () => {
    setRetryError(null);
    try {
      const response = await fetch(`/api/analysis/${token}`, { method: "POST" });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        setRetryError(data.message ?? "다시 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      setMessageIndex(0);
      setPhase("writing");
    } catch {
      setRetryError("네트워크 연결을 확인해주세요.");
    }
  }, [token]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 py-24 text-center">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-line animate-spin-celestial" />
        <div className="absolute inset-0 rounded-full bg-cinnabar/10 blur-2xl animate-breathe" />
        <BloomingBlossom bloom={bloom} size={128} />
      </div>

      <AnimatePresence mode="wait">
        {phase === "writing" ? (
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.9 }}
            className="flex flex-col gap-3"
          >
            <p className="font-serif text-lg font-light leading-relaxed text-paper">{REPORT_WRITING_MESSAGES[messageIndex]}</p>
            <p className="text-xs text-mist-dim">보통 1~2분 걸려요. 이 화면을 닫아도 리포트는 이메일로 보내드려요.</p>
          </motion.div>
        ) : (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full max-w-xs flex-col items-center gap-6"
          >
            <p className="font-serif text-base leading-relaxed text-paper">
              꽃을 펼치다 잠시 바람이 불었구나.
              <br />
              <span className="text-mist">결제는 안전하게 완료되었으니, 다시 펼쳐 보거라.</span>
            </p>
            <Button onClick={retry}>다시 펼치기</Button>
            {retryError && (
              <p role="alert" className="text-xs text-cinnabar">
                {retryError}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
