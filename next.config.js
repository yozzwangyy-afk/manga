/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.sankavollerei.com', 'sankavollerei.com'],
    unoptimized: true
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
