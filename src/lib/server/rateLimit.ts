import "server-only";

type Window = { limit: number; windowMs: number };

const globalForLimiter = globalThis as typeof globalThis & { __paljaRateLimit?: Map<string, number[]> };
const hits = (globalForLimiter.__paljaRateLimit ??= new Map<string, number[]>());

/**
 * 키별 고정 시간창 안의 요청 횟수를 센다. 허용되면 1회를 기록하고 null, 초과면 다시 시도까지 남은 초를 돌려준다.
 * 서버 한 대의 메모리 기준이라, 배포 시 저장소 교체와 함께 공유 저장소로 옮긴다.
 */
export function consumeRateLimit(key: string, { limit, windowMs }: Window): number | null {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return Math.ceil((recent[0] + windowMs - now) / 1000);
  }
  recent.push(now);
  hits.set(key, recent);
  return null;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}
