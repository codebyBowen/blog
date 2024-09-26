import Link from "next/link";
import { cookies } from "next/headers";
import { Article } from "../../../types/article";
import Image from "@/components/Image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import TopBar from "@/components/TopBar";

// Moved to a separate client component
import ArticleContent from "./ArticleContent";

export const revalidate = 0; // disable cache for this page

async function getArticle(id: string): Promise<Article | null> {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    return null;
  }
  return data;
}

async function getUser() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
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

  return (
    <>
      <TopBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <ArticleContent article={article} user={user} />
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </>
  );
}