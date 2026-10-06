export const SERVICE = {
  name: "도화사주",
  tagline: "달빛 아래 도화",
  englishName: "DOHWA SAJU",
  englishTagline: "Your Peach Blossom Fate",
  description:
    "태어난 순간의 여덟 글자에 숨은 당신의 매력과 인연의 흐름을, 달빛 아래에서 읽어드립니다.",
} as const;

/** 도화선녀가 사용자를 처음 맞이하는 대사 (docs/WORLDVIEW.md) */
export const INTRO_GREETING = ["“왔구나.”", "“네 꽃은 아직", "피지 않았느냐?”"] as const;

export const HERO_COPY = {
  headline: ["홀리는 사주는", "따로 있다"],
  description: "자꾸 눈길이 가는 사람이 있지. 그 이유는 태어날 때 이미 정해졌단다.",
  cta: "내 꽃 보여주기",
} as const;

export const DETAILED_REPORT_PRICE = 19900;

export const formatPrice = (won: number) => `${won.toLocaleString("ko-KR")}원`;

export const REPORT_PARTS = [
  { part: 1, title: "당신이라는 사람", summary: "성격, 감정 구조, 숨겨진 욕망과 두려움" },
  { part: 2, title: "성장 과정과 가족", summary: "어린 시절의 환경과 반복되어 온 패턴" },
  { part: 3, title: "평생 재물운", summary: "돈을 버는 방식, 모으는 방식, 잃기 쉬운 패턴" },
  { part: 4, title: "직업운 · 사업운", summary: "지금의 일과 사주 구조의 관계" },
  { part: 5, title: "연애와 결혼", summary: "사랑하는 방식, 갈등과 이별의 패턴" },
  { part: 6, title: "인간관계", summary: "귀인처럼 작용하는 사람, 부딪히기 쉬운 사람" },
  { part: 7, title: "대운, 인생의 큰 흐름", summary: "10년 단위로 바뀌는 삶의 계절" },
  { part: 8, title: "시기별 흐름", summary: "각 시기에 조심할 것과 투자할 것" },
  { part: 9, title: "인생에서 힘든 시기", summary: "변화와 압박이 커질 수 있는 구간" },
  { part: 10, title: "잘되는 방식 · 무너지는 방식", summary: "당신을 살리는 선택과 흔드는 선택" },
  { part: 11, title: "지금의 고민에 대하여", summary: "당신이 적어준 고민에 대한 맞춤 분석" },
] as const;

export const ANALYSIS_MESSAGES = [
  "네가 태어난 밤의 하늘을 펼치는 중이란다.",
  "만세력으로 네 여덟 글자를 세우고 있지.",
  "네 안의 오행이 어디로 기울었는지 보고 있구나.",
  "글자와 글자 사이에 숨은 인연을 읽는 중이란다.",
  "네 꽃이 피고 지는 큰 흐름을 따라가고 있지.",
  "네 마음의 고민과 사주의 흐름을 잇고 있단다.",
  "이제 네 꽃의 첫 잎을 쓰고 있으니, 조금만 기다리거라.",
] as const;

/** 도화선녀가 하나씩 묻는 입력 질문. 순서는 analysisInput의 STEP_SCHEMAS와 같다. */
export const INPUT_STEPS = [
  { sub: "그날의 기운을 보아야겠구나.", question: "“네가 태어난 날을 알려다오.”" },
  { sub: "모름을 골라도 되느니라.", question: "“그날 몇 시에 태어났느냐?”" },
  { sub: "하나만 더 묻자꾸나.", question: "“네 성별은?”" },
  { sub: "네가 아끼는 별명이어도 좋다.", question: "“내가 너를 뭐라 부르면 좋겠느냐?”" },
  { sub: "이제 네 마음을 들여다보자꾸나.", question: "“지금 마음에 품은 이가 있느냐?”" },
] as const;
