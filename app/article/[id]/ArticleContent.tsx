"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "@/components/Image";
import { Article } from "../../../types/article";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import slugify from "slugify";

// const remarkGfm = dynamic(
//   () => import("remark-gfm").then((mod) => mod.default),
//   { ssr: false }
// );

export default function ArticleContent({
  article,
  user,
}: {
  article: Article;
  user: any;
}) {
  const [toc, setToc] = useState<
    { id: string; title: string; level: number }[]
  >([]);
  const [showToc, setShowToc] = useState(true);

  const customRenderers = {
    h1: ({ node, ...props }: { node: React.ReactNode; [key: string]: any }) => {
      const id = slugify(props.children[0], { lower: true, strict: true });
      return <h1 id={id} {...props} />;
    },
    h2: ({ node, ...props }: { node: React.ReactNode; [key: string]: any }) => {
      const id = slugify(props.children[0], { lower: true, strict: true });
      return <h2 id={id} {...props} />;
    },
    h3: ({ node, ...props }: { node: React.ReactNode; [key: string]: any }) => {
      const id = slugify(props.children[0], { lower: true, strict: true });
      return <h3 id={id} {...props} />;
    },
    h4: ({ node, ...props }: { node: React.ReactNode; [key: string]: any }) => {
      const id = slugify(props.children[0], { lower: true, strict: true });
      return <h4 id={id} {...props} />;
    },
    h5: ({ node, ...props }: { node: React.ReactNode; [key: string]: any }) => {
      const id = slugify(props.children[0], { lower: true, strict: true });
      return <h5 id={id} {...props} />;
    },
    h6: ({ node, ...props }: { node: React.ReactNode; [key: string]: any }) => {
      const id = slugify(props.children[0], { lower: true, strict: true });
      return <h6 id={id} {...props} />;
    },
  };

  useEffect(() => {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const tocItems = Array.from(headings).map((heading) => ({
      id: heading.id,
      title: heading.textContent || "",
      level: parseInt(heading.tagName[1]),
    }));
    setToc(tocItems);
  }, [article]);

  return (
    <div className="relative">
      <div className="prose prose-lg dark:prose-invert max-w-none mb-4 custom-markdown dark:prose-headings:text-white dark:prose-code:text-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm as any]}
          components={{
            ...customRenderers,
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <code className={`block ${className}`} {...props}>
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {article.markdown_content || article.content}
        </ReactMarkdown>
      </div>
      <div>
        {article.image_url && <Image path={article.image_url} user={user} />}
        {article.audio_url && (
          <audio
            controls
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/audio/${article.audio_url}`}
            className="mb-4 w-full"
          />
        )}
      </div>

      <div className="fixed top-24 right-8 z-10">
        <button
          onClick={() => setShowToc(!showToc)}
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md w-10 h-10 flex flex-col justify-center items-center"
        >
          <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></span>
          <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></span>
          <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300"></span>
        </button>
      </div>

      {showToc && (
        <div className="hidden lg:block fixed top-24 right-20 w-64 p-4">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Contents
          </h2>
          <ul className="space-y-2 text-sm">
            {toc.map((item) => (
              <li
                key={item.id}
                style={{ marginLeft: `${(item.level - 1) * 8}px` }}
              >
                <a
                  href={`#${item.id}`}
                  className="text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
