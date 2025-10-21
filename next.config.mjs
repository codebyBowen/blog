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
    // 增加 API 路由的 body size 限制以支持文件上传
    // 默认为 1MB，现在设置为 10MB
    experimental: {
      serverActions: {
        bodySizeLimit: '10mb',
      },
    },
  }

  export default nextConfig;