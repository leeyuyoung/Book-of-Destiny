import "server-only";

import {
  EARTHLY_BRANCHES,
  EARTHLY_BRANCHES_HANJA,
  HEAVENLY_STEMS,
  HEAVENLY_STEMS_HANJA,
  calculateFourPillars,
  getSolarTerm,
  isValidSolarDate,
  lunarToSolar,
  solarToLunar,
  type FourPillarsDetail,
} from "manseryeok";
import { calculateSaju as calculateWithSsaju } from "ssaju";
import { SajuCalculationError } from "./errors";
import { todayInKorea, toKoreaStandardTime, type KoreaStandardTime, type SolarDate } from "./koreaClock";
import type { CalculateSajuInput, SajuCalculation, SajuPillar } from "./types";

// package.json에서 정확한 버전으로 고정되어 있다. 버전을 올리면 여기와 검증 스크립트를 함께 갱신한다.
const ENGINE = "manseryeok@2.0.0";
const CROSS_CHECK_ENGINE = "ssaju@0.2.0";
const UNKNOWN_TIME_REFERENCE = { hour: 12, minute: 0 } as const;
// ssaju는 근사식이라 절입 시각이 KASI 기준과 최대 ±12분가량 어긋난다.
const SOLAR_TERM_BOUNDARY_MINUTES = 15;
// 1948~51년, 1954~61년에는 ssaju 내부의 과거 한국 시간 처리 때문에 절입 판정이 30~65분 밀린다.
const LEGACY_CLOCK_TOLERANCE_MINUTES = 70;
const isLegacyClockYear = (year: number) => (year >= 1948 && year <= 1951) || (year >= 1954 && year <= 1961);
const IPCHUN_INDEX = 2;

type PillarKey = "year" | "month" | "day" | "hour";

const compareDates = (a: SolarDate, b: SolarDate) => a.year - b.year || a.month - b.month || a.day - b.day;

function resolveSolarDate(birth: CalculateSajuInput["birth"]): SolarDate {
  if (birth.calendarType === "lunar") {
    try {
      return lunarToSolar(birth.year, birth.month, birth.day, birth.isLeapMonth);
    } catch (error) {
      throw new SajuCalculationError("INVALID_LUNAR_DATE", { birth }, error);
    }
  }
  if (!isValidSolarDate(birth.year, birth.month, birth.day)) {
    throw new SajuCalculationError("INVALID_DATE", { birth });
  }
  return { year: birth.year, month: birth.month, day: birth.day };
}

/** 이미 UTC+9 표준시로 환산된 시각을 받으므로 엔진에는 추가 보정 옵션을 주지 않는다. */
function runEngine(kst: KoreaStandardTime, gender: CalculateSajuInput["gender"]): FourPillarsDetail {
  const { year, month, day, hour, minute } = kst;
  try {
    return calculateFourPillars({ year, month, day, hour, minute, isLunar: false, dayBoundary: "midnight", gender });
  } catch (error) {
    if (error instanceof RangeError) throw new SajuCalculationError("OUT_OF_RANGE", { kst }, error);
    throw new SajuCalculationError("ENGINE_ERROR", { kst }, error);
  }
}

/** 출생 순간이 절입(월이 바뀌는 절기) 앞뒤 windowMinutes분 안인지. 입춘이면 연주도 해당된다. */
function nearSolarTermBoundary(kst: KoreaStandardTime, windowMinutes: number): { year: boolean; month: boolean } {
  const windowMs = windowMinutes * 60_000;
  for (let index = 0; index < 24; index += 2) {
    const term = getSolarTerm(kst.year, index);
    if (Math.abs(term.date.getTime() - kst.instantMs) <= windowMs) {
      return { year: index === IPCHUN_INDEX, month: true };
    }
  }
  return { year: false, month: false };
}

function toSajuPillar(detail: FourPillarsDetail, key: PillarKey): SajuPillar {
  const pillar = detail[key];
  const element = detail[`${key}Element`];
  const yinYang = detail[`${key}YinYang`];
  return {
    heavenlyStem: pillar.heavenlyStem,
    earthlyBranch: pillar.earthlyBranch,
    stemHanja: HEAVENLY_STEMS_HANJA[HEAVENLY_STEMS.indexOf(pillar.heavenlyStem)],
    branchHanja: EARTHLY_BRANCHES_HANJA[EARTHLY_BRANCHES.indexOf(pillar.earthlyBranch)],
    stemElement: element.stem,
    branchElement: element.branch,
    stemYinYang: yinYang.stem,
    branchYinYang: yinYang.branch,
  };
}

const hanjaOf = (pillar: SajuPillar) => `${pillar.stemHanja}${pillar.branchHanja}`;

type WallClock = { year: number; month: number; day: number; hour: number; minute: number };

function runCrossCheckEngine(wall: WallClock, gender: CalculateSajuInput["gender"]) {
  try {
    return calculateWithSsaju({
      ...wall,
      calendar: "solar",
      gender: gender === "male" ? "남" : "여",
      timezone: "Asia/Seoul",
      applyLocalMeanTime: false,
    });
  } catch (error) {
    throw new SajuCalculationError("ENGINE_ERROR", { engine: CROSS_CHECK_ENGINE, wall }, error);
  }
}

const sameWallClock = (a: WallClock, b: WallClock) =>
  a.year === b.year && a.month === b.month && a.day === b.day && a.hour === b.hour && a.minute === b.minute;

