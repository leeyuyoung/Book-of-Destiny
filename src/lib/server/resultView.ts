import "server-only";

import { SAMPLE_BASIC_RESULT } from "@/lib/mock/sampleResult";
import { ELEMENT_KOREAN } from "@/lib/saju/tables";
import type { FreeResultView, PillarView } from "@/types/result";
import type { AnalysisRecord } from "./store";

/** 무료 화면용으로 필요한 값만 골라낸다. report.parts(유료 본문)는 절대 담지 않는다. */
export function toFreeResultView(record: AnalysisRecord): FreeResultView | null {
  if (record.status !== "ready" || !record.report) return null;
  const { profile, report } = record;

  const pillars: PillarView[] = [...profile.pillars].reverse().map((pillar) => ({
    label: pillar.label,
    stem: { hanja: pillar.stem.hanja, korean: pillar.stem.korean, element: pillar.stem.element, tenGod: pillar.stem.tenGod },
    branch: {
      hanja: pillar.branch.hanja,
      korean: pillar.branch.korean,
      element: pillar.branch.element,
      tenGod: pillar.branch.tenGod,
    },
  }));

  return {
    name: record.name,
    summary: report.summary,
    keywords: report.keywords,
    pillars,
    fiveElements: profile.fiveElements.counts,
    dayMaster: {
      hanja: profile.dayMaster.hanja,
      korean: `${profile.dayMaster.korean}${ELEMENT_KOREAN[profile.dayMaster.element]}`,
      description: report.dayMasterDescription,
    },
    birthTimeKnown: profile.calculation.hourPillar !== null,
  };
}

export const SAMPLE_FREE_RESULT: FreeResultView = {
  name: SAMPLE_BASIC_RESULT.name,
  summary: SAMPLE_BASIC_RESULT.summary,
  keywords: SAMPLE_BASIC_RESULT.keywords,
  pillars: SAMPLE_BASIC_RESULT.pillars,
  fiveElements: SAMPLE_BASIC_RESULT.fiveElements,
  dayMaster: SAMPLE_BASIC_RESULT.dayMaster,
  birthTimeKnown: true,
};
