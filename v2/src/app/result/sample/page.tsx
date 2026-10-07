import type { Metadata } from "next";
import { FreeResultScreen } from "@/components/result/FreeResultScreen";
import { sampleFreeResult } from "@/lib/server/resultView";

export const metadata: Metadata = {
  title: "도화 지수 예시",
  robots: { index: false, follow: false },
};

export default function SampleResultPage() {
  return <FreeResultScreen result={sampleFreeResult()} sample />;
}
