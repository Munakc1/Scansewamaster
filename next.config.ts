const nextConfig = {
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'https://api.caresewa.in/api/:path*',
    },
  ],
  // Other common configurations:
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.caresewa.in'], // If you need to optimize images from this domain
  },
  // Environment variables
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://api.caresewa.in',
  }
};