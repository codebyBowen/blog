// import { Button } from "@/components/ui/button"
// import { Code, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"

const OverviewPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Personal Blog</h1>
        <p className="text-xl text-muted-foreground">
          Exploring the intersections of code, life, and finance
        </p>
      </header>

      <div className="space-y-16 max-w-3xl mx-auto">
        <section>
          <div className="flex items-center gap-2 mb-4">
            {/* <Code className="h-8 w-8" /> */}
            <h2 className="text-3xl font-semibold">Coding Techniques</h2>
          </div>
          <p className="text-lg">
            Dive into the world of programming. Discover tips, tricks, and best practices for writing clean, efficient code. From beginner tutorials to advanced concepts, I&apos;ll share my experiences and insights in various programming languages and frameworks. Whether you&apos;re just starting out or looking to refine your skills, you&apos;ll find valuable content to enhance your coding journey.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            {/* <BookOpen className="h-8 w-8" /> */}
            <h2 className="text-3xl font-semibold">Personal Thoughts</h2>
          </div>
          <p className="text-lg">
            Join me as I reflect on the ever-changing landscape of technology, its impact on our lives, and the challenges and joys of being a developer in today&apos;s world. Expect honest, thought-provoking content that goes beyond just code. I&apos;ll share personal experiences, lessons learned, and insights on balancing work, life, and continuous learning in the fast-paced tech industry.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            {/* <TrendingUp className="h-8 w-8" /> */}
            <h2 className="text-3xl font-semibold">Stock Knowledge</h2>
          </div>
          <p className="text-lg">
            Explore the fascinating realm of stocks and investments. I&apos;ll share my learnings, analysis techniques, and thoughts on market trends. From fundamental analysis to technical indicators, we&apos;ll delve into various aspects of stock market investing. Disclaimer: This is not financial advice, just my personal journey in understanding the stock market and how it intersects with technology and our daily lives.
          </p>
        </section>
      </div>

      <footer className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to dive in?</h2>
        <Link href="/">
          Explore Blog Posts
        </Link>
      </footer>
    </div>
  )
}

export default OverviewPage;