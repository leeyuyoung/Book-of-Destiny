import Image from "next/image";
import type { CSSProperties } from "react";
import { PetalCanvas } from "./PetalCanvas";
import { SceneVideo } from "./SceneVideo";

/** ratio는 그림의 가로/세로 비. 가로로 넓은 화면에서 그림 폭을 정한다. video가 있으면 그림은 영상이 뜨기 전 자리만 지킨다. */
type SceneSpec = { src: string; ratio: number; alt: string; video?: string };

const SCENES = {
  garden: {
    src: "/images/intro/01-garden.jpg",
    video: "/videos/intro/01-garden.mp4",
    ratio: 9 / 16,
    alt: "등불이 켜진 달밤의 복숭아꽃 정원, 아무도 없는 꽃잎 깔린 돌길",
  },
  sleeping: { src: "/images/intro/02-sleeping.jpg", ratio: 9 / 16, alt: "커다란 복숭아나무 아래 기대어 잠든 한복 차림의 도화신선" },
  awake: { src: "/images/intro/03-awake.jpg", ratio: 9 / 16, alt: "나무에 기댄 채 눈을 뜨고 이쪽을 바라보며 웃는 도화신선" },
  trapped: { src: "/images/intro/04-trapped.jpg", ratio: 9 / 16, alt: "나무에 한 손을 짚고 여자주인공의 눈앞까지 얼굴을 들이민 도화신선" },
  scent: { src: "/images/intro/05-scent.jpg", ratio: 9 / 16, alt: "뒤에서 여자주인공의 목덜미에 얼굴을 묻고 향을 맡는 도화신선과 얼굴이 붉어진 여자주인공" },
  main: { src: "/images/intro/06-main.jpg", ratio: 9 / 16, alt: "여자주인공을 뒤에서 끌어안아 얼굴을 감싼 채 혀를 살짝 내밀고 웃는 도화신선" },
  pinRaised: { src: "/images/loading/02-raised.jpg", ratio: 9 / 16, alt: "여자주인공의 두 손목을 머리 위 벽에 눌러 쥐고 내려다보는 도화신선" },
  final: { src: "/images/sinseon/hero.jpg", ratio: 3 / 4, alt: "달밤의 복숭아꽃 정원에서 꽃가지를 입가에 대고 웃는 한복 차림의 도화신선" },
} satisfies Record<string, SceneSpec>;

export type HeroineScene = keyof typeof SCENES;

/** 인물이 크게 보이도록 확대하는 장면. origin은 확대 기준점이라 그 지점이 화면에서 제자리에 남는다. */
const SCENE_ZOOM: Partial<Record<HeroineScene, { scale: number; origin: string }>> = {
  /** 정원 영상 오른쪽 아래의 생성 도구 워터마크가 이 확대로 화면 밖에 밀려난다. 확대를 줄이면 워터마크가 보인다. */
  garden: { scale: 1.12, origin: "50% 0%" },
  sleeping: { scale: 1.18, origin: "62% 0%" },
  awake: { scale: 1.18, origin: "62% 0%" },
  trapped: { scale: 1.18, origin: "57% 0%" },
  scent: { scale: 1.18, origin: "30% 0%" },
  main: { scale: 1.45, origin: "44% 5%" },
  pinRaised: { scale: 1.08, origin: "100% 0%" },
};

/**
 * 인트로 전체를 채우는 도화신선 그림과 그 위로 흩날리는 꽃잎. scene이 바뀌면 그림이 천천히 겹쳐 바뀐다.
 * 세로 화면에서는 그림이 화면을 가득 덮고, 가로로 넓은 화면에서는 얼굴이 잘리지 않도록
 * 그림 전체를 가운데 두고 양옆을 같은 그림의 흐린 빛으로 채운다.
 */
export function HeroineBackdrop({
  lit = true,
  scene = "final",
  scenes = ["final"],
  approach = false,
  lowVeil = false,
  noVeil = false,
  fadeMs = 1600,
}: {
  lit?: boolean;
  scene?: HeroineScene;
  /** 그림이 겹쳐 바뀌는 시간(ms) */
  fadeMs?: number;
  /** 미리 깔아 둘 그림. 쓰지 않는 그림은 불러오지 않는다. */
  scenes?: HeroineScene[];
  /** 그림 속 인물이 다가오듯 천천히 확대한다. */
  approach?: boolean;
  /** 그림 아래쪽까지 보여야 할 때 글자 뒤 어둠을 더 아래에서 시작한다. */
  lowVeil?: boolean;
  /** 그림 전체가 보여야 할 때 글자 뒤 어둠을 깔지 않는다. */
  noVeil?: boolean;
}) {
  return (
    <div aria-hidden className="hanji pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0 transition-opacity duration-[2500ms]" style={{ opacity: lit ? 1 : 0.25 }}>
        {scenes.map((key) => {
          const spec: SceneSpec = SCENES[key];
          return (
            <div
              key={key}
              className="absolute inset-0 origin-[54%_28%]"
              style={{
                opacity: key === scene ? 1 : 0,
                transform: approach && key === scene ? "scale(1.3)" : "scale(1)",
                transition: `opacity ${fadeMs}ms ease-out, transform 3600ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
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
              <div
                className="heroine-landscape-fade absolute inset-0 landscape:left-1/2 landscape:right-auto landscape:w-[var(--scene-w)] landscape:-translate-x-1/2"
                style={{ "--scene-w": `${SCENES[key].ratio * 100}vh` } as CSSProperties}
              >
                <div className="absolute inset-0 animate-portrait-breathe will-change-transform">
                  <div
                    className="absolute inset-0"
                    style={
                      SCENE_ZOOM[key] && {
                        transform: `scale(${SCENE_ZOOM[key].scale})`,
                        transformOrigin: SCENE_ZOOM[key].origin,
                      }
                    }
                  >
                    <Image
                      src={spec.src}
                      alt={spec.alt}
                      fill
                      sizes="100vw"
                      loading="eager"
                      fetchPriority={key === scenes[0] ? "high" : "auto"}
                      className="select-none object-cover object-[50%_22%]"
                      draggable={false}
                    />
                    {spec.video && <SceneVideo src={spec.video} active={key === scene} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PetalCanvas density={1.1} scale={1.6} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-0 transition-opacity duration-[1600ms]"
        style={{
          opacity: lowVeil || noVeil ? 0 : 1,
          background:
            "linear-gradient(180deg, rgb(7 6 14 / 0.45) 0%, transparent 14%, transparent 40%, rgb(7 6 14 / 0.78) 64%, rgb(7 6 14 / 0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms]"
        style={{
          opacity: lowVeil && !noVeil ? 1 : 0,
          background:
            "linear-gradient(180deg, rgb(7 6 14 / 0.45) 0%, transparent 14%, transparent 64%, rgb(7 6 14 / 0.8) 80%, rgb(7 6 14 / 0.95) 100%)",
        }}
      />
    </div>
  );
}
