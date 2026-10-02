const INK = "#b3201c";
const TITLE_CHARS = ["八", "字", "書", "齋"];

/**
 * 누런 괴황지에 주사(붉은 먹)로 그린 부적. 실제 부적 문구를 옮기지 않고,
 * 서비스 이름(八字書齋)과 소용돌이 획으로 부적의 형식만 빌렸다.
 */
export function Talisman({ className }: { className?: string }) {
  return (
    <div
      className={`talisman-paper relative aspect-[5/12] overflow-hidden rounded-[2px] shadow-[0_20px_60px_-10px_rgb(0_0_0/0.9),0_0_80px_-20px_rgb(224_170_46/0.5)] ${className ?? ""}`}
    >
      <svg viewBox="0 0 100 240" className="absolute inset-0 h-full w-full" aria-label="八字書齋 부적" role="img">
        <defs>
          <filter id="talisman-ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" />
          </filter>
        </defs>
        <g filter="url(#talisman-ink)" fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
          <rect x="5" y="5" width="90" height="230" strokeWidth="1.6" />
          <rect x="8.5" y="8.5" width="83" height="223" strokeWidth="0.6" />

          <path d="M50 16 C 62 16, 66 28, 56 32 C 46 36, 40 26, 48 23 C 54 21, 56 27, 51 28" strokeWidth="1.8" />
          <path d="M22 22 L 38 22 M 62 22 L 78 22" strokeWidth="1.4" />
          <path d="M20 40 Q 50 34 80 40" strokeWidth="1.6" />

          <path
            d="M50 196 C 50 204, 40 204, 42 210 C 44 216, 58 212, 58 218 C 58 224, 44 222, 46 228"
            strokeWidth="1.5"
          />
          <path d="M28 190 L 72 190" strokeWidth="1.2" />
          <path d="M20 200 Q 30 196 34 206 M 80 200 Q 70 196 66 206" strokeWidth="1.1" />
        </g>

        <g filter="url(#talisman-ink)" fill={INK} opacity="0.95">
          {TITLE_CHARS.map((char, index) => (
            <text
              key={char}
              x="50"
              y={72 + index * 33}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="27"
              fontWeight="700"
              fontFamily="var(--font-noto-serif-kr), serif"
            >
              {char}
            </text>
          ))}
        </g>

        <g filter="url(#talisman-ink)" transform="rotate(-4 76 214)">
          <rect x="66" y="204" width="20" height="20" rx="1.5" fill={INK} opacity="0.88" />
          <text
            x="76"
            y="214.5"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fontWeight="700"
            fill="#e9c35a"
            fontFamily="var(--font-noto-serif-kr), serif"
          >
            命
          </text>
        </g>
      </svg>
    </div>
  );
}
