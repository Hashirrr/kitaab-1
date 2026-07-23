import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,

  turbopack: {
    root: path.resolve(__dirname),
  },

  allowedDevOrigins: [
    "192.168.10.1",
    "192.168.10.2",
    "192.168.10.3",
    "192.168.10.4",
    "192.168.10.5",
    "192.168.10.6",
    "192.168.10.7",
    "192.168.10.8",
    "192.168.10.9",
    "192.168.0.109",
  ],
};

export default nextConfig;