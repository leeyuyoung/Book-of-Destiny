"use client";

import { AnimatePresence, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { SpeechBubble, type Bubble } from "./SpeechBubble";

type WebtoonPanelProps = {
  id?: string;
  src: string;
  alt: string;
  bubbles: Bubble[];
  /** 첫 화면에 보이는 칸이면 그림을 먼저 불러온다. */
  priority?: boolean;
  /** 그림 위에 비워 둘 여백(그림 높이 대비 비율). 말풍선이 얼굴을 가리는 칸에서 그림을 아래로 내린다. */
  headroom?: number;
};

const IMAGE_MASK = "linear-gradient(180deg, transparent 0%, black 10%, black 82%, transparent 100%)";

/** 화면 폭을 꽉 채우는 웹툰 한 칸. 칸이 화면에 들어오면 말풍선이 차례로 뜬다. 위아래는 배경으로 스며들게 흐린다. */
export function WebtoonPanel({ id, src, alt, bubbles, priority = false, headroom = 0 }: WebtoonPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });

  return (
    <div
      id={id}
      ref={ref}
      className="relative -mx-5 w-[calc(100%+2.5rem)] overflow-hidden"
      style={{ aspectRatio: `3 / ${4 * (1 + headroom)}` }}
    >
      <div className="absolute inset-x-0 bottom-0 aspect-[3/4]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, 576px"
          className="object-cover"
          style={{ maskImage: IMAGE_MASK, WebkitMaskImage: IMAGE_MASK }}
        />
      </div>
      <AnimatePresence>{inView && bubbles.map((bubble) => <SpeechBubble key={bubble.text} bubble={bubble} />)}</AnimatePresence>
    </div>
  );
}
