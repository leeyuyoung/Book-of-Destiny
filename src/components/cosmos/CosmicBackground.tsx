import { CelestialRing } from "./CelestialRing";
import { StarField } from "./StarField";

type CosmicBackgroundProps = {
  showRing?: boolean;
  intensity?: "full" | "soft";
};

export function CosmicBackground({ showRing = false, intensity = "full" }: CosmicBackgroundProps) {
  const soft = intensity === "soft";

  return (
    <div aria-hidden className="grain pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 35%, rgb(35 42 77 / 0.55) 0%, rgb(10 12 23 / 0.4) 45%, transparent 75%)",
        }}
      />
      <div
        className={`absolute -left-1/4 top-1/4 h-[70vh] w-[90vw] rounded-full blur-3xl animate-drift-slow ${soft ? "opacity-20" : "opacity-35"}`}
        style={{ background: "radial-gradient(circle, rgb(80 92 150 / 0.35), transparent 65%)" }}
      />
      <div
        className={`absolute -right-1/4 bottom-0 h-[60vh] w-[80vw] rounded-full blur-3xl animate-drift-slower ${soft ? "opacity-15" : "opacity-30"}`}
        style={{ background: "radial-gradient(circle, rgb(200 169 106 / 0.18), transparent 65%)" }}
      />
      <StarField density={soft ? 0.00007 : 0.00012} className="absolute inset-0" />
      {showRing && (
        <CelestialRing className="absolute left-1/2 top-1/2 aspect-square w-[140vw] max-w-[820px] -translate-x-1/2 -translate-y-1/2 opacity-80" />
      )}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: "linear-gradient(to top, rgb(5 5 10 / 0.9), transparent)" }}
      />
    </div>
  );
}
