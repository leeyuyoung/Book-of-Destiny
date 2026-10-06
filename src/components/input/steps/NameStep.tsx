import { NAME_MAX_LENGTH } from "@/lib/validation/analysisInput";
import { FieldError } from "../fields/Field";
import type { StepProps } from "./types";

export function NameStep({ values, errors, update }: StepProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        id="name"
        type="text"
        aria-label="이름"
        autoComplete="off"
        maxLength={NAME_MAX_LENGTH}
        placeholder="이름"
        value={values.name}
        onChange={(event) => update({ name: event.target.value })}
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
        className="w-full bg-transparent font-serif text-2xl tracking-[0.04em] text-paper placeholder:text-mist-dim/50 focus:outline-none"
      />
      <div className="h-px bg-line" />
      <FieldError id="name-error" message={errors.name} />
    </div>
  );
}
