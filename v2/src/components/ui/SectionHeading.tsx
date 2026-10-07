import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
};

export function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/80">{eyebrow}</span>
      )}
      <h2 className="font-serif text-2xl font-light leading-snug text-paper sm:text-3xl">{title}</h2>
      {description && <p className="text-[15px] leading-relaxed text-mist">{description}</p>}
    </div>
  );
}

export function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 ${className ?? ""}`}>
      <span className="hairline w-16" />
      <span className="h-1.5 w-1.5 rotate-45 border border-gold/60" />
      <span className="hairline w-16" />
    </div>
  );
}
