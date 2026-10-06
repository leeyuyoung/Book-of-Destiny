export const SERVICE = {
  name: "도화사주",
  tagline: "달빛 아래 도화",
  englishName: "DOHWA SAJU",
  englishTagline: "Your Peach Blossom Fate",
  description: "오늘 밤, 너의 도화 기운이 최고조에 달하는 시간이야.",
} as const;

/** 인트로 대사. 밀회 중이던 도화선녀가 다가온 사용자를 알아채고, 그 사람의 도화를 짚어 준다. */
export const INTRO_SCRIPT = {
  /** 대사가 아닌 상황 설명과 효과음 */
  tryst: "(선녀와의 밀회를 목격한다.)",
  rustle: "바스락—",
  who: "“이 야밤에… 누구야?”",
  stop: "“……잠깐.”",
  teaseLead: "“너…”",
  tease: ["“사람 좀", "홀리고 다녔겠구나.”"],
  secret: ["남을 미치게 만드는 색기는", "타고나는 것이지."],
} as const;

/** 인트로 마지막 장면 */
export const HERO_COPY = {
  lead: ["“스치기만 해도 반응하게 만드는", "네 사주의 비밀,”"],
  invite: "“도화선녀가 알려주마.”",
  cta: "숨겨진 도화력 확인하기",
} as const;

export const DETAILED_REPORT_PRICE = 19900;

export const formatPrice = (won: number) => `${won.toLocaleString("ko-KR")}원`;

export const ANALYSIS_MESSAGES = [
  "네가 태어난 밤의 하늘을 펼치는 중이란다.",
  "만세력으로 네 여덟 글자를 세우고 있지.",
  "글자 사이에 숨은 도화의 기운을 찾고 있구나.",
  "네 꽃이 얼마나 피었는지 재어 보는 중이니, 조금만 기다리거라.",
] as const;

/** 결제 후 리포트를 쓰는 동안 보여주는 문구 */
export const REPORT_WRITING_MESSAGES = [
  "네 꽃을 끝까지 펼치는 중이란다.",
  "네 사주에 숨은 도화를 하나하나 짚고 있지.",
  "네게 감겨들 인연의 때를 헤아리는 중이구나.",
  "네 마음에 품은 이와 사주의 흐름을 잇고 있단다.",
  "이제 마지막 장을 쓰고 있으니, 조금만 기다리거라.",
] as const;

/** 도화선녀가 하나씩 묻는 입력 질문. 순서는 analysisInput의 STEP_SCHEMAS와 같다. */
export const INPUT_STEPS = [
  { sub: "그날의 기운을 보아야겠구나.", question: "“네가 태어난 날을 알려다오.”" },
  { sub: "모름을 골라도 되느니라.", question: "“그날 몇 시에 태어났느냐?”" },
  { sub: "하나만 더 묻자꾸나.", question: "“네 성별은?”" },
  { sub: "네가 아끼는 별명이어도 좋다.", question: "“내가 너를 뭐라 부르면 좋겠느냐?”" },
  { sub: "이제 네 마음을 들여다보자꾸나.", question: "“지금 마음에 품은 이가 있느냐?”" },
] as const;
