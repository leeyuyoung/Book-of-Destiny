import { z } from "zod";
import { sanitizeEmail, sanitizeMultiLine, sanitizeSingleLine } from "./sanitize";

export const MIN_BIRTH_YEAR = 1920;
export const NAME_MAX_LENGTH = 12;
export const CONCERN_MAX_LENGTH = 1000;
export const LUNAR_MAX_DAY = 30;

export const RELATIONSHIP_STATUSES = [
  { value: "single", label: "없어요. 지금은 혼자예요" },
  { value: "some", label: "있는데 아직 애매한 썸이에요" },
  { value: "dating", label: "지금 사귀는 사람이 있어요" },
  { value: "breakup", label: "다시 만나고 싶은 사람이 있어요" },
] as const;

export type RelationshipStatus = (typeof RELATIONSHIP_STATUSES)[number]["value"];

const RELATIONSHIP_STATUS_VALUES = RELATIONSHIP_STATUSES.map((status) => status.value) as [
  RelationshipStatus,
  ...RelationshipStatus[],
];

export const relationshipLabel = (status: RelationshipStatus) =>
  RELATIONSHIP_STATUSES.find((item) => item.value === status)?.label ?? status;

/** 입력 화면이 다루는 값. select/input 특성상 숫자도 문자열로 보관한다. */
export type AnalysisFormValues = {
  calendarType: "solar" | "lunar";
  isLeapMonth: boolean;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  birthTimeUnknown: boolean;
  gender: "" | "female" | "male";
  name: string;
  relationshipStatus: "" | RelationshipStatus;
  concern: string;
};

export const EMPTY_FORM_VALUES: AnalysisFormValues = {
  calendarType: "solar",
  isLeapMonth: false,
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  birthHour: "",
  birthMinute: "",
  birthTimeUnknown: false,
  gender: "",
  name: "",
  relationshipStatus: "",
  concern: "",
};

export function daysInMonth(calendarType: "solar" | "lunar", year: number, month: number): number {
  if (calendarType === "lunar") return LUNAR_MAX_DAY;
  return new Date(year, month, 0).getDate();
}

const toInt = (value: string) => (/^\d+$/.test(value) ? Number(value) : NaN);

/** 리포트에서 사용자를 부를 이름. 형식은 묻지 않고 제어문자와 꺾쇠만 걸러낸다. */
const nameRule = z
  .string()
  .transform(sanitizeSingleLine)
  .pipe(
    z
      .string()
      .min(1, "이름을 알려주렴.")
      .max(NAME_MAX_LENGTH, `${NAME_MAX_LENGTH}자 이내로 알려주렴.`),
  );

const concernRule = z
  .string()
  .transform(sanitizeMultiLine)
  .pipe(z.string().max(CONCERN_MAX_LENGTH, `${CONCERN_MAX_LENGTH}자 이내로 적어주렴.`));

export const birthDateStepSchema = z
  .object({
    calendarType: z.enum(["solar", "lunar"]),
    isLeapMonth: z.boolean(),
    birthYear: z.string(),
    birthMonth: z.string(),
    birthDay: z.string(),
  })
  .superRefine((values, ctx) => {
    const year = toInt(values.birthYear);
    const month = toInt(values.birthMonth);
    const day = toInt(values.birthDay);
    const currentYear = new Date().getFullYear();

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      ctx.addIssue({ code: "custom", path: ["birthDate"], message: "태어난 해와 달, 날을 모두 골라주렴." });
    } else if (year < MIN_BIRTH_YEAR || year > currentYear || month < 1 || month > 12) {
      ctx.addIssue({ code: "custom", path: ["birthDate"], message: "올바른 날을 골라주렴." });
    } else if (day < 1 || day > daysInMonth(values.calendarType, year, month)) {
      ctx.addIssue({ code: "custom", path: ["birthDate"], message: "그런 날은 없단다. 다시 골라주렴." });
    } else if (values.calendarType === "solar" && new Date(year, month - 1, day).getTime() > Date.now()) {
      ctx.addIssue({ code: "custom", path: ["birthDate"], message: "아직 오지 않은 날은 고를 수 없단다." });
    }

    if (values.isLeapMonth && values.calendarType !== "lunar") {
      ctx.addIssue({ code: "custom", path: ["isLeapMonth"], message: "윤달은 음력에서만 고를 수 있단다." });
    }
  });

