/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Add any image domains you need
  },
  // Enable static exports if needed
  // output: 'export',
}

module.exports = nextConfig
