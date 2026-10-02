type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 56, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="팔자서재 로고"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e6c4" />
          <stop offset="60%" stopColor="#c8a96a" />
          <stop offset="100%" stopColor="#8f7442" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="none" stroke="url(#logo-gold)" strokeWidth="0.8" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="url(#logo-gold)" strokeWidth="0.5" opacity="0.6" />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={index}
            x1={32 + Math.cos(angle) * 24}
            y1={32 + Math.sin(angle) * 24}
            x2={32 + Math.cos(angle) * 30}
            y2={32 + Math.sin(angle) * 30}
            stroke="url(#logo-gold)"
            strokeWidth="0.8"
          />
        );
      })}
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fill="url(#logo-gold)"
        fontSize="20"
        fontFamily="var(--font-noto-serif-kr), serif"
      >
        書
      </text>
    </svg>
  );
}
