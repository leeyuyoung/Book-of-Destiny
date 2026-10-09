import { writeFileSync } from "node:fs";
import { buildSajuProfile, calculateSaju } from "../src/lib/saju";
import { generateReport } from "../src/lib/server/ai/generateReport";

// 실제 OpenAI를 호출해 샘플 리포트를 만든다(비용 발생). 결과는 .data/ 아래에 저장된다.
const profile = buildSajuProfile(
  calculateSaju({
    birth: { calendarType: "solar", isLeapMonth: false, year: 1992, month: 10, day: 24, hour: 5, minute: 30 },
    gender: "female",
  }),
);

async function main() {
  const startedAt = Date.now();
  const report = await generateReport(profile, { relationshipStatus: "some" });
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  const paragraphsOf = (chapter: (typeof report.chapters)[number]) => chapter.sections.flatMap((section) => section.paragraphs);
  const characters = report.chapters.reduce((sum, chapter) => sum + paragraphsOf(chapter).join("").length, 0);

  writeFileSync(".data/sample-report.json", JSON.stringify(report, null, 2));
  console.log(`생성 ${seconds}초, 본문 ${characters.toLocaleString()}자`);
  console.log(`summary: ${report.summary}`);
  console.log(`keywords: ${report.keywords.join(", ")}`);
  for (const chapter of report.chapters) {
    console.log(`제${chapter.chapter}장 (${paragraphsOf(chapter).length}문단) ${chapter.headline}`);
  }
  for (const item of report.loveTimeline) console.log(`${item.year}년 ${item.mood}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
