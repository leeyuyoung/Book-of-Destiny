import { hourBranchOf } from "@/lib/constants/time";
import { MIN_BIRTH_YEAR, NAME_MAX_LENGTH, daysInMonth } from "@/lib/validation/analysisInput";
import { CheckboxField } from "../fields/CheckboxField";
import { Field, INPUT_BASE, inputBorder } from "../fields/Field";
import { SegmentedControl } from "../fields/SegmentedControl";
import { SelectInput } from "../fields/SelectInput";
import type { StepProps } from "./types";

const CALENDAR_OPTIONS = [
  { value: "solar", label: "양력" },
  { value: "lunar", label: "음력" },
] as const;

const GENDER_OPTIONS = [
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: `${index + 1}월` }));

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour),
  label: `${pad(hour)}시 · ${hourBranchOf(hour).name}`,
}));

const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, minute) => ({ value: String(minute), label: `${pad(minute)}분` }));

export function BirthStep({ values, errors, update }: StepProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - MIN_BIRTH_YEAR + 1 }, (_, index) => {
    const year = currentYear - index;
    return { value: String(year), label: `${year}년` };
  });

  const maxDay =
    values.birthYear && values.birthMonth
      ? daysInMonth(values.calendarType, Number(values.birthYear), Number(values.birthMonth))
      : 31;
  const dayOptions = Array.from({ length: maxDay }, (_, index) => ({ value: String(index + 1), label: `${index + 1}일` }));

  const updateDate = (patch: Partial<Pick<StepProps["values"], "birthYear" | "birthMonth" | "calendarType">>) => {
    const next = { ...values, ...patch };
    const nextMax =
      next.birthYear && next.birthMonth
        ? daysInMonth(next.calendarType, Number(next.birthYear), Number(next.birthMonth))
        : 31;
    const dayOverflow = next.birthDay !== "" && Number(next.birthDay) > nextMax;
    update({
      ...patch,
      ...(dayOverflow ? { birthDay: "" } : {}),
      ...(patch.calendarType === "solar" ? { isLeapMonth: false } : {}),
    });
  };

  const hourBranch = values.birthHour !== "" ? hourBranchOf(Number(values.birthHour)) : null;

  return (
    <div className="flex flex-col gap-9">
      <Field label="이름" htmlFor="name" error={errors.name} errorId="name-error">
        <input
          id="name"
          type="text"
          autoComplete="name"
          maxLength={NAME_MAX_LENGTH}
          placeholder="이름을 입력해주세요"
          value={values.name}
          onChange={(event) => update({ name: event.target.value })}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${INPUT_BASE} ${inputBorder(!!errors.name)}`}
        />
      </Field>

      <Field label="생년월일" error={errors.birthDate ?? errors.isLeapMonth} errorId="birth-date-error">
        <SegmentedControl
          name="달력 유형"
          value={values.calendarType}
          options={CALENDAR_OPTIONS}
          onChange={(calendarType) => updateDate({ calendarType })}
        />
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2">
          <SelectInput
            aria-label="태어난 해"
            placeholder="년"
            options={yearOptions}
            value={values.birthYear}
            onChange={(event) => updateDate({ birthYear: event.target.value })}
            hasError={!!errors.birthDate && !values.birthYear}
            aria-invalid={!!errors.birthDate}
          />
          <SelectInput
            aria-label="태어난 달"
            placeholder="월"
            options={MONTH_OPTIONS}
            value={values.birthMonth}
            onChange={(event) => updateDate({ birthMonth: event.target.value })}
            hasError={!!errors.birthDate && !values.birthMonth}
          />
          <SelectInput
            aria-label="태어난 날"
            placeholder="일"
            options={dayOptions}
            value={values.birthDay}
            onChange={(event) => update({ birthDay: event.target.value })}
            hasError={!!errors.birthDate && !values.birthDay}
          />
        </div>
        {values.calendarType === "lunar" && (
          <CheckboxField
            id="leap-month"
            checked={values.isLeapMonth}
            onChange={(isLeapMonth) => update({ isLeapMonth })}
          >
            윤달입니다 <span className="text-mist-dim">(음력 생일이 윤달인 경우에만 체크)</span>
          </CheckboxField>
        )}
      </Field>

      <Field
        label="태어난 시간"
        error={errors.birthTime}
        errorId="birth-time-error"
        hint={
          values.birthTimeUnknown
            ? "시간을 모르면 시주를 제외한 여섯 글자로 풀이합니다. 일부 해석의 정밀도가 낮아질 수 있습니다."
            : hourBranch
              ? `${hourBranch.name}(${hourBranch.hanja}) · ${hourBranch.range}에 해당합니다.`
              : "정확한 시간을 알수록 풀이가 정밀해집니다."
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <SelectInput
            aria-label="태어난 시"
            placeholder="시"
            options={HOUR_OPTIONS}
            value={values.birthTimeUnknown ? "" : values.birthHour}
            disabled={values.birthTimeUnknown}
            onChange={(event) =>
              update({ birthHour: event.target.value, birthMinute: values.birthMinute || "0" })
            }
            hasError={!!errors.birthTime && !values.birthHour}
            aria-invalid={!!errors.birthTime}
          />
          <SelectInput
            aria-label="태어난 분"
            placeholder="분"
            options={MINUTE_OPTIONS}
            value={values.birthTimeUnknown ? "" : values.birthMinute}
            disabled={values.birthTimeUnknown}
            onChange={(event) => update({ birthMinute: event.target.value })}
            hasError={!!errors.birthTime && !values.birthMinute}
          />
        </div>
        <CheckboxField
          id="birth-time-unknown"
          checked={values.birthTimeUnknown}
          onChange={(birthTimeUnknown) => update({ birthTimeUnknown })}
        >
          출생시간을 몰라요
        </CheckboxField>
      </Field>

      <Field label="성별" error={errors.gender} errorId="gender-error">
        <SegmentedControl
          name="성별"
          value={values.gender}
          options={GENDER_OPTIONS}
          onChange={(gender) => update({ gender })}
          hasError={!!errors.gender}
          describedBy={errors.gender ? "gender-error" : undefined}
        />
      </Field>
    </div>
  );
}
