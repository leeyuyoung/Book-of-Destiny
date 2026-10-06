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
 * 순서를 바꾸면 이미 저장된 리포트와 장 번호가 어긋나므로 내용만 고친다.
 */
export const REPORT_CHAPTERS = [
  {
    chapter: 1,
    title: "너라는 꽃",
    teaser: "다들 너한테서 눈을 못 떼는 진짜 이유",
    guide: "타고난 분위기와 첫인상, 사람들이 이 사람에게서 느끼는 매력의 정체",
  },
  {
    chapter: 2,
    title: "숨겨둔 무기",
    teaser: "남들은 평생 애써도 못 가지는 색기, 넌 아직 반도 안 꺼냈단다",
    guide: "사주 속 매력살(도화·홍염·화개)이 어디에 어떻게 놓였고 어떤 식으로 드러나는지. 없다면 대신 매력을 만드는 글자",
  },
  {
    chapter: 3,
    title: "숨만 쉬어도 홀리는 법",
    teaser: "네가 가장 치명적으로 보이는 순간, 그리고 상대를 무너뜨리는 너만의 플러팅",
    guide: "가장 매력적으로 보이는 상황, 끌어당기는 방식, 이 사람에게 맞는 플러팅 화법",
  },
  {
    chapter: 4,
    title: "네 향기에 취하는 자들",
    teaser: "지금 이 순간에도 네 곁을 맴돌며 애태우는 자들의 정체",
    guide: "이 사람에게 끌려오는 이성의 유형과 특징, 그들이 다가오는 방식",
  },
  {
    chapter: 5,
    title: "사랑에 빠진 너",
    teaser: "왜 매번 같은 지점에서 흔들리고, 같은 이유로 무너지는지",
    guide: "연애할 때의 모습, 반복되는 연애 패턴, 갈등과 이별이 생기는 지점",
  },
  {
    chapter: 6,
    title: "네 짝, 그리고 독이 되는 자",
    teaser: "네 꽃을 터뜨려 줄 운명, 그리고 시들게 할 독",
    guide: "잘 맞는 상대와 피해야 할 상대의 성향, 그 사주적 근거",
  },
  {
    chapter: 7,
    title: "인연이 감겨드는 때",
    teaser: "앞으로 3년, 네 도화가 폭발하고 인연이 쏟아지는 때",
    guide: "세운 목록의 앞 3년을 따라 연애운의 흐름과 인연이 들어오는 시기",
  },
  {
    chapter: 8,
    title: "지금 네 마음에게",
    teaser: "네가 품은 그 사람을 끌어당길, 네 다음 한 수",
    guide: "연애 상태와 고민에 대한 직접적인 답과 구체적인 행동 제안",
  },
] as const;

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

/** 잠긴 장 위에 흐리게 깔리는 자리 채움 글. 실제 리포트 내용이 아니다. */
export const BLURRED_FILLER =
  "넌 이미 충분히 사람을 홀리는 아이란다. 처음 너를 본 이들은 이유도 모른 채 시선을 빼앗기고, 가까워질수록 헤어나오지 못하지. 그런데 넌 그 힘의 반도 아직 꺼내지 않았어. 어디서 흘러나오는지, 언제 가장 짙어지는지, 어떻게 써야 상대가 무너지는지 하나하나 알려 주마. 다만 이 이야기는 꽃을 끝까지 펼친 이에게만 들려줄 수 있느니라.";
