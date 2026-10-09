import { ChoiceChips } from "../fields/ChoiceChips";
import { FieldError } from "../fields/Field";
import type { StepProps } from "./types";

const GENDER_OPTIONS = [
  { value: "female", label: "여인" },
  { value: "male", label: "사내" },
] as const;

export function GenderStep({ values, errors, update }: StepProps) {
  return (
    <div className="flex flex-col gap-3">
      <ChoiceChips
        name="성별"
        value={values.gender}
        options={GENDER_OPTIONS}
        onChange={(gender) => update({ gender })}
        hasError={!!errors.gender}
        describedBy={errors.gender ? "gender-error" : undefined}
      />
      <FieldError id="gender-error" message={errors.gender} />
    </div>
  );
}
