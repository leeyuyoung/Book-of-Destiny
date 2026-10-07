import type { EarthlyBranch, HeavenlyStem, TenGod, YinYang } from "manseryeok";
import type { FiveElementKey, HiddenStemRole, TwelveStage } from "./tables";
import type { SajuCalculation } from "./types";

export type { FiveElementKey, HiddenStemRole, TenGod, TwelveStage };

export type PillarPosition = "year" | "month" | "day" | "hour";
export type PillarLabel = "년주" | "월주" | "일주" | "시주";

export type TenGodGroup = "비겁" | "식상" | "재성" | "관성" | "인성";

export type StemGlyph = {
  korean: HeavenlyStem;
  hanja: string;
  element: FiveElementKey;
  yinYang: YinYang;
  /** 일간 기준 십신. 일주의 천간은 '일간' */
  tenGod: TenGod | "일간";
};

export type HiddenStem = {
  role: HiddenStemRole;
  korean: HeavenlyStem;
  hanja: string;
  element: FiveElementKey;
  tenGod: TenGod;
};

export type BranchGlyph = {
  korean: EarthlyBranch;
  hanja: string;
  element: FiveElementKey;
  yinYang: YinYang;
  /** 일간 기준 십신(지장간 정기 기준) */
  tenGod: TenGod;
  hiddenStems: HiddenStem[];
  /** 일간 기준 12운성 */
  twelveStage: TwelveStage;
  /** 일주 기준 공망에 해당하는지 */
  isVoid: boolean;
};

export type ProfilePillar = {
  position: PillarPosition;
  label: PillarLabel;
  stem: StemGlyph;
  branch: BranchGlyph;
  /** 절입 경계 출생 등으로 이 기둥이 확정되지 않았는지 */
  uncertain: boolean;
};

export type RelationType =
  | "천간합"
  | "천간충"
  | "육합"
  | "삼합"
  | "반합"
  | "방합"
  | "충"
  | "형"
  | "파"
  | "해"
  | "원진";

export type PillarRelation = {
  type: RelationType;
  positions: PillarPosition[];
  /** 관계를 이루는 글자(한자). 예: 乙庚, 卯酉 */
  hanja: string;
  /** 합이 만들어내는 오행 */
  resultElement?: FiveElementKey;
};

export type DayStrength = {
  /** 일간을 돕는(비겁·인성) 기운의 비중으로 본 경향. 학파마다 판단이 다를 수 있는 참고값이다. */
  level: "strong" | "balanced" | "weak";
  /** 0~1. 일간을 제외한 글자 중 일간을 돕는 기운의 가중 비중 */
  supportRatio: number;
  /** 월지가 일간을 돕는지(득령) */
  deukryeong: boolean;
  /** 일지가 일간을 돕는지(득지) */
  deukji: boolean;
};

export type LuckPeriod = {
  index: number;
  /** 대운이 시작되는 만 나이(대운수 기준) */
  startAge: number;
  startYear: number;
  startMonth: number;
  korean: string;
  hanja: string;
  stem: { korean: HeavenlyStem; element: FiveElementKey; tenGod: TenGod };
  branch: { korean: EarthlyBranch; element: FiveElementKey; tenGod: TenGod; twelveStage: TwelveStage };
  isCurrent: boolean;
};

export type LuckCycle = {
  direction: "forward" | "backward";
  /** 대운수(첫 대운이 시작되는 만 나이, 반올림) */
  startAge: number;
  periods: LuckPeriod[];
  /** 기준일에 해당하는 대운 인덱스. 첫 대운 전이면 null */
  currentIndex: number | null;
};

export type YearFortune = {
  year: number;
  /** 그해에 맞는 만 나이 */
  age: number;
  korean: string;
  hanja: string;
  stem: { korean: HeavenlyStem; element: FiveElementKey; tenGod: TenGod };
  branch: { korean: EarthlyBranch; element: FiveElementKey; tenGod: TenGod; twelveStage: TwelveStage };
  /** 그해 대부분이 속한 대운 인덱스 */
  luckIndex: number | null;
};

export type SajuProfile = {
  calculation: SajuCalculation;
  /** 분석 기준일(한국 날짜). 현재 대운·만 나이·세운의 기준이 된다. */
  referenceDate: { year: number; month: number; day: number };
  age: number;
  dayMaster: StemGlyph & { strength: DayStrength };
  /** 시주를 모르면 3개, 알면 4개. 순서는 년·월·일·시 */
  pillars: ProfilePillar[];
  /** 겉으로 드러난 글자(천간+지지) 기준 오행 개수 */
  fiveElements: {
    counts: Record<FiveElementKey, number>;
    total: number;
    dominant: FiveElementKey[];
    missing: FiveElementKey[];
  };
  /** 일간을 뺀 겉글자 기준 십신 그룹 개수 */
  tenGodGroups: Record<TenGodGroup, number>;
  relations: PillarRelation[];
  voidBranches: EarthlyBranch[];
  luck: LuckCycle;
  /** 기준 연도부터 10년간의 세운 */
  yearlyFortunes: YearFortune[];
};
