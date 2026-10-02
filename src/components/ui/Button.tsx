import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost";

const BASE =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-8 font-serif text-[15px] tracking-[0.12em] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS: Record<Variant, string> = {
  primary:
    "border border-gold/50 bg-gradient-to-b from-crimson to-crimson-deep text-gold-soft shadow-[0_0_40px_-8px_rgb(196_43_31_/_0.7),inset_0_1px_0_rgb(243_211_140_/_0.25)] hover:border-gold hover:shadow-[0_0_56px_-6px_rgb(196_43_31_/_0.9),inset_0_1px_0_rgb(243_211_140_/_0.35)]",
  ghost: "border border-line bg-ink/40 text-mist backdrop-blur-sm hover:border-gold/40 hover:text-paper",
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
