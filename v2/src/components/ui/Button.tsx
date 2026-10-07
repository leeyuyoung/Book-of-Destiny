import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "light";

const BASE =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-8 font-serif text-[15px] tracking-[0.12em] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS: Record<Variant, string> = {
  primary:
    "border border-gold/50 bg-gradient-to-b from-crimson to-crimson-deep text-gold-soft shadow-[0_0_40px_-8px_rgb(232_137_155_/_0.6),inset_0_1px_0_rgb(242_221_184_/_0.25)] hover:border-gold hover:shadow-[0_0_56px_-6px_rgb(232_137_155_/_0.85),inset_0_1px_0_rgb(242_221_184_/_0.35)]",
  ghost: "border border-line bg-ink/40 text-mist backdrop-blur-sm hover:border-gold/40 hover:text-paper",
  light: "bg-paper text-ink shadow-[0_0_32px_-10px_rgb(246_236_216_/_0.6)] hover:bg-moon",
};

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={`${BASE} ${VARIANTS[variant]} ${className ?? ""}`} {...props} />;
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "primary", className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className ?? ""}`}>
      {children}
    </Link>
  );
}
