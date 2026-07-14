import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirige les URLs *.vercel.app vers le domaine principal
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        destination: "https://www.prepa-fpc.fr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
