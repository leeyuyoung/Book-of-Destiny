export const SERVICE = {
  name: "도화사주",
  tagline: "달빛 아래 도화",
  englishName: "DOHWA SAJU",
  englishTagline: "Your Peach Blossom Fate",
  description: "오늘 밤, 너의 도화 기운이 최고조에 달하는 시간이야.",
} as const;

/**
 * 인트로 웹툰 대사. 금지된 정원에 들어선 여자주인공(사용자)을 잠에서 깬 도화신선이 붙잡고, 목덜미의 향으로 도화를 짚어 낸다.
 * caption은 장면 설명, thought는 주인공의 속마음, sfx는 효과음, 나머지는 말풍선 대사다.
 */
export const INTRO_SCRIPT = {
  caption: "꽃향기에 이끌려 들어선, 낯선 정원.",
  wonder: "…여긴 어디지?",
  found: "…저 사람, 자고 있는 거야?",
  rustle: "바스락—",
  who: "…인간이 여길 어찌 들어왔지?",
  stop: "……가만.",
  flustered: "저, 저는 그냥…",
  scent: "이 향… 도화살이 아주 짙구나.",
  gasp: "…!",
  tease: "꽤나 홀리고 다녔겠어. 아니면… 홀리고 싶었거나.",
} as const;

/** 인트로 마지막 장면 */
export const HERO_COPY = {
  badge: "19금 도화살 풀이",
  lead: ["“오늘 밤, 네 몸에 핀 꽃", "하나하나 벗겨서 읽어주마.”"],
  invite: "“도화신선이 직접.”",
  cta: "도화신선에게 사주 내어주기",
} as const;

export const DETAILED_REPORT_PRICE = 19900;

export const formatPrice = (won: number) => `${won.toLocaleString("ko-KR")}원`;

/** 도화신선이 손목을 잡고 맥을 짚는 동안 보여주는 문구 */
export const ANALYSIS_MESSAGES = [
  "가만히 있거라. 맥 좀 짚어보자.",
  "…심장이 왜 이리 뛰지? 나 때문인가.",
  "찾았다. 네 꽃.",
] as const;

/** 결제 후 리포트를 쓰는 동안 보여주는 문구 */
export const REPORT_WRITING_MESSAGES = [
  "옷고름 하나씩 풀듯, 네 사주를 풀고 있다.",
  "네가 숨긴 데까지 다 짚는 중이니, 얌전히 기다리거라.",
  "네게 감겨들 사내들의 때를 세고 있지.",
  "마음에 품은 그놈과 너, 꽤 재밌는 사이구나.",
  "마지막 장이다. 조금만 더 참거라.",
] as const;

/** 도화신선이 하나씩 묻는 입력 질문. 순서는 analysisInput의 STEP_SCHEMAS와 같다. */
export const INPUT_STEPS = [
  { sub: "귀에 대고 속삭여 보거라.", question: "“네가 태어난 날, 언제지?”" },
  { sub: "몰라도 괜찮아. 어차피 내가 찾아낼 테니.", question: "“몇 시에 태어났느냐?”" },
  { sub: "보면 알지만… 네 입으로 듣고 싶구나.", question: "“여인이냐, 사내냐?”" },
  { sub: "오늘 밤 내가 부를 이름이니, 예쁜 걸로.", question: "“이름이 뭐지?”" },
  { sub: "숨겨 봤자 소용없다.", question: "“지금 네 마음 차지한 놈, 있느냐?”" },
] as const;
