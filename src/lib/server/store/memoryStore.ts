import "server-only";

import type { AnalysisRecord, AnalysisStore } from "./types";

/** 개발용 보관 기간. 서버를 재시작해도 사라진다. */
const RECORD_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * 개발용 메모리 저장소. 서버 프로세스 하나에서만 유효해 배포(서버리스) 환경에서는 쓸 수 없다.
 * 결제 연동 전에 Supabase 구현으로 교체한다.
 */
export class MemoryAnalysisStore implements AnalysisStore {
  private records = new Map<string, AnalysisRecord>();

  private sweep() {
    const now = Date.now();
    for (const [token, record] of this.records) {
      if (now - record.createdAt > RECORD_TTL_MS) this.records.delete(token);
    }
  }

  async create(record: AnalysisRecord) {
    this.sweep();
    this.records.set(record.token, structuredClone(record));
  }

  async get(token: string) {
    this.sweep();
    const record = this.records.get(token);
    return record ? structuredClone(record) : null;
  }

  async update(token: string, patch: Partial<Omit<AnalysisRecord, "token" | "createdAt">>) {
    const record = this.records.get(token);
    if (!record) return;
    this.records.set(token, { ...record, ...structuredClone(patch), updatedAt: Date.now() });
  }
}
