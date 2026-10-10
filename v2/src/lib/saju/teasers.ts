import { EARTHLY_BRANCHES, type EarthlyBranch } from "manseryeok";
import type { CharmIndexKey, DohwaReading } from "./dohwa";
import type { FiveElementKey, SajuProfile } from "./profileTypes";
import { ELEMENT_ORDER, SIX_COMBINATIONS, THREE_HARMONIES, branchHanja } from "./tables";

/**
 * 무료 결과에서 반만 열어 보여주는 값들. 만세력 계산 결과만으로 정하므로 같은 사주는 항상 같은 값이 나온다.
 * 잠긴 칸의 값은 여기서 만들지 않는다(화면에도 내려가지 않는다).
 */

export type BloomMonth = { year: number; month: number; hanja: string };

/** 다음 달부터 몇 달 앞까지 볼지. 子·卯·午·酉 어느 도화 글자든 이 안에 깨우는 달이 하나 이상 든다. */
const BLOOM_WINDOW = 4;

/** 양력 m월 초 절기부터 드는 월지. 12월이 子月, 1월이 丑月, 3월이 卯月이다. */
const monthBranch = (month: number) => EARTHLY_BRANCHES[month % 12];

/** 이 달의 월지가 도화 글자를 얼마나 세게 깨우는지. 같은 글자 3, 육합 2, 같은 삼합 1, 그 밖은 0. */
function awakening(branch: EarthlyBranch, peach: EarthlyBranch): number {
  if (branch === peach) return 3;
  if (SIX_COMBINATIONS.some(({ members }) => members.includes(branch) && members.includes(peach))) return 2;
  if (THREE_HARMONIES.some(({ members }) => members.includes(branch) && members.includes(peach))) return 1;
  return 0;
}

/** 다음 달부터 BLOOM_WINDOW달 안에서 도화살을 가장 세게 깨우는 달. 세기가 같으면 이른 달을 고른다. */
export function nextBloomMonth(profile: SajuProfile, reading: DohwaReading): BloomMonth {
  const triggers = reading.stars.find((star) => star.key === "dohwa")!.triggers;
  const { year, month } = profile.referenceDate;
  const candidates = Array.from({ length: BLOOM_WINDOW }, (_, index) => {
    const offset = month + index;
    const candidate = { year: year + Math.floor(offset / 12), month: (offset % 12) + 1 };
    const branch = monthBranch(candidate.month);
    return { ...candidate, hanja: branchHanja(branch), strength: Math.max(...triggers.map((peach) => awakening(branch, peach))) };
  });
  const best = candidates.reduce((top, candidate) => (candidate.strength > top.strength ? candidate : top));
  return { year: best.year, month: best.month, hanja: best.hanja };
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
