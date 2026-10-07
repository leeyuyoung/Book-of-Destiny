import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageShell showFooter={false}>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20 text-center">
        <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">Page not found</span>
        <h1 className="font-serif text-2xl font-light leading-relaxed">
          찾으시는 페이지가
          <br />
          이 서재에 없습니다
        </h1>
        <p className="text-sm text-mist">주소가 잘못되었거나, 열람 기간이 지난 리포트일 수 있습니다.</p>
        <div className="w-full max-w-xs">
          <ButtonLink href="/">처음으로</ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
