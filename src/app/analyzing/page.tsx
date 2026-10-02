import type { Metadata } from "next";
import { AnalyzingExperience } from "@/components/analyzing/AnalyzingExperience";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "당신의 사주를 읽고 있습니다",
};

export default function AnalyzingPage() {
  return (
    <PageShell showHeader={false} showFooter={false}>
      <AnalyzingExperience />
    </PageShell>
  );
}
