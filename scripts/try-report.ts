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
  const report = await generateReport(profile, {
    occupationStatus: "employee",
    occupation: "IT 회사 마케팅 5년차",
    concern: "지금 회사를 계속 다녀야 할지, 이직하거나 내 일을 시작해야 할지 고민입니다. 요즘 일에 의욕이 많이 떨어졌어요.",
  });
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  const characters = report.parts.reduce((sum, part) => sum + part.paragraphs.join("").length, 0);

  writeFileSync(".data/sample-report.json", JSON.stringify(report, null, 2));
  console.log(`생성 ${seconds}초, 본문 ${characters.toLocaleString()}자`);
  console.log(`summary: ${report.summary}`);
  console.log(`keywords: ${report.keywords.join(", ")}`);
  for (const part of report.parts) console.log(`PART ${part.part} (${part.paragraphs.length}문단) ${part.headline}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
