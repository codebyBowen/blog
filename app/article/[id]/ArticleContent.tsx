'use client';

import dynamic from "next/dynamic";
import Image from "@/components/Image";
import { Article } from "../../../types/article";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// const remarkGfm = dynamic(
//   () => import("remark-gfm").then((mod) => mod.default),
//   { ssr: false }
// );

export default function ArticleContent({ article, user }: { article: Article, user: any }) {
  return (
    <>
      <div className="prose prose-lg dark:prose-invert max-w-none mb-4 custom-markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm as any]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <code className={`block ${className}`} {...props}>
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {article.image_url && (
        <Image path={article.image_url} user={user} />
      )}
      {article.audio_url && (
        <audio
          controls
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/audio/${article.audio_url}`}
          className="mb-4 w-full"
        />
      )}
    </>
  );
}