import "server-only";

import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  calculateFourPillars,
  getBranchTenGod,
  getEarthlyBranchElement,
  getEarthlyBranchYinYang,
  getHeavenlyStemElement,
  getHeavenlyStemYinYang,
  getTenGod,
  getVoidBranches,
  type EarthlyBranch,
  type HeavenlyStem,
  type TenGod,
} from "manseryeok";
import { SajuCalculationError } from "./errors";
import { todayInKorea, type SolarDate } from "./koreaClock";
import type {
  BranchGlyph,
  DayStrength,
  HiddenStem,
  LuckCycle,
  PillarLabel,
  PillarPosition,
  PillarRelation,
  ProfilePillar,
  SajuProfile,
  StemGlyph,
  TenGodGroup,
  YearFortune,
} from "./profileTypes";
import {
  BRANCH_BREAKS,
  BRANCH_CLASHES,
  BRANCH_HARMS,
  BRANCH_RESENTMENTS,
  DIRECTIONAL_HARMONIES,
  ELEMENT_KEY,
  ELEMENT_ORDER,
  GENERATES,
  HIDDEN_STEMS,
  MUTUAL_PUNISHMENT,
  SELF_PUNISHMENT,
  SIX_COMBINATIONS,
  STEM_CLASHES,
  STEM_COMBINATIONS,
  THREE_HARMONIES,
  THREE_PUNISHMENTS,
  branchHanja,
  stemHanja,
  twelveStage,
  type FiveElementKey,
  type HiddenStemRole,
} from "./tables";
import type { SajuCalculation, SajuPillar } from "./types";

const LABELS: Record<PillarPosition, PillarLabel> = { year: "년주", month: "월주", day: "일주", hour: "시주" };

const TEN_GOD_GROUP: Record<TenGod, TenGodGroup> = {
  비견: "비겁",
  겁재: "비겁",
  식신: "식상",
  상관: "식상",
  편재: "재성",
  정재: "재성",
  편관: "관성",
  정관: "관성",
  편인: "인성",
  정인: "인성",
};

const HIDDEN_ROLE_ORDER: HiddenStemRole[] = ["여기", "중기", "정기"];

/** 신강/신약 판단용 가중치. 월지(계절)의 영향이 가장 크고, 일지가 그다음이다. */
const STRENGTH_WEIGHT = { stem: 1, monthBranch: 3, dayBranch: 1.5, otherBranch: 1 } as const;
const STRONG_RATIO = 0.55;
const WEAK_RATIO = 0.4;

const YEARLY_FORTUNE_SPAN = 10;
const MID_YEAR_MONTH = 7;

type DateParts = { year: number; month: number; day: number };
const dateKey = (date: DateParts) => date.year * 10_000 + date.month * 100 + date.day;

function stemGlyph(dayMaster: HeavenlyStem, stem: HeavenlyStem, isDayMaster: boolean): StemGlyph {
  return {
    korean: stem,
    hanja: stemHanja(stem),
    element: ELEMENT_KEY[getHeavenlyStemElement(stem)],
    yinYang: getHeavenlyStemYinYang(stem),
    tenGod: isDayMaster ? "일간" : getTenGod(dayMaster, stem),
  };
}

function hiddenStemsOf(dayMaster: HeavenlyStem, branch: EarthlyBranch): HiddenStem[] {
  const table = HIDDEN_STEMS[branch];
  return HIDDEN_ROLE_ORDER.flatMap((role) => {
    const stem = table[role];
    if (!stem) return [];
    return [
      {
        role,
        korean: stem,
        hanja: stemHanja(stem),
        element: ELEMENT_KEY[getHeavenlyStemElement(stem)],
        tenGod: getTenGod(dayMaster, stem),
      },
    ];
  });
}

function branchGlyph(dayMaster: HeavenlyStem, branch: EarthlyBranch, voidBranches: EarthlyBranch[]): BranchGlyph {
  return {
    korean: branch,
    hanja: branchHanja(branch),
    element: ELEMENT_KEY[getEarthlyBranchElement(branch)],
    yinYang: getEarthlyBranchYinYang(branch),
    tenGod: getBranchTenGod(dayMaster, branch),
    hiddenStems: hiddenStemsOf(dayMaster, branch),
    twelveStage: twelveStage(dayMaster, branch),
    isVoid: voidBranches.includes(branch),
  };
}

