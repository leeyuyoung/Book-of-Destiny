import type { CharmIndexKey, CharmStarKey } from "@/lib/saju/dohwa";
import type { FiveElementKey } from "@/lib/saju/profileTypes";

/**
 * 일간 오행으로 정해지는 도화 유형. 무료 화면에 그대로 보여준다. 한자는 장식으로만 쓴다.
 */
export const DOHWA_TYPES: Record<
  FiveElementKey,
  {
    hanja: string;
    name: string;
    alias: string;
    elementHanja: string;
    headline: string;
    description: string;
    story: string;
    vibes: string[];
    /** 누구나 바로 알아듣는 유형 설명 한 줄 */
    plain: string;
    /** 무료 화면의 공감 체크리스트. 앞의 둘은 이 사람의 색기가 먹히는 모습, 마지막은 정작 그걸 못 쓰고 있는 모습이다. */
    checks: [string, string, string];
  }
> = {
  wood: {
    hanja: "春風桃花",
    name: "춘풍도화",
    alias: "스며드는 봄바람",
    elementHanja: "木",
    headline: "무해한 얼굴로 사람을 무너뜨리는 꽃",
    description: "다들 너를 그저 편한 사람이라 착각하지. 정신 차려 보면 이미 네 생각에 밤을 새우는데. 그 무방비한 얼굴, 일부러 그러는 거 다 안다.",
    story: "다들 너를 그저 편한 사람이라 착각하지. 정신 차려 보면 이미 네 생각에 밤을 새우는데 말이야.",
    vibes: ["맑은 척 경계를 허무는 첫인상", "웃는 순간 상대가 무장 해제되는 얼굴", "편해서 방심했다가 빠져나오지 못하는 타입", "천천히 스며들어 끝내 지워지지 않는 여운"],
    plain: "순진한 얼굴로 사람 홀리는 타입",
    checks: ["너는 웃는 순간 상대가 무장 해제되지", "정신 차려 보면 이미 네 생각에 밤을 새우지", "근데 정작 너는, 좋아하는 사람 앞에선 평소 반도 못 보여 줘"],
  },
  fire: {
    hanja: "紅艶桃花",
    name: "홍염도화",
    alias: "타오르는 불꽃",
    elementHanja: "火",
    headline: "눈 마주친 순간 게임을 끝내는 꽃",
    description: "네가 들어서면 공기의 온도부터 달라지지. 데일 걸 알면서도 다들 너한테 손을 뻗고. 그 열기, 아직 반도 안 꺼냈잖아.",
    story: "네가 들어서면 공기의 온도부터 달라지지. 데일 걸 알면서도 다들 너한테 손을 뻗고.",
    vibes: ["한 번 보면 잊히지 않는 눈빛", "표정 하나로 분위기를 쥐락펴락하는 얼굴", "가만히 있어도 모든 시선을 훔치는 존재감", "위험한 줄 알면서도 다가오게 만드는 열기"],
    plain: "눈빛 하나로 판을 뒤집는 타입",
    checks: ["너는 가만히 있어도 모든 시선을 훔치지", "데일 걸 알면서도 다들 너한테 손을 뻗지", "근데 정작 너는, 확 끌렸다가도 좋아하는 사람 앞에선 쿨한 척해"],
  },
  earth: {
    hanja: "月下桃花",
    name: "월하도화",
    alias: "달빛 아래 꽃",
    elementHanja: "土",
    headline: "한 번 품은 자를 절대 놓아주지 않는 꽃",
    description: "멀리선 단정한 척, 고요한 척하지. 그런데 네 곁에 한 번 들어온 자는 그 온기 없이 못 살아. 그 반전이 네 색기의 정체다.",
    story: "멀리선 단정한 척, 고요한 척하지. 그런데 네 곁에 한 번 들어온 자는 그 온기 없이 못 살아.",
    vibes: ["단정한데 묘하게 눈이 가는 분위기", "가까이 갈수록 짙어지는 향", "알면 알수록 뒤통수치는 반전 매력", "한번 빠지면 다른 사람이 안 보이는 중독성"],
    plain: "알수록 빠져나갈 수 없는 타입",
    checks: ["멀리선 단정한 척, 고요한 척하지", "알면 알수록 뒤통수치는 반전 매력을 가졌구나", "근데 정작 너는, 먼저 연락하고 싶어도 꾹 참다가 타이밍을 놓쳐"],
  },
  metal: {
    hanja: "雪中桃花",
    name: "설중도화",
    alias: "눈 속에 핀 꽃",
    elementHanja: "金",
    headline: "차가워서 미치도록 갖고 싶은 꽃",
    description: "쉽게 곁을 안 내주니 다들 애가 타서 안달이지. 그 서늘함이 얼마나 치명적인지 너만 모르는구나. 녹는 순간만 고를 줄 알면 돼.",
    story: "쉽게 곁을 안 내주니 다들 애가 타서 안달이지. 그 서늘함이 얼마나 치명적인지, 너만 모르는구나.",
    vibes: ["선이 또렷해서 다가가기 겁나는 도도함", "말수가 적어 밤새 곱씹게 만드는 사람", "무심하게 던진 한마디의 파괴력", "허락된 단 한 사람만 보는 녹아내린 얼굴"],
    plain: "차가워서 더 갖고 싶은 타입",
    checks: ["쉽게 곁을 안 내주니 다들 애가 타서 안달이고", "무심하게 던진 한마디에 상대는 밤새 곱씹지", "근데 정작 너는, 재고 따지다 다 놓쳐"],
  },
  water: {
    hanja: "夜來桃花",
    name: "야래도화",
    alias: "밤에 피는 꽃",
    elementHanja: "水",
    headline: "한번 빠지면 바닥이 안 보이는 꽃",
    description: "속을 알 수 없는 눈빛에 다들 한 번은 길을 잃지. 들여다볼수록 깊이 가라앉아 헤어나올 생각조차 못 해. 넌 그걸 알면서 흘리고 다니는 거고.",
    story: "속을 알 수 없는 눈빛에 다들 한 번은 길을 잃지. 들여다볼수록 깊이 가라앉아, 헤어나올 생각조차 못 해.",
    vibes: ["촉촉해서 시선이 빨려드는 눈매", "속을 몰라서 더 파고들고 싶은 분위기", "낮보다 밤에 더 위험해지는 사람", "한번 빠지면 헤어나올 수 없는 깊이"],
    plain: "속을 몰라서 더 빠지는 타입",
    checks: ["촉촉해서 시선이 빨려드는 눈매를 가졌구나", "너는 낮보다 밤에 더 위험해지지", "근데 정작 너는, 혼자 의미 부여하다 혼자 지쳐"],
  },
};

