"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/** 한 장이 덮는 너비(em). 꽃잎끼리 조금씩 겹치게 둔다. */
const PETAL_SPAN_EM = 2;
const TILTS = [-64, 38, -22, 74, -46, 16];
const SCALES = [1, 0.86, 1.08, 0.92, 1.02, 0.9];
/** scripts/make-petals.mjs 로 만든 꽃잎 사진 */
const PETAL_COUNT = 5;

/**
 * 덮어 둔 낱말 자리에 큰 꽃잎이 살포시 내려앉는다.
 * 자리에는 글자를 두지 않는다. 화면 소스를 열어도 지어낸 결과가 보이지 않게 하기 위해서다.
 */
export function PetalVeil({ em, seed = 0 }: { em: number; seed?: number }) {
  const reducedMotion = useReducedMotion();
  const count = Math.max(1, Math.round(em / PETAL_SPAN_EM));

  return (
    <span role="img" aria-label="꽃잎에 덮인 낱말" className="relative mx-0.5 inline-block h-[1em] align-middle" style={{ width: `${em}em` }}>
      {Array.from({ length: count }, (_, index) => {
        const tilt = TILTS[(index + seed) % TILTS.length];
        const scale = SCALES[(index + seed) % SCALES.length];
        const left = count === 1 ? 50 : 22 + (index / (count - 1)) * 56;
        const lift = (index + seed) % 2 === 0 ? -0.18 : 0.12;
        return (
          <motion.span
            key={index}
            aria-hidden
            className="absolute top-1/2 block h-[2.2em] w-[2.2em]"
            style={{ left: `${left}%`, marginLeft: "-1.1em", marginTop: `${-1.1 + lift}em` }}
            initial={reducedMotion ? false : { opacity: 0, y: -34, x: -14, rotate: tilt - 70, scale }}
            whileInView={{ opacity: 1, y: 0, x: 0, rotate: tilt, scale }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.9, delay: 0.25 + ((index + seed) % 5) * 0.18, ease: [0.16, 0.7, 0.3, 1] }}
          >
            <Image
              src={`/images/petals/petal-${((index + seed) % PETAL_COUNT) + 1}.webp`}
              alt=""
              fill
              unoptimized
              className="object-contain drop-shadow-[0_3px_3px_rgb(110_40_60_/_0.3)]"
            />
          </motion.span>
        );
      })}
    </span>
  );
}

