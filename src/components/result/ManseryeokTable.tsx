import { ELEMENT_LABELS, PILLAR_LABELS, TEN_GOD_LABELS, TWELVE_STAGE_LABELS } from "@/lib/constants/sajuLabels";
import type { FiveElementKey, PillarView } from "@/types/result";

const ELEMENT_COLOR: Record<FiveElementKey, string> = {
  wood: "var(--color-wood)",
  fire: "var(--color-fire)",
  earth: "var(--color-earth)",
  metal: "var(--color-metal)",
  water: "var(--color-water)",
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
  const me = pillars.find((pillar) => pillar.label === "일주")?.stem;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-night/70">
      <div className="flex items-center gap-4 border-b border-line/60 px-5 py-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cinnabar/40 bg-crimson-deep/60 font-eerie text-lg text-blossom">
          {me?.hanja}
        </span>
        <div className="flex flex-col">
          <span className="font-serif text-[15px] text-paper">
            {name}
            {me && <span className="ml-1.5 text-xs text-blossom">· {ELEMENT_LABELS[me.element].name}의 기운을 타고난 아이</span>}
          </span>
          <span className="text-xs text-mist">
            {dayPillarName} · {birthLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[2.5rem_repeat(4,1fr)] gap-x-2 gap-y-1.5 px-3 py-4 text-center">
        <span />
        {COLUMN_ORDER.map((label) => (
          <span key={label} className={`text-[11px] ${label === "일주" ? "text-cinnabar" : "text-mist-dim"}`}>
            {PILLAR_LABELS[label]}
          </span>
        ))}

        <RowLabel>성향</RowLabel>
        {columns.map((pillar, index) => (
          <SmallCell key={index}>{pillar ? TEN_GOD_LABELS[pillar.stem.tenGod] : "-"}</SmallCell>
        ))}

        <RowLabel>하늘</RowLabel>
        {columns.map((pillar, index) => (
          <GlyphTile key={index} glyph={pillar?.stem ?? null} highlight={pillar?.label === "일주"} />
        ))}

        <RowLabel>땅</RowLabel>
        {columns.map((pillar, index) => (
          <GlyphTile key={index} glyph={pillar?.branch ?? null} />
        ))}

        <RowLabel>성향</RowLabel>
        {columns.map((pillar, index) => (
          <SmallCell key={index}>{pillar ? TEN_GOD_LABELS[pillar.branch.tenGod] : "-"}</SmallCell>
        ))}

        <RowLabel>기운</RowLabel>
        {columns.map((pillar, index) => (
          <SmallCell key={index}>{pillar ? TWELVE_STAGE_LABELS[pillar.branch.twelveStage] : "-"}</SmallCell>
        ))}
      </div>

      {!columns[0] && (
        <p className="border-t border-line/60 px-5 py-3 text-[11px] leading-relaxed text-mist-dim">출생 시간을 몰라 태어난 시 칸은 비워 뒀다.</p>
      )}
    </div>
  );
}

function RowLabel({ children }: { children: string }) {
  return <span className="flex items-center justify-center text-[10px] text-mist-dim">{children}</span>;
}

function SmallCell({ children }: { children: string }) {
  return <span className="py-1 text-[11px] text-mist break-keep">{children}</span>;
}

function GlyphTile({ glyph, highlight = false }: { glyph: PillarView["stem"] | null; highlight?: boolean }) {
  if (!glyph) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-line/70 bg-ink/40">
        <span className="font-serif text-xl text-mist-dim/60">?</span>
      </div>
    );
  }
  const color = ELEMENT_COLOR[glyph.element];
  const element = ELEMENT_LABELS[glyph.element];
  return (
    <div
      className={`relative flex aspect-square items-center justify-center rounded-2xl border ${highlight ? "ring-1 ring-cinnabar/70" : ""}`}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
        borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
      }}
    >
      <span className="font-serif text-[30px] leading-none" style={{ color }}>
        {glyph.hanja}
      </span>
      <span className="absolute bottom-1 right-1.5 text-[9px] text-paper/70">
        {glyph.korean}
        {element.reading}
      </span>
    </div>
  );
}
