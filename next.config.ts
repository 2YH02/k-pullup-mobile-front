import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.k-pullup.com/api/v1/:path*",
      },
    ];
  },
  images: {
    domains: ["chulbong-kr.s3.amazonaws.com", "t1.daumcdn.net"],
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
