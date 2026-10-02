import type { FiveElementKey, PillarView } from "@/types/result";

export const ELEMENT_STYLE: Record<FiveElementKey, { label: string; hanja: string; color: string }> = {
  wood: { label: "목", hanja: "木", color: "var(--color-wood)" },
  fire: { label: "화", hanja: "火", color: "var(--color-fire)" },
  earth: { label: "토", hanja: "土", color: "var(--color-earth)" },
  metal: { label: "금", hanja: "金", color: "var(--color-metal)" },
  water: { label: "수", hanja: "水", color: "var(--color-water)" },
};

type PillarChartProps = {
  pillars: PillarView[];
};

export function PillarChart({ pillars }: PillarChartProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {pillars.map((pillar) => {
        const isDay = pillar.label === "일주";
        return (
          <div key={pillar.label} className="flex flex-col items-center gap-2">
            <span className={`text-[11px] tracking-widest ${isDay ? "text-gold" : "text-mist-dim"}`}>
              {pillar.label}
            </span>
            {[pillar.stem, pillar.branch].map((glyph, index) => (
              <div
                key={index}
                className={`flex aspect-square w-full flex-col items-center justify-center rounded-xl border ${
                  isDay && index === 0 ? "border-gold/60 bg-gold/10" : "border-line bg-night/60"
                }`}
              >
                <span className="font-serif text-[28px] leading-none" style={{ color: ELEMENT_STYLE[glyph.element].color }}>
                  {glyph.hanja}
                </span>
                <span className="mt-1.5 text-[10px] text-mist">
                  {glyph.korean} · {ELEMENT_STYLE[glyph.element].label}
                </span>
              </div>
            ))}
            <span className="text-[10px] leading-tight text-mist-dim">
              {pillar.stem.tenGod}
              <br />
              {pillar.branch.tenGod}
            </span>
          </div>
        );
      })}
    </div>
  );
}
