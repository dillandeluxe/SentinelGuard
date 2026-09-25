import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/SentinelGuard",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
