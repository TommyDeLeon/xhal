/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hostinger serves the built files from a document root with no Node runtime,
  // so the whole site has to come out as static HTML.
  output: "export",
  trailingSlash: true,
  // The image optimizer needs a server. Assets are pre-compressed to AVIF/WebP
  // by scripts/optimize-images.mjs instead.
  images: { unoptimized: true },
};

module.exports = nextConfig;
