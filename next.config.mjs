/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // GitHub Pages serves from a subdirectory when using project pages
  // If you're using a custom domain, you can remove this line
  basePath: '/math-adventure',
  // Disable image optimization since it requires a server
  images: {
    unoptimized: true,
  },
  // This ensures that assets are properly referenced in the static build
  assetPrefix: './',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
