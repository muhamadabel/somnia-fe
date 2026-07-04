import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images are served by the backend (/api/files) and rendered with plain
    // <img> tags via fileUrl(), so the Next image optimizer is not needed.
    unoptimized: true,
  },
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://be-somnia.hallojanu.xyz"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
