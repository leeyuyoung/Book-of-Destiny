import type { EarthlyBranch, HeavenlyStem } from "manseryeok";
import type { FiveElementKey, PillarPosition, SajuProfile } from "./profileTypes";

/**
 * 도화(매력) 관련 신살과 지수를 만세력 결과만으로 계산한다. AI를 쓰지 않으므로 같은 사주는 항상 같은 값이 나온다.
 * 도화·화개는 년지·일지의 삼합 기준, 홍염은 일간 기준 표를 쓴다.
 */

type TriadGroup = { members: EarthlyBranch[]; dohwa: EarthlyBranch; hwagae: EarthlyBranch };

const TRIAD_GROUPS: TriadGroup[] = [
  { members: ["인", "오", "술"], dohwa: "묘", hwagae: "술" },
  { members: ["신", "자", "진"], dohwa: "유", hwagae: "진" },
  { members: ["사", "유", "축"], dohwa: "오", hwagae: "축" },
  { members: ["해", "묘", "미"], dohwa: "자", hwagae: "미" },
];

const HONGYEOM: Record<HeavenlyStem, EarthlyBranch> = {
  갑: "오",
  을: "오",
  병: "인",
  정: "미",
  무: "진",
  기: "진",
  경: "술",
  신: "유",
  임: "자",
  계: "신",
};

/** 子午卯酉. 그 자체로 도화의 기운이 강한 글자 */
const PEACH_BRANCHES: EarthlyBranch[] = ["자", "오", "묘", "유"];

export type CharmStarKey = "dohwa" | "hongyeom" | "hwagae";

export type CharmStar = {
  key: CharmStarKey;
  name: string;
  hanja: string;
  /** 이 살이 놓인 기둥. 비어 있으면 사주에 없다. */
  positions: PillarPosition[];
  /** 이 살을 이루는 지지. 대운·세운에서 이 글자가 들어오면 살이 깨어난다. */
  triggers: EarthlyBranch[];
  /** 원국에 있으면 80~99, 없으면 잠재력으로 70~79 */
  score: number;
};

export type CharmIndexKey = "allure" | "sensual" | "mystery" | "flirt" | "popularity";

export type DohwaReading = {
  /** 78~99. indices도 같은 범위 */
  score: number;
  indices: Record<CharmIndexKey, number>;
  stars: CharmStar[];
  /** 유형은 일간 오행으로 정한다. */
  typeKey: FiveElementKey;
};

const SCORE_RANGE = { min: 40, max: 99 } as const;
/** 누구에게나 꽃은 있다는 세계관에 맞춰 점수의 바닥을 올려 둔다. 종합 점수 중앙값이 70점대 초반이 된다. */
const SCORE_LIFT = 5;
const clampScore = (value: number) => Math.round(Math.min(SCORE_RANGE.max, Math.max(SCORE_RANGE.min, value)));
/**
 * 실망하지 않도록 화면에는 78점 미만이 나오지 않게, 계산한 점수를 순서는 지킨 채 78~99점으로 옮겨 보여준다.
 * 계산 점수는 실제로 55점 아래가 거의 없어서 55점을 바닥으로 잡아야 점수가 고르게 퍼진다.
 */
const DISPLAY_RANGE = { min: 78, max: 99 } as const;
const RAW_FLOOR = 55;
const toDisplay = (value: number) =>
  Math.round(
    DISPLAY_RANGE.min +
      (Math.max(0, value - RAW_FLOOR) * (DISPLAY_RANGE.max - DISPLAY_RANGE.min)) / (SCORE_RANGE.max - RAW_FLOOR),
  );

const triadOf = (branch: EarthlyBranch) => TRIAD_GROUPS.find((group) => group.members.includes(branch))!;

function triadStarTriggers(profile: SajuProfile, pick: (group: TriadGroup) => EarthlyBranch): EarthlyBranch[] {
  const bases = profile.pillars.filter((pillar) => pillar.position === "year" || pillar.position === "day");
  return [...new Set(bases.map((base) => pick(triadOf(base.branch.korean))))];
}

function triadStarPositions(profile: SajuProfile, pick: (group: TriadGroup) => EarthlyBranch): PillarPosition[] {
  const found = new Set<PillarPosition>();
  for (const base of profile.pillars.filter((pillar) => pillar.position === "year" || pillar.position === "day")) {
    const target = pick(triadOf(base.branch.korean));
    for (const pillar of profile.pillars) {
      if (pillar.position !== base.position && pillar.branch.korean === target) found.add(pillar.position);
    }
  }
  return profile.pillars.map((pillar) => pillar.position).filter((position) => found.has(position));
}

