import "server-only";

import { CHARM_INDICES, DOHWA_TYPES, LOVE_TIMELINE_YEARS, REPORT_CHAPTERS, gradeOf } from "@/lib/constants/result";
import { buildSajuProfile, calculateSaju, readDohwa, type SajuProfile } from "@/lib/saju";
import type { CharmStarView, CurrentLuckView, DohwaView, FreeResultView, FullReportView, PillarView } from "@/types/result";
import { storedReport } from "./analysis";
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
      twelveStage: pillar.branch.twelveStage,
    },
  }));
}

function dohwaView(profile: SajuProfile): DohwaView {
  const reading = readDohwa(profile);
  return {
    score: reading.score,
    grade: gradeOf(reading.score),
    indices: CHARM_INDICES.map((index) => ({ ...index, score: reading.indices[index.key] })),
    type: DOHWA_TYPES[reading.typeKey],
  };
}

function birthLabel(profile: SajuProfile): string {
  const { solarDate, birthTime } = profile.calculation;
  const pad = (value: number) => String(value).padStart(2, "0");
  const date = `${solarDate.year}.${pad(solarDate.month)}.${pad(solarDate.day)} (양력)`;
  return birthTime ? `${date} ${pad(birthTime.hour)}:${pad(birthTime.minute)}` : `${date} · 시간 모름`;
}

function freeView(name: string, profile: SajuProfile): FreeResultView {
  const day = profile.pillars.find((pillar) => pillar.position === "day")!;
  return {
    name,
    birthLabel: birthLabel(profile),
    dayPillarName: `${day.stem.korean}${day.branch.korean}일주`,
    pillars: pillarViews(profile),
    birthTimeKnown: profile.calculation.hourPillar !== null,
    dohwa: dohwaView(profile),
    timelineYears: profile.yearlyFortunes.slice(0, LOVE_TIMELINE_YEARS).map((fortune) => fortune.year),
  };
}

function currentLuckView(profile: SajuProfile): CurrentLuckView | null {
  const period = profile.luck.periods.find((item) => item.isCurrent);
  if (!period) return null;
  return {
    startAge: period.startAge,
    endAge: period.startAge + 9,
    stemElement: period.stem.element,
    branchElement: period.branch.element,
    stemTenGod: period.stem.tenGod,
    twelveStage: period.branch.twelveStage,
  };
}

const formatKoreanDate = (time: number) =>
  new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric" }).format(time);

/** 무료 화면용 값. 만세력 계산 결과만으로 만든다. */
export const toFreeResultView = (record: AnalysisRecord): FreeResultView => freeView(record.name, record.profile);

/** 결제가 확인되고 리포트가 완성된 기록만 전체 리포트로 변환한다. */
export function toFullReportView(record: AnalysisRecord): FullReportView | null {
  const report = storedReport(record);
  if (record.paidAt === null || !report) return null;
  const { profile } = record;
  const stars: CharmStarView[] = readDohwa(profile).stars.map((star) => ({
    key: star.key,
    name: star.name,
    hanja: star.hanja,
    found: star.positions.length > 0,
    positions: star.positions,
    score: star.score,
  }));
  return {
    ...toFreeResultView(record),
    analyzedAt: formatKoreanDate(record.createdAt),
    summary: report.summary,
    keywords: report.keywords,
    stars,
    fiveElements: {
      counts: profile.fiveElements.counts,
      dominant: profile.fiveElements.dominant,
      missing: profile.fiveElements.missing,
    },
    currentLuck: currentLuckView(profile),
    chapters: REPORT_CHAPTERS.map((meta, index) => ({
      chapter: meta.chapter,
      key: meta.key,
      title: meta.title,
      teaser: meta.teaser,
      headline: report.chapters[index].headline,
      paragraphs: report.chapters[index].paragraphs,
    })),
    loveTimeline: report.loveTimeline,
  };
}

/** /result/sample 화면용. 실제 만세력으로 계산한 예시 사주다. */
export function sampleFreeResult(): FreeResultView {
  const profile = buildSajuProfile(
    calculateSaju({
      birth: { calendarType: "solar", isLeapMonth: false, year: 1998, month: 4, day: 17, hour: 23, minute: 40 },
      gender: "female",
    }),
  );
  return freeView("서윤", profile);
}
