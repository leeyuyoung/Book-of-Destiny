import type { CharmIndexKey, CharmStarKey } from "@/lib/saju/dohwa";
import type { FiveElementKey } from "@/lib/saju/profileTypes";

/** 일간 오행으로 정해지는 도화 유형. 무료 화면에 그대로 보여준다. */
export const DOHWA_TYPES: Record<
  FiveElementKey,
  { hanja: string; name: string; alias: string; elementHanja: string; headline: string; description: string; vibes: string[] }
> = {
  wood: {
    hanja: "春風桃花",
    name: "춘풍도화",
    alias: "스며드는 봄바람",
    elementHanja: "木",
    headline: "무해한 얼굴로 사람을 무너뜨리는 꽃",
    description: "다들 너를 그저 편한 사람이라 착각하지. 정신 차려 보면 이미 네 생각에 잠 못 드는데 말이야. 그 무방비한 얼굴이 네 가장 무서운 무기란다.",
    vibes: ["맑은 척 경계를 허무는 첫인상", "웃는 순간 상대가 무장 해제되는 얼굴", "편해서 방심했다가 빠져나오지 못하는 타입", "천천히 스며들어 끝내 지워지지 않는 여운"],
  },
  fire: {
    hanja: "紅艶桃花",
    name: "홍염도화",
    alias: "타오르는 불꽃",
    elementHanja: "火",
    headline: "눈 마주친 순간 게임을 끝내는 꽃",
    description: "네가 들어서면 공기의 온도부터 달라지지. 데일 걸 알면서도 다들 너한테 손을 뻗는단다. 그 열기, 아직 반도 안 쓴 거 알고 있니?",
    vibes: ["한 번 보면 잊히지 않는 눈빛", "표정 하나로 분위기를 쥐락펴락하는 얼굴", "가만히 있어도 모든 시선을 훔치는 존재감", "위험한 줄 알면서도 다가오게 만드는 열기"],
  },
  earth: {
    hanja: "月下桃花",
    name: "월하도화",
    alias: "달빛 아래 꽃",
    elementHanja: "土",
    headline: "한 번 품은 자를 절대 놓아주지 않는 꽃",
    description: "멀리선 단정한 척, 고요한 척하지. 하지만 네 곁에 한 번 들어온 자는 그 온기 없이는 못 산단다. 그 반전이 네 매력의 정체야.",
    vibes: ["단정한데 묘하게 눈이 가는 분위기", "가까이 갈수록 짙어지는 향", "알면 알수록 뒤통수치는 반전 매력", "한번 빠지면 다른 사람이 안 보이는 중독성"],
  },
  metal: {
    hanja: "雪中桃花",
    name: "설중도화",
    alias: "눈 속에 핀 꽃",
    elementHanja: "金",
    headline: "차가워서 미치도록 갖고 싶은 꽃",
    description: "쉽게 곁을 내주지 않으니 다들 애가 타서 안달이지. 그 서늘함, 네가 생각하는 것보다 훨씬 치명적이란다. 녹는 순간을 고르는 법만 알면 돼.",
    vibes: ["선이 또렷해서 다가가기 겁나는 도도함", "말수가 적어 밤새 곱씹게 만드는 사람", "무심하게 던진 한마디의 파괴력", "허락된 단 한 사람만 보는 녹아내린 얼굴"],
  },
  water: {
    hanja: "夜來桃花",
    name: "야래도화",
    alias: "밤에 피는 꽃",
    elementHanja: "水",
    headline: "한번 빠지면 바닥이 안 보이는 꽃",
    description: "속을 알 수 없는 눈빛에 다들 한 번은 길을 잃지. 들여다볼수록 깊이 가라앉아, 헤어나올 생각조차 못 한단다. 넌 그걸 아직 모르고 흘리고 다니는 거고.",
    vibes: ["촉촉해서 시선이 빨려드는 눈매", "속을 몰라서 더 파고들고 싶은 분위기", "낮보다 밤에 더 위험해지는 사람", "한번 빠지면 헤어나올 수 없는 깊이"],
  },
};

/** 도화 지수 구간. 높은 점수부터 순서대로 확인한다. */
export const DOHWA_GRADES = [
  { min: 92, hanja: "滿開", label: "만개", line: "이미 흘러넘치는 도화로구나. 그런데 그 힘, 제대로 쓸 줄은 아직 모르지?" },
  { min: 88, hanja: "開花", label: "개화", line: "꽃이 한창 차오르는 중이란다. 제대로 피우는 순간, 시선은 전부 네 거야." },
  { min: 85, hanja: "半開", label: "반개", line: "반만 피었는데도 이 정도란다. 나머지 반을 꺼내는 순간, 판이 뒤집혀." },
  { min: 0, hanja: "含苞", label: "함포", line: "꽁꽁 숨겨 둔 향기가 가득하구나. 터지는 날, 다들 몰라봤던 걸 후회할 거야." },
] as const;

