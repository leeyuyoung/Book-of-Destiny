import { z } from "zod";
import { sanitizeEmail, sanitizeMultiLine, sanitizeSingleLine } from "./sanitize";

export const MIN_BIRTH_YEAR = 1920;
export const NAME_MAX_LENGTH = 20;
export const OCCUPATION_MAX_LENGTH = 100;
export const CONCERN_MIN_LENGTH = 10;
export const CONCERN_MAX_LENGTH = 2000;
export const LUNAR_MAX_DAY = 30;

export const OCCUPATION_STATUSES = [
  { value: "student", label: "학생" },
  { value: "job_seeking", label: "취업 준비 중" },
  { value: "employee", label: "직장인" },
  { value: "business_owner", label: "자영업 · 사업" },
  { value: "freelancer", label: "프리랜서" },
  { value: "homemaker", label: "주부" },
  { value: "unemployed", label: "무직" },
  { value: "other", label: "기타" },
] as const;

export type OccupationStatus = (typeof OCCUPATION_STATUSES)[number]["value"];

const OCCUPATION_STATUS_VALUES = OCCUPATION_STATUSES.map((status) => status.value) as [
  OccupationStatus,
  ...OccupationStatus[],
];

export const OCCUPATION_DETAIL_REQUIRED: ReadonlySet<OccupationStatus> = new Set([
  "employee",
  "business_owner",
  "freelancer",
  "other",
]);

export const occupationLabel = (status: OccupationStatus) =>
  OCCUPATION_STATUSES.find((item) => item.value === status)?.label ?? status;

/** 입력 화면이 다루는 값. select/input 특성상 숫자도 문자열로 보관한다. */
export type AnalysisFormValues = {
  name: string;
  calendarType: "solar" | "lunar";
  isLeapMonth: boolean;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  birthTimeUnknown: boolean;
  gender: "" | "female" | "male";
  occupationStatus: "" | OccupationStatus;
  occupation: string;
  concern: string;
  email: string;
  agreePrivacy: boolean;
  agreeAge14: boolean;
};

export const EMPTY_FORM_VALUES: AnalysisFormValues = {
  name: "",
  calendarType: "solar",
  isLeapMonth: false,
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  birthHour: "",
  birthMinute: "",
  birthTimeUnknown: false,
  gender: "",
  occupationStatus: "",
  occupation: "",
  concern: "",
  email: "",
  agreePrivacy: false,
  agreeAge14: false,
};

export function daysInMonth(calendarType: "solar" | "lunar", year: number, month: number): number {
  if (calendarType === "lunar") return LUNAR_MAX_DAY;
  return new Date(year, month, 0).getDate();
}

const toInt = (value: string) => (/^\d+$/.test(value) ? Number(value) : NaN);

const nameRule = z
  .string()
  .transform(sanitizeSingleLine)
  .pipe(
    z
      .string()
      .min(1, "이름을 입력해주세요.")
      .max(NAME_MAX_LENGTH, `이름은 ${NAME_MAX_LENGTH}자 이내로 입력해주세요.`)
      .regex(/^[가-힣a-zA-Z\s]+$/, "이름은 한글 또는 영문으로 입력해주세요."),
  );

