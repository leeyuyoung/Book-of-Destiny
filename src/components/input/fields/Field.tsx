import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  errorId?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, error, errorId, children }: FieldProps) {
  const LabelTag = htmlFor ? "label" : "p";
  return (
    <div className="flex flex-col gap-3">
      <LabelTag {...(htmlFor ? { htmlFor } : {})} className="font-serif text-sm tracking-wide text-gold-soft">
        {label}
      </LabelTag>
      {children}
      {hint && !error && <p className="text-xs leading-relaxed text-mist-dim">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="text-xs leading-relaxed text-fire">
          {error}
        </p>
      )}
    </div>
  );
}

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs leading-relaxed text-fire">
      {message}
    </p>
  );
}

export const INPUT_BASE =
  "h-14 w-full rounded-xl border bg-night/70 px-4 text-base text-paper placeholder:text-mist-dim/70 transition-colors duration-300 focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-40";

export const inputBorder = (hasError: boolean) => (hasError ? "border-fire/60" : "border-line");
