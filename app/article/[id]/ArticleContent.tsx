"use client";

import React from "react";
import { Article } from "../../../types/article";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Components } from "react-markdown";
import Image from "@/components/Image";
import readingDuration from "reading-duration";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from "next-themes";

const slugify = (text: string | React.ReactNode): string => {
  const str = typeof text === 'string' ? text : Array.isArray(text) ? text.join('') : String(text);
  
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function ArticleContent({
  article,
  user,
}: {
  article: Article;
  user: any;
}) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const customRenderers: Partial<Components> = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      
      return !inline && match ? (
        <SyntaxHighlighter
          style={isDarkMode ? vscDarkPlus : vs as any}
          language={language}
          PreTag="div"
          className="rounded-md"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code 
          className={`${className} px-1 rounded [&]:dark:text-white [&]:dark:bg-gray-800`} 
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 id={slugify(children)}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 id={slugify(children)}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 id={slugify(children)}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 id={slugify(children)}>
        {children}
      </h4>
    ),
  };

  const readingTime = readingDuration(
    article.markdown_content || article.content,
    {
      wordsPerMinute: 200,
      emoji: false,
    }
  );

  return (
    <article>
      <header className="mb-8">
        <h1 className="font-sans text-[#242424] dark:text-white font-bold text-3xl md:text-[42px] leading-tight md:leading-[52px] tracking-normal md:tracking-[-0.011em] mb-4 md:mb-8 mt-0 break-words overflow-wrap-break-word">
          {article.title}
        </h1>
        <div className="flex items-center text-gray-500">
          <FontAwesomeIcon icon={faClock} className="mr-2" width={16} height={16} />
          <span>{readingTime}</span>
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-4 custom-markdown 
        dark:prose-headings:text-white 
        dark:prose-code:text-white 
        [&_.token]:!dark:text-white
        [&_span[class*='token']]:!dark:text-white
        [&_span[class*='language-']]:!dark:text-white
        [&_span[class*='liquid']]:!dark:text-white"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm as any]}
          components={customRenderers}
        >
          {article.markdown_content || article.content}
        </ReactMarkdown>
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
      </div>
    </article>
  );
}
