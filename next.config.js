/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site is a set of files, not a running server: every page is known at
  // build time and nothing is personalised per request. Exporting keeps it
  // that way, which is why there is no server to attack, no request-time cost,
  // and no host lock-in -- any static host serves the contents of out/ as-is.
  output: "export",
  trailingSlash: true,
  // The image optimizer needs a server. Assets are pre-compressed to AVIF/WebP
  // by scripts/optimize-images.mjs instead.
  images: { unoptimized: true },
};

module.exports = nextConfig;
