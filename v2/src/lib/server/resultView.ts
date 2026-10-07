import "server-only";

import { CHARM_INDICES, DOHWA_TYPES, LOVE_TIMELINE_YEARS, gradeOf } from "@/lib/constants/result";
import { buildSajuProfile, calculateSaju, readDohwa, type SajuProfile } from "@/lib/saju";
import type { AnalysisInput } from "@/lib/validation/analysisInput";
import type { DohwaView, FreeResultView, PillarView } from "@/types/result";

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

/** 입력값으로 바로 무료 결과를 계산한다. 계산 오류는 그대로 던진다(SajuCalculationError). */
export function freeResultFromInput(input: AnalysisInput): FreeResultView {
  return freeView(input.name, buildSajuProfile(calculateSaju({ birth: input.birth, gender: input.gender })));
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
