/**@type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,
  basePath: isProd ? 'localhost:3000' : undefined,
  assetPrefix: isProd ? 'localhost:3000' : undefined,
  images: {
    loader: 'imgix',
    path: '/',
  },
}
module.exports = nextConfig

