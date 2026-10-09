import { z } from "zod";
import { LOVE_TIMELINE_YEARS, REPORT_CHAPTERS } from "@/lib/constants/result";

export const KEYWORD_COUNT = { min: 3, max: 5 } as const;
export const PARAGRAPH_COUNT = { min: 1, max: 4 } as const;
const sectionCounts = REPORT_CHAPTERS.map((chapter) => chapter.sections.length);
const SECTION_COUNT = { min: Math.min(...sectionCounts), max: Math.max(...sectionCounts) };

/** 한글·한자·영문·숫자·문장부호 외의 문자(모델이 가끔 섞는 다른 언어 단어)를 잡아낸다. */
const FOREIGN_SCRIPT = /[^\p{Script=Hangul}\p{Script=Han}\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/u;

const text = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !FOREIGN_SCRIPT.test(value), "한국어 외의 문자가 섞여 있습니다.");

export const aiReportSchema = z.object({
  summary: text(120),
  keywords: z.array(text(12)).min(KEYWORD_COUNT.min).max(KEYWORD_COUNT.max),
  chapters: z
    .array(
      z.object({
        chapter: z.number().int(),
        headline: text(120),
        sections: z.array(z.object({ paragraphs: z.array(text(1200)).min(PARAGRAPH_COUNT.min).max(PARAGRAPH_COUNT.max) })),
      }),
    )
    .length(REPORT_CHAPTERS.length)
    .refine((chapters) => chapters.every((chapter, index) => chapter.chapter === index + 1), "장 번호가 1부터 순서대로여야 합니다.")
    .refine(
      (chapters) => chapters.every((chapter, index) => chapter.sections.length === REPORT_CHAPTERS[index]?.sections.length),
      "장마다 소제목 수만큼 sections가 있어야 합니다.",
    ),
  loveTimeline: z
    .array(z.object({ year: z.number().int(), mood: text(40), body: text(400) }))
    .length(LOVE_TIMELINE_YEARS),
});

export type AiReport = z.infer<typeof aiReportSchema>;

/**
 * OpenAI Structured Outputs용 JSON Schema. 형식과 개수만 강제하고, 장마다 다른 소제목 수 같은 세부 검증은 aiReportSchema가 맡는다.
 * 장 개수를 묶어 두지 않으면 모델이 고민 답변이나 맺음말을 7·8장으로 덧붙인다.
 */
export const AI_REPORT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "keywords", "chapters", "loveTimeline"],
  properties: {
    summary: { type: "string" },
    keywords: { type: "array", minItems: KEYWORD_COUNT.min, maxItems: KEYWORD_COUNT.max, items: { type: "string" } },
    chapters: {
      type: "array",
      minItems: REPORT_CHAPTERS.length,
      maxItems: REPORT_CHAPTERS.length,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["chapter", "headline", "sections"],
        properties: {
          chapter: { type: "integer" },
          headline: { type: "string" },
          sections: {
            type: "array",
            minItems: SECTION_COUNT.min,
            maxItems: SECTION_COUNT.max,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["paragraphs"],
              properties: { paragraphs: { type: "array", items: { type: "string" } } },
            },
          },
        },
      },
    },
    loveTimeline: {
      type: "array",
      minItems: LOVE_TIMELINE_YEARS,
      maxItems: LOVE_TIMELINE_YEARS,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["year", "mood", "body"],
        properties: {
          year: { type: "integer" },
          mood: { type: "string" },
          body: { type: "string" },
        },
      },
    },
  },
} as const;