const sameMembers = <T>(pair: T[], a: T, b: T) => (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a);

function findRelations(pillars: ProfilePillar[]): PillarRelation[] {
  const relations: PillarRelation[] = [];
  const stemHanjaOf = (indices: number[]) => indices.map((i) => pillars[i].stem.hanja).join("");
  const branchHanjaOf = (indices: number[]) => indices.map((i) => pillars[i].branch.hanja).join("");
  const push = (type: PillarRelation["type"], indices: number[], hanja: string, resultElement?: FiveElementKey) =>
    relations.push({ type, positions: indices.map((i) => pillars[i].position), hanja, ...(resultElement ? { resultElement } : {}) });

  for (let i = 0; i < pillars.length; i++) {
    for (let j = i + 1; j < pillars.length; j++) {
      const [s1, s2] = [pillars[i].stem.korean, pillars[j].stem.korean];
      const [b1, b2] = [pillars[i].branch.korean, pillars[j].branch.korean];

      const stemCombo = STEM_COMBINATIONS.find((combo) => sameMembers(combo.members, s1, s2));
      if (stemCombo) push("천간합", [i, j], stemHanjaOf([i, j]), stemCombo.element);
      if (STEM_CLASHES.some((pair) => sameMembers(pair, s1, s2))) push("천간충", [i, j], stemHanjaOf([i, j]));

      const sixCombo = SIX_COMBINATIONS.find((combo) => sameMembers(combo.members, b1, b2));
      if (sixCombo) push("육합", [i, j], branchHanjaOf([i, j]), sixCombo.element);
      if (BRANCH_CLASHES.some((pair) => sameMembers(pair, b1, b2))) push("충", [i, j], branchHanjaOf([i, j]));
      if (BRANCH_BREAKS.some((pair) => sameMembers(pair, b1, b2))) push("파", [i, j], branchHanjaOf([i, j]));
      if (BRANCH_HARMS.some((pair) => sameMembers(pair, b1, b2))) push("해", [i, j], branchHanjaOf([i, j]));
      if (BRANCH_RESENTMENTS.some((pair) => sameMembers(pair, b1, b2))) push("원진", [i, j], branchHanjaOf([i, j]));
      const mutual = sameMembers(MUTUAL_PUNISHMENT, b1, b2);
      const self = b1 === b2 && SELF_PUNISHMENT.includes(b1);
      if (mutual || self) push("형", [i, j], branchHanjaOf([i, j]));
    }
  }

  const indicesWith = (members: EarthlyBranch[]) =>
    pillars.flatMap((pillar, index) => (members.includes(pillar.branch.korean) ? [index] : []));
  const distinctCount = (indices: number[]) => new Set(indices.map((i) => pillars[i].branch.korean)).size;

  for (const harmony of THREE_HARMONIES) {
    const indices = indicesWith(harmony.members);
    if (distinctCount(indices) === 3) {
      push("삼합", indices, branchHanjaOf(indices), harmony.element);
      continue;
    }
    const cardinal = harmony.members[1];
    const hasCardinal = indices.some((i) => pillars[i].branch.korean === cardinal);
    if (hasCardinal && distinctCount(indices) === 2) push("반합", indices, branchHanjaOf(indices), harmony.element);
  }

  for (const harmony of DIRECTIONAL_HARMONIES) {
    const indices = indicesWith(harmony.members);
    if (distinctCount(indices) === 3) push("방합", indices, branchHanjaOf(indices), harmony.element);
  }

  for (const group of THREE_PUNISHMENTS) {
    const indices = indicesWith(group);
    if (distinctCount(indices) === 3) {
      push("형", indices, branchHanjaOf(indices));
      continue;
    }
    for (let a = 0; a < indices.length; a++) {
      for (let b = a + 1; b < indices.length; b++) {
        const [i, j] = [indices[a], indices[b]];
        if (pillars[i].branch.korean !== pillars[j].branch.korean) push("형", [i, j], branchHanjaOf([i, j]));
      }
    }
  }

  return relations;
}

