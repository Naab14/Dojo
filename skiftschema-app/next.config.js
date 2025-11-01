/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Optional: Change the base path if deploying to a subdirectory
  // basePath: '/skiftschema',
  // Optional: Change the asset prefix if using a CDN
  // assetPrefix: '/',
}

module.exports = nextConfig
