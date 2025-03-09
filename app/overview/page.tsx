// import { Button } from "@/components/ui/button"
// import { Code, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link";
import { ArrowRight, Code, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import Aurora from "@/components/aurora/Background";

// import Image from "next/image"

const OverviewPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 relative">
      <div className="absolute inset-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <header className="flex flex-col items-center justify-center text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Welcome to My Personal Blog
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Exploring the intersections of code, life, and finance
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/" className="flex items-center gap-2">
                Explore Thought Posts <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <section className="bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Coding Techniques</h2>
            </div>
            <p className="text-muted-foreground">
              Dive into the world of programming. Discover tips, tricks, and
              best practices for writing clean, efficient code. From beginner
              tutorials to advanced concepts.
            </p>
            <Button variant="ghost" asChild className="mt-6 group">
              <Link href="/?category=Web%20Development" className="flex items-center gap-2">
                Read more{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </section>

          <section className="bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Personal Thoughts</h2>
            </div>
            <p className="text-muted-foreground">
              Join me as I reflect on the ever-changing landscape of technology,
              its impact on our lives, and the challenges and joys of being a
              developer in todays world.
            </p>
            <Button variant="ghost" asChild className="mt-6 group">
              <Link href="/?category=Life%20Experience" className="flex items-center gap-2">
                Read more{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </section>

          <section className="bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Stock Knowledge</h2>
            </div>
            <p className="text-muted-foreground">
              Explore the fascinating realm of stocks and investments. I&apos;ll
              share my learnings, analysis techniques, and thoughts on market
              trends.
            </p>
            <Button variant="ghost" asChild className="mt-6 group">
              <Link href="/?category=Finance" className="flex items-center gap-2">
                Read more{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </section>
        </div>

        {/* Newsletter Section */}
        <section className="mt-24 bg-card rounded-xl p-10 shadow-lg border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground">
                Subscribe to my newsletter to receive the latest articles, tips,
                and insights directly to your inbox.
              </p>
            </div>
            <div className="md:w-1/2 w-full flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center py-8 border-t border-border">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Thought platform. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OverviewPage;
