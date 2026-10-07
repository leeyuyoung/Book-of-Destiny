/**
 * 한국 벽시계 시각 → 현재 한국 표준시(UTC+9) 환산.
 *
 * 과거에는 표준시가 UTC+8:30이던 시기와 서머타임(시계를 1시간 앞당김) 시기가 있어,
 * 출생증명서에 적힌 시각을 그대로 UTC+9로 보면 실제 순간과 30~60분 어긋난다.
 * 표는 IANA tz database(Asia/Seoul)와 manseryeok@2.0.0 내부 표와 같으며,
 * scripts/check-saju.ts에서 manseryeok의 보정 결과와 일치하는지 검증한다.
 */

const KST_OFFSET_MIN = 540;
const MINUTE_MS = 60_000;

const STANDARD_EPOCHS = [
  { year: 1908, month: 4, day: 1, offsetMin: 510 },
  { year: 1912, month: 1, day: 1, offsetMin: 540 },
  { year: 1954, month: 3, day: 21, offsetMin: 510 },
  { year: 1961, month: 8, day: 10, offsetMin: 540 },
] as const;

type ClockPoint = readonly [year: number, month: number, day: number, hour: number];

/** 서머타임 구간 [시작, 끝) — 벽시계 기준 */
const DST_INTERVALS: ReadonlyArray<readonly [ClockPoint, ClockPoint]> = [
  [[1948, 6, 1, 0], [1948, 9, 13, 0]],
  [[1949, 4, 3, 0], [1949, 9, 11, 0]],
  [[1950, 4, 1, 0], [1950, 9, 10, 0]],
  [[1951, 5, 6, 0], [1951, 9, 9, 0]],
  [[1955, 5, 5, 0], [1955, 9, 9, 0]],
  [[1956, 5, 20, 0], [1956, 9, 30, 0]],
  [[1957, 5, 5, 0], [1957, 9, 22, 0]],
  [[1958, 5, 4, 0], [1958, 9, 21, 0]],
  [[1959, 5, 3, 0], [1959, 9, 20, 0]],
  [[1960, 5, 1, 0], [1960, 9, 18, 0]],
  [[1987, 5, 10, 2], [1987, 10, 11, 3]],
  [[1988, 5, 8, 2], [1988, 10, 9, 3]],
];

const pointKey = (year: number, month: number, day: number, hour: number) =>
  ((year * 12 + (month - 1)) * 31 + (day - 1)) * 24 + hour;

function civilOffsetMin(year: number, month: number, day: number, hour: number): number {
  const dayKey = pointKey(year, month, day, 0);
  let offset = KST_OFFSET_MIN;
  for (const epoch of STANDARD_EPOCHS) {
    if (dayKey < pointKey(epoch.year, epoch.month, epoch.day, 0)) break;
    offset = epoch.offsetMin;
  }
  const hourKey = pointKey(year, month, day, hour);
  const inDst = DST_INTERVALS.some(([start, end]) => hourKey >= pointKey(...start) && hourKey < pointKey(...end));
  return offset + (inDst ? 60 : 0);
}

export type SolarDate = { year: number; month: number; day: number };

export function todayInKorea(): SolarDate {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("-")
    .map(Number);
  return { year, month, day };
}

export type KoreaStandardTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 환산된 절대 순간 (UTC epoch ms) */
  instantMs: number;
  /** 벽시계 대비 보정량(분). 서머타임이면 -60, UTC+8:30 시기면 +30 */
  correctionMinutes: number;
};

export function toKoreaStandardTime(
  date: { year: number; month: number; day: number },
  time: { hour: number; minute: number },
): KoreaStandardTime {
  const offset = civilOffsetMin(date.year, date.month, date.day, time.hour);
  const wallMs = Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute);
  const instantMs = wallMs - offset * MINUTE_MS;
  const kst = new Date(instantMs + KST_OFFSET_MIN * MINUTE_MS);
  return {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
    hour: kst.getUTCHours(),
    minute: kst.getUTCMinutes(),
    instantMs,
    correctionMinutes: KST_OFFSET_MIN - offset,
  };
}
