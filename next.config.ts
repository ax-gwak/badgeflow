import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "ethers"],
  output: "standalone",
};

export default nextConfig;
