import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import TopBar from "@/components/TopBar";
import LearnMoreBtn from "@/components/LearnMoreBtn";
import CreateBtn from "@/components/CreateButton";


export const revalidate = 0;

async function getArticles() {
  const supabase = createServerComponentClient({ cookies });
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return articles || [];
}

export default async function HomePage() {
  const articles = await getArticles();

  return (
    <>
      {" "}
      <TopBar />
      <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">
          文章列表
        </h1> */}
        {/* <div className="mb-8 text-center">
          <Link
            href="/create"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            创建新文章
          </Link>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {article.content.substring(0, 100)}...
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/article/${article.id}`}
                    className="hover:text-grey-300 dark:text-blue-400 dark:hover:text-grey-300 font-medium"
                  >
                    {/* <LearnMoreBtn /> */}
                    {" Learn More >"}
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {Math.floor(Math.random() * 100)} {/* 模拟点赞数 */}
                    </span>
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {Math.floor(Math.random() * 1000)} {/* 模拟浏览数 */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CreateBtn />
    </>
  );
}
