/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next from trying to prerender routes that must run on the server.
  // This helps avoid "Dynamic server usage" errors when routes use headers()/getServerSession().
  skipPrerenderedRoutes: true,

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },

  output: "standalone",

  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },

  experimental: {
    serverComponentsExternalPackages: ['canvas'],
  },

  // Increase API route timeout for long-running operations (optional)
  serverRuntimeConfig: {
    // Increase timeout for API routes
    maxDuration: 60,
  },
};

export default nextConfig;
