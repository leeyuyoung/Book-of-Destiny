// 초록 배경 위에 찍은 꽃잎 사진에서 배경을 지우고 한 장씩 잘라 public/images/petals/ 에 저장한다.
// 실행: node scripts/make-petals.mjs <초록 배경 꽃잎 사진>
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = process.argv[2];
const OUT_DIR = "public/images/petals";
/** 사진은 3열 2행 격자다. 쓰지 않을 칸이 있으면 SKIP에 칸 번호(0부터)를 넣는다. */
const COLUMNS = 3;
const ROWS = 2;
const SKIP = new Set([5]);

if (!SOURCE) throw new Error("꽃잎 사진 경로를 넘겨 주세요.");
await mkdir(OUT_DIR, { recursive: true });

const { data, info } = await sharp(SOURCE).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let index = 0; index < info.width * info.height; index += 1) {
  const [red, green, blue] = [data[index * 3], data[index * 3 + 1], data[index * 3 + 2]];
  const spill = green - Math.max(red, blue);
  const alpha = Math.max(0, Math.min(1, 1 - (spill - 10) / 70));
  rgba[index * 4] = red;
  rgba[index * 4 + 1] = Math.min(green, Math.max(red, blue));
  rgba[index * 4 + 2] = blue;
  rgba[index * 4 + 3] = Math.round(alpha * 255);
}

const opaque = (x, y) => rgba[(y * info.width + x) * 4 + 3] > 40;

/** 칸 가운데에서 이어진 꽃잎 한 장만 골라, 그 범위와 해당 픽셀 표시를 돌려준다. 옆 칸 꽃잎 조각은 빠진다. */
const petalIn = (cell) => {
  const centreX = cell.left + Math.floor(cell.width / 2);
  const centreY = cell.top + Math.floor(cell.height / 2);
  let start = -1;
  for (let radius = 0; radius < cell.width / 2 && start < 0; radius += 2) {
    if (opaque(centreX + radius, centreY)) start = centreY * info.width + centreX + radius;
    else if (opaque(centreX - radius, centreY)) start = centreY * info.width + centreX - radius;
  }
  const member = new Uint8Array(info.width * info.height);
  const stack = [start];
  member[start] = 1;
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -1, -1];
  while (stack.length) {
    const index = stack.pop();
    const x = index % info.width;
    const y = (index - x) / info.width;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= info.width || ny >= info.height) continue;
      const next = ny * info.width + nx;
      if (!member[next] && opaque(nx, ny)) {
        member[next] = 1;
        stack.push(next);
      }
    }
  }
  const pad = 3;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const bounds = { left, top, width: Math.min(info.width - 1, maxX + pad) - left + 1, height: Math.min(info.height - 1, maxY + pad) - top + 1 };
  return { bounds, member };
};

/** 고른 꽃잎만 남기고, 가장자리의 반투명 테두리는 살린다. */
const isolate = ({ bounds, member }) => {
  const out = Buffer.alloc(bounds.width * bounds.height * 4);
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const sx = bounds.left + x;
      const sy = bounds.top + y;
      const source = (sy * info.width + sx) * 4;
      const near = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [0, 2], [0, -2]].some(([dx, dy]) => {
        const nx = sx + dx;
        const ny = sy + dy;
        return nx >= 0 && ny >= 0 && nx < info.width && ny < info.height && member[ny * info.width + nx];
      });
      if (!near) continue;
      rgba.copy(out, (y * bounds.width + x) * 4, source, source + 4);
    }
  }
  return sharp(out, { raw: { width: bounds.width, height: bounds.height, channels: 4 } });
};

const cellWidth = Math.floor(info.width / COLUMNS);
const cellHeight = Math.floor(info.height / ROWS);
let saved = 0;
for (let cellIndex = 0; cellIndex < COLUMNS * ROWS; cellIndex += 1) {
  if (SKIP.has(cellIndex)) continue;
  const cell = { left: (cellIndex % COLUMNS) * cellWidth, top: Math.floor(cellIndex / COLUMNS) * cellHeight, width: cellWidth, height: cellHeight };
  saved += 1;
  const file = `${OUT_DIR}/petal-${saved}.webp`;
  await isolate(petalIn(cell)).resize(220, 220, { fit: "inside" }).webp({ quality: 82, alphaQuality: 90 }).toFile(file);
  console.log(`wrote ${file}`);
}
