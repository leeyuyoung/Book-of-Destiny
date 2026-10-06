export type FiveElementKey = "wood" | "fire" | "earth" | "metal" | "water";

export type GlyphView = { hanja: string; korean: string; element: FiveElementKey; tenGod: string };

export type PillarView = {
  label: "시주" | "일주" | "월주" | "년주";
  stem: GlyphView;
  branch: GlyphView & { twelveStage: string };
};

export type DohwaView = {
  score: number;
  grade: { hanja: string; label: string; line: string };
  indices: { key: string; label: string; hanja: string; score: number }[];
  type: { hanja: string; name: string; alias: string; elementHanja: string; headline: string; description: string; vibes: string[] };
};

/** 결제 전 무료 화면에 내려가는 값. 만세력 계산 결과만 담고 리포트 본문은 담지 않는다. */
export type FreeResultView = {
  name: string;
  birthLabel: string;
  dayPillarName: string;
  pillars: PillarView[];
  birthTimeKnown: boolean;
  dohwa: DohwaView;
  /** 연애운 표에 쓰는 앞으로의 연도 */
  timelineYears: number[];
};

export type CharmStarView = { name: string; hanja: string; found: boolean; where: string };

export type ReportChapterView = {
  chapter: number;
  title: string;
  teaser: string;
  headline: string;
  paragraphs: string[];
};

/** 결제가 확인되고 리포트가 완성된 뒤에만 만들어진다. */
export type FullReportView = FreeResultView & {
  analyzedAt: string;
  summary: string;
  keywords: string[];
  stars: CharmStarView[];
  chapters: ReportChapterView[];
  loveTimeline: { year: number; mood: string; body: string }[];
};
