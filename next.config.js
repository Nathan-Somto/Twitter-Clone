/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false, 
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com','uploadthing.com'],
  },
}

module.exports = nextConfig
