import { ELEMENT_LABELS, TEN_GOD_LABELS, TWELVE_STAGE_LABELS, josa } from "@/lib/constants/sajuLabels";
import { ELEMENT_ORDER } from "@/lib/saju/tables";
import type { CurrentLuckView, FiveElementKey, FiveElementsView } from "@/types/result";

const ELEMENT_COLOR: Record<FiveElementKey, string> = {
  wood: "var(--color-wood)",
  fire: "var(--color-fire)",
  earth: "var(--color-earth)",
  metal: "var(--color-metal)",
  water: "var(--color-water)",
};

const names = (keys: FiveElementKey[]) => keys.map((key) => ELEMENT_LABELS[key].name).join(", ");

/** 만세력으로 센 다섯 기운의 개수와 지금 지나고 있는 10년의 기운 */
export function FiveElementsCard({ fiveElements, currentLuck }: { fiveElements: FiveElementsView; currentLuck: CurrentLuckView | null }) {
  const max = Math.max(1, ...Object.values(fiveElements.counts));

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-3xl border border-line bg-night/70 px-5 py-5">
        <ul className="flex flex-col gap-3">
          {ELEMENT_ORDER.map((key) => {
            const label = ELEMENT_LABELS[key];
            const count = fiveElements.counts[key];
            return (
              <li key={key} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-3">
                <span className="flex items-center gap-2 text-sm text-paper">
                  <span aria-hidden className="h-2 w-2 rotate-45" style={{ backgroundColor: ELEMENT_COLOR[key] }} />
                  {label.name}
                </span>
                <span className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${(count / max) * 100}%`, backgroundColor: ELEMENT_COLOR[key] }}
                  />
                </span>
                <span className="text-right font-serif text-sm text-mist">{count}개</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 border-t border-line/60 pt-4 text-[13px] leading-relaxed text-paper/90 break-keep">
          {fiveElements.dominant.length > 0 && (
            <>
              <span className="text-blossom">{names(fiveElements.dominant)}</span> 기운이 가장 짙구나.{" "}
              {josa(ELEMENT_LABELS[fiveElements.dominant[0]].mood, "이", "가")} 네 매력의 바탕이란다.{" "}
            </>
          )}
          {fiveElements.missing.length > 0 ? (
            <>
              <span className="text-blossom">{names(fiveElements.missing)}</span> 기운은 비어 있어, 그 빈자리를 채워 주는 사람에게 마음이 끌리기 쉽지.
            </>
          ) : (
            "다섯 기운을 하나도 빠짐없이 품었으니, 어떤 자리에서도 제 빛을 내는 꽃이란다."
          )}
        </p>
      </div>

      {currentLuck && (
        <div className="rounded-2xl border border-cinnabar/30 bg-crimson-deep/30 px-5 py-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-mist">
              지금 너의 10년 · {currentLuck.startAge}~{currentLuck.endAge}세
            </p>
            <p className="text-[14px] leading-snug text-paper break-keep">
              {currentLuck.stemElement === currentLuck.branchElement ? (
                <>
                  {ELEMENT_LABELS[currentLuck.stemElement].name}의 기운이 짙게 흐르는 시기.{" "}
                </>
              ) : (
                <>
                  {josa(ELEMENT_LABELS[currentLuck.stemElement].name, "과", "와")}{" "}
                  {ELEMENT_LABELS[currentLuck.branchElement].name}의 기운이 흐르는 시기.{" "}
                </>
              )}
              <span className="text-blossom">
                네 안의 {josa(TEN_GOD_LABELS[currentLuck.stemTenGod], "이", "가")} 깨어나고, 마음은 {TWELVE_STAGE_LABELS[currentLuck.twelveStage]}의 결
              </span>
              이란다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
