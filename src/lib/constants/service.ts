export const SERVICE = {
  name: "도화사주",
  tagline: "운명의 책",
  englishName: "DOHWA SAJU",
  englishTagline: "The Book of Your Fate",
  description:
    "태어난 순간의 여덟 글자와 지금의 고민을 엮어, 오직 한 사람을 위한 인생의 기록을 씁니다.",
} as const;

export const INTRO_LINES: ReadonlyArray<readonly [string, string]> = [
  ["당신이 살아온 시간에는", "이유가 있습니다."],
  ["지금의 고민도,", "당신의 운명 안에 있습니다."],
  ["오직 한 사람을 위해 쓰인", "인생의 기록."],
  ["이제, 당신의 다음 장을", "펼칠 시간입니다."],
];

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
  "태어난 순간의 하늘을 펼치고 있습니다.",
  "만세력으로 여덟 글자를 세우고 있습니다.",
  "당신의 오행 균형을 살펴보고 있습니다.",
  "십신과 지장간의 관계를 읽고 있습니다.",
  "대운의 큰 흐름을 따라가고 있습니다.",
  "지금의 고민과 사주의 흐름을 잇고 있습니다.",
  "당신만을 위한 첫 페이지를 쓰고 있습니다.",
] as const;

export const INPUT_STEPS = [
  { step: 1, eyebrow: "STEP 01", title: "당신은 언제 태어났나요?", description: "태어난 순간의 하늘이 이야기의 첫 문장이 됩니다." },
  { step: 2, eyebrow: "STEP 02", title: "어떤 삶을 살고 있나요?", description: "지금의 자리를 알아야 흐름을 더 정확히 읽을 수 있습니다." },
  { step: 3, eyebrow: "STEP 03", title: "요즘 가장 고민되는 것은 무엇인가요?", description: "적어주신 고민은 리포트의 마지막 장에서 깊이 다룹니다." },
  { step: 4, eyebrow: "STEP 04", title: "결과를 받을 이메일을 알려주세요.", description: "상세 사주 리포트를 이메일로 보내드립니다." },
] as const;
