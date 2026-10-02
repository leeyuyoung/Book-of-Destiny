import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type ChapterCardProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function ChapterCard({ eyebrow, title, children }: ChapterCardProps) {
  return (
    <Reveal>
      <section className="glass-card rounded-3xl px-6 py-8">
        <span className="font-display text-[11px] uppercase tracking-[0.4em] text-gold/70">{eyebrow}</span>
        <h2 className="mt-3 font-serif text-xl font-light text-paper">{title}</h2>
        <div className="hairline my-6 opacity-60" />
        <div className="flex flex-col gap-5 text-[15px] leading-[1.9] text-paper/85">{children}</div>
      </section>
    </Reveal>
  );
}
