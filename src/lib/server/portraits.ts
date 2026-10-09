import "server-only";

import type { FullReportView } from "@/types/result";

/**
 * 리포트에 넣는 얼굴 그림. 지금은 모든 리포트가 같은 샘플 그림을 쓴다.
 * 출시 전에 사주별 AI 생성 그림으로 바꿀 자리라, 화면은 이 함수가 돌려주는 값만 쓴다.
 */
export function reportPortraits(): FullReportView["portraits"] {
  return {
    self: { src: "/images/report/portrait-self-sample.jpg", caption: "그 남자가 보는 네 얼굴" },
    partner: { src: "/images/report/portrait-partner-sample.jpg", caption: "네 남자의 얼굴" },
  };
}
