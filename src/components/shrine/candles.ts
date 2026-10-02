export type CandleSpec = {
  /** 화면 너비 기준 가로 위치(%) */
  x: number;
  /** 기준 화면(430px)에서의 초 높이(px) */
  height: number;
  tone: "white" | "red";
};

/** 신당 제단 위 촛불 배치. 가운데는 본문이 놓이므로 비워 둔다. */
export const CANDLES: CandleSpec[] = [
  { x: 7, height: 64, tone: "red" },
  { x: 17, height: 118, tone: "white" },
  { x: 28, height: 86, tone: "white" },
  { x: 72, height: 92, tone: "white" },
  { x: 83, height: 126, tone: "white" },
  { x: 93, height: 70, tone: "red" },
];

/** 제단 바닥에서 화면 아래까지의 거리 (화면 높이 대비) */
export const ALTAR_BOTTOM_RATIO = 0.05;

/** 화면 너비에 맞춘 초 높이. CSS의 clamp(0.75배, 너비 비례, 1.2배)와 같은 계산이다. */
export function candlePixelHeight(baseHeight: number, viewportWidth: number) {
  return Math.min(Math.max(baseHeight * 0.75, (baseHeight / 430) * viewportWidth), baseHeight * 1.2);
}

export const candleCssHeight = (baseHeight: number) =>
  `clamp(${baseHeight * 0.75}px, ${(baseHeight / 4.3).toFixed(2)}vw, ${baseHeight * 1.2}px)`;