/** 도화 지수 구간. 높은 점수부터 순서대로 확인한다. */
export const DOHWA_GRADES = [
  { min: 92, hanja: "滿開", label: "활짝 핀 꽃", line: "색기가 흘러넘치는데, 정작 어디에 써야 할지는 모르지?" },
  { min: 88, hanja: "開花", label: "피어나는 꽃", line: "꽃은 한창인데 아직 반도 안 썼구나. 제대로 쓰는 순간, 시선은 전부 네 거다." },
  { min: 85, hanja: "半開", label: "반쯤 핀 꽃", line: "반만 꺼냈는데도 이 정도라니. 나머지 반을 쓰는 순간, 판이 뒤집히지." },
  { min: 0, hanja: "含苞", label: "꽃봉오리", line: "꽁꽁 숨겨 둔 색기가 가득하구나. 꺼내는 법만 알면, 다들 몰라봤던 걸 후회할 거다." },
] as const;

export const gradeOf = (score: number) => DOHWA_GRADES.find((grade) => score >= grade.min)!;

export const CHARM_INDICES: { key: CharmIndexKey; label: string; hanja: string }[] = [
  { key: "allure", label: "끌림력", hanja: "桃" },
  { key: "sensual", label: "관능미", hanja: "艶" },
  { key: "flirt", label: "유혹력", hanja: "誘" },
  { key: "popularity", label: "인기력", hanja: "人" },
  { key: "mystery", label: "신비력", hanja: "秘" },
];

/** meaning은 살 이름을 모르는 사람도 바로 알아듣는 한 줄 풀이 */
export const CHARM_STAR_LABELS: Record<CharmStarKey, { name: string; hanja: string; meaning: string }> = {
  dohwa: { name: "도화살", hanja: "桃花", meaning: "사람을 끌어당기는 꽃향기" },
  hongyeom: { name: "홍염살", hanja: "紅艶", meaning: "눈을 못 떼게 하는 뜨거운 색기" },
  hwagae: { name: "화개살", hanja: "華蓋", meaning: "고독해서 더 빛나는 예술가의 아우라" },
};