export const birthStepSchema = z
  .object({
    name: nameRule,
    calendarType: z.enum(["solar", "lunar"]),
    isLeapMonth: z.boolean(),
    birthYear: z.string(),
    birthMonth: z.string(),
    birthDay: z.string(),
    birthHour: z.string(),
    birthMinute: z.string(),
    birthTimeUnknown: z.boolean(),
    gender: z.string(),
  })
  .superRefine((values, ctx) => {
    const year = toInt(values.birthYear);
    const month = toInt(values.birthMonth);
    const day = toInt(values.birthDay);
    const currentYear = new Date().getFullYear();

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      ctx.addIssue({ code: "custom", path: ["birthDate"], message: "생년월일을 모두 선택해주세요." });
    } else if (year < MIN_BIRTH_YEAR || year > currentYear || month < 1 || month > 12) {
      ctx.addIssue({ code: "custom", path: ["birthDate"], message: "올바른 생년월일을 선택해주세요." });
    } else if (day < 1 || day > daysInMonth(values.calendarType, year, month)) {
      ctx.addIssue({ code: "custom", path: ["birthDate"], message: "존재하지 않는 날짜입니다." });
    } else if (values.calendarType === "solar") {
      const birth = new Date(year, month - 1, day);
      if (birth.getTime() > Date.now()) {
        ctx.addIssue({ code: "custom", path: ["birthDate"], message: "미래의 날짜는 선택할 수 없습니다." });
      }
    }

    if (values.isLeapMonth && values.calendarType !== "lunar") {
      ctx.addIssue({ code: "custom", path: ["isLeapMonth"], message: "윤달은 음력에서만 선택할 수 있습니다." });
    }

    if (!values.birthTimeUnknown) {
      const hour = toInt(values.birthHour);
      const minute = toInt(values.birthMinute);
      if (Number.isNaN(hour) || Number.isNaN(minute) || hour > 23 || minute > 59) {
        ctx.addIssue({
          code: "custom",
          path: ["birthTime"],
          message: "태어난 시간을 선택하거나 ‘출생시간 모름’을 체크해주세요.",
        });
      }
    }

    if (values.gender !== "female" && values.gender !== "male") {
      ctx.addIssue({ code: "custom", path: ["gender"], message: "성별을 선택해주세요." });
    }
  });

export const lifeStepSchema = z
  .object({
    occupationStatus: z.string(),
    occupation: z.string().transform(sanitizeSingleLine),
  })
  .superRefine((values, ctx) => {
    if (!OCCUPATION_STATUS_VALUES.includes(values.occupationStatus as OccupationStatus)) {
      ctx.addIssue({ code: "custom", path: ["occupationStatus"], message: "현재 상태를 선택해주세요." });
      return;
    }
    const needsDetail = OCCUPATION_DETAIL_REQUIRED.has(values.occupationStatus as OccupationStatus);
    if (needsDetail && values.occupation.length === 0) {
      ctx.addIssue({ code: "custom", path: ["occupation"], message: "어떤 일을 하고 계신지 적어주세요." });
    }
    if (values.occupation.length > OCCUPATION_MAX_LENGTH) {
      ctx.addIssue({
        code: "custom",
        path: ["occupation"],
        message: `${OCCUPATION_MAX_LENGTH}자 이내로 적어주세요.`,
      });
    }
  });

export const concernStepSchema = z.object({
  concern: z
    .string()
    .transform(sanitizeMultiLine)
    .pipe(
      z
        .string()
        .min(CONCERN_MIN_LENGTH, `고민을 ${CONCERN_MIN_LENGTH}자 이상 적어주세요. 자세할수록 리포트가 깊어집니다.`)
        .max(CONCERN_MAX_LENGTH, `${CONCERN_MAX_LENGTH}자 이내로 적어주세요.`),
    ),
});

export const emailStepSchema = z.object({
  email: z
    .string()
    .transform(sanitizeEmail)
    .pipe(z.string().min(1, "이메일을 입력해주세요.").max(254).pipe(z.email("올바른 이메일 주소를 입력해주세요."))),
  agreePrivacy: z.literal(true, { error: "개인정보 수집·이용에 동의해주세요." }),
  agreeAge14: z.literal(true, { error: "만 14세 이상만 이용할 수 있습니다." }),
});

export const STEP_SCHEMAS = [birthStepSchema, lifeStepSchema, concernStepSchema, emailStepSchema] as const;

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
  occupationStatus: z.enum(OCCUPATION_STATUS_VALUES),
  occupation: z.string().transform(sanitizeSingleLine).pipe(z.string().max(OCCUPATION_MAX_LENGTH)).nullable(),
  concern: concernStepSchema.shape.concern,
  email: emailStepSchema.shape.email,
  consent: z.object({ privacy: z.literal(true), age14: z.literal(true) }),
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

  const status = values.occupationStatus as OccupationStatus;
  const timeKnown = !values.birthTimeUnknown;
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
    occupationStatus: status,
    occupation: OCCUPATION_DETAIL_REQUIRED.has(status) ? values.occupation : null,
    concern: values.concern,
    email: values.email,
    consent: { privacy: values.agreePrivacy, age14: values.agreeAge14 },
  });

  if (!parsed.success) return { ok: false, stepIndex: 0, errors: { form: "입력값을 다시 확인해주세요." } };
  return { ok: true, input: parsed.data };
}
