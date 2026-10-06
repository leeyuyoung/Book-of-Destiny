import type { DohwaView } from "@/types/result";

export function DohwaScoreCard({ dohwa }: { dohwa: DohwaView }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cinnabar/30 bg-gradient-to-b from-crimson-deep/70 via-night/90 to-night px-6 pb-7 pt-8">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cinnabar/20 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <p className="text-sm text-mist">사람을 홀리는 힘, 숫자로 보면</p>
        <p className="mt-3 font-serif leading-none">
          <span className="text-blossom-glow text-[72px] font-light">{dohwa.score}</span>
          <span className="ml-1 text-xl text-mist">점</span>
        </p>
        <p className="mt-4 flex items-center gap-2">
          <span className="rounded-full border border-cinnabar/50 bg-crimson/30 px-3 py-1 font-serif text-sm text-blossom">
            {dohwa.grade.hanja} · {dohwa.grade.label}
          </span>
        </p>
        <p className="mt-3 font-serif text-[15px] leading-relaxed text-paper/90">“{dohwa.grade.line}”</p>
      </div>

      <ul className="relative mt-8 flex flex-col gap-4">
        {dohwa.indices.map((index) => (
          <li key={index.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="flex items-center gap-2 text-sm text-paper">
                <span className="font-serif text-xs text-cinnabar">{index.hanja}</span>
                {index.label}
              </span>
              <span className="font-serif text-lg text-paper">{index.score}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-crimson via-cinnabar to-blossom"
                style={{ width: `${index.score}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
