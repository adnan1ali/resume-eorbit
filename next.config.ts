import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf2json"],

  allowedDevOrigins: [
    "192.168.1.151",
    "localhost"
  ]
};

export default nextConfig;