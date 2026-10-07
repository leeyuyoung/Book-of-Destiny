"use client";

import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  sway: number;
  alpha: number;
  sprite: number;
};

const SPRITE_SIZE = 64;
const PETAL_COLORS = [
  ["#ffe3e8", "#f4a9b8"],
  ["#fbd0d8", "#e3849a"],
  ["#fff0f2", "#f2bcc6"],
] as const;

/** 꽃잎 모양을 미리 그려 둔다. 매 프레임 경로와 그라디언트를 새로 만들면 화면 전체가 버벅인다. */
function createPetalSprite([light, deep]: readonly [string, string]) {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const context = sprite.getContext("2d");
  if (!context) return null;
  const half = SPRITE_SIZE / 2;
  const gradient = context.createLinearGradient(half, 4, half, SPRITE_SIZE - 4);
  gradient.addColorStop(0, light);
  gradient.addColorStop(1, deep);
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(half, SPRITE_SIZE - 6);
  context.bezierCurveTo(4, half + 6, 10, 8, half - 4, 6);
  context.quadraticCurveTo(half, 12, half + 4, 6);
  context.bezierCurveTo(SPRITE_SIZE - 10, 8, SPRITE_SIZE - 4, half + 6, half, SPRITE_SIZE - 6);
  context.fill();
  return sprite;
}

/** 달밤에 천천히 흩날리는 복숭아꽃잎. 탭이 가려지면 브라우저가 알아서 멈춘다. */
export function PetalCanvas({
  density = 1,
  scale = 1,
  className,
}: {
  density?: number;
  /** 꽃잎 크기 배율 */
  scale?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sprites = PETAL_COLORS.map(createPetalSprite).filter((sprite) => sprite !== null);
    if (sprites.length === 0) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (anywhere: boolean): Petal => ({
      x: Math.random() * (width + 200) - 100,
      y: anywhere ? Math.random() * height : -30 - Math.random() * 80,
      vx: 0.15 + Math.random() * 0.35,
      vy: 0.35 + Math.random() * 0.45,
      size: (7 + Math.random() * 9) * scale,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.01 + Math.random() * 0.025,
      sway: Math.random() * Math.PI * 2,
      alpha: 0.45 + Math.random() * 0.45,
      sprite: Math.floor(Math.random() * sprites.length),
    });

    const count = Math.max(6, Math.round((width / 22) * density));
    const petals = Array.from({ length: count }, () => spawn(true));
    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 16.7, 3);
      previous = now;
      context.clearRect(0, 0, width, height);

      for (let index = 0; index < petals.length; index++) {
        const petal = petals[index];
        petal.sway += 0.012 * delta;
        petal.flip += petal.flipSpeed * delta;
        petal.angle += petal.spin * delta;
        petal.x += (petal.vx + Math.sin(petal.sway) * 0.45) * delta;
        petal.y += petal.vy * delta;
        if (petal.y > height + 30 || petal.x > width + 60) {
          petals[index] = spawn(false);
          continue;
        }

        context.save();
        context.globalAlpha = petal.alpha;
        context.translate(petal.x, petal.y);
        context.rotate(petal.angle);
        context.scale(1, Math.max(0.15, Math.abs(Math.cos(petal.flip))));
        context.drawImage(sprites[petal.sprite], -petal.size / 2, -petal.size / 2, petal.size, petal.size);
        context.restore();
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [density, scale]);

  return <canvas ref={canvasRef} className={className} />;
}