function dayStrength(pillars: ProfilePillar[], dayMasterElement: FiveElementKey): DayStrength {
  const supports = (element: FiveElementKey) => element === dayMasterElement || GENERATES[element] === dayMasterElement;
  let total = 0;
  let support = 0;
  for (const pillar of pillars) {
    if (pillar.position !== "day") {
      total += STRENGTH_WEIGHT.stem;
      if (supports(pillar.stem.element)) support += STRENGTH_WEIGHT.stem;
    }
    const weight =
      pillar.position === "month"
        ? STRENGTH_WEIGHT.monthBranch
        : pillar.position === "day"
          ? STRENGTH_WEIGHT.dayBranch
          : STRENGTH_WEIGHT.otherBranch;
    total += weight;
    if (supports(pillar.branch.element)) support += weight;
  }
  const supportRatio = Math.round((support / total) * 100) / 100;
  const branchOf = (position: PillarPosition) => pillars.find((pillar) => pillar.position === position)!.branch;
  return {
    level: supportRatio >= STRONG_RATIO ? "strong" : supportRatio <= WEAK_RATIO ? "weak" : "balanced",
    supportRatio,
    deukryeong: supports(branchOf("month").element),
    deukji: supports(branchOf("day").element),
  };
}

function ganjiOfYear(year: number) {
  const stem = HEAVENLY_STEMS[(((year - 4) % 10) + 10) % 10];
  const branch = EARTHLY_BRANCHES[(((year - 4) % 12) + 12) % 12];
  return { stem, branch };
}

function luckCycle(calculation: SajuCalculation, dayMaster: HeavenlyStem, reference: SolarDate): LuckCycle {
  const { calculationTime, gender } = calculation;
  const detail = calculateFourPillars({ ...calculationTime, isLunar: false, dayBoundary: "midnight", gender });
  const info = detail.luckPillars;
  if (!info) throw new SajuCalculationError("ENGINE_ERROR", { reason: "luck pillars missing" });

  const start = new Date(
    Date.UTC(
      calculationTime.year + info.startYears,
      calculationTime.month - 1 + info.startMonths,
      calculationTime.day + info.startDays,
    ),
  );
  const startOf = (index: number): DateParts => ({
    year: start.getUTCFullYear() + index * 10,
    month: start.getUTCMonth() + 1,
    day: start.getUTCDate(),
  });

  const referenceKey = dateKey(reference);
  let currentIndex: number | null = null;
  const periods = info.pillars.map((luck, index) => {
    const from = startOf(index);
    const isCurrent = referenceKey >= dateKey(from) && referenceKey < dateKey(startOf(index + 1));
    if (isCurrent) currentIndex = index;
    const { heavenlyStem: stem, earthlyBranch: branch } = luck.pillar;
    return {
      index,
      startAge: info.startAge + index * 10,
      startYear: from.year,
      startMonth: from.month,
      korean: luck.korean,
      hanja: `${stemHanja(stem)}${branchHanja(branch)}`,
      stem: { korean: stem, element: ELEMENT_KEY[getHeavenlyStemElement(stem)], tenGod: getTenGod(dayMaster, stem) },
      branch: {
        korean: branch,
        element: ELEMENT_KEY[getEarthlyBranchElement(branch)],
        tenGod: getBranchTenGod(dayMaster, branch),
        twelveStage: twelveStage(dayMaster, branch),
      },
      isCurrent,
    };
  });

  return { direction: info.forward ? "forward" : "backward", startAge: info.startAge, periods, currentIndex };
}

