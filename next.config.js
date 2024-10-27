/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false, // Prevents 'child_process' from being bundled client-side
      };
    }
    return config;
  },
};

module.exports = nextConfig;