/**
 * 두 번째 엔진(ssaju)으로 같은 순간을 계산해 8글자가 일치하는지 확인한다.
 * 절입 경계 근처의 연주/월주 차이만 허용하고(주 엔진 KASI 분 단위 자료를 따른다), 나머지 차이는 오류로 본다.
 *
 * ssaju는 연주/월주를 절대 순간으로, 일주/시주를 그 순간의 '당시 서울 벽시계'로 판정한다.
 * 그래서 연주/월주는 입력한 벽시계 시각을, 일주/시주는 UTC+9로 환산한 시각을 넘겨야 같은 기준이 된다.
 * 환산한 시각이 서머타임 시작으로 사라진 시간대에 걸리면 ssaju가 시각을 옮겨 버리므로 일주/시주 대조를 건너뛴다.
 */
function crossCheck(
  wall: WallClock,
  kst: KoreaStandardTime,
  gender: CalculateSajuInput["gender"],
  pillars: Record<PillarKey, SajuPillar>,
  keys: PillarKey[],
) {
  const standardClock: WallClock = { year: kst.year, month: kst.month, day: kst.day, hour: kst.hour, minute: kst.minute };
  const byInstant = runCrossCheckEngine(wall, gender);
  const byStandardClock = kst.correctionMinutes === 0 ? byInstant : runCrossCheckEngine(standardClock, gender);
  const standardClockUsable = kst.correctionMinutes === 0 || sameWallClock(byStandardClock.normalized.calculation, standardClock);
  const otherOf = (key: PillarKey) =>
    key === "year" || key === "month" ? byInstant.pillars[key] : byStandardClock.pillars[key];

  const tolerance = nearSolarTermBoundary(
    kst,
    isLegacyClockYear(kst.year) ? LEGACY_CLOCK_TOLERANCE_MINUTES : SOLAR_TERM_BOUNDARY_MINUTES,
  );
  const tolerated = (key: PillarKey) =>
    (key === "year" && tolerance.year) ||
    (key === "month" && tolerance.month) ||
    ((key === "day" || key === "hour") && !standardClockUsable);

  const mismatches = keys
    .filter((key) => otherOf(key) !== hanjaOf(pillars[key]))
    .filter((key) => !tolerated(key))
    .map((key) => ({ pillar: key, primary: hanjaOf(pillars[key]), crossCheck: otherOf(key) }));

  if (mismatches.length > 0) {
    throw new SajuCalculationError("CROSS_CHECK_MISMATCH", { kst, mismatches });
  }
}

/**
 * 출생 정보를 받아 사주 8글자(시간을 모르면 6글자)를 계산한다.
 * AI가 아니라 검증된 만세력 라이브러리로만 계산하며, 입력 시각은 과거 표준시·서머타임을 보정해 UTC+9로 환산한다.
 * 절입 경계 근처가 아닌데 두 엔진의 결과가 다르면 오류를 던진다.
 */
export function calculateSaju(input: CalculateSajuInput): SajuCalculation {
  const { birth, gender } = input;
  const solarDate = resolveSolarDate(birth);

  if (compareDates(solarDate, todayInKorea()) > 0) {
    throw new SajuCalculationError("FUTURE_DATE", { solarDate });
  }

  const timeKnown = birth.hour !== null && birth.minute !== null;
  const time = timeKnown ? { hour: birth.hour!, minute: birth.minute! } : UNKNOWN_TIME_REFERENCE;
  const kst = toKoreaStandardTime(solarDate, time);

  const detail = runEngine(kst, gender);
  const pillars: Record<PillarKey, SajuPillar> = {
    year: toSajuPillar(detail, "year"),
    month: toSajuPillar(detail, "month"),
    day: toSajuPillar(detail, "day"),
    hour: toSajuPillar(detail, "hour"),
  };

  crossCheck({ ...solarDate, ...time }, kst, gender, pillars, timeKnown ? ["year", "month", "day", "hour"] : ["year", "month", "day"]);
  const nearBoundary = nearSolarTermBoundary(kst, SOLAR_TERM_BOUNDARY_MINUTES);

  let uncertainty: SajuCalculation["uncertainty"];
  if (timeKnown) {
    uncertainty = {
      yearPillar: nearBoundary.year,
      monthPillar: nearBoundary.month,
      reason: nearBoundary.month ? "near_solar_term" : null,
    };
  } else {
    const startOfDay = runEngine(toKoreaStandardTime(solarDate, { hour: 0, minute: 0 }), gender);
    const endOfDay = runEngine(toKoreaStandardTime(solarDate, { hour: 23, minute: 59 }), gender);
    const yearPillar = startOfDay.yearString !== endOfDay.yearString;
    const monthPillar = startOfDay.monthString !== endOfDay.monthString;
    uncertainty = { yearPillar, monthPillar, reason: monthPillar ? "unknown_time" : null };
  }

  const lunarDate =
    birth.calendarType === "lunar"
      ? { year: birth.year, month: birth.month, day: birth.day, isLeapMonth: birth.isLeapMonth }
      : solarToLunar(solarDate.year, solarDate.month, solarDate.day);

  return {
    yearPillar: pillars.year,
    monthPillar: pillars.month,
    dayPillar: pillars.day,
    hourPillar: timeKnown ? pillars.hour : null,
    solarDate,
    lunarDate,
    birthTime: timeKnown ? time : null,
    calculationTime: { year: kst.year, month: kst.month, day: kst.day, hour: kst.hour, minute: kst.minute },
    clockCorrectionMinutes: kst.correctionMinutes,
    gender,
    uncertainty,
    basis: {
      engine: ENGINE,
      crossCheckedWith: CROSS_CHECK_ENGINE,
      timezone: "Asia/Seoul",
      dayBoundary: "midnight",
      trueSolarTime: false,
      historicalClockCorrection: true,
      solarTermBoundaryMinutes: SOLAR_TERM_BOUNDARY_MINUTES,
      unknownTimeReference: timeKnown ? null : "12:00",
    },
  };
}
