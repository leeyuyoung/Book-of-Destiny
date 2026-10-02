import { AnimatePresence, motion } from "motion/react";
import {
  OCCUPATION_DETAIL_REQUIRED,
  OCCUPATION_MAX_LENGTH,
  OCCUPATION_STATUSES,
  type OccupationStatus,
} from "@/lib/validation/analysisInput";
import { Field, INPUT_BASE, inputBorder } from "../fields/Field";
import type { StepProps } from "./types";

const DETAIL_PLACEHOLDER: Partial<Record<OccupationStatus, string>> = {
  student: "예: 대학교 경영학과 3학년, 진로를 고민 중",
  job_seeking: "예: 게임 회사 기획 직무, 준비한 지 1년째",
  employee: "예: IT 회사 마케팅팀 5년차, 이직을 고민 중",
  business_owner: "예: 동네에서 카페를 3년째 운영하고 있어요",
  freelancer: "예: 영상 편집 프리랜서, 수입이 들쭉날쭉해요",
  other: "지금 하고 계신 일을 편하게 적어주세요",
};

const DETAIL_COPY = {
  job_seeking: {
    label: "어떤 분야로 취업하고 싶으신가요?",
    hint: "희망하는 업종이나 직무, 준비 기간을 함께 적어주시면 취업운 풀이가 더 구체적이 됩니다.",
  },
  student: {
    label: "어떤 학과(전공)에서 공부하고 계신가요?",
    hint: "학교 종류와 학과, 학년을 함께 적어주시면 진로·직업운 풀이가 더 구체적이 됩니다. 고등학생이라면 문과·이과 등으로 적어주세요.",
  },
  default: {
    label: "현재 어떤 일을 하고 계신가요?",
    hint: "하는 일과 연차, 요즘의 상황을 함께 적어주시면 직업운 풀이가 더 구체적이 됩니다.",
  },
} as const;

export function LifeStep({ values, errors, update }: StepProps) {
  const status = values.occupationStatus;
  const needsDetail = status !== "" && OCCUPATION_DETAIL_REQUIRED.has(status);
  const detailCopy =
    status === "student" ? DETAIL_COPY.student : status === "job_seeking" ? DETAIL_COPY.job_seeking : DETAIL_COPY.default;

  return (
    <div className="flex flex-col gap-9">
      <Field label="현재 상태" error={errors.occupationStatus} errorId="occupation-status-error">
        <div
          role="radiogroup"
          aria-label="현재 직업 상태"
          aria-describedby={errors.occupationStatus ? "occupation-status-error" : undefined}
          className="grid grid-cols-2 gap-2"
        >
          {OCCUPATION_STATUSES.map((option) => {
            const selected = option.value === status;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update({ occupationStatus: option.value })}
                className={`h-14 rounded-xl border font-serif text-[15px] tracking-wide transition-all duration-300 ${
                  selected
                    ? "border-gold/70 bg-gradient-to-b from-gold/20 to-gold/5 text-gold-soft shadow-[0_0_24px_-10px_rgb(200_169_106_/_0.7)]"
                    : errors.occupationStatus
                      ? "border-fire/50 bg-night/70 text-mist"
                      : "border-line bg-night/70 text-mist hover:border-gold/40 hover:text-paper"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </Field>

      <AnimatePresence initial={false}>
        {needsDetail && (
          <motion.div
            key="occupation-detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Field
              label={detailCopy.label}
              htmlFor="occupation"
              error={errors.occupation}
              errorId="occupation-error"
              hint={detailCopy.hint}
            >
              <input
                id="occupation"
                type="text"
                maxLength={OCCUPATION_MAX_LENGTH}
                placeholder={DETAIL_PLACEHOLDER[status as OccupationStatus]}
                value={values.occupation}
                onChange={(event) => update({ occupation: event.target.value })}
                aria-invalid={!!errors.occupation}
                aria-describedby={errors.occupation ? "occupation-error" : undefined}
                className={`${INPUT_BASE} ${inputBorder(!!errors.occupation)}`}
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
