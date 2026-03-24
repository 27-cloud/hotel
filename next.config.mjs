// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sogbexgjtfosnddvluct.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // output:"export",
};

export default nextConfig;  // 注意：这里是 export default，不是 module.exports