import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/resident-request",
        destination: "/resident-request/new",
        permanent: true,
      },
    ];
  },
  publicRuntimeConfig: {
    version,
  },
};

export default nextConfig;
