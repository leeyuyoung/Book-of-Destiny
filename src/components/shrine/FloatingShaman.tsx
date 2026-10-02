"use client";

import { motion, type TargetAndTransition } from "motion/react";
import Image from "next/image";

export type ShamanPose = "closed" | "open" | "shake" | "point" | "sweep";

const POSES: ShamanPose[] = ["closed", "open", "shake", "point", "sweep"];

/** 표정 이미지와 함께 몸 전체에 주는 동작 */
const MOVES: Record<ShamanPose, TargetAndTransition> = {
  closed: { scale: 1, x: 0, rotate: 0, transition: { duration: 1.2, ease: "easeInOut" } },
  open: { scale: [1, 1.1, 1.05], x: 0, rotate: 0, transition: { duration: 0.7, ease: "easeOut" } },
  shake: {
    scale: 1.04,
    x: 0,
    rotate: [0, -2.5, 2.5, -2, 2, -1, 0],
    transition: { rotate: { duration: 0.9, repeat: Infinity, repeatDelay: 0.5 }, scale: { duration: 0.6 } },
  },
  point: { scale: 1.13, x: 0, rotate: 0, transition: { duration: 2.6, ease: [0.22, 0.61, 0.36, 1] } },
  sweep: {
    scale: 1.05,
    x: [-14, 14],
    rotate: [-1, 1],
    transition: { x: { duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }, rotate: { duration: 2.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }, scale: { duration: 0.8 } },
  },
};

/** 얼굴(이미지 위쪽 30% 지점)을 중심으로 확대하는 배율 */
const FACE_ZOOM = 1.7;

const PORTRAIT_MASK =
  "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 70%, transparent 100%)";

/** 문구 위에 떠 있는 박수무당. 장면마다 표정과 동작이 바뀐다. */
export function FloatingShaman({ pose, className }: { pose: ShamanPose; className?: string }) {
  return (
    <div className={`relative aspect-[3/4] ${className ?? ""}`}>
      <div
        aria-hidden
        className="absolute inset-[-12%] rounded-full animate-glow-pulse will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 50% 55% at 50% 45%, rgb(196 43 31 / 0.3), rgb(224 170 46 / 0.07) 45%, transparent 70%)",
        }}
      />
      <div className="relative h-full animate-hover-float will-change-transform">
        <motion.div className="relative h-full" animate={MOVES[pose]}>
          <div className="relative h-full overflow-hidden" style={{ maskImage: PORTRAIT_MASK, maskComposite: "intersect" }}>
            <div className="relative h-full" style={{ transform: `scale(${FACE_ZOOM})`, transformOrigin: "50% 30%" }}>
              {POSES.map((name) => (
                <Image
                  key={name}
                  src={`/images/shaman-${name}.webp`}
                  alt=""
                  width={540}
                  height={720}
                  priority={name === "closed"}
                  sizes="(max-width: 640px) 95vw, 400px"
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-700 ease-out"
                  style={{ opacity: name === pose ? 1 : 0 }}
                />
              ))}
              {pose === "open" && <EyeFlash />}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** 눈을 번쩍 뜨는 순간 눈가에 금빛이 번쩍인다. */
function EyeFlash() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[22.4%] flex justify-center gap-[3%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.35], transition: { duration: 1.1, times: [0, 0.25, 1] } }}
    >
      {[0, 1].map((eye) => (
        <span
          key={eye}
          className="block aspect-square w-[7%] rounded-full"
          style={{ background: "radial-gradient(circle, rgb(255 226 140 / 0.95), rgb(255 190 80 / 0.35) 40%, transparent 70%)" }}
        />
      ))}
    </motion.div>
  );
}
