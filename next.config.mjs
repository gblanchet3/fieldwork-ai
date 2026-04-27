/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages — only in production so dev mode works with dynamic routes
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
