import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // The site is a static export with images.unoptimized, so next/image has
      // no optimizer to call at request time. Images are pre-compressed to
      // AVIF and WebP by scripts/optimize-images.mjs and served through
      // <picture>, which also lets the markup pick the format explicitly.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "out/**", "node_modules/**"] },
];

export default config;