import { useState } from "react";
import { CONCERN_MAX_LENGTH, CONCERN_MIN_LENGTH } from "@/lib/validation/analysisInput";
import { Field, inputBorder } from "../fields/Field";
import type { StepProps } from "./types";

const PLACEHOLDER = `요즘 가장 고민되는 것은 무엇인가요?
직업, 연애, 돈, 인간관계, 가족, 미래 등
편하게 적어주세요.`;

const EXAMPLE = `지금 직장을 계속 다녀야 할지 이직해야 할지 고민이에요.
연애도 잘 풀리지 않고, 앞으로 돈을 어떻게 벌어야 할지도 모르겠어요.`;

export function ConcernStep({ values, errors, update }: StepProps) {
  const [showExample, setShowExample] = useState(false);
  const length = values.concern.trim().length;

  return (
    <div className="flex flex-col gap-6">
      <Field
        label="지금의 고민"
        htmlFor="concern"
        error={errors.concern}
        errorId="concern-error"
        hint="여러 가지 고민을 함께 적어도 괜찮습니다. 적어주신 내용은 리포트 작성에만 사용됩니다."
      >
        <div className="relative">
          <textarea
            id="concern"
            rows={10}
            maxLength={CONCERN_MAX_LENGTH}
            placeholder={PLACEHOLDER}
            value={values.concern}
            onChange={(event) => update({ concern: event.target.value })}
            aria-invalid={!!errors.concern}
            aria-describedby={errors.concern ? "concern-error" : "concern-counter"}
            className={`w-full resize-none rounded-2xl border bg-night/70 px-4 pb-9 pt-4 text-base leading-[1.8] text-paper placeholder:text-mist-dim/70 transition-colors duration-300 focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/30 ${inputBorder(!!errors.concern)}`}
          />
          <span
            id="concern-counter"
            className={`pointer-events-none absolute bottom-3 right-4 text-xs ${
              length > 0 && length < CONCERN_MIN_LENGTH ? "text-mist" : "text-mist-dim"
            }`}
          >
            {length.toLocaleString()} / {CONCERN_MAX_LENGTH.toLocaleString()}
          </span>
        </div>
      </Field>

      <div className="rounded-2xl border border-line/70 p-5">
        <button
          type="button"
          onClick={() => setShowExample((visible) => !visible)}
          aria-expanded={showExample}
          className="flex w-full items-center justify-between text-left text-sm text-gold-soft"
        >
          어떻게 적어야 할지 모르겠다면
          <span aria-hidden className={`transition-transform duration-300 ${showExample ? "rotate-45" : ""}`}>
            +
          </span>
        </button>
        {showExample && (
          <div className="mt-4 flex flex-col gap-3">
            <p className="whitespace-pre-line rounded-xl bg-night/60 p-4 text-sm leading-[1.8] text-mist">{EXAMPLE}</p>
            <p className="text-xs leading-relaxed text-mist-dim">
              무엇이 고민인지, 왜 고민인지, 어떤 선택지 사이에서 망설이는지 적어주시면 마지막 장에서 그 고민을 사주의
              흐름과 연결해 풀어드립니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
