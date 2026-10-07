type ChoiceChipsProps<T extends string> = {
  name: string;
  value: T | "";
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  hasError?: boolean;
  describedBy?: string;
};

export const pillClass = (selected: boolean) =>
  `rounded-full font-serif tracking-wide transition-all duration-300 ${
    selected ? "bg-paper text-ink" : "bg-white/10 text-mist hover:bg-white/15 hover:text-paper"
  }`;

/** 하나만 고르는, 세로로 쌓인 큰 알약 버튼 */
export function ChoiceChips<T extends string>({
  name,
  value,
  options,
  onChange,
  hasError = false,
  describedBy,
}: ChoiceChipsProps<T>) {
  return (
    <div role="radiogroup" aria-label={name} aria-describedby={describedBy} className="flex flex-col gap-2.5">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`h-13 text-base ${pillClass(selected)} ${hasError && !selected ? "ring-1 ring-fire/60" : ""}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
