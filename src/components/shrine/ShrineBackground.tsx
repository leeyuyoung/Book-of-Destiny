import { Candle } from "./Candle";
import { CANDLES } from "./candles";
import { ObangCloths } from "./ObangCloths";
import { SmokeCanvas } from "./SmokeCanvas";

type ShrineBackgroundProps = {
  /** full: 인트로처럼 분위기가 주인공인 화면, soft: 글을 읽어야 하는 화면 */
  intensity?: "full" | "soft";
  /** false면 촛불이 꺼진 상태로 시작하고, true가 되는 순간 차례로 불이 붙는다 */
  candlesLit?: boolean;
};

/** 신당 배경: 늘어뜨린 오방색 천, 제단 위 촛불, 피어오르는 향 연기, 붉은 빛 */
export function ShrineBackground({ intensity = "full", candlesLit = true }: ShrineBackgroundProps) {
  const soft = intensity === "soft";

  return (
    <div aria-hidden className="grain pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div
        className="absolute inset-0 transition-opacity duration-[2500ms]"
        style={{
          opacity: candlesLit ? 1 : 0.25,
          background:
            "radial-gradient(ellipse 90% 55% at 50% 100%, rgb(150 28 18 / 0.55) 0%, rgb(70 12 8 / 0.35) 45%, transparent 75%), radial-gradient(ellipse 70% 45% at 50% 0%, rgb(60 10 8 / 0.5), transparent 70%)",
        }}
      />
      <div
        className="absolute left-1/2 top-[38%] h-[60dvh] w-[120vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full animate-breathe"
        style={{ background: "radial-gradient(circle, rgb(166 28 26 / 0.22), rgb(166 28 26 / 0.08) 40%, transparent 70%)", opacity: soft ? 0.5 : 1 }}
      />

      <ObangCloths opacity={soft ? 0.22 : 0.62} />

      <div className="absolute inset-x-0 bottom-[5dvh] h-0" style={{ opacity: soft ? 0.55 : 1 }}>
        {CANDLES.map((candle, index) => (
          <Candle key={index} {...candle} lit={candlesLit} igniteDelay={0.25 + index * 0.35} />
        ))}
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-[6dvh]"
        style={{ background: "linear-gradient(to bottom, #2a0f0a, #120605)", boxShadow: "0 -1px 0 rgb(217 164 65 / 0.18)" }}
      />

      <SmokeCanvas density={soft ? 0.5 : 1} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgb(0 0 0 / 0.75) 100%)" }}
      />
      {soft && <div className="absolute inset-0 bg-ink/45" />}
    </div>
  );
}
