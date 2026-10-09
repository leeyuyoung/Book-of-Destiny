import {
  EMPTY_FORM_VALUES,
  checkoutContactSchema,
  toAnalysisInput,
  validateStep,
  type AnalysisFormValues,
} from "../src/lib/validation/analysisInput";

const valid: AnalysisFormValues = {
  ...EMPTY_FORM_VALUES,
  birthYear: "1992",
  birthMonth: "10",
  birthDay: "24",
  birthHour: "5",
  birthMinute: "30",
  name: "  달빛 서윤 ",
  relationshipStatus: "some",
};

type Case = { label: string; step: number; patch: Partial<AnalysisFormValues>; expectKeys: string[] };

const cases: Case[] = [
  { label: "정상 입력", step: 0, patch: {}, expectKeys: [] },
  { label: "생년월일 미선택", step: 0, patch: { birthDay: "" }, expectKeys: ["birthDate"] },
  { label: "양력 2월 30일", step: 0, patch: { birthMonth: "2", birthDay: "30" }, expectKeys: ["birthDate"] },
  { label: "양력 2023-02-29 (평년)", step: 0, patch: { birthYear: "2023", birthMonth: "2", birthDay: "29" }, expectKeys: ["birthDate"] },
  { label: "양력 2024-02-29 (윤년)", step: 0, patch: { birthYear: "2024", birthMonth: "2", birthDay: "29" }, expectKeys: [] },
  { label: "음력 2월 30일 허용", step: 0, patch: { calendarType: "lunar", birthMonth: "2", birthDay: "30" }, expectKeys: [] },
  { label: "양력인데 윤달 체크", step: 0, patch: { isLeapMonth: true }, expectKeys: ["isLeapMonth"] },
  { label: "미래 날짜", step: 0, patch: { birthYear: String(new Date().getFullYear()), birthMonth: "12", birthDay: "31" }, expectKeys: ["birthDate"] },
  { label: "시간 미선택", step: 1, patch: { birthHour: "" }, expectKeys: ["birthTime"] },
  { label: "시간 모름", step: 1, patch: { birthHour: "", birthMinute: "", birthTimeUnknown: true }, expectKeys: [] },
  { label: "이름 비어있음", step: 2, patch: { name: "   " }, expectKeys: ["name"] },
  { label: "이름에 숫자 허용", step: 2, patch: { name: "서윤99" }, expectKeys: [] },
  { label: "자음·모음만 입력해도 허용", step: 2, patch: { name: "ㅇㄹ" }, expectKeys: [] },
  { label: "모음 섞인 입력 허용", step: 2, patch: { name: "ㅐㄹ" }, expectKeys: [] },
  { label: "꺾쇠만 입력하면 빈 이름", step: 2, patch: { name: "<>" }, expectKeys: ["name"] },
  { label: "이름 13자", step: 2, patch: { name: "가나다라마바사아자차카타파" }, expectKeys: ["name"] },
  { label: "연애 상태 미선택", step: 3, patch: { relationshipStatus: "" }, expectKeys: ["relationshipStatus"] },
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

const femaleOk = normalized.ok && normalized.input.gender === "female";
if (!femaleOk) failed++;
console.log(`${femaleOk ? "PASS" : "FAIL"}  성별은 묻지 않고 female로 고정`);

const contactCases = [
  { label: "결제 이메일 정상", input: { email: " User@Example.COM ", agreePrivacy: true, agreeAge14: true }, ok: true },
  { label: "결제 이메일 형식 오류", input: { email: "user@", agreePrivacy: true, agreeAge14: true }, ok: false },
  { label: "결제 동의 안 함", input: { email: "user@example.com", agreePrivacy: false, agreeAge14: true }, ok: false },
];
for (const testCase of contactCases) {
  const ok = checkoutContactSchema.safeParse(testCase.input).success === testCase.ok;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${testCase.label}`);
}

if (failed > 0) {
  console.error(`\n${failed}개 실패`);
  process.exit(1);
}
console.log("\n모두 통과");
