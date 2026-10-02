import { candleCssHeight, type CandleSpec } from "./candles";

type CandleProps = CandleSpec & {
  lit: boolean;
  /** 불이 붙는 순서용 지연(초) */
  igniteDelay?: number;
};

/** 제단 위의 초 한 자루. 불꽃은 일렁이고, 주변으로 따뜻한 빛이 번진다. */
export function Candle({ x, height, tone, lit, igniteDelay = 0 }: CandleProps) {
  const wax =
    tone === "red"
      ? "linear-gradient(90deg, #4a0907 0%, #9c1a16 35%, #c2332a 50%, #8a1411 70%, #3d0705 100%)"
      : "linear-gradient(90deg, #8f8170 0%, #e6dccb 35%, #fbf5ea 50%, #d9cdb8 70%, #776a5a 100%)";
  const transition = `opacity 900ms ease ${igniteDelay}s, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) ${igniteDelay}s`;

  return (
    <div className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${x}%` }}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: lit ? 1 : 0, transition }}
      >
        <div
          className="h-full w-full rounded-full animate-glow-pulse"
          style={{ background: "radial-gradient(circle, rgb(255 170 70 / 0.32), rgb(214 80 30 / 0.12) 40%, transparent 70%)" }}
        />
      </div>

      <div
        className="relative mb-[-2px] h-7 w-3.5 origin-bottom"
        style={{ opacity: lit ? 1 : 0, transform: lit ? "scale(1)" : "scale(0.2)", transition }}
      >
        <div
          className="absolute inset-0 origin-bottom animate-flicker"
          style={{
            borderRadius: "50% 50% 45% 45% / 65% 65% 35% 35%",
            background:
              "radial-gradient(ellipse 45% 60% at 50% 72%, #fffbe8 0%, #ffe08a 30%, #ff9a2e 62%, rgb(214 60 20 / 0) 100%)",
          }}
        />
        <div
          className="absolute bottom-0.5 left-1/2 h-2.5 w-1.5 -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgb(60 90 200 / 0.75), transparent 70%)" }}
        />
      </div>
      <div className="h-1.5 w-[1.5px] bg-[#1a0d08]" />

      <div className="relative w-[clamp(14px,3.6vw,20px)] rounded-t-[3px]" style={{ height: candleCssHeight(height), background: wax }}>
        <div
          className="absolute -top-px left-0 right-0 h-2 rounded-[50%]"
          style={{ background: tone === "red" ? "#b3241d" : "#f4ecdc", opacity: 0.9 }}
        />
        <div
          className="absolute left-[18%] top-1 h-5 w-[3px] rounded-b-full"
          style={{ background: tone === "red" ? "#c8352a" : "#fffaf0", opacity: 0.8 }}
        />
        <div
          className="absolute inset-0 rounded-t-[3px]"
          style={{
            background: "linear-gradient(to bottom, rgb(255 170 70 / 0.35), transparent 40%)",
            opacity: lit ? 1 : 0,
            transition,
          }}
        />
      </div>
    </div>
  );
}
