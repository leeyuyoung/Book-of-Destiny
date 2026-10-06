import { useState } from "react";
import { CheckboxField } from "../fields/CheckboxField";
import { pillClass } from "../fields/ChoiceChips";
import { FieldError } from "../fields/Field";
import type { StepProps } from "./types";

const CALENDAR_OPTIONS = [
  { value: "solar", label: "양력" },
  { value: "lunar", label: "음력" },
] as const;

/** 숫자 8자리를 1996.04.17 모양으로 보여준다. */
function formatDigits(digits: string) {
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}

function initialDigits({ birthYear, birthMonth, birthDay }: StepProps["values"]) {
  if (!birthYear || !birthMonth || !birthDay) return "";
  return `${birthYear}${birthMonth.padStart(2, "0")}${birthDay.padStart(2, "0")}`;
}

export function BirthDateStep({ values, errors, update }: StepProps) {
  const [digits, setDigits] = useState(() => initialDigits(values));
  const error = errors.birthDate ?? errors.isLeapMonth;

  const changeDigits = (raw: string) => {
    const next = raw.replace(/\D/g, "").slice(0, 8);
    setDigits(next);
    if (next.length === 8) {
      update({
        birthYear: next.slice(0, 4),
        birthMonth: String(Number(next.slice(4, 6))),
        birthDay: String(Number(next.slice(6, 8))),
      });
    } else {
      update({ birthYear: "", birthMonth: "", birthDay: "" });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <input
          id="birth-date"
          type="text"
          inputMode="numeric"
          autoComplete="bday"
          aria-label="생년월일 (예: 1996.04.17)"
          placeholder="1996.04.17"
          value={formatDigits(digits)}
          onChange={(event) => changeDigits(event.target.value)}
          aria-invalid={!!errors.birthDate}
          aria-describedby={error ? "birth-date-error" : undefined}
          className="min-w-0 flex-1 bg-transparent font-serif text-2xl tracking-[0.06em] text-paper placeholder:text-mist-dim/50 focus:outline-none"
        />
        <div role="radiogroup" aria-label="달력 유형" className="flex shrink-0 gap-1.5">
          {CALENDAR_OPTIONS.map((option) => {
            const selected = values.calendarType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() =>
                  update({ calendarType: option.value, ...(option.value === "solar" ? { isLeapMonth: false } : {}) })
                }
                className={`h-11 px-4 text-sm ${pillClass(selected)}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-px bg-line" />
      {values.calendarType === "lunar" && (
        <CheckboxField id="leap-month" checked={values.isLeapMonth} onChange={(isLeapMonth) => update({ isLeapMonth })}>
          윤달이에요 <span className="text-mist-dim">(음력 생일이 윤달일 때만)</span>
        </CheckboxField>
      )}
      <FieldError id="birth-date-error" message={error} />
    </div>
  );
}
