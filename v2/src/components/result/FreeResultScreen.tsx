import { PageShell } from "@/components/layout/PageShell";
import { DohwaLetter, DohwaRadarCard, LockedChapterList, LoveTimelineStrip, PeachInterlude } from "@/components/result/FreeResultParts";
import { CharmStars, MidCheckoutPrompt, ReportContents, SectionTitle, StickyCheckoutBar } from "@/components/result/ResultParts";
import { ComingSoonNotice } from "@/components/result/ComingSoonNotice";
import { ResultStory } from "@/components/result/ResultStory";
import { ReviewCarousel } from "@/components/result/ReviewCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { chapterOf, type ReportChapterKey } from "@/lib/constants/result";
import type { FreeResultView } from "@/types/result";

/** 결제 기능이 없는 버전이라 유료 리포트로 가는 링크는 모두 이 주소로 보내고, 누르면 준비 중 안내를 띄운다. */
export const COMING_SOON_HREF = "/coming-soon";

const starTypes = chapterOf("starTypes");
const timeline = chapterOf("timeline");
/** 서찰 아래에 이어 보여주는 잠긴 장. 5장과 6장 사이에 선녀 그림, 7장과 8장 사이에 중간 결제 안내를 끼우고, 12장은 11장 인연 시기 뒤에 따로 둔다. */
const STORY_CHAPTERS_BEFORE_PICTURE: ReportChapterKey[] = ["firstImpression", "looks", "flirt"];
const STORY_CHAPTERS_BEFORE_PROMPT: ReportChapterKey[] = ["language", "styling"];
const STORY_CHAPTERS_AFTER_PROMPT: ReportChapterKey[] = ["admirers", "inLove", "match"];

export function FreeResultScreen({ result, sample = false }: { result: FreeResultView; sample?: boolean }) {
  const checkoutHref = sample ? "/start" : COMING_SOON_HREF;
  const sticky = sample
    ? { href: "/start", label: "내 꽃도 보러 가기" }
    : { href: COMING_SOON_HREF, label: "숨겨진 도화력 확인하기" };

  return (
    <PageShell withStickyBar>
      <ResultStory name={result.name} type={result.dohwa.type}>
        <div className="mt-12 flex flex-col gap-12">
          <Reveal>
            <section className="flex flex-col gap-5">
              <SectionTitle
                eyebrow="도화 지수"
                title={
                  <>
                    너, 생각보다 훨씬
                    <br />
                    <span className="text-blossom-glow">치명적인 아이란다</span>
                  </>
                }
              />
              <DohwaRadarCard dohwa={result.dohwa} />
            </section>
          </Reveal>

          <Reveal>
            <section className="flex flex-col gap-5">
              <SectionTitle
                eyebrow={`제${starTypes.chapter}장`}
                title={starTypes.title}
                description="몇 개를 쥐고 태어났는지, 어디에 숨겨 뒀는지가 네 색기의 결을 정한단다."
              />
              <CharmStars />
            </section>
          </Reveal>

          <Reveal>
            <section className="flex flex-col gap-5">
              <SectionTitle
                eyebrow="펼치면 보이는 이야기"
                title={
                  <>
                    네 꽃에 숨은 <span className="text-blossom-glow">이야기</span>
                  </>
                }
              />
              <DohwaLetter name={result.name} href={checkoutHref} />
              <LockedChapterList keys={STORY_CHAPTERS_BEFORE_PICTURE} href={checkoutHref} />
              <div className="my-7">
                <PeachInterlude />
              </div>
              <LockedChapterList keys={STORY_CHAPTERS_BEFORE_PROMPT} href={checkoutHref} />
              <div className="my-7">
                <MidCheckoutPrompt checkoutHref={checkoutHref} />
              </div>
              <LockedChapterList keys={STORY_CHAPTERS_AFTER_PROMPT} href={checkoutHref} />
            </section>
          </Reveal>

          <Reveal>
            <section className="flex flex-col gap-5">
              <SectionTitle eyebrow={`제${timeline.chapter}장`} title={timeline.title} description={timeline.teaser} />
              <LoveTimelineStrip years={result.timelineYears} />
            </section>
          </Reveal>

          <Reveal>
            <LockedChapterList keys={["heart"]} href={checkoutHref} />
          </Reveal>

          <ReviewCarousel />

          <Reveal>
            <ReportContents />
          </Reveal>
        </div>
      </ResultStory>

      <StickyCheckoutBar href={sticky.href} label={sticky.label} />
      <ComingSoonNotice href={COMING_SOON_HREF} />
    </PageShell>
  );
}
