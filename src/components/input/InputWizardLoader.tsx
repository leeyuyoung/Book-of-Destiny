"use client";

import dynamic from "next/dynamic";

// 작성 중인 입력을 sessionStorage에서 복원하므로 브라우저에서만 렌더링한다.
const InputWizard = dynamic(() => import("./InputWizard"), {
  ssr: false,
  loading: () => <div className="flex-1" aria-busy="true" />,
});

export function InputWizardLoader() {
  return <InputWizard />;
}
