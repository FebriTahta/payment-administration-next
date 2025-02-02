import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "api.sandbox.midtrans.com", // Domain sandbox Midtrans
      "api.midtrans.com"          // Domain production Midtrans
    ],
  },
};

export default nextConfig;
