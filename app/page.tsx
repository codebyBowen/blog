'use client'

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import TopBar from "@/components/TopBar";
import CreateBtn from "@/components/CreateButton";
import Loading from "@/components/Loading";
import { stripMarkdown } from '@/utils/textUtils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Search } from 'lucide-react';
import { Article } from '../types/article';
import readingDuration from "reading-duration";
// import NewsletterPopup from "@/components/NewsletterPopup";
import { useSearchParams, useRouter } from 'next/navigation';

export const revalidate = 0;

// 在文件顶部添加类型定义
type Category = 'Web Development' | 'Finance' | 'SEO' | 'Life Experience';

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Suspense fallback={<Loading />}>
        <HomePageContent />
      </Suspense>
      <CreateBtn />
    </>
  );
}

function HomePageContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [visibleArticles, setVisibleArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 URL 获取初始分类
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    searchParams.get('category') as Category | null
  );

  // 更新分类选择的处理函数
  const handleCategoryClick = (category: Category) => {
    if (selectedCategory === category) {
      // 清除分类
      setSelectedCategory(null);
      router.push('/');
    } else {
      // 设置新分类
      setSelectedCategory(category);
      router.push(`?category=${category}`);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      const supabase = createClientComponentClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setArticles(data);
        setVisibleArticles(data.slice(0, 5));
        
        const sortedByViews = [...data].sort((a, b) => b.views - a.views);
        setPopularArticles(sortedByViews);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // 在 useEffect 之后添加筛选函数
  useEffect(() => {
    if (selectedCategory) {
      const filtered = articles.filter(article => article.tag?.includes(selectedCategory));
      setVisibleArticles(filtered.slice(0, 5));
    } else {
      setVisibleArticles(articles.slice(0, 5));
    }
  }, [selectedCategory, articles]);

  const loadMorePosts = () => {
    const currentLength = visibleArticles.length;
    let nextArticles;
    
    if (selectedCategory) {
      // 如果有选中分类，从已过滤的文章中加载更多
      const filteredArticles = articles.filter(article => 
        article.tag?.toLowerCase() === selectedCategory.toLowerCase()
      );
      nextArticles = filteredArticles.slice(currentLength, currentLength + 5);
    } else {
      // 如果没有选中分类，从所有文章中加载更多
      nextArticles = articles.slice(currentLength, currentLength + 5);
    }
    
    setVisibleArticles([...visibleArticles, ...nextArticles]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
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
            {visibleArticles.length < (selectedCategory 
              ? articles.filter(article => article.tag?.toLowerCase() === selectedCategory.toLowerCase()).length 
              : articles.length) && (
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
                  {['Web Development', 'Finance', 'SEO', 'Life Experience'].map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-secondary-hover transition-colors"
                      onClick={() => handleCategoryClick(category as Category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {popularArticles.slice(0, 3).map((article) => (
                    <li key={article.id} className="flex items-center space-x-4">
                      {article.image && (
                        <Image src={article.image} height={80} width={80} alt={`Popular post ${article.id}`} className="w-20 h-20 object-cover rounded" />
                      )}
                      <div>
                        <Link href={`/article/${article.id}`}>
                          <h3 className="font-semibold hover:text-primary">{article.title}</h3>
                        </Link>
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
    </>
  );
}
