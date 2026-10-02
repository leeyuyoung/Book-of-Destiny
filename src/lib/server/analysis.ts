import "server-only";

import { randomBytes } from "node:crypto";
import { buildSajuProfile, calculateSaju } from "@/lib/saju";
import type { AnalysisInput } from "@/lib/validation/analysisInput";
import { AiReportError, generateReport } from "./ai/generateReport";
import { getAnalysisStore, type AnalysisRecord } from "./store";

/** 동시에 생성 중인 리포트 수 상한. 요청 폭주 시 AI 비용이 한꺼번에 커지는 것을 막는다. */
export const MAX_CONCURRENT_GENERATIONS = 10;

const globalForGeneration = globalThis as typeof globalThis & { __paljaInFlight?: { count: number } };
const inFlight = (globalForGeneration.__paljaInFlight ??= { count: 0 });

export const generationCapacityAvailable = () => inFlight.count < MAX_CONCURRENT_GENERATIONS;

export const TOKEN_PATTERN = /^[A-Za-z0-9_-]{22}$/;
const newToken = () => randomBytes(16).toString("base64url");

/** 만세력 계산까지 마치고 '생성 중' 기록을 만든다. 계산 오류는 그대로 던진다(SajuCalculationError). */
export async function createAnalysis(input: AnalysisInput): Promise<AnalysisRecord> {
  const profile = buildSajuProfile(calculateSaju({ birth: input.birth, gender: input.gender }));
  const now = Date.now();
  const record: AnalysisRecord = {
    token: newToken(),
    status: "generating",
    createdAt: now,
    updatedAt: now,
    name: input.name,
    email: input.email,
    occupationStatus: input.occupationStatus,
    occupation: input.occupation,
    concern: input.concern,
    profile,
    report: null,
    paidAt: null,
  };
  await getAnalysisStore().create(record);
  return record;
}

/** 결제가 확인된 분석의 전체 리포트를 연다. 결제 승인 검증을 마친 서버 코드에서만 호출한다. */
export async function markAnalysisPaid(token: string): Promise<boolean> {
  const store = getAnalysisStore();
  const record = await store.get(token);
  if (!record || record.status !== "ready") return false;
  if (record.paidAt === null) await store.update(token, { paidAt: Date.now() });
  return true;
}

/** 전체 리포트를 한 번 생성해 저장한다. 실패해도 예외를 밖으로 던지지 않고 상태만 바꾼다. */
export async function runReportGeneration(record: AnalysisRecord): Promise<void> {
  const store = getAnalysisStore();
  inFlight.count++;
  try {
    const report = await generateReport(record.profile, {
      occupationStatus: record.occupationStatus,
      occupation: record.occupation,
      concern: record.concern,
    });
    await store.update(record.token, { status: "ready", report });
  } catch (error) {
    // 사용자 입력이 섞이지 않도록 오류 코드와 메시지만 남긴다.
    const detail = error instanceof AiReportError ? error.message : String(error);
    console.error(`[analysis] ${record.token.slice(0, 6)}… report generation failed: ${detail}`);
    await store
      .update(record.token, { status: "failed" })
      .catch((storeError) => console.error(`[analysis] could not mark failed: ${String(storeError)}`));
  } finally {
    inFlight.count--;
  }
}
