const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;
const ANGLE_BRACKETS = /[<>]/g;

/** 한 줄 입력(이름, 직업 등): 제어문자·꺾쇠 제거, 연속 공백을 하나로 */
export function sanitizeSingleLine(value: string): string {
  return value.replace(CONTROL_CHARS, "").replace(ANGLE_BRACKETS, "").replace(/\s+/g, " ").trim();
}

/** 여러 줄 입력(고민): 제어문자·꺾쇠 제거, 줄바꿈은 유지하되 3줄 이상 빈 줄은 2줄로 */
export function sanitizeMultiLine(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(ANGLE_BRACKETS, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeEmail(value: string): string {
  return value.replace(CONTROL_CHARS, "").replace(/\s/g, "").toLowerCase();
}
