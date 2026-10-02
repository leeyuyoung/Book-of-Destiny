type Cloth = { color: string; left: string; width: string; height: string; slow?: boolean; delay: number };

/** 천장에서 늘어뜨린 오방색(청·적·황·백·흑) 천 */
const CLOTHS: Cloth[] = [
  { color: "#1d4a9c", left: "-3%", width: "11vw", height: "72dvh", delay: 0 },
  { color: "#b01f1c", left: "6%", width: "9vw", height: "58dvh", slow: true, delay: -3 },
  { color: "#e0aa2e", left: "13.5%", width: "7vw", height: "46dvh", delay: -6 },
  { color: "#ece4d4", left: "80%", width: "7vw", height: "50dvh", slow: true, delay: -2 },
  { color: "#b01f1c", left: "86%", width: "8vw", height: "62dvh", delay: -5 },
  { color: "#1b1a1f", left: "93%", width: "11vw", height: "74dvh", slow: true, delay: -8 },
];

export function ObangCloths({ opacity }: { opacity: number }) {
  return (
    <div className="absolute inset-x-0 top-0" style={{ opacity }}>
      {CLOTHS.map((cloth, index) => (
        <div
          key={index}
          className={`absolute -top-[2dvh] origin-top will-change-transform ${cloth.slow ? "animate-sway-slow" : "animate-sway"}`}
          style={{
            left: cloth.left,
            width: cloth.width,
            minWidth: 26,
            maxWidth: 110,
            height: cloth.height,
            animationDelay: `${cloth.delay}s`,
          }}
        >
          <div
            className="h-full w-full"
            style={{
              maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
              backgroundColor: cloth.color,
              backgroundImage:
                "repeating-linear-gradient(90deg, rgb(0 0 0 / 0.32) 0%, rgb(0 0 0 / 0) 14%, rgb(255 255 255 / 0.1) 26%, rgb(0 0 0 / 0) 38%, rgb(0 0 0 / 0.22) 50%), linear-gradient(to bottom, rgb(0 0 0 / 0.45), rgb(0 0 0 / 0) 30%, rgb(255 140 60 / 0.12) 90%)",
              clipPath: "polygon(0 0, 100% 0, 100% 96%, 85% 100%, 70% 95%, 50% 99%, 30% 94%, 14% 99%, 0 95%)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
