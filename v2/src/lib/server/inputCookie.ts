import "server-only";

import { cookies } from "next/headers";
import { analysisInputSchema, type AnalysisInput } from "@/lib/validation/analysisInput";

/**
 * 이 버전은 데이터베이스 없이 돈다. 입력값은 그 사람 브라우저의 쿠키에만 잠깐 두고,
 * 결과 화면을 열 때마다 만세력으로 다시 계산한다.
 */
const COOKIE_NAME = "dohwa_v2_input";
const MAX_AGE_SECONDS = 60 * 60;

export async function saveInputCookie(input: AnalysisInput) {
  const value = Buffer.from(JSON.stringify(input), "utf8").toString("base64url");
  (await cookies()).set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function loadInputCookie(): Promise<AnalysisInput | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = analysisInputSchema.safeParse(JSON.parse(Buffer.from(raw, "base64url").toString("utf8")));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
