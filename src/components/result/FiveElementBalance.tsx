import type { FiveElementKey } from "@/types/result";
import { ELEMENT_STYLE } from "./PillarChart";

const ORDER: FiveElementKey[] = ["wood", "fire", "earth", "metal", "water"];

type FiveElementBalanceProps = {
  counts: Record<FiveElementKey, number>;
};

export function FiveElementBalance({ counts }: FiveElementBalanceProps) {
  const max = Math.max(...Object.values(counts), 1);

  return (
    <div className="flex items-end justify-between gap-3">
      {ORDER.map((key) => {
        const style = ELEMENT_STYLE[key];
        const value = counts[key];
        return (
          <div key={key} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs text-mist">{value}</span>
            <div className="flex h-24 w-full items-end overflow-hidden rounded-md bg-night/80">
              <div
                className="w-full rounded-md transition-all duration-1000"
                style={{
                  height: `${Math.max((value / max) * 100, value === 0 ? 0 : 8)}%`,
                  background: `linear-gradient(to top, ${style.color}, transparent)`,
                  opacity: 0.85,
                }}
              />
            </div>
            <span className="font-serif text-base" style={{ color: style.color }}>
              {style.hanja}
            </span>
            <span className="-mt-1 text-[10px] text-mist-dim">{style.label}</span>
          </div>
        );
      })}
    </div>
  );
}
