import "./globals.css";
import { Inter } from "next/font/google";
// import { ThemeProvider } from 'next-themes'
// import ThemeToggle from "../components/ThemeToggle";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Providers from "@/components/NextThemeProvider";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "thebowvee",
  description: "Explore expert insights on AI technology, financial markets, and investment strategies. Stay informed with in-depth analysis, trading tips, and the latest developments in artificial intelligence.",
  keywords: "AI technology, financial markets, trading strategies, investment analysis, artificial intelligence, market trends",
  openGraph: {
    title: 'thebowvee',
    description: 'Your trusted source for AI technology and financial market insights. Discover expert analysis on trading strategies, market trends, and artificial intelligence innovations.',
    url: 'https://thebowvee.com',
    siteName: 'thebowvee',
    images: [
      {
        url: '/thebowveelogo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  icons: {
    icon: '/thebowveelogo.png', // 使用同一张图片作为网站图标
    apple: '/thebowveelogo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2431267230374983"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
