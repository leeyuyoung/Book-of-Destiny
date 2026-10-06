import { useState } from "react";
import { CONCERN_MAX_LENGTH, RELATIONSHIP_STATUSES } from "@/lib/validation/analysisInput";
import { CheckboxField } from "../fields/CheckboxField";
import { FieldError } from "../fields/Field";
import { RadioList } from "../fields/RadioList";
import type { StepProps } from "./types";

export function LoveStep({ values, errors, update }: StepProps) {
  const [writing, setWriting] = useState(() => values.concern.trim().length > 0);

  const toggleWriting = (checked: boolean) => {
    setWriting(checked);
    if (!checked) update({ concern: "" });
  };

  return (
    <div className="flex flex-col gap-3">
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

      <div className="flex flex-col gap-3">
        <CheckboxField id="concern-toggle" checked={writing} onChange={toggleWriting}>
          직접 입력할래요
        </CheckboxField>
        {writing && (
          <textarea
            id="concern"
            rows={2}
            maxLength={CONCERN_MAX_LENGTH}
            aria-label="마음에 걸리는 사람이나 고민"
            placeholder="예) 연락이 뜸해진 그 사람, 먼저 다가가도 될까요?"
            value={values.concern}
            onChange={(event) => update({ concern: event.target.value })}
            aria-invalid={!!errors.concern}
            aria-describedby={errors.concern ? "concern-error" : undefined}
            className="w-full resize-none rounded-2xl bg-white/10 px-4 py-3 text-[15px] leading-[1.7] text-paper placeholder:text-mist-dim/70 focus:outline-none focus:ring-1 focus:ring-paper/40"
          />
        )}
        <FieldError id="concern-error" message={errors.concern} />
      </div>
    </div>
  );
}
