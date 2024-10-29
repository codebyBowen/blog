'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import TopBar from "@/components/TopBar";
import CreateBtn from "@/components/CreateButton";
import { stripMarkdown } from '@/utils/textUtils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Search } from 'lucide-react';
import { Article } from '../types/article';
import readingDuration from "reading-duration";
// import NewsletterPopup from "@/components/NewsletterPopup";

export const revalidate = 0;

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [visibleArticles, setVisibleArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const supabase = createClientComponentClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      setArticles(data || []);
      setVisibleArticles(data?.slice(0, 5) || []);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const loadMorePosts = () => {
    const currentLength = visibleArticles.length;
    const nextArticles = articles.slice(currentLength, currentLength + 5);
    setVisibleArticles([...visibleArticles, ...nextArticles]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TopBar />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {visibleArticles.map((article, index) => {
                const readingTime = readingDuration(article.content, {
                  wordsPerMinute: 200,
                  emoji: false,
                });

                return (
                  <Card key={article.id} className={index === 0 ? "mb-8" : "mb-6"}>
                    {index === 0 && article.image && (
                      <Image src={article.image} height={400} width={800} alt="Featured blog post" className="w-full h-64 object-cover" />
                    )}
                    <CardHeader>
                      <CardTitle className={index === 0 ? "text-2xl" : "text-xl"}>{article.title}</CardTitle>
                      <CardDescription>{stripMarkdown(article.content).substring(0, 100)}...</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center"><User size={16} className="mr-1" /> Author</span>
                        <span className="flex items-center"><Calendar size={16} className="mr-1" /> {new Date(article.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center"><Clock size={16} className="mr-1" /> {readingTime}</span>
                        <span className="flex items-center"><Search size={16} className="mr-1" /> {article.views} views</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/article/${article.id}`}>
                        <Button variant={index === 0 ? "default" : "outline"}>Read More</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
              {visibleArticles.length < articles.length && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" onClick={loadMorePosts}>Load More Posts</Button>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Web Development</Badge>
                    <Badge variant="secondary">JavaScript</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">UI/UX Design</Badge>
                    <Badge variant="secondary">DevOps</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {articles.slice(0, 3).map((article) => (
                      <li key={article.id} className="flex items-center space-x-4">
                        {article.image && (
                          <Image src={article.image} height={80} width={80} alt={`Popular post ${article.id}`} className="w-20 h-20 object-cover rounded" />
                        )}
                        <div>
                          <h3 className="font-semibold">{article.title}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(article.created_at).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">{article.views} views</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              {/* <NewsletterPopup /> */}

              <Card>
                <CardHeader>
                  <CardTitle>Newsletter</CardTitle>
                  <CardDescription>Stay updated with our latest blog posts and news.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input type="email" placeholder="Enter your email" />
                    <Button className="w-full">Subscribe</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <CreateBtn />
    </>
  );
}
