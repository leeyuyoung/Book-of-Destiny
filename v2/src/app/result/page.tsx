import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FreeResultScreen } from "@/components/result/FreeResultScreen";
import { SajuCalculationError } from "@/lib/saju";
import { loadInputCookie } from "@/lib/server/inputCookie";
import { freeResultFromInput } from "@/lib/server/resultView";
import type { FreeResultView } from "@/types/result";

export const metadata: Metadata = {
  title: "나의 도화 지수",
  robots: { index: false, follow: false },
};

async function loadResult(): Promise<FreeResultView | null> {
  const input = await loadInputCookie();
  if (!input) return null;
  try {
    return freeResultFromInput(input);
  } catch (error) {
    if (error instanceof SajuCalculationError) return null;
    throw error;
  }
}

export default async function ResultPage() {
  const result = await loadResult();
  if (!result) redirect("/start");
  return <FreeResultScreen result={result} />;
}
