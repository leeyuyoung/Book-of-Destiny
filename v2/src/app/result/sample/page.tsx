import type { Metadata } from "next";
import { FreeResultScreen } from "@/components/result/FreeResultScreen";
import { isSampleType, sampleFreeResult } from "@/lib/server/resultView";

export const metadata: Metadata = {
  title: "도화 지수 예시",
  robots: { index: false, follow: false },
};

export default async function SampleResultPage({ searchParams }: PageProps<"/result/sample">) {
  const { type } = await searchParams;
  return <FreeResultScreen result={sampleFreeResult(isSampleType(type) ? type : undefined)} sample />;
}
