import "server-only";

import { SERVICE } from "@/lib/constants/service";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** 결제 완료 후 보내는 리포트 링크 메일. 리포트 본문은 담지 않고 링크만 보낸다. */
export function buildReportEmail({ name, reportUrl }: { name: string; reportUrl: string }) {
  const subject = `[${SERVICE.name}] ${name} 님의 인생 리포트가 펼쳐졌습니다`;
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(reportUrl);

  const text = [
    `${name} 님, ${SERVICE.name}를 찾아주셔서 감사합니다.`,
    "",
    "결제가 확인되어 당신의 인생 리포트 전체를 열람하실 수 있습니다.",
    "아래 링크에서 언제든 다시 읽으실 수 있습니다.",
    "",
    reportUrl,
    "",
    "이 링크는 리포트를 여는 열쇠입니다. 다른 사람과 공유하지 말아주세요.",
    "",
    `${SERVICE.tagline} | ${SERVICE.name}`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="ko">
<body style="margin:0;padding:0;background:#0d0b10;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d0b10;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#16131a;border:1px solid #3a3226;border-radius:16px;">
        <tr><td style="padding:40px 32px;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#e8e2d6;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;color:#a8925f;">THE FULL BOOK</p>
          <h1 style="margin:0 0 24px;font-size:22px;font-weight:400;line-height:1.5;color:#f3ead7;">
            <span style="color:#d8b56a;">${safeName}</span> 님의<br>인생 리포트가 펼쳐졌습니다
          </h1>
          <p style="margin:0 0 28px;font-size:14px;line-height:1.8;color:#b9b2a5;">
            결제가 확인되어 열한 개의 장 전체를 열람하실 수 있습니다.<br>
            아래 버튼을 누르면 언제든 다시 읽으실 수 있습니다.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#8f2a22;">
            <a href="${safeUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;color:#f8eedb;text-decoration:none;">나의 책 펼치기</a>
          </td></tr></table>
          <p style="margin:28px 0 0;font-size:12px;line-height:1.7;color:#7d776d;">
            버튼이 열리지 않으면 아래 주소를 복사해 브라우저에 붙여넣어 주세요.<br>
            <a href="${safeUrl}" style="color:#a8925f;word-break:break-all;">${safeUrl}</a>
          </p>
          <p style="margin:20px 0 0;font-size:12px;line-height:1.7;color:#7d776d;">
            이 링크는 리포트를 여는 열쇠입니다. 다른 사람과 공유하지 말아주세요.
          </p>
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font-family:sans-serif;font-size:11px;color:#5f5a52;">${SERVICE.tagline} | ${SERVICE.name}</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
