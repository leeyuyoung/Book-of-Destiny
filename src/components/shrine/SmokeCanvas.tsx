"use client";

import { useEffect, useRef } from "react";
import { ALTAR_BOTTOM_RATIO, CANDLES, candlePixelHeight } from "./candles";

type Wisp = { x: number; y: number; vx: number; vy: number; radius: number; life: number; maxLife: number; phase: number };
type Ember = { x: number; y: number; vy: number; life: number; maxLife: number; phase: number; size: number };

const FLAME_OFFSET = 30;
const PUFF_SIZE = 128;

/** 연기 한 덩어리 모양을 미리 그려 둔다. 매 프레임 그라디언트를 새로 만들면 화면 전체가 버벅인다. */
function createPuff() {
  const puff = document.createElement("canvas");
  puff.width = PUFF_SIZE;
  puff.height = PUFF_SIZE;
  const context = puff.getContext("2d");
  if (!context) return null;
  const half = PUFF_SIZE / 2;
  const gradient = context.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, "rgba(226, 212, 198, 1)");
  gradient.addColorStop(1, "rgba(226, 212, 198, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, PUFF_SIZE, PUFF_SIZE);
  return puff;
}

/** 촛불 위로 피어오르는 향 연기와 불티. 탭이 가려지면 브라우저가 알아서 멈춘다. */
export function SmokeCanvas({ density = 1, className }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const puff = createPuff();
    if (!puff) return;

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

    const sources = () =>
      CANDLES.map((candle) => ({
        x: (candle.x / 100) * width,
        y: height - height * ALTAR_BOTTOM_RATIO - candlePixelHeight(candle.height, width) - FLAME_OFFSET,
      }));

    const wisps: Wisp[] = [];
    const embers: Ember[] = [];
    const maxWisps = Math.round(90 * density);
    const maxEmbers = Math.round(26 * density);
    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 16.7, 3);
      previous = now;
      const flames = sources();

      if (wisps.length < maxWisps && Math.random() < 0.55 * density * delta) {
        const flame = flames[Math.floor(Math.random() * flames.length)];
        wisps.push({
          x: flame.x + (Math.random() - 0.5) * 6,
          y: flame.y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -(0.35 + Math.random() * 0.4),
          radius: 4 + Math.random() * 4,
          life: 0,
          maxLife: 260 + Math.random() * 220,
          phase: Math.random() * Math.PI * 2,
        });
      }
      if (embers.length < maxEmbers && Math.random() < 0.08 * density * delta) {
        const flame = flames[Math.floor(Math.random() * flames.length)];
        embers.push({
          x: flame.x + (Math.random() - 0.5) * 10,
          y: flame.y + 10,
          vy: -(0.6 + Math.random() * 0.9),
          life: 0,
          maxLife: 120 + Math.random() * 160,
          phase: Math.random() * Math.PI * 2,
          size: 0.8 + Math.random() * 1.4,
        });
      }

      context.clearRect(0, 0, width, height);

      for (let index = wisps.length - 1; index >= 0; index--) {
        const wisp = wisps[index];
        wisp.life += delta;
        const t = wisp.life / wisp.maxLife;
        if (t >= 1) {
          wisps.splice(index, 1);
          continue;
        }
        wisp.x += (wisp.vx + Math.sin(wisp.phase + wisp.life * 0.025) * 0.35) * delta;
        wisp.y += wisp.vy * delta;
        const radius = wisp.radius + t * 70;
        context.globalAlpha = Math.sin(Math.PI * t) * 0.075;
        context.drawImage(puff, wisp.x - radius, wisp.y - radius, radius * 2, radius * 2);
      }
      context.globalAlpha = 1;

      for (let index = embers.length - 1; index >= 0; index--) {
        const ember = embers[index];
        ember.life += delta;
        const t = ember.life / ember.maxLife;
        if (t >= 1) {
          embers.splice(index, 1);
          continue;
        }
        ember.x += Math.sin(ember.phase + ember.life * 0.06) * 0.5 * delta;
        ember.y += ember.vy * delta;
        const flickerAlpha = (1 - t) * (0.6 + 0.4 * Math.sin(ember.life * 0.4 + ember.phase));
        context.fillStyle = `rgba(255, ${150 + Math.round(60 * (1 - t))}, 70, ${flickerAlpha})`;
        context.beginPath();
        context.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        context.fill();
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={className} />;
}
