/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['16.171.181.100'],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.API_URL || 'http://localhost:4000'}/api/v1/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
