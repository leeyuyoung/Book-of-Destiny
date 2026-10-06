import Image from "next/image";
import { PetalCanvas } from "./PetalCanvas";

const HEROINE_SRC = "/images/dohwa-heroine.jpg";
const HEROINE_ALT = "달밤의 복숭아꽃 정원에 선 한복 차림의 여인";

/**
 * 인트로 전체를 채우는 여인 그림과 그 위로 흩날리는 꽃잎.
 * 세로 화면에서는 그림이 화면을 가득 덮고, 가로로 넓은 화면에서는 얼굴이 잘리지 않도록
 * 그림 전체를 가운데 두고 양옆을 같은 그림의 흐린 빛으로 채운다.
 */
export function HeroineBackdrop({ lit = true }: { lit?: boolean }) {
  return (
    <div aria-hidden className="hanji pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0 transition-opacity duration-[2500ms]" style={{ opacity: lit ? 1 : 0.25 }}>
        <Image
          src={HEROINE_SRC}
          alt=""
          fill
          sizes="100vw"
          className="hidden scale-110 select-none object-cover opacity-50 blur-2xl landscape:block"
          draggable={false}
        />
        <div className="heroine-landscape-fade absolute inset-0 landscape:left-1/2 landscape:right-auto landscape:w-[75vh] landscape:-translate-x-1/2">
          <div className="absolute inset-0 animate-portrait-breathe will-change-transform">
            <Image
              src={HEROINE_SRC}
              alt={HEROINE_ALT}
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="select-none object-cover object-[50%_22%]"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <PetalCanvas density={1.1} scale={1.6} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(7 6 14 / 0.45) 0%, transparent 14%, transparent 40%, rgb(7 6 14 / 0.78) 64%, rgb(7 6 14 / 0.95) 100%)",
        }}
      />
    </div>
  );
}
