import {
  EMPTY_FORM_VALUES,
  toAnalysisInput,
  validateStep,
  type AnalysisFormValues,
} from "../src/lib/validation/analysisInput";

const valid: AnalysisFormValues = {
  ...EMPTY_FORM_VALUES,
  name: "  김 서윤 ",
  birthYear: "1992",
  birthMonth: "10",
  birthDay: "24",
  birthHour: "5",
  birthMinute: "30",
  gender: "female",
  occupationStatus: "employee",
  occupation: " IT 회사 <b>마케팅</b> ",
  concern: "이직을 해야 할지 고민입니다.\n\n\n\n연애도 잘 안 풀려요.",
  email: " User@Example.COM ",
  agreePrivacy: true,
  agreeAge14: true,
};

type Case = { label: string; step: number; patch: Partial<AnalysisFormValues>; expectKeys: string[] };

const cases: Case[] = [
  { label: "정상 입력", step: 0, patch: {}, expectKeys: [] },
  { label: "이름 비어있음", step: 0, patch: { name: "   " }, expectKeys: ["name"] },
  { label: "이름에 숫자", step: 0, patch: { name: "서윤123" }, expectKeys: ["name"] },
  { label: "생년월일 미선택", step: 0, patch: { birthDay: "" }, expectKeys: ["birthDate"] },
  { label: "양력 2월 30일", step: 0, patch: { birthMonth: "2", birthDay: "30" }, expectKeys: ["birthDate"] },
  { label: "양력 2023-02-29 (평년)", step: 0, patch: { birthYear: "2023", birthMonth: "2", birthDay: "29" }, expectKeys: ["birthDate"] },
  { label: "양력 2024-02-29 (윤년)", step: 0, patch: { birthYear: "2024", birthMonth: "2", birthDay: "29" }, expectKeys: [] },
  { label: "음력 2월 30일 허용", step: 0, patch: { calendarType: "lunar", birthMonth: "2", birthDay: "30" }, expectKeys: [] },
  { label: "양력인데 윤달 체크", step: 0, patch: { isLeapMonth: true }, expectKeys: ["isLeapMonth"] },
  { label: "미래 날짜", step: 0, patch: { birthYear: "2026", birthMonth: "12", birthDay: "31" }, expectKeys: ["birthDate"] },
  { label: "시간 미선택", step: 0, patch: { birthHour: "" }, expectKeys: ["birthTime"] },
  { label: "시간 모름", step: 0, patch: { birthHour: "", birthMinute: "", birthTimeUnknown: true }, expectKeys: [] },
  { label: "성별 미선택", step: 0, patch: { gender: "" }, expectKeys: ["gender"] },
  { label: "직업 상태 미선택", step: 1, patch: { occupationStatus: "" }, expectKeys: ["occupationStatus"] },
  { label: "직장인인데 하는 일 비어있음", step: 1, patch: { occupation: "  " }, expectKeys: ["occupation"] },
  { label: "학생은 하는 일 생략 가능", step: 1, patch: { occupationStatus: "student", occupation: "" }, expectKeys: [] },
  { label: "고민 너무 짧음", step: 2, patch: { concern: "고민" }, expectKeys: ["concern"] },
  { label: "이메일 형식 오류", step: 3, patch: { email: "user@" }, expectKeys: ["email"] },
  { label: "동의 안 함", step: 3, patch: { agreePrivacy: false, agreeAge14: false }, expectKeys: ["agreePrivacy", "agreeAge14"] },
];

let failed = 0;
for (const testCase of cases) {
  const errors = validateStep(testCase.step, { ...valid, ...testCase.patch });
  const keys = Object.keys(errors).sort();
  const ok = JSON.stringify(keys) === JSON.stringify([...testCase.expectKeys].sort());
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${testCase.label}  ${keys.length ? JSON.stringify(errors) : ""}`);
}

const normalized = toAnalysisInput(valid);
console.log("\n정규화 결과:", JSON.stringify(normalized, null, 2));

const unknownTime = toAnalysisInput({ ...valid, birthTimeUnknown: true, occupationStatus: "student" });
console.log("\n시간 모름 + 학생:", JSON.stringify(unknownTime.ok && { birth: unknownTime.input.birth, occupation: unknownTime.input.occupation }));

if (failed > 0) {
  console.error(`\n${failed}개 실패`);
  process.exit(1);
}
console.log(`\n${cases.length}개 모두 통과`);
