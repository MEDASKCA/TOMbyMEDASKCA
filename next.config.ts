import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for GitHub Pages
  output: 'export',

  // If deploying to GitHub Pages with custom domain, leave this empty
  // If deploying to github.io subdirectory, set to '/your-repo-name'
  basePath: '/TOM',

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
};

export default nextConfig;