export const gradeOf = (score: number) => DOHWA_GRADES.find((grade) => score >= grade.min)!;

export const CHARM_INDICES: { key: CharmIndexKey; label: string; hanja: string }[] = [
  { key: "allure", label: "끌림력", hanja: "桃" },
  { key: "sensual", label: "관능미", hanja: "艶" },
  { key: "flirt", label: "유혹력", hanja: "誘" },
  { key: "popularity", label: "인기력", hanja: "人" },
  { key: "mystery", label: "신비력", hanja: "秘" },
];

export const CHARM_STAR_LABELS: Record<CharmStarKey, { name: string; hanja: string }> = {
  dohwa: { name: "도화살", hanja: "桃花" },
  hongyeom: { name: "홍염살", hanja: "紅艶" },
  hwagae: { name: "화개살", hanja: "華蓋" },
};

/**
 * 결제 후 AI가 쓰는 연애 리포트의 장. guide는 AI 지시문에만 쓰이고, teaser는 결제 전 화면에 보인다.
 * 장 번호는 배열 순서로 매겨지고, 화면에서는 key로 장을 찾는다.
 * 장 수나 순서를 바꾸면 이미 저장된 리포트는 형식 검사에서 걸러져 새로 생성해야 한다.
 */
const CHAPTERS = [
  {
    key: "nature",
    title: "너라는 꽃",
    teaser: "다들 너한테서 눈을 못 떼는 진짜 이유",
    guide: "타고난 분위기와 기질, 사람들이 이 사람에게서 느끼는 매력의 정체",
  },
  {
    key: "firstImpression",
    title: "그들이 처음 본 너",
    teaser: "이성의 눈에 비친 네 첫인상, 그리고 그 마음을 무너뜨리는 공략법",
    guide:
      "이성이 이 사람을 처음 봤을 때의 인상(첫눈에 받는 느낌을 하나의 비유로, 첫 대화 뒤의 느낌, 헤어진 뒤 남는 잔상)과, 그 첫인상을 무기 삼아 마음에 둔 이성을 사로잡는 단계별 공략법",
  },
  {
    key: "looks",
    title: "네 얼굴에 깃든 도화",
    teaser: "눈빛, 표정, 분위기. 네 사주가 그려 낸 외모의 결",
    guide:
      "일간·오행·매력살로 본 외모의 느낌(도화가 맺힌 자리인 눈매·입매 같은 얼굴의 매력 포인트, 눈빛, 표정, 인상의 온도, 풍기는 분위기, 어울리는 이미지). 외모를 평가하거나 신체를 성적으로 묘사하지 말고 분위기와 비유로 쓴다",
  },
  {
    key: "starTypes",
    title: "네 색기의 종류",
    teaser: "도화살, 홍염살, 화개살. 네가 쥔 살과 그것이 깨어나는 때",
    guide:
      "도화살·홍염살·화개살이 각각 어떤 색기인지 쉽게 풀고, 이 사람에게 있는 살은 어느 자리에서 어떻게 드러나는지, 없는 살은 무엇이 대신하는지. 살이 깨어나는 시기는 <dohwa>의 awakening에 있는 해와 대운만 근거로 짚는다",
  },
  {
    key: "flirt",
    title: "숨만 쉬어도 홀리는 법",
    teaser: "네가 가장 치명적으로 보이는 순간, 그리고 상대를 무너뜨리는 너만의 플러팅",
    guide: "가장 매력적으로 보이는 상황, 끌어당기는 방식, 이 사람에게 맞는 플러팅 포인트",
  },
  {
    key: "language",
    title: "밤새 너를 떠올리게 하는 말",
    teaser: "상대가 밤새 네 말을 곱씹으며 잠 못 들게 만드는 언어 습관",
    guide:
      "이 사람 특유의 말투와 대화 습관 중 매력 포인트, 상대가 밤새 떠올리게 만드는 화법과 연락 습관, 바로 써먹을 문장 예시 2~3개, 매력을 깎는 말버릇",
  },
  {
    key: "styling",
    title: "도화를 피우는 치장",
    teaser: "네 도화를 두 배로 피워 줄 색, 향, 분위기",
    guide:
      "오행의 균형으로 본 도화를 피우는 대표 색과 어울리는 색, 어울리는 향의 결, 스타일과 분위기 연출, 매력이 가장 살아나는 장소와 시간대",
  },
  {
    key: "admirers",
    title: "네 향기에 취하는 자들",
    teaser: "지금 이 순간에도 네 곁을 맴돌며 애태우는 자들의 정체",
    guide: "이 사람에게 끌려오는 이성의 유형과 특징, 그들이 다가오는 방식",
  },
  {
    key: "inLove",
    title: "사랑에 빠진 너",
    teaser: "왜 매번 같은 지점에서 흔들리고, 같은 이유로 무너지는지",
    guide: "연애할 때의 모습, 반복되는 연애 패턴, 갈등과 이별이 생기는 지점",
  },
  {
    key: "match",
    title: "네 짝, 그리고 독이 되는 자",
    teaser: "네 꽃을 터뜨려 줄 운명, 그리고 시들게 할 독",
    guide: "잘 맞는 상대와 피해야 할 상대가 각각 어떤 오행 기운을 지녔는지, 그 성향과 사주적 근거",
  },
  {
    key: "timeline",
    title: "인연이 감겨드는 때",
    teaser: "앞으로 3년, 네 도화가 폭발하고 인연이 쏟아지는 때",
    guide: "세운 목록의 앞 3년을 따라 연애운의 흐름과 인연이 들어오는 시기",
  },
  {
    key: "heart",
    title: "지금 네 마음에게",
    teaser: "네가 품은 그 사람을 끌어당길, 네 다음 한 수",
    guide: "연애 상태와 고민에 대한 직접적인 답과 구체적인 행동 제안",
  },
] as const;