/** 살이 놓인 자리마다 더하는 점수. 나 자신과 가장 가까운 일지가 가장 짙다. */
const STAR_POSITION_WEIGHT: Record<PillarPosition, number> = { day: 6, month: 4, hour: 3, year: 2 };

/**
 * 매력살 점수. 원국에 있으면 자리와 개수로 80~99점,
 * 없으면 70점에서 시작해 앞으로 10년 세운과 남은 대운에 살을 깨우는 글자가 들어오는 만큼 79점까지 올린다.
 */
function starScore(profile: SajuProfile, positions: PillarPosition[], triggers: EarthlyBranch[]): number {
  if (positions.length > 0) {
    const weight = positions.reduce((sum, position) => sum + STAR_POSITION_WEIGHT[position], 0);
    return Math.min(99, 82 + weight + (positions.length - 1) * 4);
  }
  const years = profile.yearlyFortunes.filter((fortune) => triggers.includes(fortune.branch.korean)).length;
  const periods = profile.luck.periods.filter(
    (period) => period.startYear + 9 >= profile.referenceDate.year && triggers.includes(period.branch.korean),
  ).length;
  return 70 + Math.min(9, years * 2 + periods * 3);
}

export function readDohwa(profile: SajuProfile): DohwaReading {
  const hongyeomTarget = HONGYEOM[profile.dayMaster.korean];
  const starBases: Omit<CharmStar, "score">[] = [
    {
      key: "dohwa",
      name: "도화살",
      hanja: "桃花煞",
      positions: triadStarPositions(profile, (group) => group.dohwa),
      triggers: triadStarTriggers(profile, (group) => group.dohwa),
    },
    {
      key: "hongyeom",
      name: "홍염살",
      hanja: "紅艶煞",
      positions: profile.pillars.filter((pillar) => pillar.branch.korean === hongyeomTarget).map((pillar) => pillar.position),
      triggers: [hongyeomTarget],
    },
    {
      key: "hwagae",
      name: "화개살",
      hanja: "華蓋煞",
      positions: triadStarPositions(profile, (group) => group.hwagae),
      triggers: triadStarTriggers(profile, (group) => group.hwagae),
    },
  ];
  const stars: CharmStar[] = starBases.map((star) => ({ ...star, score: starScore(profile, star.positions, star.triggers) }));
  const starCount = (key: CharmStarKey) => stars.find((star) => star.key === key)!.positions.length;

  const branches = profile.pillars.map((pillar) => pillar.branch);
  const peach = branches.filter((branch) => PEACH_BRANCHES.includes(branch.korean)).length;
  const bath = branches.filter((branch) => branch.twelveStage === "목욕").length;
  const dayBranchPeach = PEACH_BRANCHES.includes(profile.pillars.find((pillar) => pillar.position === "day")!.branch.korean);
  const { counts } = profile.fiveElements;
  const groups = profile.tenGodGroups;
  const partner = profile.calculation.gender === "female" ? groups.관성 : groups.재성;

  const lifted = (raw: number) => clampScore(raw + SCORE_LIFT);
  const indices: Record<CharmIndexKey, number> = {
    allure: lifted(52 + starCount("dohwa") * 14 + peach * 6 + bath * 4),
    sensual: lifted(50 + starCount("hongyeom") * 16 + (dayBranchPeach ? 6 : 0) + counts.water * 4 + counts.fire * 3),
    mystery: lifted(48 + starCount("hwagae") * 14 + groups.인성 * 5 + counts.water * 3),
    flirt: lifted(50 + groups.식상 * 8 + counts.fire * 4),
    popularity: lifted(50 + partner * 7 + peach * 4 + groups.비겁 * 2),
  };

  const weighted =
    indices.allure * 0.35 + indices.sensual * 0.25 + indices.flirt * 0.15 + indices.popularity * 0.15 + indices.mystery * 0.1;
  const starBonus = stars.filter((star) => star.positions.length > 0).length * 3;

  const displayIndices = Object.fromEntries(
    Object.entries(indices).map(([key, value]) => [key, toDisplay(value)]),
  ) as Record<CharmIndexKey, number>;

  return {
    score: toDisplay(clampScore(weighted + starBonus)),
    indices: displayIndices,
    stars,
    typeKey: profile.dayMaster.element,
  };
}
