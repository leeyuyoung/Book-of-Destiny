import { hourBranchOf } from "@/lib/constants/time";
import { pillClass } from "../fields/ChoiceChips";
import { FieldError } from "../fields/Field";
import type { StepProps } from "./types";

const TIME_INPUT =
  "w-12 bg-transparent text-center font-serif text-2xl tracking-[0.06em] text-paper placeholder:text-mist-dim/50 focus:outline-none disabled:opacity-30";

const onlyDigits = (value: string) => value.replace(/\D/g, "").slice(0, 2);

export function BirthTimeStep({ values, errors, update }: StepProps) {
  const unknown = values.birthTimeUnknown;
  const hour = Number(values.birthHour);
  const hourBranch = !unknown && values.birthHour !== "" && hour <= 23 ? hourBranchOf(hour) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center">
          <input
            id="birth-hour"
            type="text"
            inputMode="numeric"
            aria-label="태어난 시 (0~23)"
            placeholder="00"
            value={unknown ? "" : values.birthHour}
            disabled={unknown}
            onChange={(event) => update({ birthHour: onlyDigits(event.target.value) })}
            aria-invalid={!!errors.birthTime}
            className={`${TIME_INPUT} text-left!`}
          />
          <span className={`font-serif text-2xl text-mist-dim ${unknown ? "opacity-30" : ""}`}>:</span>
          <input
            id="birth-minute"
            type="text"
            inputMode="numeric"
            aria-label="태어난 분 (0~59)"
            placeholder="00"
            value={unknown ? "" : values.birthMinute}
            disabled={unknown}
            onChange={(event) => update({ birthMinute: onlyDigits(event.target.value) })}
            className={TIME_INPUT}
          />
        </div>
        <button
          type="button"
          aria-pressed={unknown}
          onClick={() => update({ birthTimeUnknown: !unknown })}
          className={`h-11 shrink-0 px-5 text-sm ${pillClass(unknown)}`}
        >
          시간모름
        </button>
      </div>
      <div className="h-px bg-line" />
      <p className="text-xs leading-relaxed text-mist-dim">
        {unknown
          ? "괜찮다. 시각 없이도 여섯 글자면 충분하지."
          : hourBranch
            ? `${hourBranch.name}(${hourBranch.hanja}) · ${hourBranch.range}이로구나.`
            : "24시간 기준으로 적거라. 예) 오후 3시 30분 → 15 : 30"}
      </p>
      <FieldError message={errors.birthTime} />
    </div>
  );
}
