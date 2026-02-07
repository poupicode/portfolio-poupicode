/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
  },
  compress: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
