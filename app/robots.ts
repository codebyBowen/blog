import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/',
          '/static/',
          '/images/',
          '/article/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/image*',
          '/*.json$',
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/']
      }
    ],
    sitemap: 'https://thebowvee.com/sitemap.ts',
    host: 'https://thebowvee.com'
  }
}