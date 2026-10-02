import { calculateFourPillars, getSolarTerm } from "manseryeok";
import { calculateSaju as calculateWithSsaju } from "ssaju";
import {
  buildSajuProfile,
  calculateSaju,
  SajuCalculationError,
  type CalculateSajuInput,
  type PillarPosition,
  type SajuCalculation,
} from "../src/lib/saju";

type Birth = CalculateSajuInput["birth"];

type SsajuResult = {
  pillarDetails: Record<
    PillarPosition,
    { stemKo: string; branchKo: string; hiddenStems: Record<"여기" | "중기" | "정기", string | null> }
  >;
  tenGods: Record<PillarPosition, { stem: string; branch: string }>;
  stages12: { bong: Record<PillarPosition, string> };
  fiveElements: Record<string, number>;
  gongmang: { branchesKo: string[] };
  stemRelations: { type: string; pillars: PillarPosition[] }[];
  branchRelations: Record<string, Record<string, string>>;
  daeun: { startAge: number; list: { ganzhi: string }[] };
};
const ELEMENT_ORDER_KR = ["목", "화", "토", "금", "수"];
const CARDINAL_BRANCHES = ["子", "午", "卯", "酉"];

const solar = (year: number, month: number, day: number, hour: number | null, minute: number | null): Birth => ({
  calendarType: "solar",
  isLeapMonth: false,
  year,
  month,
  day,
  hour,
  minute,
});

const lunar = (year: number, month: number, day: number, isLeapMonth: boolean, hour: number, minute: number): Birth => ({
  calendarType: "lunar",
  isLeapMonth,
  year,
  month,
  day,
  hour,
  minute,
});

const pillarsOf = (result: SajuCalculation) =>
  [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar]
    .map((pillar) => (pillar ? `${pillar.heavenlyStem}${pillar.earthlyBranch}` : "--"))
    .join(" ");

type GoldenCase = { label: string; birth: Birth; expected: string; check?: (result: SajuCalculation) => string | null };

// expected 순서: 년주 월주 일주 시주
const goldenCases: GoldenCase[] = [
  {
    label: "기준일 1992-10-24 05:30 (만세력 공식 예시)",
    birth: solar(1992, 10, 24, 5, 30),
    expected: "임신 경술 계유 을묘",
    check: (result) =>
      result.clockCorrectionMinutes === 0 && result.uncertainty.reason === null ? null : "보정·경계 표시가 없어야 함",
  },
  {
    label: "2000-01-01 00:00 (입춘 전이라 전년도 기묘년)",
    birth: solar(2000, 1, 1, 0, 0),
    expected: "기묘 병자 무오 임자",
  },
  {
    label: "입춘 직전 2024-02-04 17:00 (입춘 17:27)",
    birth: solar(2024, 2, 4, 17, 0),
    expected: "계묘 을축 무술 신유",
  },
  {
    label: "입춘 직후 2024-02-04 17:30 → 입춘 3분 뒤라 경계 출생 표시",
    birth: solar(2024, 2, 4, 17, 30),
    expected: "갑진 병인 무술 신유",
    check: (result) =>
      result.uncertainty.yearPillar && result.uncertainty.monthPillar && result.uncertainty.reason === "near_solar_term"
        ? null
        : `경계 출생 표시 누락: ${JSON.stringify(result.uncertainty)}`,
  },
  {
    label: "경칩 1분 전 1927-03-06 22:49 → 주 엔진(KASI) 기준 이전 달, 엔진 차이 허용",
    birth: solar(1927, 3, 6, 22, 49),
    expected: "정묘 임인 기해 을해",
    check: (result) =>
      !result.uncertainty.yearPillar && result.uncertainty.monthPillar && result.uncertainty.reason === "near_solar_term"
        ? null
        : `경계 출생 표시 오류: ${JSON.stringify(result.uncertainty)}`,
  },
  {
    label: "서머타임 1987-07-08 00:30 → 실제 07-07 23:30으로 계산",
    birth: solar(1987, 7, 8, 0, 30),
    expected: "정묘 병오 정사 경자",
    check: (result) => {
      const t = result.calculationTime;
      return result.clockCorrectionMinutes === -60 && t.day === 7 && t.hour === 23 && t.minute === 30
        ? null
        : `보정 오류: ${result.clockCorrectionMinutes}분 ${JSON.stringify(t)}`;
    },
  },
  {
    label: "UTC+8:30 시기 1957-03-06 10:00 → +30분 보정",
    birth: solar(1957, 3, 6, 10, 0),
    expected: "정유 계묘 정축 을사",
    check: (result) =>
      result.clockCorrectionMinutes === 30 && result.calculationTime.hour === 10 && result.calculationTime.minute === 30
        ? null
        : `보정 오류: ${result.clockCorrectionMinutes}분 ${JSON.stringify(result.calculationTime)}`,
  },
  {
    label: "자시 2024-03-10 23:30 (자정 기준: 당일 일주 유지)",
    birth: solar(2024, 3, 10, 23, 30),
    expected: "갑진 정묘 계유 임자",
  },
  {
    label: "음력 1992-09-29 05:30 = 양력 1992-10-24",
    birth: lunar(1992, 9, 29, false, 5, 30),
    expected: "임신 경술 계유 을묘",
    check: (result) =>
      result.solarDate.year === 1992 && result.solarDate.month === 10 && result.solarDate.day === 24
        ? null
        : `양력 변환 오류: ${JSON.stringify(result.solarDate)}`,
  },
  {
    label: "음력 2020 윤4월 1일 10:00 = 양력 2020-05-23",
    birth: lunar(2020, 4, 1, true, 10, 0),
    expected: "경자 신사 병인 계사",
    check: (result) =>
      result.solarDate.month === 5 && result.solarDate.day === 23 ? null : `양력 변환 오류: ${JSON.stringify(result.solarDate)}`,
  },
  {
    label: "출생시간 모름 1992-10-24 → 시주 없음",
    birth: solar(1992, 10, 24, null, null),
    expected: "임신 경술 계유 --",
    check: (result) =>
      !result.uncertainty.yearPillar && !result.uncertainty.monthPillar && result.basis.unknownTimeReference === "12:00"
        ? null
        : `불확실성 표시 오류: ${JSON.stringify(result.uncertainty)}`,
  },
  {
    label: "출생시간 모름 + 입춘 당일 2024-02-04 → 연주·월주 불확실 표시",
    birth: solar(2024, 2, 4, null, null),
    expected: "계묘 을축 무술 --",
    check: (result) =>
      result.uncertainty.yearPillar && result.uncertainty.monthPillar
        ? null
        : `불확실성 표시 누락: ${JSON.stringify(result.uncertainty)}`,
  },
];

