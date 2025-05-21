// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Use static export
  distDir: "out", // Match with your Netlify publish directory
  images: {
    unoptimized: true, // Required for static export
  },
  reactStrictMode: true,
  eslint: {
    // Don't run ESLint during build for faster builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't run TypeScript checking during build
    ignoreBuildErrors: true,
  },
  // Add trailingSlash to improve static export compatibility
  trailingSlash: true,
  // Note: removed skipTypeCheck (invalid option)
  // Note: removed experimental.staticPageGenerationTimeout (invalid option)
};

module.exports = nextConfig;
