import type { Metadata } from "next";
import { InputWizardLoader } from "@/components/input/InputWizardLoader";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "나의 이야기 들려주기",
};

export default function StartPage() {
  return (
    <PageShell showFooter={false}>
      <InputWizardLoader />
    </PageShell>
  );
}
