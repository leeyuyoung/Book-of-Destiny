import { useState } from "react";
import { occupationLabel, type AnalysisFormValues } from "@/lib/validation/analysisInput";
import { CheckboxField } from "../fields/CheckboxField";
import { Field, INPUT_BASE, inputBorder } from "../fields/Field";
import type { StepProps } from "./types";

type EmailStepProps = StepProps & {
  onEditStep: (stepIndex: number) => void;
};

export function EmailStep({ values, errors, update, onEditStep }: EmailStepProps) {
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false);

  return (
    <div className="flex flex-col gap-9">
      <Field
        label="이메일"
        htmlFor="email"
        error={errors.email}
        errorId="email-error"
        hint="결제 후 상세 리포트와 열람 링크를 이 주소로 보내드립니다. 다른 용도로는 사용하지 않습니다."
      >
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="example@email.com"
          value={values.email}
          onChange={(event) => update({ email: event.target.value })}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${INPUT_BASE} ${inputBorder(!!errors.email)}`}
        />
      </Field>

      <InputSummary values={values} onEditStep={onEditStep} />

      <div className="flex flex-col gap-4 rounded-2xl border border-line/70 p-5">
        <CheckboxField
          id="agree-privacy"
          checked={values.agreePrivacy}
          onChange={(agreePrivacy) => update({ agreePrivacy })}
          hasError={!!errors.agreePrivacy}
        >
          <span className="text-gold-soft">[필수]</span> 개인정보 수집·이용에 동의합니다
        </CheckboxField>
        <button
          type="button"
          onClick={() => setShowPrivacyDetail((visible) => !visible)}
          aria-expanded={showPrivacyDetail}
          className="self-start pl-8 text-xs text-mist underline underline-offset-4"
        >
          {showPrivacyDetail ? "내용 접기" : "내용 보기"}
        </button>
        {showPrivacyDetail && (
          <dl className="ml-8 grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-2 rounded-xl bg-night/60 p-4 text-xs leading-relaxed text-mist">
            <dt className="text-mist-dim">수집 항목</dt>
            <dd>이름, 생년월일, 출생시간, 성별, 직업 상태, 고민 내용, 이메일</dd>
            <dt className="text-mist-dim">이용 목적</dt>
            <dd>사주 계산, 맞춤 리포트 작성, 결제 확인, 리포트 이메일 발송</dd>
            <dt className="text-mist-dim">보유 기간</dt>
            <dd>리포트 열람 기간 종료 후 지체 없이 파기 (세부 기준은 개인정보처리방침에 따름)</dd>
          </dl>
        )}
        {errors.agreePrivacy && (
          <p role="alert" className="pl-8 text-xs text-fire">
            {errors.agreePrivacy}
          </p>
        )}

        <CheckboxField
          id="agree-age14"
          checked={values.agreeAge14}
          onChange={(agreeAge14) => update({ agreeAge14 })}
          hasError={!!errors.agreeAge14}
        >
          <span className="text-gold-soft">[필수]</span> 만 14세 이상입니다
        </CheckboxField>
        {errors.agreeAge14 && (
          <p role="alert" className="pl-8 text-xs text-fire">
            {errors.agreeAge14}
          </p>
        )}
      </div>
    </div>
  );
}

function InputSummary({
  values,
  onEditStep,
}: {
  values: AnalysisFormValues;
  onEditStep: (stepIndex: number) => void;
}) {
  const birthDate = `${values.birthYear}년 ${values.birthMonth}월 ${values.birthDay}일 (${
    values.calendarType === "solar" ? "양력" : values.isLeapMonth ? "음력 윤달" : "음력"
  })`;
  const birthTime = values.birthTimeUnknown
    ? "모름"
    : `${values.birthHour.padStart(2, "0")}:${values.birthMinute.padStart(2, "0")}`;
  const life =
    values.occupationStatus === ""
      ? "-"
      : `${occupationLabel(values.occupationStatus)}${values.occupation.trim() ? ` · ${values.occupation.trim()}` : ""}`;

  const rows = [
    { label: "이름", value: values.name.trim(), step: 0 },
    { label: "생년월일", value: birthDate, step: 0 },
    { label: "출생시간", value: birthTime, step: 0 },
    { label: "성별", value: values.gender === "female" ? "여성" : "남성", step: 0 },
    { label: "현재 상태", value: life, step: 1 },
    { label: "고민", value: values.concern.trim(), step: 2 },
  ];

  return (
    <section aria-label="입력 정보 확인" className="rounded-2xl border border-line/70 bg-night/40 p-5">
      <p className="text-xs tracking-widest text-gold/70">입력하신 정보</p>
      <dl className="mt-4 flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[4.5rem_1fr_auto] items-start gap-3 text-sm">
            <dt className="text-mist-dim">{row.label}</dt>
            <dd className="line-clamp-2 text-paper/85">{row.value}</dd>
            <button
              type="button"
              onClick={() => onEditStep(row.step)}
              className="text-xs text-mist underline-offset-4 hover:text-gold-soft hover:underline"
            >
              수정
            </button>
          </div>
        ))}
      </dl>
    </section>
  );
}
