import Link from "next/link";
import TopBar from "@/components/TopBar";
import BackToMenuButton from "@/components/BackToMenuButton";
import ArticleContent from "./ArticleContent";
import ArticleView from '@/components/ArticleView';
import { getArticle, getRecentArticles } from '@/app/actions/articles'
import { getUser } from '@/app/actions/auth'
import { Metadata } from 'next';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import TableOfContents from './TableOfContents';

export const revalidate = 0; // disable cache for this page

// 创建 slug 函数
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

// 生成 metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClientComponentClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, description, image, updated_at")
    .eq("id", params.id)
    .single();

  if (!article) return {};

  const canonicalUrl = `https://thebowvee.com/article/${params.id}/${createSlug(article.title)}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: article.image || '/default-og-image.jpg', // 使用文章图片或默认图片
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.image || '/default-og-image.jpg'],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticle(params.id);
  const user = await getUser();

  if (!article)
    return <div className="container mx-auto p-4">Article not found</div>;

  const articleId = parseInt(params.id);

  // 添加 JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.content.substring(0, 160),
    image: article.image,
    datePublished: article.created_at,
    // dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: 'Author Name',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Recent Posts */}
          <aside className="hidden lg:block lg:w-1/5">
            <nav className="sticky top-4">
              <div className="font-semibold mb-4">Recent posts</div>
              <ul className="space-y-2">
                {(await getRecentArticles(params.id)).map((recentArticle) => (
                  <li key={recentArticle.id}>
                    <Link
                      href={`/article/${recentArticle.id}`}
                      className="text-gray-600 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400"
                    >
                      {recentArticle.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:w-2/4">
            <article className="article">
              <ArticleContent article={article} user={user} />
              <div className="flex justify-end mt-4 mb-10">
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/8">
                  <BackToMenuButton />
                </div>
              </div>
              <ArticleView articleId={articleId} />
            </article>
          </div>

          {/* Right Sidebar - Table of Contents */}
          <aside className="hidden lg:block lg:w-1/4">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </>
  );
}
