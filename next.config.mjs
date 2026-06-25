/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["chatbot-page"],
}

export default nextConfig