type ErrorCase = { label: string; birth: Birth; expectedCode: string };

const errorCases: ErrorCase[] = [
  { label: "존재하지 않는 윤달 (2021 윤4월)", birth: lunar(2021, 4, 1, true, 10, 0), expectedCode: "INVALID_LUNAR_DATE" },
  { label: "29일까지인 음력 달의 30일 (2024 음력 1월)", birth: lunar(2024, 1, 30, false, 10, 0), expectedCode: "INVALID_LUNAR_DATE" },
  { label: "존재하지 않는 양력 날짜 (2023-02-29)", birth: solar(2023, 2, 29, 10, 0), expectedCode: "INVALID_DATE" },
  { label: "미래 날짜 (2099-01-01)", birth: solar(2099, 1, 1, 10, 0), expectedCode: "FUTURE_DATE" },
];

let failures = 0;
const report = (ok: boolean, label: string, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  → ${detail}` : ""}`);
};

console.log("■ 정답 비교 (golden cases)");
for (const testCase of goldenCases) {
  try {
    const result = calculateSaju({ birth: testCase.birth, gender: "female" });
    const actual = pillarsOf(result);
    const extra = testCase.check?.(result) ?? null;
    report(actual === testCase.expected && extra === null, testCase.label, actual === testCase.expected ? extra ?? actual : `기대 ${testCase.expected} / 실제 ${actual}`);
  } catch (error) {
    report(false, testCase.label, String(error));
  }
}

console.log("\n■ 잘못된 입력 차단");
for (const testCase of errorCases) {
  try {
    calculateSaju({ birth: testCase.birth, gender: "male" });
    report(false, testCase.label, "오류가 발생하지 않음");
  } catch (error) {
    const code = error instanceof SajuCalculationError ? error.code : String(error);
    report(code === testCase.expectedCode, testCase.label, code);
  }
}

