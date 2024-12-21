import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "awesome-coding.com",
        port: "",
        pathname: "/theme/images/**",
      },
    ],
  },
};

export default nextConfig;
