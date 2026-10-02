import type { AiReport } from "@/lib/server/ai/reportSchema";
import type { SajuProfile } from "@/lib/saju";
import type { OccupationStatus } from "@/lib/validation/analysisInput";

export type AnalysisStatus = "generating" | "ready" | "failed";

/** 분석 1건. 리포트 전문은 결제 확인 전까지 서버 밖으로 나가지 않는다. */
export type AnalysisRecord = {
  token: string;
  status: AnalysisStatus;
  createdAt: number;
  updatedAt: number;
  name: string;
  /** 리포트 링크 발송용. 화면이나 AI 요청에는 쓰지 않는다. */
  email: string;
  occupationStatus: OccupationStatus;
  occupation: string | null;
  concern: string;
  profile: SajuProfile;
  report: AiReport | null;
  paidAt: number | null;
};

export interface AnalysisStore {
  create(record: AnalysisRecord): Promise<void>;
  get(token: string): Promise<AnalysisRecord | null>;
  update(token: string, patch: Partial<Omit<AnalysisRecord, "token" | "createdAt">>): Promise<void>;
}