function yearlyFortunes(birthYear: number, dayMaster: HeavenlyStem, reference: SolarDate, luck: LuckCycle): YearFortune[] {
  return Array.from({ length: YEARLY_FORTUNE_SPAN }, (_, offset) => {
    const year = reference.year + offset;
    const { stem, branch } = ganjiOfYear(year);
    const midYear = dateKey({ year, month: MID_YEAR_MONTH, day: 1 });
    const period = [...luck.periods]
      .reverse()
      .find((candidate) => dateKey({ year: candidate.startYear, month: candidate.startMonth, day: 1 }) <= midYear);
    return {
      year,
      age: year - birthYear,
      korean: `${stem}${branch}`,
      hanja: `${stemHanja(stem)}${branchHanja(branch)}`,
      stem: { korean: stem, element: ELEMENT_KEY[getHeavenlyStemElement(stem)], tenGod: getTenGod(dayMaster, stem) },
      branch: {
        korean: branch,
        element: ELEMENT_KEY[getEarthlyBranchElement(branch)],
        tenGod: getBranchTenGod(dayMaster, branch),
        twelveStage: twelveStage(dayMaster, branch),
      },
      luckIndex: period ? period.index : null,
    };
  });
}

function ageOn(birth: SolarDate, reference: SolarDate) {
  const hadBirthday = reference.month * 100 + reference.day >= birth.month * 100 + birth.day;
  return reference.year - birth.year - (hadBirthday ? 0 : 1);
}

/**
 * 계산된 8글자(시간을 모르면 6글자)를 해석에 쓰는 구조로 정리한다.
 * 지장간·12운성·합충·대운처럼 표로 정해지는 값만 계산하며, 격국·용신처럼 학파마다 판단이 갈리는 값은 넣지 않는다.
 * 신강/신약은 근거(득령·득지·돕는 기운 비중)와 함께 참고값으로만 제공한다.
 */
export function buildSajuProfile(calculation: SajuCalculation, options: { referenceDate?: SolarDate } = {}): SajuProfile {
  const referenceDate = options.referenceDate ?? todayInKorea();
  const dayMaster = calculation.dayPillar.heavenlyStem;
  const voidBranches = getVoidBranches(dayMaster, calculation.dayPillar.earthlyBranch);

  const source: [PillarPosition, SajuPillar | null][] = [
    ["year", calculation.yearPillar],
    ["month", calculation.monthPillar],
    ["day", calculation.dayPillar],
    ["hour", calculation.hourPillar],
  ];
  const pillars: ProfilePillar[] = source.flatMap(([position, pillar]) =>
    pillar
      ? [
          {
            position,
            label: LABELS[position],
            stem: stemGlyph(dayMaster, pillar.heavenlyStem, position === "day"),
            branch: branchGlyph(dayMaster, pillar.earthlyBranch, voidBranches),
            uncertain:
              (position === "year" && calculation.uncertainty.yearPillar) ||
              (position === "month" && calculation.uncertainty.monthPillar),
          },
        ]
      : [],
  );

  const counts = Object.fromEntries(ELEMENT_ORDER.map((key) => [key, 0])) as Record<FiveElementKey, number>;
  const tenGodGroups: Record<TenGodGroup, number> = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  for (const pillar of pillars) {
    counts[pillar.stem.element]++;
    counts[pillar.branch.element]++;
    if (pillar.stem.tenGod !== "일간") tenGodGroups[TEN_GOD_GROUP[pillar.stem.tenGod]]++;
    tenGodGroups[TEN_GOD_GROUP[pillar.branch.tenGod]]++;
  }
  const max = Math.max(...Object.values(counts));

  const dayMasterGlyph = pillars.find((pillar) => pillar.position === "day")!.stem;
  const luck = luckCycle(calculation, dayMaster, referenceDate);

  return {
    calculation,
    referenceDate,
    age: ageOn(calculation.solarDate, referenceDate),
    dayMaster: { ...dayMasterGlyph, strength: dayStrength(pillars, dayMasterGlyph.element) },
    pillars,
    fiveElements: {
      counts,
      total: pillars.length * 2,
      dominant: ELEMENT_ORDER.filter((key) => counts[key] === max),
      missing: ELEMENT_ORDER.filter((key) => counts[key] === 0),
    },
    tenGodGroups,
    relations: findRelations(pillars),
    voidBranches,
    luck,
    yearlyFortunes: yearlyFortunes(calculation.solarDate.year, dayMaster, referenceDate, luck),
  };
}
