import type { FiveElementKey, PillarView } from "@/types/result";

const ELEMENT_STYLE: Record<FiveElementKey, { label: string; color: string }> = {
  wood: { label: "목", color: "var(--color-wood)" },
  fire: { label: "화", color: "var(--color-fire)" },
  earth: { label: "토", color: "var(--color-earth)" },
  metal: { label: "금", color: "var(--color-metal)" },
  water: { label: "수", color: "var(--color-water)" },
};

const COLUMN_ORDER: PillarView["label"][] = ["시주", "일주", "월주", "년주"];

type ManseryeokTableProps = {
  name: string;
  dayPillarName: string;
  birthLabel: string;
  pillars: PillarView[];
};

export function ManseryeokTable({ name, dayPillarName, birthLabel, pillars }: ManseryeokTableProps) {
  const columns = COLUMN_ORDER.map((label) => pillars.find((pillar) => pillar.label === label) ?? null);

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-night/70">
      <div className="flex items-center gap-4 border-b border-line/60 px-5 py-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cinnabar/40 bg-crimson-deep/60 font-eerie text-lg text-blossom">
          {pillars.find((pillar) => pillar.label === "일주")?.stem.hanja}
        </span>
        <div className="flex flex-col">
          <span className="font-serif text-[15px] text-paper">{name}</span>
          <span className="text-xs text-mist">
            {dayPillarName} · {birthLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[2.25rem_repeat(4,1fr)] gap-x-2 gap-y-1.5 px-3 py-4 text-center">
        <span />
        {COLUMN_ORDER.map((label) => (
          <span key={label} className={`text-[11px] tracking-widest ${label === "일주" ? "text-cinnabar" : "text-mist-dim"}`}>
            {label}
          </span>
        ))}

        <RowLabel>십신</RowLabel>
        {columns.map((pillar, index) => (
          <SmallCell key={index}>{pillar ? (pillar.stem.tenGod === "일간" ? "나" : pillar.stem.tenGod) : "-"}</SmallCell>
        ))}

        <RowLabel>천간</RowLabel>
        {columns.map((pillar, index) => (
          <GlyphTile key={index} glyph={pillar?.stem ?? null} highlight={pillar?.label === "일주"} />
        ))}

        <RowLabel>지지</RowLabel>
        {columns.map((pillar, index) => (
          <GlyphTile key={index} glyph={pillar?.branch ?? null} />
        ))}

        <RowLabel>십신</RowLabel>
        {columns.map((pillar, index) => (
          <SmallCell key={index}>{pillar?.branch.tenGod ?? "-"}</SmallCell>
        ))}

        <RowLabel>운성</RowLabel>
        {columns.map((pillar, index) => (
          <SmallCell key={index}>{pillar?.branch.twelveStage ?? "-"}</SmallCell>
        ))}
      </div>

      {!columns[0] && (
        <p className="border-t border-line/60 px-5 py-3 text-[11px] text-mist-dim">출생 시간을 몰라 시주는 비워 두었단다.</p>
      )}
    </div>
  );
}

function RowLabel({ children }: { children: string }) {
  return <span className="flex items-center justify-center text-[10px] text-mist-dim">{children}</span>;
}

function SmallCell({ children }: { children: string }) {
  return <span className="py-1 text-[11px] text-mist">{children}</span>;
}

function GlyphTile({ glyph, highlight = false }: { glyph: PillarView["stem"] | null; highlight?: boolean }) {
  if (!glyph) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-line/70 bg-ink/40">
        <span className="font-serif text-xl text-mist-dim/60">?</span>
      </div>
    );
  }
  const style = ELEMENT_STYLE[glyph.element];
  return (
    <div
      className={`relative flex aspect-square items-center justify-center rounded-2xl border ${highlight ? "ring-1 ring-cinnabar/70" : ""}`}
      style={{
        backgroundColor: `color-mix(in srgb, ${style.color} 16%, transparent)`,
        borderColor: `color-mix(in srgb, ${style.color} 45%, transparent)`,
      }}
    >
      <span className="font-serif text-[30px] leading-none" style={{ color: style.color }}>
        {glyph.hanja}
      </span>
      <span className="absolute bottom-1 right-1.5 text-[9px] text-paper/70">
        {glyph.korean}
        {style.label}
      </span>
    </div>
  );
}