export type ReportChapterKey = (typeof CHAPTERS)[number]["key"];

export const REPORT_CHAPTERS = CHAPTERS.map((chapter, index) => ({ ...chapter, chapter: index + 1 }));

export const chapterOf = (key: ReportChapterKey) => REPORT_CHAPTERS.find((chapter) => chapter.key === key)!;

/** 앞으로 몇 년의 연애운을 표로 보여줄지 */
export const LOVE_TIMELINE_YEARS = 3;

/**
 * 결과 화면 중간의 후기. 실제로 받은 후기는 sample: false, 직접 쓴 예시 문구는 sample: true로 둔다.
 * 예시 카드에는 '예시' 표시가 붙고, 평균 별점은 실제 후기로만 계산한다. 지어낸 후기를 실제 후기처럼 보여주면 표시광고법 위반이 될 수 있다.
 * zodiac은 작성자의 띠(지지 한자와 띠 이름), date는 작성일(YY. MM. DD.)
 */
export const REVIEWS = [
  {
    name: "익명",
    zodiac: { hanja: "卯", label: "토끼띠" },
    rating: 5,
    date: "26. 10. 07.",
    body: "제 표정이랑 분위기 지적해주셨는데 소름 돋았어요..ㅋㅋㅋ 그동안 제 매력을 완전 잘못 쓰고 있었더라고요 읽는 내내 너무 감탄햇어요 ❤️",
    sample: false,
  },
  {
    name: "이**",
    zodiac: { hanja: "酉", label: "닭띠" },
    rating: 5,
    date: "26. 10. 05.",
    body: "학교 다닐 때 인기 많았거든요? 이유를 알았어요;; 매력을 더 끌어올리는 법도 배울 수 있어서 좋았습니다. 알려주신 플러팅 쓰니까 진짜 반응이 와요",
    sample: false,
  },
  {
    name: "최**",
    zodiac: { hanja: "亥", label: "돼지띠" },
    rating: 5,
    date: "26. 10. 04.",
    body: "도화 지수랑 무료 분량 보고 내 얘기 같아서 에라 모르겠다 하고 결제했는데 분량이 너무 알차요!! 나중에 인연 들어오는 시기 맞춰서 다시 찾아볼 생각입니다. 강추합니다!",
    sample: false,
  },
  {
    name: "김**",
    zodiac: { hanja: "辰", label: "용띠" },
    rating: 5,
    date: "26. 09. 26.",
    body: "매번 나쁜 남자 만나서 연애가 힘들었는데, 단번에 이해됐어요. 피해야 할 유형 파트 진짜 강추입니다 !!",
    sample: false,
  },
  {
    name: "박**",
    zodiac: { hanja: "申", label: "원숭이띠" },
    rating: 5,
    date: "26. 09. 13.",
    body: "선녀님이 직접 이야기해 주는 듯한 반말 톤이 은근히 중독성 있고 몰입감이 미쳤어요. 진짜 잘 맞춰서 놀랬고, 자존감도 엄청 올라가네요. 밤마다 꺼내보고 있습니다.ㅎㅎ",
    sample: false,
  },
] as const;

export const REVIEWS_INCLUDE_SAMPLES = REVIEWS.some((review) => review.sample);

const realReviews = REVIEWS.filter((review) => !review.sample);
export const REVIEW_AVERAGE =
  realReviews.length > 0 ? (realReviews.reduce((sum, review) => sum + review.rating, 0) / realReviews.length).toFixed(2) : null;