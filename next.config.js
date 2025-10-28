/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Konfigurasi untuk PDF.js worker
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
};

export default nextConfig;