/**
 * 결제 후 AI가 쓰는 연애 리포트의 장과 소제목. guide는 AI 지시문에만 쓰이고, title·subtitle은 결제 전 목차에도 보인다.
 * 장 번호는 배열 순서로 매겨진다. 장이나 소제목의 수·순서를 바꾸면 이미 저장된 리포트는 형식 검사에서 걸러져 새로 생성해야 한다.
 * 문구 속 {partner}와 {him}은 사용자의 성별에 맞춰 withPartner로 바꾼다.
 */
const CHAPTERS = [
  {
    key: "nature",
    title: "네 색기의 정체",
    subtitle: "다들 너한테서 눈을 못 떼는 진짜 이유",
    image: "/images/result/chapter-1.jpg",
    sections: [
      {
        title: "타고난 도화의 결",
        guide: "일간과 오행으로 본 타고난 분위기와 기질, 도화 유형이 실제 삶에서 어떻게 드러나는지. 출생 시간을 모르면 여기서 그 한계를 한 번만 짧게 밝힌다",
      },
      {
        title: "다들 너한테서 눈을 못 떼는 이유",
        guide: "사람들이 이 사람에게서 느끼는 매력의 정체를 <dohwa>의 다섯 매력 지수(가장 높은 지수를 중심으로)와 사주 근거로 푼다",
      },
      {
        title: "너만 모르는 매력",
        guide: "본인은 모르지만 남들은 알아보는 매력, 그것이 가장 짙게 드러나는 순간",
      },
      {
        title: "그 매력이 독이 되는 순간",
        guide: "매력이 오해·질투·상처로 번지는 상황과 그 힘을 다루는 법",
      },
    ],
  },
  {
    key: "gaze",
    title: "그들의 눈에 비친 너",
    subtitle: "첫눈에 박히고, 밤새 떠오르는 얼굴",
    image: "/images/result/chapter-2.jpg",
    sections: [
      {
        title: "첫눈에 박히는 인상",
        guide: "이성이 이 사람을 처음 봤을 때의 인상(첫눈에 받는 느낌을 하나의 비유로, 첫 대화 뒤의 느낌, 헤어진 뒤 남는 잔상)",
      },
      {
        title: "얼굴에 맺힌 도화 자리",
        guide:
          "일간·오행·매력살로 본 얼굴의 매력 포인트(도화가 맺힌 자리인 눈매·입매, 눈빛, 표정, 인상의 온도, 풍기는 분위기). 외모를 평가하거나 신체를 성적으로 묘사하지 말고 분위기와 비유로 쓴다",
      },
      {
        title: "도화를 두 배로 피우는 색·향·스타일",
        guide: "오행의 균형으로 본 도화를 피우는 대표 색과 어울리는 색, 향의 결, 스타일과 분위기 연출, 매력이 가장 살아나는 장소와 시간대",
      },
    ],
  },
  {
    key: "flirt",
    title: "숨만 쉬어도 홀리는 법",
    subtitle: "네가 마음먹으면 무너지지 않을 자가 없다",
    image: "/images/result/chapter-3.jpg",
    sections: [
      {
        title: "네가 가장 치명적인 순간",
        guide: "이 사람이 가장 매력적으로 보이는 상황·장면·시간대",
      },
      {
        title: "너만의 플러팅",
        guide: "이 사람의 기질에 맞는 끌어당기는 방식과 플러팅 포인트, 단계별로 쓰는 법",
      },
      {
        title: "밤새 곱씹게 만드는 말",
        guide: "이 사람 특유의 말투와 대화 습관 중 매력 포인트, 상대가 밤새 떠올리게 만드는 화법과 연락 습관, 바로 써먹을 문장 예시 2~3개",
      },
      {
        title: "매력을 깎는 습관",
        guide: "매력을 깎아 먹는 말버릇·행동 습관과 고치는 법",
      },
    ],
  },
  {
    key: "night",
    title: "밤의 너",
    subtitle: "아무도 모르는 네 속궁합",
    image: "/images/result/chapter-4.jpg",
    sections: [
      {
        title: "불이 꺼지면 드러나는 네 얼굴",
        guide: "연인과 단둘이 있을 때 드러나는 낮과 다른 반전 성향, 분위기와 감정 표현의 온도",
      },
      {
        title: "너를 달아오르게 하는 것",
        guide: "이 사람의 마음보다 본능이 먼저 끌리는 상대의 분위기·태도·상황(말투, 눈빛, 거리감 같은 것으로)",
      },
      {
        title: "네 속궁합 성향",
        guide:
          "연인 사이의 친밀함에서 주도하는 쪽인지 맡기는 쪽인지, 스킨십과 다정함을 대하는 온도, 잘 맞는 상대의 결. 행위나 신체가 아니라 분위기·감정·주도권·속도의 비유로만 쓴다",
      },
      {
        title: "숨겨 둔 욕망의 결",
        guide: "연애에서 이 사람이 입 밖에 내지 못하고 감춰 둔 갈망(인정받고 싶은 마음, 독점하고 싶은 마음 같은 감정의 결)과 그것을 건강하게 채우는 법",
      },
    ],
  },
  {
    key: "fate",
    title: "네 몸이 먼저 알아보는 인연",
    subtitle: "머리보다 먼저 끌리는 자, 그리고 피해야 할 자",
    image: "/images/result/chapter-5.jpg",
    sections: [
      {
        title: "지금 네 곁을 맴도는 자들",
        guide: "이 사람에게 끌려오는 이성의 유형과 특징, 그들이 다가오는 방식과 알아보는 법",
      },
      {
        title: "너를 시들게 할 독",
        guide: "피해야 할 상대가 어떤 오행 기운과 성향을 지녔는지, 처음에 어떻게 달콤하게 다가오는지와 사주적 근거",
      },
      {
        title: "{him}를 만나는 장소와 순간",
        guide: "잘 맞는 인연이 지닌 오행 기운과 성향, 그 인연을 만나기 쉬운 장소·상황·계절. 시기는 세운 목록 안에서만 짚는다",
      },
    ],
  },
  {
    key: "bloom",
    title: "도화가 터지는 때",
    subtitle: "앞으로 3년, 네 꽃이 흐드러지는 때",
    image: "/images/result/chapter-6.jpg",
    sections: [
      {
        title: "앞으로 3년 연애운",
        guide: "앞으로 3년 연애운의 큰 흐름만 짧게(문단 1~2개). 해마다의 이야기는 loveTimeline에 쓰므로 여기서 연도별로 풀어 쓰지 않는다",
      },
      {
        title: "매력살이 깨어나는 시기",
        guide:
          "도화살·홍염살·화개살이 각각 어떤 색기인지 짧게 짚고, <dohwa>의 점수와 드러남·잠재 여부를 그대로 쓴다. 살이 깨어나는 시기는 <dohwa>의 awakening에 있는 해와 대운만 근거로 짚는다",
      },
      {
        title: "지금 네 고민에 대한 신선의 답",
        guide: "<concern>의 고민에 직접 답한다. <concern>이 비어 있으면 <life>의 연애 상태에서 지금 가장 궁금해할 만한 것을 골라 답하고, 구체적인 행동을 제안한다",
      },
    ],
  },
] as const;

export type ReportChapterKey = (typeof CHAPTERS)[number]["key"];

export const REPORT_CHAPTERS = CHAPTERS.map((chapter, index) => ({ ...chapter, chapter: index + 1 }));

export const chapterOf = (key: ReportChapterKey) => REPORT_CHAPTERS.find((chapter) => chapter.key === key)!;

export const REPORT_SECTION_COUNT = REPORT_CHAPTERS.reduce((sum, chapter) => sum + chapter.sections.length, 0);

/** 문구 속 {partner}·{him}을 사용자의 성별에 맞는 호칭으로 바꾼다. 여성 사용자에게 끌리는 이는 사내, 남성 사용자에게는 여인이다. */
export function withPartner(text: string, gender: "female" | "male"): string {
  const female = gender === "female";
  return text.replaceAll("{partner}", female ? "사내" : "여인").replaceAll("{him}", female ? "그" : "그녀");
}

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
  realReviews.length > 0 ? (realReviews.reduce((sum, review) => sum + review.rating, 0) / realReviews.length).toFixed(1) : null;