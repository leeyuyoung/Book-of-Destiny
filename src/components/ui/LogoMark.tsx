type LogoMarkProps = {
  size?: number;
  className?: string;
};

/** 붉은 낙관(도장) 모양의 로고 */
export function LogoMark({ size = 56, className }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="도화사주 로고" className={className}>
      <rect x="4" y="4" width="56" height="56" rx="6" fill="#a61c1a" />
      <rect x="9" y="9" width="46" height="46" rx="3" fill="none" stroke="#f3d38c" strokeWidth="1.2" opacity="0.85" />
      <text
        x="32"
        y="33.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#f3e8d2"
        fontSize="30"
        fontWeight="700"
        fontFamily="var(--font-noto-serif-kr), serif"
      >
        書
      </text>
    </svg>
  );
}
