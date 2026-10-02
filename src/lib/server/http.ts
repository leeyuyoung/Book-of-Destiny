import "server-only";

export const MAX_BODY_BYTES = 16 * 1024;

/** 다른 사이트에서 우리 API를 대신 호출하는 것을 막는다. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const jsonError = (status: number, message: string, headers?: HeadersInit) =>
  Response.json({ message }, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** 크기 제한 안에서 JSON 본문을 읽는다. 실패하면 null. */
export async function readJsonBody(request: Request): Promise<unknown | null> {
  const body = await request.text();
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}
