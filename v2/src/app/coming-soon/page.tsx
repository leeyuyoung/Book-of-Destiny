import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "준비 중",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <PageShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-24 text-center">
        <p className="font-serif text-lg font-light leading-relaxed text-paper">
          네 꽃을 끝까지 펼쳐 볼 리포트는
          <br />
          <span className="text-blossom-glow">곧 열린단다.</span>
        </p>
        <ButtonLink href="/result">내 결과로 돌아가기</ButtonLink>
      </div>
    </PageShell>
  );
}
