import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Use remotePatterns (domains is deprecated)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "getthawha.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "profile.line-scdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "goo.gl",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.yungying.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.getthawha.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yungying.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
