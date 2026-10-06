type RadioListProps<T extends string> = {
  name: string;
  value: T | "";
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  hasError?: boolean;
  describedBy?: string;
};

/** 세로로 긴 동그라미 선택 목록 */
export function RadioList<T extends string>({
  name,
  value,
  options,
  onChange,
  hasError = false,
  describedBy,
}: RadioListProps<T>) {
  return (
    <div role="radiogroup" aria-label={name} aria-describedby={describedBy} className="flex flex-col">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className="flex h-10 items-center gap-4 text-left"
          >
            <span
              aria-hidden
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300 ${
                selected ? "border-paper" : hasError ? "border-fire/70" : "border-mist-dim"
              }`}
            >
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-paper" />}
            </span>
            <span
              className={`font-serif text-base tracking-wide transition-colors duration-300 ${
                selected ? "text-paper" : "text-mist"
              }`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