let seed = 20261003;
const random = () => {
  seed = (seed * 1664525 + 1013904223) % 2 ** 32;
  return seed / 2 ** 32;
};
const randomBirth = (fromYear: number, toYear: number): Birth => {
  const year = fromYear + Math.floor(random() * (toYear - fromYear + 1));
  const month = 1 + Math.floor(random() * 12);
  const day = 1 + Math.floor(random() * new Date(year, month, 0).getDate());
  return solar(year, month, day, Math.floor(random() * 24), Math.floor(random() * 60));
};
const describe = (birth: Birth) => `${birth.year}-${birth.month}-${birth.day} ${birth.hour}:${birth.minute}`;

console.log("\n■ 과거 표준시·서머타임 보정표가 manseryeok 내장 보정과 같은지 (1948~1961, 1987~1988년 무작위 3,000건)");
const CLOCK_SAMPLE_COUNT = 3000;
let clockFailures = 0;
for (let index = 0; index < CLOCK_SAMPLE_COUNT; index++) {
  const birth = index % 3 === 0 ? randomBirth(1987, 1988) : randomBirth(1948, 1961);
  let ours: string;
  try {
    ours = pillarsOf(calculateSaju({ birth, gender: "female" }));
  } catch (error) {
    clockFailures++;
    if (clockFailures <= 5) {
      const detail = error instanceof SajuCalculationError ? JSON.stringify(error.detail) : String(error);
      console.log(`  오류 ${describe(birth)} ${detail}`);
    }
    continue;
  }
  const builtIn = calculateFourPillars({
    year: birth.year,
    month: birth.month,
    day: birth.day,
    hour: birth.hour!,
    minute: birth.minute!,
    dayBoundary: "midnight",
    trueSolarTime: { longitude: 135, applyEquationOfTime: false, applyHistoricalDst: true },
  });
  const expected = [builtIn.year, builtIn.month, builtIn.day, builtIn.hour]
    .map((pillar) => `${pillar.heavenlyStem}${pillar.earthlyBranch}`)
    .join(" ");
  if (ours !== expected) {
    clockFailures++;
    if (clockFailures <= 5) console.log(`  차이 ${describe(birth)} 우리 ${ours} / 내장 ${expected}`);
  }
}
report(clockFailures === 0, `보정표 비교 ${CLOCK_SAMPLE_COUNT}건`, `차이 ${clockFailures}건`);

console.log("\n■ 두 엔진 대량 교차검증 (1920~2025년 무작위 5,000건)");
const SAMPLE_COUNT = 5000;
let crossFailures = 0;
let boundaryCount = 0;
for (let index = 0; index < SAMPLE_COUNT; index++) {
  const birth = randomBirth(1920, 2025);
  try {
    const result = calculateSaju({ birth, gender: random() < 0.5 ? "male" : "female" });
    if (result.uncertainty.reason === "near_solar_term") boundaryCount++;
  } catch (error) {
    crossFailures++;
    if (crossFailures <= 5) {
      const detail = error instanceof SajuCalculationError ? JSON.stringify(error.detail) : String(error);
      console.log(`  불일치 ${describe(birth)} ${detail}`);
    }
  }
}
report(crossFailures === 0, `교차검증 ${SAMPLE_COUNT}건`, `불일치 ${crossFailures}건, 경계 출생 표시 ${boundaryCount}건`);

console.log("\n■ 절입 경계 집중 교차검증 (1920~2025년 모든 절입 ±75분, 1분 간격)");
let edgeFailures = 0;
let edgeChecked = 0;
for (let year = 1920; year <= 2025; year++) {
  for (let termIndex = 0; termIndex < 24; termIndex += 2) {
    const termMs = getSolarTerm(year, termIndex).date.getTime();
    for (let offset = -75; offset <= 75; offset++) {
      const kst = new Date(termMs + (9 * 60 + offset) * 60_000);
      const birth = solar(kst.getUTCFullYear(), kst.getUTCMonth() + 1, kst.getUTCDate(), kst.getUTCHours(), kst.getUTCMinutes());
      edgeChecked++;
      try {
        calculateSaju({ birth, gender: "male" });
      } catch (error) {
        edgeFailures++;
        if (edgeFailures <= 5) {
          const detail = error instanceof SajuCalculationError ? JSON.stringify(error.detail) : String(error);
          console.log(`  불일치 ${describe(birth)} ${detail}`);
        }
      }
    }
  }
}
report(edgeFailures === 0, `경계 검증 ${edgeChecked}건`, `불일치 ${edgeFailures}건`);

