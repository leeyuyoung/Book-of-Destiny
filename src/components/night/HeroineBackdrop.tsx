import Image from "next/image";
import { PetalCanvas } from "./PetalCanvas";

const SCENES = {
  tryst: { src: "/images/dohwa-intro-cut01-w3.jpg", alt: "벚꽃 덤불 너머로 보이는, 천의를 두른 선녀가 갓 쓴 남자의 뺨에 손을 뻗는 밀회" },
  sensed: { src: "/images/dohwa-intro-cut01d.jpg", alt: "밀회하던 선녀와 갓 쓴 남자가 인기척을 느끼고 동시에 이쪽을 응시하는 장면" },
  noticed: { src: "/images/dohwa-intro-cut02-w.jpg", alt: "남자를 뒤에 두고 고개를 돌려 이쪽을 응시하는 천의 차림의 선녀" },
  caught: { src: "/images/dohwa-intro-cut03-w.jpg", alt: "이쪽을 바라보며 살짝 웃는 천의 차림의 선녀" },
  petal: { src: "/images/dohwa-intro-cut06-w.jpg", alt: "흩날리는 벚꽃잎 하나를 손끝으로 잡은 천의 차림의 선녀" },
  fairy: { src: "/images/dohwa-intro-cut07-w3.jpg", alt: "흩날리는 벚꽃과 빛나는 천의 속에서 정면을 바라보는 도화선녀" },
  offer: { src: "/images/dohwa-intro-cut08-w.jpg", alt: "달빛 아래 손바닥 위의 벚꽃을 건네는 도화선녀" },
  final: { src: "/images/dohwa-heroine.jpg", alt: "달밤의 복숭아꽃 정원에 선 한복 차림의 여인" },
} as const;

export type HeroineScene = keyof typeof SCENES;

/**
 * 인트로 전체를 채우는 여인 그림과 그 위로 흩날리는 꽃잎. scene이 바뀌면 그림이 천천히 겹쳐 바뀐다.
 * 세로 화면에서는 그림이 화면을 가득 덮고, 가로로 넓은 화면에서는 얼굴이 잘리지 않도록
 * 그림 전체를 가운데 두고 양옆을 같은 그림의 흐린 빛으로 채운다.
 */
export function HeroineBackdrop({
  lit = true,
  scene = "final",
  scenes = ["final"],
  approach = false,
  lowVeil = false,
}: {
  lit?: boolean;
  scene?: HeroineScene;
  /** 미리 깔아 둘 그림. 쓰지 않는 그림은 불러오지 않는다. */
  scenes?: HeroineScene[];
  /** 그림 속 인물이 다가오듯 천천히 확대한다. */
  approach?: boolean;
  /** 그림 아래쪽까지 보여야 할 때 글자 뒤 어둠을 더 아래에서 시작한다. */
  lowVeil?: boolean;
}) {
  return (
    <div aria-hidden className="hanji pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0 transition-opacity duration-[2500ms]" style={{ opacity: lit ? 1 : 0.25 }}>
        {scenes.map((key) => (
          <div
            key={key}
            className="absolute inset-0 origin-[54%_28%]"
            style={{
              opacity: key === scene ? 1 : 0,
              transform: approach && key === scene ? "scale(1.3)" : "scale(1)",
              transition: "opacity 1600ms ease-out, transform 3600ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            }}
          >
            <Image
              src={SCENES[key].src}
              alt=""
              fill
              sizes="100vw"
              className="hidden scale-110 select-none object-cover opacity-50 blur-2xl landscape:block"
              draggable={false}
            />
            <div className="heroine-landscape-fade absolute inset-0 landscape:left-1/2 landscape:right-auto landscape:w-[75vh] landscape:-translate-x-1/2">
              <div className="absolute inset-0 animate-portrait-breathe will-change-transform">
                <Image
                  src={SCENES[key].src}
                  alt={SCENES[key].alt}
                  fill
                  sizes="100vw"
                  loading="eager"
                  fetchPriority={key === scenes[0] ? "high" : "auto"}
                  className="select-none object-cover object-[50%_22%]"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <PetalCanvas density={1.1} scale={1.6} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-0 transition-opacity duration-[1600ms]"
        style={{
          opacity: lowVeil ? 0 : 1,
          background:
            "linear-gradient(180deg, rgb(7 6 14 / 0.45) 0%, transparent 14%, transparent 40%, rgb(7 6 14 / 0.78) 64%, rgb(7 6 14 / 0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms]"
        style={{
          opacity: lowVeil ? 1 : 0,
          background:
            "linear-gradient(180deg, rgb(7 6 14 / 0.45) 0%, transparent 14%, transparent 64%, rgb(7 6 14 / 0.8) 80%, rgb(7 6 14 / 0.95) 100%)",
        }}
      />
    </div>
  );
}
