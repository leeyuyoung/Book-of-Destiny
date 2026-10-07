"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { HeroineBackdrop } from "@/components/night/HeroineBackdrop";
import { Button } from "@/components/ui/Button";
import { clearDraft, loadDraft, saveDraft, savePendingAnalysis } from "@/lib/client/inputStorage";
import { INPUT_STEPS, SERVICE } from "@/lib/constants/service";
import {
  toAnalysisInput,
  validateStep,
  type AnalysisFormValues,
  type FieldErrors,
} from "@/lib/validation/analysisInput";
import { BirthDateStep } from "./steps/BirthDateStep";
import { BirthTimeStep } from "./steps/BirthTimeStep";
import { GenderStep } from "./steps/GenderStep";
import { LoveStep } from "./steps/LoveStep";
import { NameStep } from "./steps/NameStep";
import type { StepProps } from "./steps/types";

const STEP_COMPONENTS: ReadonlyArray<(props: StepProps) => ReactNode> = [
  BirthDateStep,
  BirthTimeStep,
  GenderStep,
  NameStep,
  LoveStep,
];

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function InputWizard() {
  const router = useRouter();
  const [initialDraft] = useState(loadDraft);
  const [values, setValues] = useState<AnalysisFormValues>(initialDraft.values);
  const [stepIndex, setStepIndex] = useState(initialDraft.stepIndex);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const step = INPUT_STEPS[stepIndex];
  const StepComponent = STEP_COMPONENTS[stepIndex];
  const isLastStep = stepIndex === INPUT_STEPS.length - 1;
  const errors: FieldErrors = showErrors ? validateStep(stepIndex, values) : {};

  useEffect(() => {
    if (!submitting) saveDraft({ values, stepIndex });
  }, [values, stepIndex, submitting]);

  const update = (patch: Partial<AnalysisFormValues>) => setValues((previous) => ({ ...previous, ...patch }));

  const moveTo = (nextIndex: number) => {
    setShowErrors(false);
    setStepIndex(nextIndex);
  };

  const revealFirstError = () => {
    window.requestAnimationFrame(() => {
      const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]');
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (Object.keys(validateStep(stepIndex, values)).length > 0) {
      setShowErrors(true);
      revealFirstError();
      return;
    }

    if (!isLastStep) {
      moveTo(stepIndex + 1);
      return;
    }

    const result = toAnalysisInput(values);
    if (!result.ok) {
      moveTo(result.stepIndex);
      setShowErrors(true);
      return;
    }

    setSubmitting(true);
    savePendingAnalysis(result.input);
    clearDraft();
    router.push("/analyzing");
  };

  const goBack = () => {
    if (stepIndex === 0) router.push("/");
    else moveTo(stepIndex - 1);
  };

  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col">
      <HeroineBackdrop />

      <header className="relative z-10 grid grid-cols-[3rem_1fr_3rem] items-center px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={goBack}
          aria-label={stepIndex === 0 ? "처음으로" : "이전 질문"}
          className="flex h-12 w-12 items-center justify-center text-paper/90 transition-colors hover:text-paper"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-center font-serif text-[15px] tracking-[0.2em] text-paper/90">{SERVICE.name}</p>
        <span />
      </header>
      <div className="relative z-10 mx-5 mt-1 h-0.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
        <div
          className="h-full rounded-full bg-cinnabar/80 transition-[width] duration-700"
          style={{ width: `${((stepIndex + 1) / INPUT_STEPS.length) * 100}%` }}
        />
      </div>

      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className="relative z-10 mt-auto w-full bg-gradient-to-t from-ink via-ink/85 to-transparent px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-16"
      >
        <div className="mx-auto w-full max-w-md">
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={stepIndex}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex flex-col gap-6"
            >
              <header className="flex flex-col gap-2">
                <p className="font-serif text-sm tracking-[0.04em] text-mist">{step.sub}</p>
                <h1 className="font-eerie text-[clamp(1.5rem,6.6vw,1.9rem)] leading-snug tracking-[0.02em] break-keep text-paper [text-shadow:0_0_24px_rgb(232_137_155/0.35)]">
                  {step.question}
                </h1>
              </header>
              <StepComponent values={values} errors={errors} update={update} />
            </motion.section>
          </AnimatePresence>

          <Button type="submit" variant="light" disabled={submitting} className="mt-7">
            {isLastStep ? (submitting ? "꽃을 펼치는 중…" : "내 꽃 읽어주기") : "다음으로"}
          </Button>
          {isLastStep && (
            <p className="mt-3 text-center text-[11px] leading-relaxed text-mist-dim">
              만 14세 이상만 이용할 수 있어요 · 들려준 이야기는 사주 풀이에만 쓰여요
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
