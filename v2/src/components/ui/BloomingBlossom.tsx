import Image from "next/image";

type BloomingBlossomProps = {
  /** 0이면 닫힌 봉오리, 1이면 활짝 핀 꽃 */
  bloom: number;
  size?: number;
  className?: string;
};

const STAGES = ["/images/bloom/peach-bloom-1.jpg", "/images/bloom/peach-bloom-2.jpg", "/images/bloom/peach-bloom-3.jpg", "/images/bloom/peach-bloom-4.jpg"];
const EDGE_FADE = "radial-gradient(circle at 50% 50%, black 50%, transparent 71%)";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** 기다리는 동안 봉오리가 꽃으로 피어나는 도화 사진. 다음 단계 사진이 위에 서서히 겹쳐진다. */
export function BloomingBlossom({ bloom, size = 96, className }: BloomingBlossomProps) {
  const position = clamp01(bloom) * (STAGES.length - 1);

  return (
    <div
      aria-hidden
      className={`relative overflow-hidden rounded-full mix-blend-screen ${className ?? ""}`}
      style={{ width: size, height: size, maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
    >
      {STAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes={`${size}px`}
          loading="eager"
          className="object-cover transition-opacity duration-[1800ms] ease-out"
          style={{ opacity: i === 0 ? 1 : clamp01(position - i + 1) }}
        />
      ))}
    </div>
  );
}
