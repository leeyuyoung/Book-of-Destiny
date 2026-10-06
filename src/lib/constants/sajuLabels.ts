import type { FiveElementKey, PillarLabel, PillarPosition, TenGod, TwelveStage } from "@/lib/saju/profileTypes";

/**
 * 사주 전문 용어를 화면에 바로 쓰지 않고 감성적인 한글로 바꿔 보여주기 위한 이름표.
 * 계산 결과(용어)는 그대로 두고, 화면에 보이는 말만 바꾼다.
 */

/** 낱말 끝 글자의 받침 유무에 맞춰 조사를 붙인다. 예: josa("불", "과", "와") → "불과" */
export function josa(word: string, withBatchim: string, withoutBatchim: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const hasBatchim = code >= 0 && code <= 11171 && code % 28 !== 0;
  return `${word}${hasBatchim ? withBatchim : withoutBatchim}`;
}

export const ELEMENT_LABELS: Record<FiveElementKey, { name: string; reading: string; hanja: string; mood: string }> = {
  wood: { name: "나무", reading: "목", hanja: "木", mood: "자라나는 생기" },
  fire: { name: "불", reading: "화", hanja: "火", mood: "타오르는 열정" },
  earth: { name: "흙", reading: "토", hanja: "土", mood: "품어 주는 온기" },
  metal: { name: "쇠", reading: "금", hanja: "金", mood: "또렷한 기품" },
  water: { name: "물", reading: "수", hanja: "水", mood: "깊은 감수성" },
};

/** 일간(나)과 각 글자의 관계를 성향 한 단어로 */
export const TEN_GOD_LABELS: Record<TenGod | "일간", string> = {
  일간: "나",
  비견: "나다움",
  겁재: "승부욕",
  식신: "다정함",
  상관: "끼",
  편재: "사교성",
  정재: "알뜰함",
  편관: "카리스마",
  정관: "단정함",
  편인: "직감",
  정인: "포용력",
};

/** 12운성을 그 자리의 기운이 어떤 상태인지로 */
export const TWELVE_STAGE_LABELS: Record<TwelveStage, string> = {
  장생: "새싹",
  목욕: "설렘",
  관대: "꾸밈",
  건록: "당당함",
  제왕: "절정",
  쇠: "원숙함",
  병: "여린 마음",
  사: "고요함",
  묘: "간직함",
  절: "새 출발",
  태: "꿈",
  양: "자라남",
};

export const PILLAR_LABELS: Record<PillarLabel, string> = {
  시주: "태어난 시",
  일주: "태어난 날",
  월주: "태어난 달",
  년주: "태어난 해",
};

export const POSITION_LABELS: Record<PillarPosition, string> = {
  year: "태어난 해",
  month: "태어난 달",
  day: "태어난 날",
  hour: "태어난 시",
};
