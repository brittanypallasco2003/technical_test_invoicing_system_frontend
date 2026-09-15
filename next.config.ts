import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/facturas",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
