"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { clearDraft, loadDraft, saveDraft, savePendingAnalysis } from "@/lib/client/inputStorage";
import { INPUT_STEPS } from "@/lib/constants/service";
import {
  toAnalysisInput,
  validateStep,
  type AnalysisFormValues,
  type FieldErrors,
} from "@/lib/validation/analysisInput";
import { StepProgress } from "./StepProgress";
import { BirthStep } from "./steps/BirthStep";
import { ConcernStep } from "./steps/ConcernStep";
import { EmailStep } from "./steps/EmailStep";
import { LifeStep } from "./steps/LifeStep";

export default function InputWizard() {
  const router = useRouter();
  const [initialDraft] = useState(loadDraft);
  const [values, setValues] = useState<AnalysisFormValues>(initialDraft.values);
  const [stepIndex, setStepIndex] = useState(initialDraft.stepIndex);
  const [direction, setDirection] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const step = INPUT_STEPS[stepIndex];
  const isLastStep = stepIndex === INPUT_STEPS.length - 1;
  const errors: FieldErrors = showErrors ? validateStep(stepIndex, values) : {};

  useEffect(() => {
    if (!submitting) saveDraft({ values, stepIndex });
  }, [values, stepIndex, submitting]);

  const update = (patch: Partial<AnalysisFormValues>) => setValues((previous) => ({ ...previous, ...patch }));

  const moveTo = (nextIndex: number) => {
    setDirection(nextIndex > stepIndex ? 1 : -1);
    setShowErrors(false);
    setStepIndex(nextIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const revealFirstError = () => {
    window.requestAnimationFrame(() => {
      const form = formRef.current;
      const target = form?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]');
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target && "focus" in target && target.matches("input, select, textarea")) target.focus({ preventScroll: true });
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const stepErrors = validateStep(stepIndex, values);
    if (Object.keys(stepErrors).length > 0) {
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
      revealFirstError();
      return;
    }

    setSubmitting(true);
    savePendingAnalysis(result.input);
    clearDraft();
    router.push("/analyzing");
  };

  const goBack = () => {
    if (stepIndex === 0) {
      router.push("/about");
      return;
    }
    moveTo(stepIndex - 1);
  };

  const stepProps = { values, errors, update };

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6"
    >
      <StepProgress current={step.step} total={INPUT_STEPS.length} />

      <div className="relative flex-1">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.section
            key={step.step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: direction * -24, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col gap-10 pt-12"
          >
            <header className="flex flex-col gap-4">
              <span className="font-display text-xs tracking-[0.4em] text-gold/80">{step.eyebrow}</span>
              <h1 className="font-serif text-[26px] font-light leading-snug">{step.title}</h1>
              <p className="text-sm leading-relaxed text-mist">{step.description}</p>
            </header>

            {stepIndex === 0 && <BirthStep {...stepProps} />}
            {stepIndex === 1 && <LifeStep {...stepProps} />}
            {stepIndex === 2 && <ConcernStep {...stepProps} />}
            {stepIndex === 3 && <EmailStep {...stepProps} onEditStep={moveTo} />}
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none sticky bottom-0 -mx-5 mt-12 flex gap-3 bg-gradient-to-t from-ink via-ink/95 to-transparent px-5 pb-2 pt-6">
        <Button type="button" variant="ghost" onClick={goBack} className="pointer-events-auto w-auto! shrink-0 px-6!">
          이전
        </Button>
        <Button type="submit" disabled={submitting} className="pointer-events-auto">
          {isLastStep ? (submitting ? "책을 펼치는 중…" : "분석 시작") : "다음"}
        </Button>
      </div>
    </form>
  );
}