console.log("\n■ 구조화 프로필 정답 비교 (1992-10-24 05:30 여, 기준일 2026-10-03)");
{
  const profile = buildSajuProfile(calculateSaju({ birth: solar(1992, 10, 24, 5, 30), gender: "female" }), {
    referenceDate: { year: 2026, month: 10, day: 3 },
  });
  const byPosition = Object.fromEntries(profile.pillars.map((pillar) => [pillar.position, pillar]));
  const hidden = (position: string) => byPosition[position].branch.hiddenStems.map((stem) => stem.korean).join("");
  const relationKeys = profile.relations.map((relation) => `${relation.type}:${relation.hanja}`).sort();
  const expectations: [string, unknown, unknown][] = [
    ["지장간", ["year", "month", "day", "hour"].map(hidden).join(" "), "무임경 신정무 경신 갑을"],
    ["12운성", ["hour", "day", "month", "year"].map((p) => byPosition[p].branch.twelveStage).join(" "), "장생 병 쇠 사"],
    ["십신", ["year", "month", "hour"].map((p) => `${byPosition[p].stem.tenGod}/${byPosition[p].branch.tenGod}`).join(" "), "겁재/정인 정인/정관 식신/식신"],
    ["오행", JSON.stringify(profile.fiveElements.counts), JSON.stringify({ wood: 2, fire: 0, earth: 1, metal: 3, water: 2 })],
    ["부족 오행", profile.fiveElements.missing.join(","), "fire"],
    ["합충", relationKeys.join(" "), ["천간합:庚乙", "육합:戌卯", "충:酉卯", "해:戌酉", "원진:申卯", "방합:申戌酉"].sort().join(" ")],
    ["공망", `${profile.voidBranches.join("")} 월지공망=${byPosition.month.branch.isVoid}`, "술해 월지공망=true"],
    ["대운", `${profile.luck.direction} ${profile.luck.startAge} ${profile.luck.periods.slice(0, 3).map((p) => p.korean).join(" ")}`, "backward 5 기유 무신 정미"],
    ["현재 대운", profile.luck.currentIndex, 2],
    ["만 나이", profile.age, 33],
    ["2026년 세운", `${profile.yearlyFortunes[0].korean} 대운${profile.yearlyFortunes[0].luckIndex}`, "병오 대운2"],
  ];
  for (const [label, actual, expected] of expectations) {
    report(actual === expected, `프로필 ${label}`, actual === expected ? String(actual) : `기대 ${expected} / 실제 ${actual}`);
  }

  const noTime = buildSajuProfile(calculateSaju({ birth: solar(1992, 10, 24, null, null), gender: "female" }));
  const noTimeSummary = `${noTime.pillars.length}기둥 ${noTime.fiveElements.total}글자 ${JSON.stringify(noTime.fiveElements.counts)}`;
  const noTimeExpected = `3기둥 6글자 ${JSON.stringify({ wood: 0, fire: 0, earth: 1, metal: 3, water: 2 })}`;
  report(noTimeSummary === noTimeExpected, "프로필 출생시간 모름", noTimeSummary);
}

