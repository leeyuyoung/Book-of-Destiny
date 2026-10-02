"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { INPUT_STEPS } from "@/lib/constants/service";
import { StepProgress } from "./StepProgress";

const STEP_FIELDS_PREVIEW: Record<number, string[]> = {
  1: ["이름", "생년월일 (년 · 월 · 일)", "출생시간 (시 · 분) / 출생시간 모름", "양력 · 음력 · 윤달", "성별"],
  2: ["현재 직업 상태 선택", "하고 있는 일 (직장인 · 사업 · 프리랜서 · 기타 선택 시)"],
  3: ["지금의 고민 (자유 서술)"],
  4: ["이메일 주소", "개인정보 수집·이용 동의"],
};

export function InputWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const step = INPUT_STEPS[stepIndex];
  const isLastStep = stepIndex === INPUT_STEPS.length - 1;

  const goNext = () => {
    if (isLastStep) {
      router.push("/analyzing");
      return;
    }
    setDirection(1);
    setStepIndex((index) => index + 1);
  };

  const goBack = () => {
    if (stepIndex === 0) {
      router.push("/about");
      return;
    }
    setDirection(-1);
    setStepIndex((index) => index - 1);
  };

  return (
    <div className="flex flex-1 flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
      <StepProgress current={step.step} total={INPUT_STEPS.length} />

      <div className="relative flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={step.step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: direction * -24, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col gap-10 pt-12"
          >
            <header className="flex flex-col gap-4">
              <span className="font-display text-xs tracking-[0.4em] text-gold/80">{step.eyebrow}</span>
              <h1 className="font-serif text-[26px] font-light leading-snug">{step.title}</h1>
              <p className="text-sm leading-relaxed text-mist">{step.description}</p>
            </header>

            <div className="rounded-2xl border border-dashed border-line p-6">
              <p className="mb-4 text-xs tracking-wide text-gold/70">이 단계에 들어갈 입력 항목 (PHASE 3에서 구현)</p>
              <ul className="flex flex-col gap-3">
                {STEP_FIELDS_PREVIEW[step.step].map((field) => (
                  <li key={field} className="flex items-center gap-3 text-sm text-mist">
                    <span className="h-1 w-1 rounded-full bg-gold/60" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex gap-3">
        <Button variant="ghost" onClick={goBack} className="w-auto! shrink-0 px-6!">
          이전
        </Button>
        <Button onClick={goNext}>{isLastStep ? "분석 시작" : "다음"}</Button>
      </div>
    </div>
  );
}
