import "server-only";

import { randomBytes } from "node:crypto";
import { after } from "next/server";
import { buildSajuProfile, calculateSaju } from "@/lib/saju";
import type { AnalysisInput } from "@/lib/validation/analysisInput";
import { AiReportError, generateReport } from "./ai/generateReport";
import { aiReportSchema, type AiReport } from "./ai/reportSchema";
import { sendReportEmail } from "./email/sendReportEmail";
import { getAnalysisStore, type AnalysisRecord } from "./store";

/** 이 시간보다 오래 generating이면 생성이 중단된 것으로 보고 다시 시작할 수 있다. 생성 제한 시간(300초)보다 길어야 한다. */
const STALE_GENERATION_MS = 10 * 60 * 1000;

export const TOKEN_PATTERN = /^[A-Za-z0-9_-]{22}$/;
const newToken = () => randomBytes(16).toString("base64url");

/** 저장된 리포트가 지금 형식에 맞을 때만 돌려준다. 예전 형식(11장 인생 리포트)이면 null. */
export function storedReport(record: AnalysisRecord): AiReport | null {
  if (!record.report) return null;
  const parsed = aiReportSchema.safeParse(record.report);
  return parsed.success ? parsed.data : null;
}

/** 만세력 계산만으로 무료 결과를 만든다. AI는 결제 후에만 호출한다. 계산 오류는 그대로 던진다(SajuCalculationError). */
export async function createAnalysis(input: AnalysisInput): Promise<AnalysisRecord> {
  const profile = buildSajuProfile(calculateSaju({ birth: input.birth, gender: input.gender }));
  const now = Date.now();
  const record: AnalysisRecord = {
    token: newToken(),
    status: "ready",
    createdAt: now,
    updatedAt: now,
    name: input.name,
    email: null,
    relationshipStatus: input.relationshipStatus,
    concern: null,
    profile,
    report: null,
    paidAt: null,
  };
  await getAnalysisStore().create(record);
  return record;
}

/** 결제가 확인된 분석을 열고 리포트 생성을 시작한다. 결제 승인 검증을 마친 서버 코드에서만 호출한다. */
export async function markAnalysisPaid(token: string): Promise<boolean> {
  const store = getAnalysisStore();
  const record = await store.get(token);
  if (!record) return false;
  if (record.paidAt === null) {
    await store.update(token, { paidAt: Date.now() });
    if (storedReport(record)) after(() => sendReportEmail(record));
  }
  await startReportGeneration(token);
  return true;
}

/** 환불된 리포트를 다시 잠근다. */
export async function revokeAnalysisPaid(token: string): Promise<void> {
  await getAnalysisStore().update(token, { paidAt: null });
}

/**
 * 결제된 분석의 리포트 생성을 백그라운드로 시작한다. 이미 완성됐거나 다른 요청이 생성 중이면 아무것도 하지 않는다.
 * after()를 쓰므로 요청을 처리하는 중에만 호출한다.
 */
export async function startReportGeneration(token: string): Promise<void> {
  const store = getAnalysisStore();
  const record = await store.get(token);
  if (!record || record.paidAt === null || storedReport(record)) return;
  if (record.report) await store.update(token, { report: null });
  const claimed = await store.claimReportGeneration(token, Date.now() - STALE_GENERATION_MS);
  if (claimed) after(() => runReportGeneration(token));
}

/** 리포트를 한 번 생성해 저장하고 메일을 보낸다. 실패해도 예외를 밖으로 던지지 않고 상태만 바꾼다. */
async function runReportGeneration(token: string): Promise<void> {
  const store = getAnalysisStore();
  try {
    const record = await store.get(token);
    if (!record) return;
    const report = await generateReport(record.profile, { relationshipStatus: record.relationshipStatus });
    await store.update(token, { status: "ready", report });
    const latest = await store.get(token);
    if (latest?.paidAt) await sendReportEmail(latest);
  } catch (error) {
    // 사용자 입력이 섞이지 않도록 오류 코드와 메시지만 남긴다.
    const detail = error instanceof AiReportError ? error.message : String(error);
    console.error(`[analysis] ${token.slice(0, 6)}… report generation failed: ${detail}`);
    await store
      .update(token, { status: "failed" })
      .catch((storeError) => console.error(`[analysis] could not mark failed: ${String(storeError)}`));
  }
}
