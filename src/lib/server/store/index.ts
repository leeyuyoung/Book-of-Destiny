import "server-only";

import { MemoryAnalysisStore } from "./memoryStore";
import type { AnalysisStore } from "./types";

export type { AnalysisRecord, AnalysisStatus, AnalysisStore } from "./types";

// 개발 서버의 코드 변경(HMR) 때 모듈이 다시 불려도 같은 저장소를 쓰도록 전역에 둔다.
const globalForStore = globalThis as typeof globalThis & { __paljaAnalysisStore?: AnalysisStore };

export function getAnalysisStore(): AnalysisStore {
  globalForStore.__paljaAnalysisStore ??= new MemoryAnalysisStore();
  return globalForStore.__paljaAnalysisStore;
}
