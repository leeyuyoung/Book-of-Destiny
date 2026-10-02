import type { AnalysisFormValues, FieldErrors } from "@/lib/validation/analysisInput";

export type StepProps = {
  values: AnalysisFormValues;
  errors: FieldErrors;
  update: (patch: Partial<AnalysisFormValues>) => void;
};
