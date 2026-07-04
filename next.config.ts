import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images are served by the backend (/api/files) and rendered with plain
    // <img> tags via fileUrl(), so the Next image optimizer is not needed.
    unoptimized: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
