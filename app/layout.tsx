import "./globals.css";
import { Inter } from "next/font/google";
// import { ThemeProvider } from 'next-themes'
// import ThemeToggle from "../components/ThemeToggle";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Providers from "@/components/NextThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "bowvee",
  description: "A modern content management system built with Next.js and Tailwind CSS, where you can create, manage, and share your content with ease.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white dark:bg-gray-900 min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
