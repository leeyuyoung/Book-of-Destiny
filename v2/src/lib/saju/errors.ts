export type SajuErrorCode =
  | "INVALID_LUNAR_DATE"
  | "INVALID_DATE"
  | "FUTURE_DATE"
  | "OUT_OF_RANGE"
  | "CROSS_CHECK_MISMATCH"
  | "ENGINE_ERROR";

const USER_MESSAGES: Record<SajuErrorCode, string> = {
  INVALID_LUNAR_DATE: "입력하신 음력 날짜가 존재하지 않습니다. 윤달 여부와 날짜를 다시 확인해주세요.",
  INVALID_DATE: "존재하지 않는 날짜입니다. 생년월일을 다시 확인해주세요.",
  FUTURE_DATE: "미래의 날짜로는 사주를 계산할 수 없습니다.",
  OUT_OF_RANGE: "지원하지 않는 날짜 범위입니다.",
  CROSS_CHECK_MISMATCH: "사주 계산 검증 중 문제가 발견되어 분석을 멈췄습니다. 잠시 후 다시 시도해주세요.",
  ENGINE_ERROR: "사주 계산 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

/** 사용자 입력 문제(4xx 성격)인지, 시스템 문제(5xx 성격)인지 */
const IS_USER_ERROR: Record<SajuErrorCode, boolean> = {
  INVALID_LUNAR_DATE: true,
  INVALID_DATE: true,
  FUTURE_DATE: true,
  OUT_OF_RANGE: true,
  CROSS_CHECK_MISMATCH: false,
  ENGINE_ERROR: false,
};

export class SajuCalculationError extends Error {
  readonly code: SajuErrorCode;
  readonly userMessage: string;
  readonly isUserError: boolean;
  /** 서버 로그용 상세 정보. 사용자에게 노출하지 않는다. */
  readonly detail?: unknown;

  constructor(code: SajuErrorCode, detail?: unknown, cause?: unknown) {
    super(`[saju] ${code}`, { cause });
    this.name = "SajuCalculationError";
    this.code = code;
    this.userMessage = USER_MESSAGES[code];
    this.isUserError = IS_USER_ERROR[code];
    this.detail = detail;
  }
}
