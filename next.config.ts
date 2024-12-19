import type { NextConfig } from "next";

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
};

export default nextConfig;
