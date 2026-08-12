/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "creafexlab.com",
      },
      {
        protocol: "https",
        hostname: "leoline.fun",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  transpilePackages: ["chatbot-page"],
}

export default nextConfig
