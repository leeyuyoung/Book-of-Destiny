import { z } from "zod";
import { REPORT_PARTS } from "@/lib/constants/service";

export const KEYWORD_COUNT = { min: 3, max: 5 } as const;
export const PARAGRAPH_COUNT = { min: 3, max: 7 } as const;

const text = (max: number) => z.string().trim().min(1).max(max);

export const aiReportSchema = z.object({
  summary: text(120),
  keywords: z.array(text(12)).min(KEYWORD_COUNT.min).max(KEYWORD_COUNT.max),
  dayMasterDescription: text(300),
  parts: z
    .array(
      z.object({
        part: z.number().int(),
        headline: text(120),
        paragraphs: z.array(text(1200)).min(PARAGRAPH_COUNT.min).max(PARAGRAPH_COUNT.max),
      }),
    )
    .length(REPORT_PARTS.length)
    .refine((parts) => parts.every((part, index) => part.part === index + 1), "PART 번호가 1부터 순서대로여야 합니다."),
});

export type AiReport = z.infer<typeof aiReportSchema>;

/** OpenAI Structured Outputs용 JSON Schema. 형식만 강제하고, 세부 검증은 aiReportSchema가 맡는다. */
export const AI_REPORT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "keywords", "dayMasterDescription", "parts"],
  properties: {
    summary: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
    dayMasterDescription: { type: "string" },
    parts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["part", "headline", "paragraphs"],
        properties: {
          part: { type: "integer" },
          headline: { type: "string" },
          paragraphs: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;
