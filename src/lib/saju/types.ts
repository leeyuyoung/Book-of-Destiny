import type { EarthlyBranch, FiveElement, HeavenlyStem, YinYang } from "manseryeok";

export type { EarthlyBranch, FiveElement, HeavenlyStem, YinYang };

export type CalendarType = "solar" | "lunar";
export type Gender = "female" | "male";

export type CalculateSajuInput = {
  birth: {
    calendarType: CalendarType;
    isLeapMonth: boolean;
    year: number;
    month: number;
    day: number;
    /** 출생시간을 모르면 null */
    hour: number | null;
    minute: number | null;
  };
  gender: Gender;
};

/** 기둥 하나(천간 1글자 + 지지 1글자) */
export type SajuPillar = {
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
  stemHanja: string;
  branchHanja: string;
  stemElement: FiveElement;
  branchElement: FiveElement;
  stemYinYang: YinYang;
  branchYinYang: YinYang;
};

export type SajuCalculation = {
  yearPillar: SajuPillar;
  monthPillar: SajuPillar;
  dayPillar: SajuPillar;
  /** 출생시간을 모르면 null */
  hourPillar: SajuPillar | null;

  /** 계산에 실제로 사용한 양력 날짜 (음력 입력은 변환된 값) */
  solarDate: { year: number; month: number; day: number };
  /** 같은 날의 음력 날짜 */
  lunarDate: { year: number; month: number; day: number; isLeapMonth: boolean };
  /** 사용자가 입력한 출생시각(당시 벽시계 기준). 시간을 모르면 null */
  birthTime: { hour: number; minute: number } | null;
  /**
   * 과거 표준시·서머타임을 보정해 현재 한국 표준시(UTC+9)로 환산한, 실제 계산에 쓴 시각.
   * 출생시간을 모르면 정오 기준값을 환산한 것이다.
   */
  calculationTime: { year: number; month: number; day: number; hour: number; minute: number };
  /** 입력 시각 대비 보정량(분). 서머타임 출생이면 -60, 1954~61년 출생이면 +30, 그 외 0 */
  clockCorrectionMinutes: number;
  gender: Gender;

  /**
   * 연주/월주를 확정하기 어려운지.
   * - unknown_time: 출생시간을 몰라서, 그날 안에 절기가 바뀌어 하루 중 시각에 따라 기둥이 달라진다.
   * - near_solar_term: 출생 시각이 절기가 바뀌는 순간과 몇 분 차이라 기록 오차에 따라 기둥이 달라질 수 있다.
   * true인 기둥은 AI 해석에서 '경계 출생'임을 언급해야 한다.
   */
  uncertainty: {
    yearPillar: boolean;
    monthPillar: boolean;
    reason: "unknown_time" | "near_solar_term" | null;
  };

  /** 계산 기준. 리포트와 고객 문의 대응에 그대로 쓴다. */
  basis: {
    engine: string;
    crossCheckedWith: string;
    timezone: "Asia/Seoul";
    dayBoundary: "midnight";
    trueSolarTime: false;
    historicalClockCorrection: true;
    /** 절기 경계로부터 이 시간(분) 안의 출생은 경계 출생으로 표시하고, 엔진 간 연주/월주 차이를 허용한다 */
    solarTermBoundaryMinutes: number;
    unknownTimeReference: "12:00" | null;
  };
};
