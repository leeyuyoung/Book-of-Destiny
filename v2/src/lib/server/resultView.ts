import "server-only";

import { CHARM_INDICES, DOHWA_TYPES, gradeOf } from "@/lib/constants/result";
import { buildSajuProfile, calculateSaju, readDohwa, type DohwaReading, type SajuProfile } from "@/lib/saju";
import { faceTeaser, nextBloomMonth, partnerTeaser } from "@/lib/saju/teasers";
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

function dohwaView(reading: DohwaReading): DohwaView {
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
  const reading = readDohwa(profile);
  const dohwa = dohwaView(reading);
  return {
    name,
    birthLabel: birthLabel(profile),
    dayPillarName: `${day.stem.korean}${day.branch.korean}일주`,
    pillars: pillarViews(profile),
    birthTimeKnown: profile.calculation.hourPillar !== null,
    dohwa,
    gender: profile.calculation.gender,
    birth: { year: profile.calculation.solarDate.year, month: profile.calculation.solarDate.month },
    teasers: {
      bloom: nextBloomMonth(profile, reading),
      partner: partnerTeaser(profile),
      face: { impression: dohwa.type.plain, ...faceTeaser(profile, reading) },
    },
  };
}

/** 입력값으로 바로 무료 결과를 계산한다. 계산 오류는 그대로 던진다(SajuCalculationError). */
export function freeResultFromInput(input: AnalysisInput): FreeResultView {
  return freeView(input.name, buildSajuProfile(calculateSaju({ birth: input.birth, gender: input.gender })));
}

/** 샘플 화면에서 도화 유형별로 보여 줄 생일. 유형은 태어난 날의 오행으로 정해진다. */
const SAMPLE_BIRTH_DAY: Record<keyof typeof DOHWA_TYPES, number> = { wood: 17, fire: 19, earth: 21, metal: 23, water: 25 };

export const isSampleType = (value: unknown): value is keyof typeof DOHWA_TYPES => typeof value === "string" && value in SAMPLE_BIRTH_DAY;

/** /result/sample 화면용. 실제 만세력으로 계산한 예시 사주다. */
export function sampleFreeResult(type: keyof typeof DOHWA_TYPES = "wood"): FreeResultView {
  const profile = buildSajuProfile(
    calculateSaju({
      birth: { calendarType: "solar", isLeapMonth: false, year: 1998, month: 4, day: SAMPLE_BIRTH_DAY[type], hour: 23, minute: 40 },
      gender: "female",
    }),
  );
  return freeView("서윤", profile);
}
