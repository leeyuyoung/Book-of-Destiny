export type FiveElementKey = "wood" | "fire" | "earth" | "metal" | "water";

export type PillarView = {
  label: "시주" | "일주" | "월주" | "년주";
  stem: { hanja: string; korean: string; element: FiveElementKey; tenGod: string };
  branch: { hanja: string; korean: string; element: FiveElementKey; tenGod: string };
};

export type BasicResultView = {
  name: string;
  analyzedAt: string;
  summary: string;
  keywords: string[];
  pillars: PillarView[];
  fiveElements: Record<FiveElementKey, number>;
  dayMaster: { hanja: string; korean: string; description: string };
  personality: {
    overview: string;
    traits: { label: string; body: string }[];
    strengths: string[];
    cautions: string[];
  };
  money: { overview: string };
  love: { overview: string };
  career: { overview: string };
};
