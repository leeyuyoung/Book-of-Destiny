type SegmentedControlProps<T extends string> = {
  name: string;
  value: T | "";
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  hasError?: boolean;
  describedBy?: string;
};

export function SegmentedControl<T extends string>({
  name,
  value,
  options,
  onChange,
  hasError = false,
  describedBy,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      aria-describedby={describedBy}
      className={`grid gap-1 rounded-xl border bg-night/70 p-1 ${hasError ? "border-fire/60" : "border-line"}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`h-12 rounded-lg font-serif text-[15px] tracking-wide transition-all duration-300 ${
              selected
                ? "bg-gradient-to-b from-gold/25 to-gold/10 text-gold-soft shadow-[inset_0_0_0_1px_rgb(200_169_106_/_0.5)]"
                : "text-mist hover:text-paper"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
