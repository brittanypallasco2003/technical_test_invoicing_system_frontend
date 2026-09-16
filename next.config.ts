import type { NextConfig } from "next";
import { API_PROXY_PATH, API_URL } from "./src/lib/api-config";

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
  async rewrites() {
    return [
      {
        source: `${API_PROXY_PATH}/:path*`,
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
