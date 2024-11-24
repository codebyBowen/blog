/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'eftlewnxnaiddxzjrhwj.supabase.co',
          pathname: '/storage/v1/object/public/**',
        },
      ],
      domains: ['eftlewnxnaiddxzjrhwj.supabase.co'],
    },
  }
  
  export default nextConfig;