import type { EarthlyBranch } from "manseryeok";
import type { CharmIndexKey, DohwaReading } from "./dohwa";
import type { FiveElementKey, SajuProfile } from "./profileTypes";
import { ELEMENT_ORDER } from "./tables";

/**
 * 무료 결과에서 반만 열어 보여주는 값들. 만세력 계산 결과만으로 정하므로 같은 사주는 항상 같은 값이 나온다.
 * 잠긴 칸의 값은 여기서 만들지 않는다(화면에도 내려가지 않는다).
 */

/** 도화 글자(子午卯酉)가 다스리는 달. start는 그 달이 시작되는 절기의 대략적인 날짜(양력)다. */
const PEACH_MONTHS: Partial<Record<EarthlyBranch, { month: number; start: number; hanja: string }>> = {
  자: { month: 12, start: 7, hanja: "子" },
  묘: { month: 3, start: 6, hanja: "卯" },
  오: { month: 6, start: 6, hanja: "午" },
  유: { month: 9, start: 8, hanja: "酉" },
};

export type BloomMonth = { year: number; month: number; hanja: string; now: boolean };

/** 도화살을 깨우는 글자가 드는 달 중 오늘에서 가장 가까운 달. 그 달 안이면 now가 true다. */
export function nextBloomMonth(profile: SajuProfile, reading: DohwaReading): BloomMonth {
  const triggers = reading.stars.find((star) => star.key === "dohwa")!.triggers;
  const { year, month, day } = profile.referenceDate;
  const candidates = triggers.flatMap((branch) => {
    const peach = PEACH_MONTHS[branch];
    if (!peach) return [];
    const startsThisYear = new Date(year, peach.month - 1, peach.start);
    const endsThisYear = new Date(year, peach.month, peach.start - 1);
    const today = new Date(year, month - 1, day);
    // 子月은 해를 넘겨 1월 초에 끝난다.
    if (peach.month === 12 && today < new Date(year, 0, peach.start - 1)) {
      return [{ year: year - 1, month: peach.month, hanja: peach.hanja, now: true, at: today.getTime() }];
    }
    if (today >= startsThisYear && today <= endsThisYear) {
      return [{ year, month: peach.month, hanja: peach.hanja, now: true, at: today.getTime() }];
    }
    const nextYear = today < startsThisYear ? year : year + 1;
    return [{ year: nextYear, month: peach.month, hanja: peach.hanja, now: false, at: new Date(nextYear, peach.month - 1, peach.start).getTime() }];
  });
  const nearest = candidates.reduce((best, candidate) => (candidate.at < best.at ? candidate : best));
  return { year: nearest.year, month: nearest.month, hanja: nearest.hanja, now: nearest.now };
}

/** 일간을 다스리는 오행. 여성 사주에서 남자(관성)를 뜻한다. */
const CONTROLLED_BY: Record<FiveElementKey, FiveElementKey> = {
  wood: "metal",
  fire: "water",
  earth: "wood",
  metal: "fire",
  water: "earth",
};

const PARTNER_VIBES: Record<FiveElementKey, string> = {
  wood: "키 크고 곧은, 다정한데 고집 있는 남자",
  fire: "눈빛이 뜨겁고 표현이 확실한 남자",
  earth: "듬직하고 말보다 행동이 먼저인 남자",
  metal: "선 굵고 말수 적은, 정장이 어울리는 남자",
  water: "속을 알 수 없는 눈빛의, 머리 좋은 남자",
};

export type PartnerTeaser = { vibe: string; age: string };

/** 관성의 오행으로 분위기를, 관성이 놓인 자리(년·월이면 윗사람, 일·시면 가까운 사람)로 나이를 본다. */
export function partnerTeaser(profile: SajuProfile): PartnerTeaser {
  const isOfficer = (tenGod: string) => tenGod === "정관" || tenGod === "편관";
  const seats = profile.pillars.filter((pillar) => isOfficer(pillar.stem.tenGod) || isOfficer(pillar.branch.tenGod));
  const age = seats.some((pillar) => pillar.position === "year" || pillar.position === "month")
    ? "너보다 연상"
    : seats.length > 0
      ? "동갑이거나 연하"
      : "나이보다 분위기에 끌리는 인연";
  return { vibe: PARTNER_VIBES[CONTROLLED_BY[profile.dayMaster.element]], age };
}

const CHARM_POINTS: Record<CharmIndexKey, string> = {
  allure: "눈웃음",
  sensual: "입술",
  flirt: "말끝을 흐리는 목소리",
  popularity: "웃을 때 풀리는 얼굴",
  mystery: "눈빛",
};

/** 부족한 오행을 채워 주는 색 */
const POINT_COLORS: Record<FiveElementKey, { name: string; hex: string; hanja: string }> = {
  wood: { name: "올리브 그린", hex: "#7c8c4a", hanja: "木" },
  fire: { name: "버건디", hex: "#8e2440", hanja: "火" },
  earth: { name: "카멜 베이지", hex: "#c19a6b", hanja: "土" },
  metal: { name: "아이보리 화이트", hex: "#f2ece0", hanja: "金" },
  water: { name: "딥 네이비", hex: "#1f2a4d", hanja: "水" },
};

export type FaceTeaser = { point: string; color: { name: string; hex: string; hanja: string } };

/** 가장 높은 매력 지수로 얼굴의 매력 포인트를, 가장 약한 오행으로 포인트 컬러를 고른다. */
export function faceTeaser(profile: SajuProfile, reading: DohwaReading): FaceTeaser {
  const top = (Object.entries(reading.indices) as [CharmIndexKey, number][]).reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  const { counts } = profile.fiveElements;
  const weakest = ELEMENT_ORDER.reduce((best, key) => (counts[key] < counts[best] ? key : best));
  return { point: CHARM_POINTS[top[0]], color: POINT_COLORS[weakest] };
}
