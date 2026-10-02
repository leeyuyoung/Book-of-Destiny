"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftY: number;
  warm: boolean;
};

type StarFieldProps = {
  density?: number;
  className?: string;
};

export function StarField({ density = 0.00012, className }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frameId = 0;

    const createStars = () => {
      const count = Math.min(220, Math.floor(width * height * density));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.1 + 0.2,
        baseAlpha: Math.random() * 0.55 + 0.15,
        twinkleSpeed: Math.random() * 0.0012 + 0.0003,
        twinklePhase: Math.random() * Math.PI * 2,
        driftY: Math.random() * 0.04 + 0.01,
        warm: Math.random() < 0.18,
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createStars();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        if (!reducedMotion) {
          star.y -= star.driftY;
          if (star.y < -2) {
            star.y = height + 2;
            star.x = Math.random() * width;
          }
        }
        const twinkle = reducedMotion
          ? 1
          : 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = star.warm
          ? `rgba(230, 211, 163, ${star.baseAlpha * twinkle})`
          : `rgba(220, 225, 245, ${star.baseAlpha * twinkle})`;
        context.fill();
      }
      if (!reducedMotion) frameId = requestAnimationFrame(draw);
    };

    resize();
    frameId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden className={`h-full w-full ${className ?? ""}`} />;
}
