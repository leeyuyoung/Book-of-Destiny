import {
  EMPTY_FORM_VALUES,
  STEP_SCHEMAS,
  type AnalysisFormValues,
  type AnalysisInput,
} from "@/lib/validation/analysisInput";

// sessionStorage는 탭을 닫으면 지워지므로, 개인정보가 기기에 오래 남지 않는다.
const DRAFT_KEY = "dohwa:input-draft:v2";
const PENDING_KEY = "dohwa:pending-analysis:v2";

type Draft = { values: AnalysisFormValues; stepIndex: number };

function readJson(key: string): unknown {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간이 없거나 사생활 보호 모드인 경우 저장 없이 진행한다.
  }
}

export function loadDraft(): Draft {
  const stored = readJson(DRAFT_KEY) as Partial<Draft> | null;
  const values = { ...EMPTY_FORM_VALUES };

  if (stored?.values && typeof stored.values === "object") {
    for (const key of Object.keys(EMPTY_FORM_VALUES) as (keyof AnalysisFormValues)[]) {
      const candidate = (stored.values as Record<string, unknown>)[key];
      if (typeof candidate === typeof EMPTY_FORM_VALUES[key]) {
        (values as Record<string, unknown>)[key] = candidate;
      }
    }
  }

  const stepIndex =
    typeof stored?.stepIndex === "number" && stored.stepIndex >= 0 && stored.stepIndex < STEP_SCHEMAS.length
      ? stored.stepIndex
      : 0;
  return { values, stepIndex };
}

export function saveDraft(draft: Draft) {
  writeJson(DRAFT_KEY, draft);
}

export function clearDraft() {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export function savePendingAnalysis(input: AnalysisInput) {
  writeJson(PENDING_KEY, input);
}

export function loadPendingAnalysis(): unknown {
  return readJson(PENDING_KEY);
}

export function clearPendingAnalysis() {
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {}
}