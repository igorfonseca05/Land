import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "htmlstream.com" },
      { protocol: "https", hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "trabalhosescolares.net" },
      { protocol: "https", hostname: "t4.ftcdn.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;