import type { BasicResultView } from "@/types/result";

// UI 확인용 샘플. 8글자·오행·십신은 1992-10-24 05:30(양력, 여성)을 manseryeok/ssaju로 계산한 실제 값이며,
// 해석 문장은 레이아웃 확인용 임시 문구다. PHASE 8에서 실제 분석 결과로 교체된다.
export const SAMPLE_BASIC_RESULT: BasicResultView = {
  name: "서윤",
  analyzedAt: "2026-10-03",
  summary: "차가운 가을 물처럼 고요하지만, 한번 정한 방향은 끝까지 흘러가는 사람",
  keywords: ["원칙", "깊은 사고", "표현의 욕구", "신중함", "독립"],
  pillars: [
    {
      label: "시주",
      stem: { hanja: "乙", korean: "을", element: "wood", tenGod: "식신" },
      branch: { hanja: "卯", korean: "묘", element: "wood", tenGod: "식신" },
    },
    {
      label: "일주",
      stem: { hanja: "癸", korean: "계", element: "water", tenGod: "일간" },
      branch: { hanja: "酉", korean: "유", element: "metal", tenGod: "편인" },
    },
    {
      label: "월주",
      stem: { hanja: "庚", korean: "경", element: "metal", tenGod: "정인" },
      branch: { hanja: "戌", korean: "술", element: "earth", tenGod: "정관" },
    },
    {
      label: "년주",
      stem: { hanja: "壬", korean: "임", element: "water", tenGod: "겁재" },
      branch: { hanja: "申", korean: "신", element: "metal", tenGod: "정인" },
    },
  ],
  fiveElements: { wood: 2, fire: 0, earth: 1, metal: 3, water: 2 },
  dayMaster: {
    hanja: "癸",
    korean: "계수",
    description: "이슬과 빗물처럼 스며드는 물. 조용하지만 닿는 곳마다 흔적을 남기는 기운입니다.",
  },
  personality: {
    overview:
      "샘플 문장입니다. 실제 서비스에서는 계산된 사주 구조를 근거로, 이 사람이 어떤 방식으로 생각하고 움직이는지 여러 문단에 걸쳐 설명합니다.",
    traits: [
      { label: "사고방식", body: "샘플 문장입니다. 결론을 내리기 전에 오래 관찰하고 정리하는 경향을 설명합니다." },
      { label: "행동방식", body: "샘플 문장입니다. 확신이 생긴 뒤에야 움직이는 패턴을 설명합니다." },
      { label: "감정 표현", body: "샘플 문장입니다. 감정을 안으로 정리한 뒤 표현하는 경향을 설명합니다." },
      { label: "인간관계", body: "샘플 문장입니다. 넓은 관계보다 깊은 소수의 관계를 선호하는 이유를 설명합니다." },
      { label: "욕심과 경쟁심", body: "샘플 문장입니다. 겉으로 드러나지 않는 승부욕의 구조를 설명합니다." },
      { label: "추구하는 것", body: "샘플 문장입니다. 인정보다 스스로 납득할 수 있는 삶을 원하는 경향을 설명합니다." },
    ],
    strengths: ["깊이 있는 분석력", "흔들리지 않는 원칙", "섬세한 관찰력"],
    cautions: ["생각이 길어져 기회를 놓치는 패턴", "감정을 혼자 삭이는 습관"],
  },
  money: { overview: "샘플 문장입니다. 평생 재물 흐름의 큰 그림을 간단히 보여줍니다." },
  love: { overview: "샘플 문장입니다. 연애 성향과 관계에서 반복되는 패턴을 간단히 보여줍니다." },
  career: { overview: "샘플 문장입니다. 현재 하고 있는 일과 사주 구조의 관계를 간단히 보여줍니다." },
};
