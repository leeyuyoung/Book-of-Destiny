type StepProgressProps = {
  current: number;
  total: number;
};

export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`${total}단계 중 ${current}단계`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-0.5 flex-1 rounded-full transition-all duration-700 ${
            index < current ? "bg-gold/80" : "bg-mist-dim/30"
          }`}
        />
      ))}
    </div>
  );
}
