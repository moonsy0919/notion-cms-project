import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.us-west-2.amazonaws.com" },
      // Notion avatar_url: https://s3-us-west-2.amazonaws.com/public.notion-static.com/...
      { protocol: "https", hostname: "s3-us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "notion.so" },
      { protocol: "https", hostname: "*.notion.so" },
    ],
  },
};

export default nextConfig;