export const birthTimeStepSchema = z
  .object({ birthHour: z.string(), birthMinute: z.string(), birthTimeUnknown: z.boolean() })
  .superRefine((values, ctx) => {
    if (values.birthTimeUnknown) return;
    const hour = toInt(values.birthHour);
    const minute = toInt(values.birthMinute);
    if (Number.isNaN(hour) || Number.isNaN(minute) || hour > 23 || minute > 59) {
      ctx.addIssue({ code: "custom", path: ["birthTime"], message: "태어난 시각을 고르거나 ‘모름’을 눌러주렴." });
    }
  });

export const genderStepSchema = z.object({ gender: z.string() }).superRefine((values, ctx) => {
  if (values.gender !== "female" && values.gender !== "male") {
    ctx.addIssue({ code: "custom", path: ["gender"], message: "하나를 골라주렴." });
  }
});

export const nameStepSchema = z.object({ name: nameRule });

export const loveStepSchema = z
  .object({ relationshipStatus: z.string(), concern: concernRule })
  .superRefine((values, ctx) => {
    if (!RELATIONSHIP_STATUS_VALUES.includes(values.relationshipStatus as RelationshipStatus)) {
      ctx.addIssue({ code: "custom", path: ["relationshipStatus"], message: "지금 네 마음에 가까운 것을 골라주렴." });
    }
  });

export const STEP_SCHEMAS = [
  birthDateStepSchema,
  birthTimeStepSchema,
  genderStepSchema,
  nameStepSchema,
  loveStepSchema,
] as const;

export type FieldErrors = Partial<Record<string, string>>;

export function validateStep(stepIndex: number, values: AnalysisFormValues): FieldErrors {
  const result = STEP_SCHEMAS[stepIndex].safeParse(values);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** 서버와 만세력 계산에 넘기는 정규화된 입력 */
export const analysisInputSchema = z.object({
  name: nameRule,
  birth: z.object({
    calendarType: z.enum(["solar", "lunar"]),
    isLeapMonth: z.boolean(),
    year: z.number().int().min(MIN_BIRTH_YEAR),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    hour: z.number().int().min(0).max(23).nullable(),
    minute: z.number().int().min(0).max(59).nullable(),
  }),
  gender: z.enum(["female", "male"]),
  relationshipStatus: z.enum(RELATIONSHIP_STATUS_VALUES),
  concern: concernRule.nullable(),
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;

/** 모든 단계 검증을 통과한 폼 값을 정규화된 입력으로 변환한다. 실패 시 첫 실패 단계를 돌려준다. */
export function toAnalysisInput(
  values: AnalysisFormValues,
): { ok: true; input: AnalysisInput } | { ok: false; stepIndex: number; errors: FieldErrors } {
  for (let index = 0; index < STEP_SCHEMAS.length; index++) {
    const errors = validateStep(index, values);
    if (Object.keys(errors).length > 0) return { ok: false, stepIndex: index, errors };
  }

  const timeKnown = !values.birthTimeUnknown;
  const concern = sanitizeMultiLine(values.concern);
  const parsed = analysisInputSchema.safeParse({
    name: values.name,
    birth: {
      calendarType: values.calendarType,
      isLeapMonth: values.calendarType === "lunar" && values.isLeapMonth,
      year: Number(values.birthYear),
      month: Number(values.birthMonth),
      day: Number(values.birthDay),
      hour: timeKnown ? Number(values.birthHour) : null,
      minute: timeKnown ? Number(values.birthMinute) : null,
    },
    gender: values.gender,
    relationshipStatus: values.relationshipStatus,
    concern: concern.length > 0 ? concern : null,
  });

  if (!parsed.success) return { ok: false, stepIndex: 0, errors: { form: "입력을 다시 확인해주렴." } };
  return { ok: true, input: parsed.data };
}

/** 결제 직전에 받는 리포트 수신 이메일과 동의 */
export const checkoutContactSchema = z.object({
  email: z
    .string({ error: "이메일을 입력해주세요." })
    .transform(sanitizeEmail)
    .pipe(z.string().min(1, "이메일을 입력해주세요.").max(254).pipe(z.email("올바른 이메일 주소를 입력해주세요."))),
  agreePrivacy: z.literal(true, { error: "개인정보 수집·이용에 동의해주세요." }),
  agreeAge14: z.literal(true, { error: "만 14세 이상만 이용할 수 있습니다." }),
});
