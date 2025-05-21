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
    // Don't run TypeScript checking during build for faster builds
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
