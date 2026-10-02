/** 무당 방울(무령). 손잡이에 금빛 방울 일곱 개가 매달려 있다. */
const BELLS = [
  { cx: 50, cy: 46 },
  { cx: 38, cy: 56 },
  { cx: 62, cy: 56 },
  { cx: 28, cy: 68 },
  { cx: 50, cy: 66 },
  { cx: 72, cy: 68 },
  { cx: 50, cy: 84 },
];

export function ShamanBells({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={className} aria-hidden>
      <defs>
        <radialGradient id="bell-gold" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff1c2" />
          <stop offset="45%" stopColor="#e0aa2e" />
          <stop offset="100%" stopColor="#6b420f" />
        </radialGradient>
      </defs>
      <path d="M50 0 L50 30" stroke="#b01f1c" strokeWidth="5" strokeLinecap="round" />
      <path d="M44 4 Q50 10 56 4" stroke="#1d4a9c" strokeWidth="2" fill="none" />
      <circle cx="50" cy="34" r="5" fill="url(#bell-gold)" />
      {BELLS.map((bell, index) => (
        <g key={index}>
          <line x1="50" y1="34" x2={bell.cx} y2={bell.cy - 6} stroke="#8a5a1c" strokeWidth="0.8" />
          <circle cx={bell.cx} cy={bell.cy} r="7.5" fill="url(#bell-gold)" />
          <path d={`M${bell.cx - 4} ${bell.cy + 2} L${bell.cx + 4} ${bell.cy + 2}`} stroke="#3d2408" strokeWidth="1.2" />
          <circle cx={bell.cx} cy={bell.cy + 2} r="1.3" fill="#2a1705" />
        </g>
      ))}
    </svg>
  );
}
