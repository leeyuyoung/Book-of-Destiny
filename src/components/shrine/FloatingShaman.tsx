"use client";

import { useEffect, useRef } from "react";

/** 7초 영상을 약 10초로 늘려 동작이 더 느리고 묵직하게 보이도록 한다 */
const PLAYBACK_RATE = 0.7;

/** 얼굴(영상 위쪽 35% 지점)을 중심으로 확대하는 배율 */
const FACE_ZOOM = 1.4;

/** 영상의 어두운 배경이 네모나게 보이지 않도록 가장자리를 타원형으로 녹인다 */
const PORTRAIT_MASK = "radial-gradient(ellipse 50% 50% at 50% 45%, black 40%, transparent 100%)";

type FloatingShamanProps = {
  /** 등장 후 영상이 재생되기 시작할 때까지의 지연(초) */
  playDelay?: number;
  className?: string;
};

/** 문구 위에 떠 있는 박수무당. 눈을 뜨고 방울을 흔든 뒤 부채로 화면을 가리키고, 그 자세로 멈춘다. */
export function FloatingShaman({ playDelay = 0, className }: FloatingShamanProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultPlaybackRate = PLAYBACK_RATE;
    video.playbackRate = PLAYBACK_RATE;
    const timer = window.setTimeout(() => {
      video.play().catch(() => {});
    }, playDelay * 1000);
    return () => window.clearTimeout(timer);
  }, [playDelay]);

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
        <div className="relative h-full overflow-hidden" style={{ maskImage: PORTRAIT_MASK }}>
          <video
            ref={videoRef}
            src="/videos/shaman.mp4"
            poster="/images/shaman-poster.webp"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="h-full w-full select-none object-cover"
            style={{ transform: `scale(${FACE_ZOOM})`, transformOrigin: "50% 35%" }}
          />
        </div>
      </div>
    </div>
  );
}
