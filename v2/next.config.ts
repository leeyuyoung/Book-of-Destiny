import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 바깥 폴더(1번째 버전)에도 package-lock.json이 있어서, 이 폴더를 프로젝트 기준으로 못 박아 둔다.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