console.log("\n■ 구조화 프로필 ssaju 교차검증 (보정 없는 연도 무작위 2,000건)");
{
  const PROFILE_SAMPLE_COUNT = 2000;
  const COMPARED_RELATIONS = ["육합", "삼합", "반합", "방합", "충", "형", "파", "해", "원진"] as const;
  const mismatchCounts: Record<string, number> = {};
  let compared = 0;
  let skipped = 0;
  const fail = (key: string, message: string) => {
    mismatchCounts[key] = (mismatchCounts[key] ?? 0) + 1;
    if (mismatchCounts[key] <= 3) console.log(`  [${key}] ${message}`);
  };

  for (let index = 0; index < PROFILE_SAMPLE_COUNT; index++) {
    const birth = index % 2 === 0 ? randomBirth(1962, 1986) : randomBirth(1989, 2025);
    const gender = random() < 0.5 ? "male" : "female";
    const profile = buildSajuProfile(calculateSaju({ birth, gender }), { referenceDate: { year: 2026, month: 10, day: 3 } });
    const other = calculateWithSsaju({
      year: birth.year,
      month: birth.month,
      day: birth.day,
      hour: birth.hour!,
      minute: birth.minute!,
      gender: gender === "male" ? "남" : "여",
    } as Parameters<typeof calculateWithSsaju>[0]) as unknown as SsajuResult;

    const ourPillars = profile.pillars.map((p) => `${p.stem.korean}${p.branch.korean}`).join(" ");
    const theirPillars = (["year", "month", "day", "hour"] as const)
      .map((p) => `${other.pillarDetails[p].stemKo}${other.pillarDetails[p].branchKo}`)
      .join(" ");
    if (ourPillars !== theirPillars) {
      skipped++;
      continue;
    }
    compared++;
    const label = `${describe(birth)} ${ourPillars}`;

    for (const pillar of profile.pillars) {
      const theirs = other.pillarDetails[pillar.position];
      const theirGods = other.tenGods[pillar.position];
      if (pillar.position !== "day" && pillar.stem.tenGod !== theirGods.stem) fail("천간 십신", `${label} ${pillar.position}`);
      if (pillar.branch.tenGod !== theirGods.branch) fail("지지 십신", `${label} ${pillar.position}`);
      if (pillar.branch.twelveStage !== other.stages12.bong[pillar.position]) fail("12운성", `${label} ${pillar.position}`);
      for (const role of ["여기", "중기", "정기"] as const) {
        const ours = pillar.branch.hiddenStems.find((stem) => stem.role === role)?.hanja ?? null;
        const their = theirs.hiddenStems[role];
        if (role === "여기" && their === null) continue;
        if (ours !== their) fail("지장간", `${label} ${pillar.position} ${role} 우리 ${ours} / ssaju ${their}`);
      }
    }

    const theirCounts = ELEMENT_ORDER_KR.map((key) => other.fiveElements[key]).join(",");
    const ourCounts = (["wood", "fire", "earth", "metal", "water"] as const).map((key) => profile.fiveElements.counts[key]).join(",");
    if (ourCounts !== theirCounts) fail("오행", `${label} 우리 ${ourCounts} / ssaju ${theirCounts}`);

    if (profile.voidBranches.join("") !== other.gongmang.branchesKo.join("")) fail("공망", label);

    // ssaju와 정의가 다른 부분: 우리는 자형(같은 글자 형)을 포함하고, 반합은 왕지(子午卯酉)가 있어야 인정한다.
    for (const type of COMPARED_RELATIONS) {
      const ourRelations = profile.relations.filter(
        (r) => r.type === type && !(type === "형" && new Set(r.hanja).size === 1),
      );
      const ours = [...new Set(ourRelations.flatMap((r) => r.positions))].sort().join(",");
      const theirEntries = Object.entries(other.branchRelations[type] ?? {}).filter(
        ([, description]) =>
          type !== "반합" || description.split(", ").some((item) => [...item.slice(0, 2)].some((c) => CARDINAL_BRANCHES.includes(c))),
      );
      const theirs = theirEntries.map(([position]) => position).sort().join(",");
      if (ours !== theirs) fail(type, `${label} 우리 [${ours}] / ssaju [${theirs}]`);
    }
    const ourStemCombos = profile.relations.filter((r) => r.type === "천간합").map((r) => [...r.positions].sort().join("-")).sort().join(" ");
    const theirStemCombos = other.stemRelations.filter((r) => r.type === "합").map((r) => [...r.pillars].sort().join("-")).sort().join(" ");
    if (ourStemCombos !== theirStemCombos) fail("천간합", `${label} 우리 [${ourStemCombos}] / ssaju [${theirStemCombos}]`);

    const ourLuck = profile.luck.periods.slice(0, 8).map((p) => p.hanja).join(" ");
    const theirLuck = other.daeun.list.slice(0, 8).map((p) => p.ganzhi).join(" ");
    if (ourLuck !== theirLuck) fail("대운 간지", `${label} 우리 ${ourLuck} / ssaju ${theirLuck}`);
    if (Math.abs(profile.luck.startAge - other.daeun.startAge) > 1) {
      fail("대운수", `${label} 우리 ${profile.luck.startAge} / ssaju ${other.daeun.startAge}`);
    }
  }

  const totalMismatches = Object.values(mismatchCounts).reduce((sum, count) => sum + count, 0);
  report(
    totalMismatches === 0,
    `프로필 교차검증 ${compared}건 (8글자 다른 표본 ${skipped}건 제외)`,
    totalMismatches === 0 ? "" : JSON.stringify(mismatchCounts),
  );
}

if (failures > 0) {
  console.error(`\n${failures}개 항목 실패`);
  process.exit(1);
}
console.log("\n모든 사주 계산 검증 통과");
