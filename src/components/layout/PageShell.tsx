import Link from "next/link";
import type { ReactNode } from "react";
import { NightGardenBackground } from "@/components/night/NightGardenBackground";
import { SERVICE } from "@/lib/constants/service";

type PageShellProps = {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  /** 소개 화면처럼 분위기를 더 강하게 보여줄 때 full */
  intensity?: "full" | "soft";
  /** 화면 아래에 떠 있는 버튼이 있으면 맨 끝 내용이 가리지 않게 그만큼 비워 둔다 */
  withStickyBar?: boolean;
};

export function PageShell({ children, showHeader = true, showFooter = true, intensity = "soft", withStickyBar = false }: PageShellProps) {
  return (
    <div className={`relative isolate flex min-h-dvh flex-col ${withStickyBar ? "pb-28" : ""}`}>
      <NightGardenBackground intensity={intensity} />
      {showHeader && (
        <header className="sticky top-0 z-30 border-b border-line/50 bg-ink/60 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-5">
            <Link href="/">
              <span className="font-serif text-[15px] tracking-[0.2em] text-gold-soft">{SERVICE.name}</span>
            </Link>
          </div>
        </header>
      )}
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5">{children}</main>
      {showFooter && <SiteFooter />}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line/50">
      <div className="mx-auto flex max-w-xl flex-col gap-3 px-5 py-10 text-xs leading-relaxed text-mist-dim">
        <p className="font-serif tracking-[0.2em] text-mist">
          {SERVICE.tagline} | {SERVICE.name}
        </p>
        <p>
          본 서비스의 해석은 사주 명리학의 전통적 해석 체계를 바탕으로 한 참고용 콘텐츠이며, 의료·법률·투자 등
          전문적인 판단을 대신하지 않습니다.
        </p>
        <p>사업자 정보 · 이용약관 · 개인정보처리방침 (서비스 오픈 전 작성 예정)</p>
      </div>
    </footer>
  );
}
