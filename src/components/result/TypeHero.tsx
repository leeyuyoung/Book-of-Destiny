import Image from "next/image";
import type { DohwaView } from "@/types/result";

type TypeHeroProps = { name: string; type: DohwaView["type"]; eyebrow: string; hook?: string };

export function TypeHero({ name, type, eyebrow, hook }: TypeHeroProps) {
  return (
    <section className="-mx-5">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src="/images/dohwa-heroine.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 576px"
          loading="eager"
          fetchPriority="high"
          className="object-cover object-[50%_20%]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgb(7 6 14 / 0.55) 0%, transparent 28%, transparent 48%, rgb(7 6 14 / 0.92) 88%, var(--color-ink) 100%)" }}
        />
        <div className="absolute inset-x-0 top-0 flex flex-col items-start gap-3 px-6 pt-6">
          <span className="rounded-full border border-white/15 bg-ink/50 px-3 py-1 text-xs text-paper/90 backdrop-blur-sm">{eyebrow}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-6 pb-4">
          <p className="font-serif text-base text-paper/90">{name}, 넌 보아하니</p>
          <h1 className="font-eerie text-[clamp(2.2rem,10vw,3rem)] leading-tight text-paper [text-shadow:0_0_24px_rgb(232_137_155_/_0.55)]">
            {type.name}이구나
          </h1>
          <p className="flex items-center gap-2 font-serif text-sm text-blossom">
            <span>{type.hanja}</span>
            <span className="text-mist-dim">·</span>
            <span>{type.alias}</span>
          </p>
        </div>
      </div>

      <div className="px-5">
        <div className="rounded-3xl border border-line bg-night/70 px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-serif text-lg text-paper">{type.headline}</p>
              <p className="text-sm leading-relaxed text-mist">{type.description}</p>
            </div>
            <span className="font-serif text-4xl text-blossom-glow">{type.elementHanja}</span>
          </div>
          <p className="mt-6 text-xs font-medium text-cinnabar">{type.name}의 분위기</p>
          <ul className="mt-3 flex flex-col gap-2">
            {type.vibes.map((vibe) => (
              <li key={vibe} className="flex items-center gap-2.5 text-sm text-paper/90">
                <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-cinnabar" />
                {vibe}
              </li>
            ))}
          </ul>
          {hook && <p className="mt-6 border-t border-line/70 pt-5 font-serif text-[15px] leading-relaxed text-blossom-glow">{hook}</p>}
        </div>
      </div>
    </section>
  );
}
