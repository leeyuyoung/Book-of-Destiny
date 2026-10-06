import { BlossomBranch } from "./BlossomBranch";
import { PetalCanvas } from "./PetalCanvas";

type NightGardenBackgroundProps = {
  /** full: 인트로처럼 분위기가 주인공인 화면, soft: 글을 읽어야 하는 화면 */
  intensity?: "full" | "soft";
  /** false면 어둡게 시작하고, true가 되는 순간 달빛과 등불이 천천히 밝아진다 */
  lit?: boolean;
};

const LANTERNS = [
  { left: "8%", size: 180, delay: "0s" },
  { left: "88%", size: 220, delay: "1.6s" },
  { left: "62%", size: 120, delay: "3.1s" },
];

/** 달밤의 도화 정원: 남색 밤하늘, 흐린 보름달, 모서리의 복숭아꽃 가지, 낮게 깔린 등불, 흩날리는 꽃잎, 한지 결 */
export function NightGardenBackground({ intensity = "full", lit = true }: NightGardenBackgroundProps) {
  const soft = intensity === "soft";

  return (
    <div aria-hidden className="hanji pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0b0a1c 0%, #110d24 45%, #1a1028 75%, #0a0710 100%)",
        }}
      />

      <div className="absolute inset-0 transition-opacity duration-[2500ms]" style={{ opacity: lit ? 1 : 0.2 }}>
        <div
          className="absolute right-[-10vw] top-[-12vh] h-[70vh] w-[70vh] rounded-full animate-breathe"
          style={{
            background: "radial-gradient(circle, rgb(246 236 216 / 0.22) 0%, rgb(200 180 220 / 0.08) 40%, transparent 70%)",
            opacity: soft ? 0.6 : 1,
          }}
        />
        <div
          className="absolute right-[12%] top-[7vh] h-[min(22vw,140px)] w-[min(22vw,140px)] rounded-full"
          style={{
            background: "radial-gradient(circle at 42% 40%, #fff8ea 0%, #f1e3c6 55%, #d8c39f 100%)",
            boxShadow: "0 0 60px 18px rgb(246 236 216 / 0.25), 0 0 160px 60px rgb(190 170 220 / 0.12)",
            opacity: soft ? 0.35 : 0.9,
          }}
        />

        {LANTERNS.map((lantern) => (
          <div
            key={lantern.left}
            className="absolute bottom-[-6vh] -translate-x-1/2 rounded-full animate-breathe"
            style={{
              left: lantern.left,
              width: lantern.size,
              height: lantern.size,
              animationDelay: lantern.delay,
              background: "radial-gradient(circle, rgb(255 190 120 / 0.32) 0%, rgb(232 137 155 / 0.12) 45%, transparent 70%)",
              opacity: soft ? 0.5 : 1,
            }}
          />
        ))}

        <div
          className="absolute inset-x-0 bottom-0 h-[45vh]"
          style={{ background: "radial-gradient(ellipse 80% 70% at 50% 100%, rgb(156 63 98 / 0.28), transparent 70%)" }}
        />
      </div>

      <div style={{ opacity: soft ? 0.45 : 1 }} className="absolute inset-0">
        <BlossomBranch className="absolute left-[-6%] top-[-2%] w-[min(78vw,460px)]" />
      </div>
      <div style={{ opacity: soft ? 0.3 : 0.85 }} className="absolute inset-0">
        <BlossomBranch className="absolute bottom-[8%] right-[-14%] w-[min(60vw,360px)] rotate-[160deg]" flip />
      </div>

      <PetalCanvas density={soft ? 0.45 : 1} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 50%, rgb(3 2 8 / 0.8) 100%)" }}
      />
      {soft && <div className="absolute inset-0 bg-ink/50" />}
    </div>
  );
}
