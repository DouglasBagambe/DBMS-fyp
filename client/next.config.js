/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow using the BrowserRouter from react-router-dom
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Don't run ESLint during build for faster builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't run TypeScript checking during build for faster builds
    ignoreBuildErrors: true,
  },
  // Configure redirects for client-side routing
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
