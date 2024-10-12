import Link from "next/link";
import { cookies } from "next/headers";
import { Article } from "../../../types/article";
import Image from "@/components/Image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import TopBar from "@/components/TopBar";
import BackToMenuButton from "@/components/BackToMenuButton";
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="font-sans text-[#242424] dark:text-white font-bold text-3xl md:text-[42px] leading-tight md:leading-[52px] tracking-normal md:tracking-[-0.011em] mb-4 md:mb-8 mt-0 md:mt-[1.19em] break-words overflow-wrap-break-word">
          <strong>{article.title}</strong>
        </h1>
        <ArticleContent article={article} user={user} />
        <div className="flex justify-end mt-4 mb-10">
          {" "}
          {/* Changed this line */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/8">
            <BackToMenuButton />
          </div>
        </div>
      </div>
    </>
  );
}
