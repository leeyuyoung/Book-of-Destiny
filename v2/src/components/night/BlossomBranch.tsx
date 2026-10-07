type Flower = { x: number; y: number; r: number; rotate: number; open?: boolean };

const FLOWERS: Flower[] = [
  { x: 92, y: 58, r: 15, rotate: 10, open: true },
  { x: 128, y: 92, r: 11, rotate: 40 },
  { x: 168, y: 70, r: 13, rotate: -20, open: true },
  { x: 205, y: 120, r: 9, rotate: 15 },
  { x: 236, y: 98, r: 14, rotate: 60, open: true },
  { x: 268, y: 150, r: 10, rotate: -35 },
  { x: 300, y: 128, r: 12, rotate: 25, open: true },
  { x: 150, y: 140, r: 8, rotate: 5 },
  { x: 60, y: 110, r: 10, rotate: -50, open: true },
  { x: 330, y: 182, r: 8, rotate: 70 },
];

const BUDS = [
  { x: 112, y: 40 },
  { x: 190, y: 54 },
  { x: 252, y: 178 },
  { x: 318, y: 106 },
  { x: 40, y: 82 },
];

function Blossom({ x, y, r, rotate, open }: Flower) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {Array.from({ length: 5 }, (_, index) => (
        <ellipse
          key={index}
          cx={0}
          cy={-r * 0.55}
          rx={r * 0.42}
          ry={r * 0.6}
          transform={`rotate(${index * 72})`}
          fill="url(#blossom-petal)"
          opacity={open ? 0.95 : 0.8}
        />
      ))}
      <circle r={r * 0.22} fill="#b8436a" />
      {open &&
        Array.from({ length: 7 }, (_, index) => {
          const angle = (index / 7) * Math.PI * 2;
          return (
            <circle
              key={index}
              cx={Math.cos(angle) * r * 0.36}
              cy={Math.sin(angle) * r * 0.36}
              r={r * 0.05}
              fill="#f2d39a"
            />
          );
        })}
    </g>
  );
}

/** 화면 모서리에 드리우는 복숭아꽃 가지. flip이면 좌우를 뒤집어 반대편 모서리에 쓴다. */
export function BlossomBranch({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 360 240"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <defs>
        <radialGradient id="blossom-petal" cx="50%" cy="85%" r="80%">
          <stop offset="0%" stopColor="#e57b98" />
          <stop offset="55%" stopColor="#f6bcc8" />
          <stop offset="100%" stopColor="#fde9ec" />
        </radialGradient>
      </defs>
      <path
        d="M-10 20 C 40 40, 70 60, 110 70 S 190 90, 230 110 S 300 150, 350 190"
        fill="none"
        stroke="#1b1020"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M110 70 C 120 50, 140 40, 175 50" fill="none" stroke="#1b1020" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M230 110 C 240 95, 270 90, 305 105" fill="none" stroke="#1b1020" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 45 C 50 70, 52 95, 62 115" fill="none" stroke="#1b1020" strokeWidth="2.5" strokeLinecap="round" />
      {BUDS.map((bud, index) => (
        <ellipse key={index} cx={bud.x} cy={bud.y} rx={3.5} ry={5} fill="#d9667f" opacity={0.85} />
      ))}
      {FLOWERS.map((flower, index) => (
        <Blossom key={index} {...flower} />
      ))}
    </svg>
  );
}
