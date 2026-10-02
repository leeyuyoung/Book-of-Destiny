const ELEMENT_COLORS = [
  "var(--color-wood)",
  "var(--color-fire)",
  "var(--color-earth)",
  "var(--color-metal)",
  "var(--color-water)",
];

const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

type CelestialRingProps = {
  className?: string;
};

export function CelestialRing({ className }: CelestialRingProps) {
  return (
    <div aria-hidden className={`pointer-events-none ${className ?? ""}`}>
      <svg viewBox="0 0 400 400" className="h-full w-full animate-spin-celestial">
        <circle cx="200" cy="200" r="190" fill="none" stroke="rgb(200 169 106 / 0.2)" strokeWidth="0.6" />
        <circle cx="200" cy="200" r="172" fill="none" stroke="rgb(200 169 106 / 0.14)" strokeWidth="0.6" strokeDasharray="1 6" />
        {BRANCHES.map((branch, index) => {
          const angle = (index / BRANCHES.length) * Math.PI * 2 - Math.PI / 2;
          const x = 200 + Math.cos(angle) * 181;
          const y = 200 + Math.sin(angle) * 181;
          return (
            <text
              key={branch}
              x={x}
              y={y}
              fill="rgb(200 169 106 / 0.4)"
              fontSize="9"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-noto-serif-kr), serif"
            >
              {branch}
            </text>
          );
        })}
      </svg>
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-celestial-reverse">
        <circle cx="200" cy="200" r="130" fill="none" stroke="rgb(200 169 106 / 0.16)" strokeWidth="0.6" />
        <polygon
          points={ELEMENT_COLORS.map((_, index) => {
            const angle = (index / 5) * Math.PI * 2 - Math.PI / 2;
            return `${200 + Math.cos(angle) * 130},${200 + Math.sin(angle) * 130}`;
          }).join(" ")}
          fill="none"
          stroke="rgb(200 169 106 / 0.07)"
          strokeWidth="0.6"
        />
        {ELEMENT_COLORS.map((color, index) => {
          const angle = (index / 5) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              key={color}
              cx={200 + Math.cos(angle) * 130}
              cy={200 + Math.sin(angle) * 130}
              r="2.2"
              fill={color}
              opacity="0.55"
            />
          );
        })}
      </svg>
    </div>
  );
}
