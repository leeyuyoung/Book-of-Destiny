"use client";

import { useEffect, useRef } from "react";

/** 장면 그림 위에 겹치는 소리 없는 영상. 장면이 다시 열릴 때마다 처음부터 한 번 재생하고 마지막 프레임에 멈춘다. */
export function SceneVideo({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !active) return;
    video.currentTime = 0;
    video.play().catch(() => {
      // 저전력 모드처럼 자동 재생이 막히면 영상 첫 프레임이 그림처럼 남는다.
    });
  }, [active]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full select-none object-cover object-[50%_22%]"
    />
  );
}
