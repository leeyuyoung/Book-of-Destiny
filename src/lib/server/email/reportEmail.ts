import "server-only";

import { SERVICE } from "@/lib/constants/service";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** 리포트가 완성되면 보내는 링크 메일. 리포트 본문은 담지 않고 링크만 보낸다. */
export function buildReportEmail({ name, reportUrl }: { name: string; reportUrl: string }) {
  const subject = `[${SERVICE.name}] ${name}, 네 꽃, 끝까지 다 읽었다`;
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(reportUrl);

  const text = [
    `${name}, 기다렸지?`,
    "",
    "네 사주로만 쓴 연애·매력 리포트가 완성됐다.",
    "아래 링크에서 언제든 다시 열어 보거라.",
    "",
    reportUrl,
    "",
    "이 링크는 리포트를 여는 열쇠예요. 다른 사람과 공유하지 말아주세요.",
    "",
    `${SERVICE.tagline} | ${SERVICE.name}`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="ko">
<body style="margin:0;padding:0;background:#07060e;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#07060e;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#17132b;border:1px solid #4a1a3a;border-radius:16px;">
        <tr><td style="padding:40px 32px;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#f5ede6;">
          <p style="margin:0 0 8px;font-size:12px;color:#e8899b;">끝까지 펼친 꽃</p>
          <h1 style="margin:0 0 24px;font-size:22px;font-weight:400;line-height:1.5;color:#f5ede6;">
            <span style="color:#f4b8c2;">${safeName}</span>,<br>네 꽃, 끝까지 다 읽었다
          </h1>
          <p style="margin:0 0 28px;font-size:14px;line-height:1.8;color:#bcb0c4;">
            네 사주로만 쓴 연애·매력 리포트가 완성됐다.<br>
            아래 버튼을 누르면 언제든 다시 볼 수 있지.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#9c3f62;">
            <a href="${safeUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;color:#f5ede6;text-decoration:none;">내 꽃 펼쳐 보기</a>
          </td></tr></table>
          <p style="margin:28px 0 0;font-size:12px;line-height:1.7;color:#807590;">
            버튼이 열리지 않으면 아래 주소를 복사해 브라우저에 붙여넣어 주세요.<br>
            <a href="${safeUrl}" style="color:#e8899b;word-break:break-all;">${safeUrl}</a>
          </p>
          <p style="margin:20px 0 0;font-size:12px;line-height:1.7;color:#807590;">
            이 링크는 리포트를 여는 열쇠예요. 다른 사람과 공유하지 말아주세요.
          </p>
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font-family:sans-serif;font-size:11px;color:#5f5a6e;">${SERVICE.tagline} | ${SERVICE.name}</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
