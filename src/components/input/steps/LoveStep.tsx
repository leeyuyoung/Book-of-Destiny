import { RELATIONSHIP_STATUSES } from "@/lib/validation/analysisInput";
import { FieldError } from "../fields/Field";
import { RadioList } from "../fields/RadioList";
import type { StepProps } from "./types";

export function LoveStep({ values, errors, update }: StepProps) {
  return (
    <div className="flex flex-col gap-1">
      <RadioList
        name="연애 상태"
        value={values.relationshipStatus}
        options={RELATIONSHIP_STATUSES}
        onChange={(relationshipStatus) => update({ relationshipStatus })}
        hasError={!!errors.relationshipStatus}
        describedBy={errors.relationshipStatus ? "relationship-error" : undefined}
      />
      <FieldError id="relationship-error" message={errors.relationshipStatus} />
    </div>
  );
}
