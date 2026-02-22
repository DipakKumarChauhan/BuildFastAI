import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable standalone output for better deployment
  output: 'standalone',
  // Optimize images
  images: {
    domains: [],
  },
};

export default nextConfig;
