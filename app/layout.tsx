import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import ThemeToggle from '../components/ThemeToggle'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Article Blog',
  description: 'A modern blog built with Next.js and Tailwind CSS',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 min-h-screen`}>
        <ThemeProvider attribute="class">
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}