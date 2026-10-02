import {
  EARTHLY_BRANCHES,
  EARTHLY_BRANCHES_HANJA,
  HEAVENLY_STEMS,
  HEAVENLY_STEMS_HANJA,
  type EarthlyBranch,
  type FiveElement,
  type HeavenlyStem,
} from "manseryeok";

export type FiveElementKey = "wood" | "fire" | "earth" | "metal" | "water";

export const ELEMENT_KEY: Record<FiveElement, FiveElementKey> = {
  목: "wood",
  화: "fire",
  토: "earth",
  금: "metal",
  수: "water",
};

export const ELEMENT_KOREAN: Record<FiveElementKey, FiveElement> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

export const ELEMENT_ORDER: FiveElementKey[] = ["wood", "fire", "earth", "metal", "water"];

/** a가 생(生)하는 오행 */
export const GENERATES: Record<FiveElementKey, FiveElementKey> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

export const stemIndex = (stem: HeavenlyStem) => HEAVENLY_STEMS.indexOf(stem);
export const branchIndex = (branch: EarthlyBranch) => EARTHLY_BRANCHES.indexOf(branch);
export const stemHanja = (stem: HeavenlyStem) => HEAVENLY_STEMS_HANJA[stemIndex(stem)];
export const branchHanja = (branch: EarthlyBranch) => EARTHLY_BRANCHES_HANJA[branchIndex(branch)];

export type HiddenStemRole = "여기" | "중기" | "정기";

/** 지장간(地藏干). 한국에서 가장 널리 쓰는 월률분야 기준: 여기 → 중기 → 정기(본기) */
export const HIDDEN_STEMS: Record<EarthlyBranch, Partial<Record<HiddenStemRole, HeavenlyStem>>> = {
  자: { 여기: "임", 정기: "계" },
  축: { 여기: "계", 중기: "신", 정기: "기" },
  인: { 여기: "무", 중기: "병", 정기: "갑" },
  묘: { 여기: "갑", 정기: "을" },
  진: { 여기: "을", 중기: "계", 정기: "무" },
  사: { 여기: "무", 중기: "경", 정기: "병" },
  오: { 여기: "병", 중기: "기", 정기: "정" },
  미: { 여기: "정", 중기: "을", 정기: "기" },
  신: { 여기: "무", 중기: "임", 정기: "경" },
  유: { 여기: "경", 정기: "신" },
  술: { 여기: "신", 중기: "정", 정기: "무" },
  해: { 여기: "무", 중기: "갑", 정기: "임" },
};

export const TWELVE_STAGES = ["장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절", "태", "양"] as const;
export type TwelveStage = (typeof TWELVE_STAGES)[number];

/** 천간별 장생(長生) 지지. 양간은 순행, 음간은 역행한다. */
const LONG_LIFE_BRANCH: Record<HeavenlyStem, EarthlyBranch> = {
  갑: "해",
  을: "오",
  병: "인",
  정: "유",
  무: "인",
  기: "유",
  경: "사",
  신: "자",
  임: "신",
  계: "묘",
};

/** 일간(또는 어떤 천간) 기준으로 지지의 12운성을 구한다 */
export function twelveStage(stem: HeavenlyStem, branch: EarthlyBranch): TwelveStage {
  const start = branchIndex(LONG_LIFE_BRANCH[stem]);
  const target = branchIndex(branch);
  const yang = stemIndex(stem) % 2 === 0;
  const step = yang ? (target - start + 12) % 12 : (start - target + 12) % 12;
  return TWELVE_STAGES[step];
}

type Combination<T> = { members: T[]; element?: FiveElementKey };

export const STEM_COMBINATIONS: Combination<HeavenlyStem>[] = [
  { members: ["갑", "기"], element: "earth" },
  { members: ["을", "경"], element: "metal" },
  { members: ["병", "신"], element: "water" },
  { members: ["정", "임"], element: "wood" },
  { members: ["무", "계"], element: "fire" },
];

export const STEM_CLASHES: HeavenlyStem[][] = [
  ["갑", "경"],
  ["을", "신"],
  ["병", "임"],
  ["정", "계"],
];

export const SIX_COMBINATIONS: Combination<EarthlyBranch>[] = [
  { members: ["자", "축"], element: "earth" },
  { members: ["인", "해"], element: "wood" },
  { members: ["묘", "술"], element: "fire" },
  { members: ["진", "유"], element: "metal" },
  { members: ["사", "신"], element: "water" },
  { members: ["오", "미"], element: "fire" },
];

/** 삼합. 가운데 글자가 왕지(旺支)이며, 반합은 왕지를 포함한 두 글자다. */
export const THREE_HARMONIES: Combination<EarthlyBranch>[] = [
  { members: ["신", "자", "진"], element: "water" },
  { members: ["해", "묘", "미"], element: "wood" },
  { members: ["인", "오", "술"], element: "fire" },
  { members: ["사", "유", "축"], element: "metal" },
];

export const DIRECTIONAL_HARMONIES: Combination<EarthlyBranch>[] = [
  { members: ["인", "묘", "진"], element: "wood" },
  { members: ["사", "오", "미"], element: "fire" },
  { members: ["신", "유", "술"], element: "metal" },
  { members: ["해", "자", "축"], element: "water" },
];

export const BRANCH_CLASHES: EarthlyBranch[][] = [
  ["자", "오"],
  ["축", "미"],
  ["인", "신"],
  ["묘", "유"],
  ["진", "술"],
  ["사", "해"],
];

/** 삼형(三刑). 세 글자가 모두 있으면 완전한 삼형, 두 글자만 있어도 형으로 본다. */
export const THREE_PUNISHMENTS: EarthlyBranch[][] = [
  ["인", "사", "신"],
  ["축", "술", "미"],
];
export const MUTUAL_PUNISHMENT: EarthlyBranch[] = ["자", "묘"];
export const SELF_PUNISHMENT: EarthlyBranch[] = ["진", "오", "유", "해"];

export const BRANCH_BREAKS: EarthlyBranch[][] = [
  ["자", "유"],
  ["축", "진"],
  ["인", "해"],
  ["묘", "오"],
  ["사", "신"],
  ["미", "술"],
];

export const BRANCH_HARMS: EarthlyBranch[][] = [
  ["자", "미"],
  ["축", "오"],
  ["인", "사"],
  ["묘", "진"],
  ["신", "해"],
  ["유", "술"],
];

export const BRANCH_RESENTMENTS: EarthlyBranch[][] = [
  ["자", "미"],
  ["축", "오"],
  ["인", "유"],
  ["묘", "신"],
  ["진", "해"],
  ["사", "술"],
];
