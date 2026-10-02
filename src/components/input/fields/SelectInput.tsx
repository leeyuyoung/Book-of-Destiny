import type { ComponentProps } from "react";
import { INPUT_BASE, inputBorder } from "./Field";

type SelectInputProps = ComponentProps<"select"> & {
  options: { value: string; label: string }[];
  placeholder: string;
  hasError?: boolean;
};

export function SelectInput({ options, placeholder, hasError = false, className, ...props }: SelectInputProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <select
        {...props}
        className={`${INPUT_BASE} ${inputBorder(hasError)} appearance-none pr-9 ${props.value === "" ? "text-mist-dim/70" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-night text-paper">
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60"
        fill="none"
      >
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
