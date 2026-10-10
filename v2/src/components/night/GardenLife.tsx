"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";

const WALK_SECONDS = 5;
/** 한 걸음마다 화면이 살짝 내려앉았다 오른다. 시작 확대가 이 흔들림보다 커야 그림 가장자리가 드러나지 않는다. */
const STEP_BOB = [0, -5, 0, -5, 0, -5, 0, -5, 0, -4, 0];
const STEP_TILT = [0, -0.35, 0, 0.35, 0, -0.35, 0, 0.35, 0, -0.25, 0];

/** 정원 길을 따라 걸어 들어가듯 화면이 앞으로 다가가며 걸음에 맞춰 흔들린다. 장면을 떠나도 마지막 자리에 머문다. */
export function GardenWalk({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0 origin-[50%_50%]"
      initial={{ scale: 1.03, y: 0, rotate: 0 }}
      animate={active ? "walk" : "rest"}
      variants={{
        walk: {
          scale: [1.03, 1.22],
          y: STEP_BOB,
          rotate: STEP_TILT,
          transition: {
            scale: { duration: WALK_SECONDS, ease: [0.3, 0.1, 0.4, 1] },
            y: { duration: WALK_SECONDS, ease: "easeInOut" },
            rotate: { duration: WALK_SECONDS, ease: "easeInOut" },
          },
        },
        rest: {},
      }}
    >
      {children}
    </motion.div>
  );
}

/** 소실점에서 화면 밖으로 스쳐 지나가는 꽃잎. angle은 날아가는 방향(도), delay는 첫 출발 시각(초)이다. */
const PASSING_PETALS = [
  { angle: -150, delay: 0.2, duration: 2.6, src: "/images/petals/petal-1.webp" },
  { angle: -20, delay: 0.7, duration: 2.3, src: "/images/petals/petal-2.webp" },
  { angle: 160, delay: 1.2, duration: 2.8, src: "/images/petals/petal-3.webp" },
  { angle: 25, delay: 1.7, duration: 2.4, src: "/images/petals/petal-4.webp" },
  { angle: -95, delay: 2.1, duration: 2.7, src: "/images/petals/petal-5.webp" },
  { angle: 120, delay: 2.6, duration: 2.5, src: "/images/petals/petal-2.webp" },
  { angle: -60, delay: 3.1, duration: 2.6, src: "/images/petals/petal-1.webp" },
];

/**
 * 정원 영상 위에 얹는 움직임: 일렁이는 등불빛, 길 위로 흐르는 안개, 눈앞을 스치는 꽃잎.
 * 영상 속 카메라가 움직여 등불 자리가 계속 바뀌므로, 불빛은 한 점에 붙이지 않고 화면 가운데 깊이에 넓게 번지게 한다.
 */
export function GardenLife({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [container-type:size]">
      <motion.span
        className="absolute inset-x-0 top-[22%] h-[40%] mix-blend-screen"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgb(255 170 120 / 0.22), transparent)" }}
        animate={{ opacity: [0.5, 1, 0.65, 0.95, 0.55, 0.85, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute left-[-20%] top-[50%] h-[9%] w-[90%] rounded-full bg-[#f3d5e4]/25 blur-2xl"
        animate={{ x: ["0%", "35%"] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.span
        className="absolute right-[-25%] top-[56%] h-[7%] w-[80%] rounded-full bg-[#e8c6dc]/20 blur-2xl"
        animate={{ x: ["0%", "-30%"] }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {active &&
        PASSING_PETALS.map((petal) => {
          const radians = (petal.angle * Math.PI) / 180;
          return (
            <motion.span
              key={`${petal.angle}-${petal.delay}`}
              className="absolute left-1/2 top-[47%] block size-10"
              initial={{ x: 0, y: 0, scale: 0.15, opacity: 0, rotate: 0, filter: "blur(0px)" }}
              animate={{
                x: `${Math.cos(radians) * 70}cqw`,
                y: `${Math.sin(radians) * 60}cqh`,
                scale: [0.15, 0.6, 2.6],
                opacity: [0, 0.9, 0.85, 0],
                rotate: petal.angle > 0 ? 240 : -240,
                filter: ["blur(0px)", "blur(0px)", "blur(3px)"],
              }}
              transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, repeatDelay: 0.6, ease: [0.5, 0, 0.9, 0.6] }}
            >
              <Image src={petal.src} alt="" fill sizes="40px" className="object-contain" />
            </motion.span>
          );
        })}
    </div>
  );
}
