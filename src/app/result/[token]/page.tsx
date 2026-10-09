import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ChapterCovers, FreeReading, ReportToc, ReportVolume, StatementCut } from "@/components/result/FreeResultParts";
import { CharmStars } from "@/components/result/ResultParts";
import { ReviewCarousel } from "@/components/result/ReviewCarousel";
import { StickyCheckoutBar } from "@/components/result/StickyCheckoutBar";
import { Reveal } from "@/components/ui/Reveal";
import { WebtoonPanel } from "@/components/webtoon/WebtoonPanel";
import { TOKEN_PATTERN } from "@/lib/server/analysis";
import { isSampleType, sampleFreeResult, toFreeResultView } from "@/lib/server/resultView";
import { getAnalysisStore } from "@/lib/server/store";

export const metadata: Metadata = {
  title: "나의 도화 지수",
  robots: { index: false, follow: false },
};

async function loadResult(token: string, sampleType: unknown) {
  if (token === "sample") return { result: sampleFreeResult(isSampleType(sampleType) ? sampleType : undefined), paid: false };
  if (!TOKEN_PATTERN.test(token)) return null;
  const record = await getAnalysisStore().get(token);
  if (!record) return null;
  return { result: toFreeResultView(record), paid: record.paidAt !== null };
}

const SEASONS = ["겨울", "봄", "여름", "가을"] as const;
const seasonOf = (month: number) => SEASONS[Math.floor((month % 12) / 3)];

/** 결제 버튼이 이 칸에 닿은 뒤부터 화면 아래에 따라다닌다. */
const PUSH_PANEL_ID = "dohwa-push";

export default async function ResultPage({ params, searchParams }: PageProps<"/result/[token]">) {
  const { token } = await params;
  const { type } = await searchParams;
  const loaded = await loadResult(token, type);
  if (!loaded) notFound();
  const { result, paid } = loaded;
  const cta = paid
    ? { href: `/report/${token}`, label: "펼친 꽃 다시 보러 가기" }
    : token === "sample"
      ? { href: "/start", label: "내 숨겨진 색기력 확인하기" }
      : { href: `/checkout/${token}`, label: "색기 쓰는 법 배우기" };

  return (
    <PageShell withStickyBar>
      <h1 className="sr-only">{result.name}의 도화 풀이</h1>

      <WebtoonPanel
        priority
        src="/images/result/opening.jpg"
        alt="달밤의 복숭아꽃 정원에서 한 손에 사주가 적힌 종이를 들어 보이고, 다른 팔로 여자주인공의 허리를 감싸며 웃는 도화신선"
        bubbles={[
          { kind: "speech", text: "이것 봐라…", at: 0.4, place: { top: "4%", left: "5%" }, tail: "bottom-right" },
          { kind: "whisper", text: `${result.name}.`, at: 1.4, place: { top: "31%", right: "3%" }, big: true },
          {
            kind: "caption",
            text: `${result.birth.year}년 ${seasonOf(result.birth.month)}에 태어난 꽃이로구나`,
            at: 2.4,
            place: { top: "84%", left: "5%" },
          },
        ]}
      />

      <div className="pt-16">
        <FreeReading type={result.dohwa.type} />
      </div>

      <StatementCut
        lines={[
          "거 봐라.",
          <>
            타고난 색기는 넘치는데,
            <br />
            <span className="text-blossom-glow">넌 그걸 반도 못 쓰고 있어.</span>
          </>,
          <>
            네 안엔 아직 안 꺼낸
            <br />
            무기가 <span className="text-blossom-glow">세 개</span> 더 있다.
          </>,
        ]}
      />

      <Reveal className="mt-4">
        <CharmStars />
      </Reveal>

      <div className="mt-16">
        <WebtoonPanel
          id={PUSH_PANEL_ID}
          src="/images/result/push.jpg"
          alt="복숭아를 입가에 대고 위험하게 웃으며 이쪽을 내려다보는 도화신선"
          bubbles={[
            { kind: "speech", text: "네가 마음만 먹으면,\n상대는 이미 네 손안에 있어.", at: 0.3, place: { top: "3%", left: "4%" }, tail: "bottom-right" },
            { kind: "whisper", text: "그 방법,\n내가 알려줄게.", at: 1.5, place: { top: "74%", right: "4%" }, tail: "top-left", big: true },
          ]}
        />
      </div>

      <StatementCut
        lines={[
          "이것만 알면",
          <>
            <span className="text-blossom-glow">네 인생이 달라질 텐데.</span>
          </>,
        ]}
      />

      <div className="mt-6 flex flex-col gap-16">
        <ReviewCarousel />

        <ReportVolume />
      </div>

      <StatementCut
        lines={[
          <>
            지금까진 <span className="text-blossom-glow">맛보기</span>였다.
          </>,
          <>
            <span className="text-blossom-glow">진짜 얘긴</span> 이제부터지.
          </>,
        ]}
      />

      <ChapterCovers gender={result.gender} />

      <div className="mt-16">
        <WebtoonPanel
          src="/images/result/closing.jpg"
          alt="한 팔로 여자주인공의 어깨를 감싸 귓가에 속삭이며, 다른 손을 내밀어 함께 가자고 청하는 도화신선"
          bubbles={[
            { kind: "speech", text: "그 색기,\n썩히기엔 아깝잖아?", at: 0.3, place: { top: "3%", left: "4%" }, tail: "bottom-right" },
            { kind: "whisper", text: "이제\n써먹어야지.", at: 1.6, place: { top: "76%", right: "5%" }, tail: "top-left", big: true },
          ]}
        />
      </div>

      <div className="mt-10 mb-10">
        <ReportToc gender={result.gender} />
      </div>

      <StickyCheckoutBar href={cta.href} label={cta.label} showAfterId={paid ? undefined : PUSH_PANEL_ID} />
    </PageShell>
  );
}
