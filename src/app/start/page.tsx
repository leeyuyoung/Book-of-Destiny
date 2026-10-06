import type { Metadata } from "next";
import { InputWizardLoader } from "@/components/input/InputWizardLoader";

export const metadata: Metadata = {
  title: "나의 꽃 들려주기",
};

export default function StartPage() {
  return <InputWizardLoader />;
}
