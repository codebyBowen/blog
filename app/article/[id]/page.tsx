import Link from "next/link";
import { cookies } from "next/headers";
import { Article } from "../../../types/article";
import Image from "@/components/Image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

const remarkGfm = dynamic(
  () => import("remark-gfm").then((mod) => mod.default),
  { ssr: false }
);

export const revalidate = 0; // disable cache for this page

async function getArticle(id: string): Promise<Article | null> {
  const supabase = createServerComponentClient({ cookies });
  // const router = useRouter()
  // const { id } = router.query
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
// async function getUser() {
//     const supabase = createServerComponentClient({ cookies })
//     const { data: { user } } = await supabase.auth.getUser()
//     console.log('user', user)
//     return user
//   }

async function getUser() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("session", session);
  return session?.user ?? null;
}


export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticle(params.id);

  if (!article)
    return <div className="container mx-auto p-4">Article not found</div>;
  console.log(
    "id",
    params.id,
    article,
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/images/${article.image_url}`
  );

  const user = await getUser();
  return (
    <>
      {" "}
      <TopBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm as any]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {article.image_url && (
          // <img
          //   src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/images/${article.image_url}`}
          //   alt={article.title}
          //   className="mb-4 max-w-full h-auto"
          // />
          <Image path={article.image_url} user={user} />
        )}
        {article.audio_url && (
          <audio
            controls
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/audio/${article.audio_url}`}
            className="mb-4 w-full"
          />
        )}
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </>
  );
}


