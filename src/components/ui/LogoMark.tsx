type LogoMarkProps = {
  size?: number;
  className?: string;
};

/** 자두빛 낙관(도장)에 복숭아 도(桃) 자를 새긴 로고 */
export function LogoMark({ size = 56, className }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="도화사주 로고" className={className}>
      <defs>
        <linearGradient id="logo-seal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b5507a" />
          <stop offset="100%" stopColor="#5b2a55" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="10" fill="url(#logo-seal)" />
      <rect x="9" y="9" width="46" height="46" rx="6" fill="none" stroke="#f2ddb8" strokeWidth="1.1" opacity="0.8" />
      <text
        x="32"
        y="33.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fbeef0"
        fontSize="30"
        fontWeight="700"
        fontFamily="var(--font-noto-serif-kr), serif"
      >
        桃
      </text>
    </svg>
  );
}
