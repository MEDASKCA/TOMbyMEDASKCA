import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for GitHub Pages
  output: 'export',

  // Use basePath only for production (GitHub Pages)
  // For local development, access at http://localhost:3000
  // For GitHub Pages, will be at https://MEDASKCA.github.io/TOM
  basePath: process.env.NODE_ENV === 'production' ? '/TOM' : '',

  // Disable Image Optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Ensure trailing slashes for static export
  trailingSlash: true,

  // Disable ESLint during build (we'll fix linting issues later)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors during build (for deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
