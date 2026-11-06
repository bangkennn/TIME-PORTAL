import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "192.168.3.32",
    "192.168.3.32:3000",
    "192.168.3.20",
    "192.168.3.20:3000",
    "192.168.*",
    "localhost",
    "localhost:3000",
  ],
};

export default nextConfig;
