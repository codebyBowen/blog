import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/NextThemeProvider";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://thebowvee.com'),
  title: {
    default: "thebowvee - AI Technology & Financial Market Insights",
    template: "%s | thebowvee"
  },
  description: "Explore expert insights on AI technology, financial markets, and investment strategies. Stay informed with in-depth analysis, trading tips, and the latest developments in artificial intelligence.",
  keywords: ["AI technology", "financial markets", "trading strategies", "investment analysis", "artificial intelligence", "market trends", "SEO", "web development", "life experience"],
  authors: [{ name: "thebowvee" }],
  creator: "thebowvee",
  publisher: "thebowvee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'thebowvee - AI Technology & Financial Market Insights',
    description: 'Your trusted source for AI technology and financial market insights. Discover expert analysis on trading strategies, market trends, and artificial intelligence innovations.',
    url: 'https://thebowvee.com',
    siteName: 'thebowvee',
    images: [
      {
        url: '/thebowveelogo.png',
        width: 1200,
        height: 630,
        alt: 'thebowvee - AI & Finance Blog',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'thebowvee - AI Technology & Financial Market Insights',
    description: 'Your trusted source for AI technology and financial market insights. Discover expert analysis on trading strategies, market trends, and artificial intelligence innovations.',
    images: ['/thebowveelogo.png'],
    creator: '@thebowvee',
  },
  icons: {
    icon: '/thebowveelogo.png',
    shortcut: '/thebowveelogo.png',
    apple: '/thebowveelogo.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://thebowvee.com',
  },
  verification: {
    google: 'your-google-verification-code',
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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
          integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-black min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
