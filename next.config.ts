import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "pic-b.komiku.org", 
      },
      {
        protocol: "https",
        hostname: "thumbnail.komiku.org",
      },
      {
        protocol: "https",
        hostname: "img.komiku.org",
      },
      {
        protocol: "https",
        hostname: "thumbnail.komiku.id",
      },
      {
        protocol: "https",
        hostname: "wsrv.nl",
      }
    ],
  },
};

export default nextConfig;
