const HOUR_BRANCHES = [
  { name: "자시", hanja: "子", range: "23:00–01:00" },
  { name: "축시", hanja: "丑", range: "01:00–03:00" },
  { name: "인시", hanja: "寅", range: "03:00–05:00" },
  { name: "묘시", hanja: "卯", range: "05:00–07:00" },
  { name: "진시", hanja: "辰", range: "07:00–09:00" },
  { name: "사시", hanja: "巳", range: "09:00–11:00" },
  { name: "오시", hanja: "午", range: "11:00–13:00" },
  { name: "미시", hanja: "未", range: "13:00–15:00" },
  { name: "신시", hanja: "申", range: "15:00–17:00" },
  { name: "유시", hanja: "酉", range: "17:00–19:00" },
  { name: "술시", hanja: "戌", range: "19:00–21:00" },
  { name: "해시", hanja: "亥", range: "21:00–23:00" },
] as const;

/** 입력 화면 안내용 시진 표시. 실제 시주는 만세력 라이브러리가 계산한다. */
export function hourBranchOf(hour: number) {
  return HOUR_BRANCHES[Math.floor(((hour + 1) % 24) / 2)];
}
