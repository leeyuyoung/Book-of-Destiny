// 서찰 배경으로 쓰는 구겨진 종이 질감을 만든다. 실행: node scripts/make-letter-paper.mjs
// 크고 작은 조각면마다 가운데가 솟거나 꺼진 높이를 주고, 그 높이에 비스듬히 빛을 비춰 접힌 면과 선을 만든다.
import sharp from "sharp";

const WIDTH = 720;
const HEIGHT = 1280;
const OUT = "public/images/letter-paper.jpg";
const PAPER_RGB = [216, 208, 194];

/** mulberry32. 같은 씨앗이면 늘 같은 종이가 나온다. */
let seed = 20261007;
const random = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const makeSites = (count) =>
  Array.from({ length: count }, () => ({
    x: random() * WIDTH,
    y: random() * HEIGHT,
    lift: (random() < 0.5 ? -1 : 1) * (0.5 + random() * 0.5),
  }));

/** 조각 경계에서 0, 안쪽으로 갈수록 솟거나 꺼지는 높이. */
const heightMap = (sites, cap) => {
  const height = new Float32Array(WIDTH * HEIGHT);
  for (let py = 0; py < HEIGHT; py += 1) {
    for (let px = 0; px < WIDTH; px += 1) {
      let first = Infinity;
      let second = Infinity;
      let best = sites[0];
      for (const site of sites) {
        const distance = (site.x - px) ** 2 + (site.y - py) ** 2;
        if (distance < first) {
          second = first;
          first = distance;
          best = site;
        } else if (distance < second) second = distance;
      }
      const edge = Math.min(cap, (Math.sqrt(second) - Math.sqrt(first)) / 2);
      height[py * WIDTH + px] = edge * best.lift;
    }
  }
  return height;
};

const layers = [
  { sites: 22, cap: 120, weight: 1 },
  { sites: 90, cap: 40, weight: 0.4 },
  { sites: 400, cap: 14, weight: 0.15 },
].map(({ sites, cap, weight }) => ({ map: heightMap(makeSites(sites), cap), weight }));

const height = new Float32Array(WIDTH * HEIGHT);
for (const { map, weight } of layers) {
  for (let index = 0; index < height.length; index += 1) height[index] += map[index] * weight;
}

const light = (() => {
  const [x, y, z] = [-0.55, -0.75, 1.6];
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
})();

const shade = new Float32Array(WIDTH * HEIGHT);
let shadeSum = 0;
for (let py = 0; py < HEIGHT; py += 1) {
  for (let px = 0; px < WIDTH; px += 1) {
    const at = (x, y) => height[Math.min(HEIGHT - 1, Math.max(0, y)) * WIDTH + Math.min(WIDTH - 1, Math.max(0, x))];
    const dx = (at(px + 1, py) - at(px - 1, py)) / 2;
    const dy = (at(px, py + 1) - at(px, py - 1)) / 2;
    const length = Math.hypot(dx, dy, 1);
    const value = (-dx * light[0] - dy * light[1] + light[2]) / length;
    shade[py * WIDTH + px] = value;
    shadeSum += value;
  }
}
const shadeMean = shadeSum / shade.length;

const shadeGray = Buffer.alloc(WIDTH * HEIGHT);
for (let index = 0; index < shade.length; index += 1) {
  shadeGray[index] = Math.max(0, Math.min(255, 128 + (shade[index] - shadeMean) * 320));
}
const softShade = await sharp(shadeGray, { raw: { width: WIDTH, height: HEIGHT, channels: 1 } })
  .blur(0.9)
  .toColourspace("b-w")
  .raw()
  .toBuffer();

const pixels = Buffer.alloc(WIDTH * HEIGHT * 3);
for (let index = 0; index < WIDTH * HEIGHT; index += 1) {
  const tone = 1 + ((softShade[index] - 128) / 128) * 0.06 + (random() - 0.5) * 0.025;
  for (let channel = 0; channel < 3; channel += 1) {
    pixels[index * 3 + channel] = Math.max(0, Math.min(255, PAPER_RGB[channel] * tone));
  }
}

await sharp(pixels, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } }).jpeg({ quality: 80, mozjpeg: true }).toFile(OUT);
console.log(`wrote ${OUT}`);
