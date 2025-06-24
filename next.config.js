/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep these if you still want to ignore lint errors on deploy
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  // if you don’t need Next’s image optimization you can leave this, otherwise remove it
  images: { unoptimized: true },
};

module.exports = nextConfig;
