import type { ReactNode } from "react";

type CheckboxFieldProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  hasError?: boolean;
  disabled?: boolean;
};

export function CheckboxField({ id, checked, onChange, children, hasError = false, disabled = false }: CheckboxFieldProps) {
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 ${disabled ? "opacity-40" : ""}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 ${
          checked ? "border-gold bg-gold/25" : hasError ? "border-fire/60" : "border-mist-dim/60"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-soft" fill="none">
            <path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </span>
      <span className="text-sm leading-relaxed text-paper/85">{children}</span>
    </label>
  );
}
