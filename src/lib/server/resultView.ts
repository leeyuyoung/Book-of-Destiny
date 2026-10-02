import "server-only";

import { REPORT_PARTS } from "@/lib/constants/service";
import { SAMPLE_BASIC_RESULT } from "@/lib/mock/sampleResult";
import { SAMPLE_REPORT } from "@/lib/mock/sampleReport";
import type { SajuProfile } from "@/lib/saju";
import { ELEMENT_KOREAN } from "@/lib/saju/tables";
import type { FreeResultView, FullReportView, PillarView, ReportPartView } from "@/types/result";
import type { AiReport } from "./ai/reportSchema";
import type { AnalysisRecord } from "./store";

function pillarViews(profile: SajuProfile): PillarView[] {
  return [...profile.pillars].reverse().map((pillar) => ({
    label: pillar.label,
    stem: { hanja: pillar.stem.hanja, korean: pillar.stem.korean, element: pillar.stem.element, tenGod: pillar.stem.tenGod },
    branch: {
      hanja: pillar.branch.hanja,
      korean: pillar.branch.korean,
      element: pillar.branch.element,
      tenGod: pillar.branch.tenGod,
    },
  }));
}

function partViews(report: AiReport): ReportPartView[] {
  return REPORT_PARTS.map((meta, index) => ({
    part: meta.part,
    title: meta.title,
    summary: meta.summary,
    headline: report.parts[index].headline,
    paragraphs: report.parts[index].paragraphs,
  }));
}

const formatKoreanDate = (time: number) =>
  new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric" }).format(time);

/** 무료 화면용으로 필요한 값만 골라낸다. report.parts(유료 본문)는 절대 담지 않는다. */
export function toFreeResultView(record: AnalysisRecord): FreeResultView | null {
  if (record.status !== "ready" || !record.report) return null;
  const { profile, report } = record;
  return {
    name: record.name,
    summary: report.summary,
    keywords: report.keywords,
    pillars: pillarViews(profile),
    fiveElements: profile.fiveElements.counts,
    dayMaster: {
      hanja: profile.dayMaster.hanja,
      korean: `${profile.dayMaster.korean}${ELEMENT_KOREAN[profile.dayMaster.element]}`,
      description: report.dayMasterDescription,
    },
    birthTimeKnown: profile.calculation.hourPillar !== null,
  };
}

/** 결제가 확인된 기록만 전체 리포트로 변환한다. */
export function toFullReportView(record: AnalysisRecord): FullReportView | null {
  const free = toFreeResultView(record);
  if (!free || record.paidAt === null || !record.report) return null;
  return { ...free, analyzedAt: formatKoreanDate(record.createdAt), parts: partViews(record.report) };
}

export const SAMPLE_FREE_RESULT: FreeResultView = {
  name: SAMPLE_BASIC_RESULT.name,
  summary: SAMPLE_REPORT.summary,
  keywords: SAMPLE_REPORT.keywords,
  pillars: SAMPLE_BASIC_RESULT.pillars,
  fiveElements: SAMPLE_BASIC_RESULT.fiveElements,
  dayMaster: { ...SAMPLE_BASIC_RESULT.dayMaster, description: SAMPLE_REPORT.dayMasterDescription },
  birthTimeKnown: true,
};

export const SAMPLE_FULL_REPORT: FullReportView = {
  ...SAMPLE_FREE_RESULT,
  analyzedAt: formatKoreanDate(Date.UTC(2026, 9, 2, 15)),
  parts: partViews(SAMPLE_REPORT),
};
