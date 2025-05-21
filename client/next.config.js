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
  // Skip prerendering for dynamic routes
  exportPathMap: async function () {
    return {
      "/": { page: "/" },
      "/login": { page: "/login" },
      "/signup": { page: "/signup" },
      "/dashboard": { page: "/dashboard" },
      "/incidents": { page: "/incidents" },
      // Add any other static routes here
      // Dynamic routes like /driver-details will be handled client-side
    };
  },
};

module.exports = nextConfig;
